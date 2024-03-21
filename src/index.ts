import express, { Application, Request, Response, NextFunction  } from 'express';
const morgan = require('morgan');
const path = require('path')
import dotenv from 'dotenv';
dotenv.config();
const cookieParser = require('cookie-parser');
const db = require('../db/index')
const PORT = process.env.PORT;
import { createUser, resetPassword, resetToken, signUp, userLogin } from './controllers/userController';
import { verifyToken } from './middlewares/auth.middleware';
import { ipChecker, payment, transactionRecord } from './controllers/payment';
import { validateLogin, validateSignup } from './middlewares/validator';
import { lgaGetter, regionGetter, stateGetter } from './controllers/localeController';
import { errorHandler, notFoundHandler } from './controllers/errorHandler';
import { limiter, strictLimiter } from './helpers/rateLimiting';
import { CustomRequest, loginAuth, tokenAuth } from './middlewares/global.middleware';
import { signatureValidation } from './helpers/signatureValidation';

const app: Application = express();

app.use(morgan('dev'))

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
db.connect();


app.set('view engine', 'ejs');
app.use(cookieParser()); 
app.set('views' , __dirname + '/views');
app.set('trust proxy', true);



app.get('/', async (req, res, next) => {
    const error: string = req.query.message as string;
    const message = error ? new Error(decodeURIComponent(error)) : null;
    res.locals.message = message;
    const token = req.cookies.token;
    res.status(200).render('home', { message, token})
})

app.get('/signup', loginAuth, signUp)
app.post('/signup',strictLimiter, validateSignup, createUser)

app.get('/login', (req, res, next) => {
    // const error = req.query.error;
    const error: string = req.query.error as string;
    const UserError = error ? new Error(decodeURIComponent(error)) : null;
    res.locals.UserError = UserError;
    if(req.cookies.token){
        res.redirect('/')
        return
    }
    res.render('login',{ UserError } )
})
app.post('/login', strictLimiter, validateLogin, userLogin)

app.get("/forgot_password", (req: Request, res: Response, next: NextFunction)=>{
    const error = req.query.error as string;
    const errorParam = error ? new Error(decodeURIComponent(error)) : null;
    res.locals.errorParam = errorParam;
    if(req.cookies.token){
      res.redirect('/')
      return
    }
    res.render('forgotPassword', {errorParam})
  })

app.post("/v1/request-reset", resetToken);

app.get("/reset/:token", (req: Request, res: Response, next: NextFunction)=>{
    const urlSafeToken = req.params.token;
    const error = req.query.error as string;
      const errorParam = error ? new Error(decodeURIComponent(error)) : null;
      res.locals.errorParam = errorParam;
    if(req.cookies.token){
      res.redirect('/')
      return
    }
    res.render('newPassword', {urlSafeToken, errorParam})
  })

  app.post("/v1/reset/:token", resetPassword); //--------------to create new password

app.post('/subscribe', strictLimiter, tokenAuth, payment)

app.post('/transaction', signatureValidation, transactionRecord)

app.use(limiter)
// to get the local governments information
app.get('/v1/lga', verifyToken, lgaGetter)

// to get the state information
app.get('/v1/state', verifyToken, stateGetter)

// to get the region information
app.get('/v1/region', verifyToken, regionGetter)


app.get('/signout', (req, res) => {    
    res.clearCookie('token')
    res.redirect('/')
});





// when a route not valid is being requested
app.get("*", (req, res) => {
    res.status(404);
    res.render('404')
  });
app.use(notFoundHandler);

app.use(errorHandler);

const server = app.listen(PORT, ()=>{
    console.log (`server started at PORT: ${PORT}`)
});

module.exports = {app, server};