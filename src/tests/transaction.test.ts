import { Request, Response, NextFunction} from 'express';
import {transactionRecord} from '../controllers/payment';
import { connectToDatabase, startMongoDB, stopMongoDB } from "./testUtils";
import UserModel from "../models/user";

const supertest = require("supertest");

const {app, server} = require("../index");

describe("transaction record handling", () => {
    let _id = "65f761e6611d8b44fb035e5d";
    let key = 'it_is_a_secret';
  beforeAll(async () => {
    const mongoUri = await startMongoDB();
    await connectToDatabase(mongoUri);
    
    // create user
    const user = await UserModel.create({
      _id: _id,
      name: "Tol",
      email: "johndoe@example.com",
      password: "securePassword",
      created_at: Date.now(),
      secret_key: key,
    })
    // console.log(user);
  });
  beforeEach(async () => {
    
  });

  afterEach(async () => {
    // await connection.cleanup();
  });

  // after hook
  afterAll(async () => {
      await stopMongoDB();
      await server.close();
  });


  it('should be able to record successful transactions', async () => {
    // Mock request, response, and next function
    const req: any = {
      body: {
        "Event": "charge_successful",
        "TransactionRef": "4678388588A0",
        "Body": {
          "amount": 83000,
          "transaction_ref": "4678388588A0",
          "gateway_ref": "4678388588A0_1_1",
          "transaction_status": "success",
          "email": "johndoe@example.com",
          "merchant_id": "SBN1EBZEQ8",
          "currency": "NGN",
          "transaction_type": "Card",
          "merchant_amount": 82170,
          "created_at": "2022-09-06T15:28:02.477",
          "customer_mobile": null,
          "meta": {},
          "payment_information": {
            "payment_type": "card",
            "pan": "408408******4081",
            "recurring_id": null,
            "card_type": "visa",
            "token_id": "tJlYMKcwPd"
          }
        }
      }
    };
  
    const res: any = {
      status: jest.fn(() => res),
      json: jest.fn() // Mock the json method
    };
  
    const next: any = jest.fn();
  
    // Call the transactionRecord function
    await transactionRecord(req, res, next);
  
    // Assert expectations
    expect(res.status).toHaveBeenCalledWith(200); // Expect status to be called with 200
    expect(res.json).toHaveBeenCalledWith({ message: 'transaction saved' }); // Expect json to be called with the appropriate response
    expect(next).not.toHaveBeenCalled(); // Ensure next function is not called
  });
  

  it('should be able to handle failed transactions', async () => {
    // Mock request, response, and next function
    const req: any = {
      body: {
        "Event": "charge_unsuccessful",
        "TransactionRef": "4678388588A0",
        "Body": {
          "amount": 83000,
          "transaction_ref": "4678388588A0",
          "gateway_ref": "4678388588A0_1_1",
          "transaction_status": "success",
          "email": "johndoe@example.com",
          "merchant_id": "SBN1EBZEQ8",
          "currency": "NGN",
          "transaction_type": "Card",
          "merchant_amount": 82170,
          "created_at": "2022-09-06T15:28:02.477",
          "customer_mobile": null,
          "meta": {},
          "payment_information": {
            "payment_type": "card",
            "pan": "408408******4081",
            "recurring_id": null,
            "card_type": "visa",
            "token_id": "tJlYMKcwPd"
          }
        }
      }
    };

    const res: any = {
      status: jest.fn(() => res),
      send: jest.fn()
    };

    const next: any = jest.fn();

    // Call the transactionRecord function
    await transactionRecord(req, res, next);

    // Assert expectations
    // expect(res.status).toEqual(424)
    expect(next).toHaveBeenCalled(); // Ensure next function to have been called to handle error
  });
});














// import { signatureValidation } from '../helpers/signatureValidation';

// // Mock the transactionRecord function
// const transactionRecord = jest.fn();

// describe('POST /transaction route', () => {
//     it('should call transactionRecord if signature is valid', async () => {
//         // Mock request and response objects
//         const req = { body: { key: 'value' }, headers: { 'x-squad-encrypted-body': 'mocked_hash' } } as unknown as Request;
//         const res = {} as Response;
//         const next = jest.fn() as NextFunction;

//         // Call the signature validation middleware
//         await signatureValidation(req, res, next);

//         // Expectations
//         expect(next).toHaveBeenCalled();
//         expect(transactionRecord).toHaveBeenCalledWith(req, res, next);
//     });

//     it('should return a 403 status if the signature is invalid', async () => {
//         // Mock request and response objects
//         const req = { body: { key: 'value' }, headers: { 'x-squad-encrypted-body': 'invalid_hash' } } as unknown as Request;
//         const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;
//         const next = jest.fn() as NextFunction;

//         // Call the signature validation middleware
//         await signatureValidation(req, res, next);

//         // Expectations
//         expect(res.status).toHaveBeenCalledWith(403);
//         expect(res.json).toHaveBeenCalledWith({ message: 'Invalid request' });
//         expect(transactionRecord).not.toHaveBeenCalled();
//     });
// });



// import request from 'supertest';
// import { mocked } from 'ts-jest/utils';
// const {app, server} = require("../index");
// import * as signatureValidationModule from '../helpers/signatureValidation';
// import * as transactionRecordModule from '../controllers/payment';

// // Mock signatureValidation middleware
// jest.mock('../middlewares/signatureValidation');
// const mockedSignatureValidation = mocked(signatureValidationModule.signatureValidation, true);

// // Mock transactionRecord controller
// jest.mock('../controllers/transactionRecord');
// const mockedTransactionRecord = mocked(transactionRecordModule.transactionRecord, true);

// describe('POST /transaction', () => {
//   it('should return 403 if signature is invalid', async () => {
//     // Mock behavior of signatureValidation middleware
//     mockedSignatureValidation.mockImplementation((req: Request, res: Response, next: NextFunction) => {
//       res.status(403).json({ message: 'Invalid request' });
//     });

//     // Send request to /transaction endpoint
//     const response = await request(app).post('/transaction');

//     // Verify response
//     expect(response.status).toBe(403);
//     expect(response.body).toEqual({ message: 'Invalid request' });

//     // Ensure transactionRecord is not called
//     expect(mockedTransactionRecord).not.toHaveBeenCalled();
//   });

//   it('should call transactionRecord if signature is valid', async () => {
//     // Mock behavior of signatureValidation middleware
//     mockedSignatureValidation.mockImplementation((req: Request, res: Response, next: NextFunction) => {
//       // Simulate valid signature
//       req.headers['x-squad-encrypted-body'] = 'valid_hash';
//       next();
//     });

//     // Mock behavior of transactionRecord controller
//     mockedTransactionRecord.mockImplementation((req: Request, res: Response, next: NextFunction) => {
//       // Simulate successful transaction recording
//       res.status(200).send('Transaction recorded successfully');
//     });

//     // Send request to /transaction endpoint
//     const response = await request(app).post('/transaction');

//     // Verify response
//     expect(response.status).toBe(200);
//     expect(response.text).toBe('Transaction recorded successfully');

//     // Ensure transactionRecord is called
//     expect(mockedTransactionRecord).toHaveBeenCalled();
//   });
// });
