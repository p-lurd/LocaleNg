import UserModel, { UserDocument} from "../models/user";
import express, { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
const bcrypt = require('bcrypt');
import { query, validationResult, body } from 'express-validator';
import dotenv from 'dotenv';
dotenv.config();
const logger = require('../logger/logger.script');
const joi = require('joi');
const PASSWORD = process.env.PASSWORD;
const EMAIL = process.env.EMAIL;
const LINK = process.env.LINK
const nodemailer = require('nodemailer');

interface userDetails {
    name: string;
    email: string;
    password: string;
    confirm_password: string;
}
export interface customError extends Error {
    status?: number;
}
export interface dbUser {
    id: object;
    name: string;
    email: string;
    password: string;
    created_at: string;
    secret_key: string;
}
    const createUser = async (req: Request, res: Response, next: NextFunction)=>{
    try {
        // console.log(req.body);
        const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(error => error.msg).join(', ');
        const errorParam = encodeURIComponent(errorMessages);
        // return res.status(400).json({ errors: errors.array() });
        return res.status(422).redirect(`/signup?error=${errorParam}`);
    }
    const user: userDetails = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        confirm_password: req.body.confirm_password
    }
    const existedUser: dbUser|null = await UserModel.findOne({email: req.body.email});
    // console.log('found user', existedUser)
    if (existedUser){
        const duplicateUserError: customError = new Error("User already exists")
        duplicateUserError.status = 409;
        // throw duplicateUserError;
        const errorParam = encodeURIComponent(duplicateUserError.message); // Encode the error message
        return res.redirect(`/signup?error=${errorParam}`);
    }
    const date = Date.now();
    const key = await bcrypt.hash(`${req.body.email + date}`, 10);
    const dbUser: UserDocument  = await UserModel.create({
       ...user,
       secret_key: key
    });
    const dUser = {
        name: dbUser.name,
        email: dbUser.email,
        secret_key: key,
        instruction: "secret_key can only be viewed once"
    }
    const token = jwt.sign({ email: dbUser.email, id: dbUser.id }, `${process.env.JWT_SECRET}`)
        res.status(200);
  
        res.cookie('token', token);
         return res.render('success', { message: 'User created successfully', dUser: dUser});
    } catch (error) {
        next(error);
    }
}

 const userLogin = async (req: Request, res: Response, next: NextFunction)=>{
    try {
        interface loginInterface {
            email: string;
            password: string;
        }
        // const bodyOfRequest: loginInterface = {
        //     email = req.body.email,
        //     password = req.body.password,

        // }
        const bodyOfRequest = req.body
        const user = await UserModel.findOne({
          email: bodyOfRequest.email
        });
        if (!user){
          const userNotFound: customError = new Error ("User not found, check username or signup");
          userNotFound.status = 404;
          // throw userNotFound;
          const errorParam = encodeURIComponent(userNotFound.message); // Encode the error message
          return res.redirect(`/login?error=${errorParam}`);
        }
    
        const validPassword = await user.isValidPassword(bodyOfRequest.password);
  
        if (!validPassword) {
          const invalidCredentials: customError = new Error("username or password is wrong");
          invalidCredentials.status = 422;
          const errorParam = encodeURIComponent(invalidCredentials.message); // Encode the error message
          return res.redirect(`/login?error=${errorParam}`);
        }
        
    
        const token = await jwt.sign({ email: user.email, id: user.id}, 
          process.env.JWT_SECRET!, 
          { expiresIn: '12h' });
        // console.log(user.id);
        res.status(200);
        // res.json({
        //   message: 'Login successful',
        //   data: {
        //       _id: user._id,
        //       name: user.name,
        //       email: user.email,
        //       token
        //   }
        // })
        res.cookie('user_id', user.id);
  
        res.cookie('token', token); // Store the token in a cookie for subsequent requests
        const message: customError = new Error("Login successful");
        message.status = 200;
        const Param = encodeURIComponent(message.message); // Encode the error message
        return res.redirect(`/?message=${Param}`);
    } catch (error) {
        next(error)
    }
}



const signUp = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // const error = req.query.error;
        const error: string = req.query.error as string;
    const UserError = error ? new Error(decodeURIComponent(error)) : null;
    res.locals.UserError = UserError;
        const authHeader = req.cookies.token;
        if(authHeader){
            res.status(302).redirect('/login');
            return
        }
        res.status(200).render('signup', {UserError});

    } catch (error) {
        next(error);
    }
}



