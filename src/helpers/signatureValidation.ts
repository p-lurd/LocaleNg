import express, { Request, Response, NextFunction } from 'express';
const crypto = require('crypto');
import dotenv from 'dotenv';


const secret = process.env.SquadSecret
export const signatureValidation = async(req: Request, res: Response, next: NextFunction) => {
    const body = req.body;
    //validate event
    const hash = crypto.createHmac('sha512', secret).update(JSON.stringify(body)).digest('hex').toUpperCase();
    if (hash == req.headers['x-squad-encrypted-body']) {
     // you can trust the event came from squad and so you can give value to customer
        next()
     } else {
      // this request didn't come from Squad, ignore it
      return res.status(403).json({message: 'Invalid request'});
     }
    }