import { Request, Response, NextFunction } from "express";
import nanoid from "nanoid";
// const nanoid = require("nanoid");
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";
dotenv.config();
import axios from "axios";
import UserModel from "../models/user";
import { HttpError } from "../helpers/errorHelper";
import TransactionModel from "../models/transactionModel";

export async function payment(req: Request, res: Response, next: NextFunction) {
  try {
    const user = req.user;
    const transaction_ref = uuidv4();
    const amount = req.body.amount;
    const Squad_Secret = process.env.SquadSecret;
    const apiUrl = process.env.API_URL;
    const data = {
      email: user!.email,
      amount: amount * 100,
      currency: "NGN",
      initiate_type: "inline",
      payment_channels: ["card", "bank", "ussd", "transfer"],
      customer_name: user!.name,
      pass_charge: false,
      transaction_ref: transaction_ref,
    };
    const axiosConfig = {
      headers: {
        Authorization: `Bearer ${Squad_Secret}`,
        "Content-Type": "application/json",
      },
    };
    axios
      .post(`${apiUrl}`, data, axiosConfig)
      .then((response) => {
        // Handling successful response
        const url = response.data.data.checkout_url;
        return res.status(200).json({ url });
      })
      .catch((error) => {
        // Handling error
        // console.error('Error:', error.response);
        const errorMsg = new Error("Try again later");
        const Param = encodeURIComponent(errorMsg.message);
        return res.status(500).redirect(`/?error=${Param}`);
      });
  } catch (error) {
    next(error);
  }
}

export async function ipChecker(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const requestIP = req.ip;
  // console.log('body in ipchecker', req.body);
  // console.log('the ip', requestIP);
  const allowedIP = process.env.allowed_ip;
  if (requestIP === allowedIP) {
    // Proceed to the next middleware or route handler
    next();
  } else {
    // IP is not allowed, send a forbidden response
    res.status(403).send("Forbidden");
  }
}

export async function transactionRecord(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const transaction = req.body;
    // const subscription = {
    //   amount: transaction.Body.amount / 100,
    //   date: Date.now(),
    //   transaction_ref: transaction.Body.transaction_ref,
    // };
    if (transaction.Event === "charge_successful") {
      // console.log('Charge successful')
      const user = await UserModel.findOne({email: transaction.Body.email})
      if (!user) {
        return res.status(404).json({message: 'user does not exist'})
      }
      const transactionDetails = {
        email: user.email,
        transaction_ref: transaction.Body.transaction_ref,
        user_id: user._id,
        amount: transaction.Body.amount/100
      }
      // check if transaction already exist 
      const isExistTransaction = await TransactionModel.findOne({transaction_ref: transaction.Body.transaction_ref})
      if (isExistTransaction) {
        // transaction already saved, take no action
        return res.status(422).json({message: 'already received'})
      }
      const savedTransaction = await TransactionModel.create(transactionDetails)
      if (savedTransaction) {
        res.status(200).json({message: "transaction saved"})
      }else{
        throw new HttpError("charge recording failed", 500, "PTR10");
      }
      
    } else {
      throw new HttpError("payment failed", 424, "PTR11");
    }
  } catch (error) {
    next(error);
  }
}