//   ---------------------reset password--------------
const resetToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const schema = joi.object({
            email: joi.string().required()
        })
        const valid = await schema.validate(req.body)
        // console.log({validError: valid.error})

        if (valid.error){
            const inputValidationError: customError = new Error (valid.error.message);
            inputValidationError.status = 422;
            // throw inputValidationError;
            logger.info(inputValidationError)
            const errorParam = encodeURIComponent(inputValidationError.message); // Encode the error message
            return res.redirect(`/forgot_password?error=${errorParam}`);
        }
        
        const email = req.body.email.toLowerCase();
        const user = await UserModel.findOne({
            email: email
          });
          if (!user){
            const userNotFound: customError = new Error ("User not found, check email or signup");
            userNotFound.status = 404;
            // throw userNotFound;
            const errorParam = encodeURIComponent(userNotFound.message); // Encode the error message
            return res.redirect(`/signup?error=${errorParam}`);
          }
        const timestamp = new Date();
        const resetToken = await bcrypt.hash(email + timestamp, 10);
        const urlSafeToken = encodeURIComponent(resetToken);
        const tokenUpdate = await UserModel.updateOne({email: email}, {$set: {resetToken: resetToken, resetTime: timestamp}})
        if (tokenUpdate.modifiedCount === 0) {
            // If no documents were modified (nModified is 0)
            return res.status(403).json({
              message: "Update condition not met. Token not updated."
            });
          }

        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
              user: EMAIL,
              pass: PASSWORD
            }
          });

          const mailOptions = {
            from: EMAIL,
            to: email,
            subject: 'Password Reset Request',
            text: `Click the following link to reset your password:${process.env.DOMAIN}/reset/${urlSafeToken}`
          };
          // console.log({mailOptions})
          await transporter.sendMail(mailOptions, function (error: any, info: any) {
            if (error) {
                logger.error("Email sending error:", error);
            } else {
                logger.log("Email sent: " + info.response);
            }
        });
          res.status(200)
          // res.json({
          //   mesage: "reset link successfully sent"
          // })
          res.redirect('/')
    } catch (error) {
        next(error)
    }
}

const resetPassword = async(req: Request, res: Response, next: NextFunction) => {
    try {
      const schema = joi.object({
        password: joi.string().required(),
        repeat_password: joi.ref('password'),
        urlSafeToken: joi.required()
    })
    const valid = await schema.validate(req.body)
        // logger.debug({validError: valid.error})
  
        if (valid.error){
            const inputValidationError: customError = new Error (valid.error.message);
            inputValidationError.status = 422;
            // throw inputValidationError;
            const errorParam = encodeURIComponent(inputValidationError.message); // Encode the error message
            return res.redirect(`/signup?error=${errorParam}`);
        }
  
        const urlSafeToken = req.body.urlSafeToken
        const resetToken = decodeURIComponent(urlSafeToken);
    const newPassword = req.body.password;
  
  const existToken = await UserModel.findOne({resetToken})
  if(!existToken){
    return res.status(404).json({
      message: "link is wrong or already used"
    })
  }
  const timestamp = existToken.resetTime
  if(!timestamp){return}
  // Calculate the token's age
  const currentDate = new Date();
  const time = currentDate.getTime() - timestamp.getTime();
  const tokenAge = time/ (1000 * 60)
  console.log({tokenAge})
  if (tokenAge > 15){
    return res.status(401).json({
      message: 'link already expired'
    })
  }
  const hash = await bcrypt.hash(newPassword, 10);
  const updatePassword = await UserModel.updateOne({resetToken: resetToken}, {$set: {password: hash}});
  if (updatePassword.modifiedCount === 0) {
    // If no documents were modified (nModified is 0), it means the update condition was not met
    return res.status(403).json({
      message: "Update condition not met. Password not changed."
    });
  }
  await UserModel.findOneAndUpdate({resetToken}, {$set: {resetToken: ''}})
  res.status(200)
  res.redirect('/login')
    } catch (error) {
        console.log(error)
      next(error)
    }
      
  }
export{createUser, userLogin, signUp, resetToken, resetPassword}