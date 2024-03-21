import UserModel, { UserDocument} from "../models/user";
import express, { Request, Response, NextFunction } from 'express';
import jwt, { Secret, JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';
import { error } from "console";
import { customError } from "../controllers/userController";
dotenv.config();


// interface jwtFormat {
//     id: string;
//     email: string;
// }
export interface CustomRequest extends Request {
    token: string | JwtPayload;
   }
   declare global {
    namespace Express {
        interface Request {
            user?: UserDocument; // Optionally mark it as optional if it might not exist in all requests
        }
    }
}

const loginAuth = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const authHeader = req.cookies.token;
        // const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!authHeader) {
            // throw new Error();
            return next()
          }
        const decoded = await jwt.verify(authHeader, process.env.JWT_SECRET!) as JwtPayload;
        (req as CustomRequest).token = decoded;

        const user: Object |null = await UserModel.findOne({_id: decoded.id});


        if (!user){
            res.status(401)
            // const noUserError = new Error ("No user found")
            // console.log(error)
            return next()
        }
        req.user = user as UserDocument;
        // console.log({user})
        const message: customError = new Error("Already logged in");
        message.status = 200;
        // throw duplicateUserError;
        const Param = encodeURIComponent(message.message);
        res.status(302).redirect(`/?message=${Param}`)
    } catch (error) {
        console.log(error)
        // res.status(401)
        // res.json({
        //     message: "Unauthorized",
        // })
        res.redirect('/login')
    }
}

const tokenAuth = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const authHeader = req.cookies.token;
        const decoded = await jwt.verify(authHeader, process.env.JWT_SECRET!) as JwtPayload;
        (req as CustomRequest).token = decoded;
        const user: Object |null = await UserModel.findOne({_id: decoded.id});

        if (!user){
            res.status(401)
            const noUserError = new Error ("No user found")
            // throw noUserError
            // logger.info(noUserError)
            res.redirect('/login')
        }
        req.user = user as UserDocument;
        next();
    } catch (error) {
        // logger.error(error)
        res.status(401)
        // res.json({
        //     message: "Unauthorized",
        // })
        res.redirect('/login')
    }
}
export{loginAuth, tokenAuth}