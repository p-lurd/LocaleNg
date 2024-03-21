import UserModel from "../models/user";
import { connectToDatabase, startMongoDB, stopMongoDB } from "./testUtils";

const supertest = require("supertest");

const {app, server} = require("../index");

describe('POST /v1/request-reset', () => {
    let token = '123456qwerty';
    let timestamp = new Date();
    beforeAll(async () => {
        const mongoUri = await startMongoDB();
        await connectToDatabase(mongoUri);

    // create user
    const user = await UserModel.create({
        name: 'John',
        email: 'test@example.com',
        password: 'securePassword',
        secret_key: 'test_key',
        resetToken: token,
        resetTime:  timestamp,
    });
      });
      beforeEach(async () => {});
      
    
      afterEach(async () => {});
    
      // after hook
      afterAll(async () => {
        await stopMongoDB();
        await server.close();
      });
      it('should handle valid password reset request', async () => {
        const newPassword = 'new_password';
    
        const response = await supertest(app)
          .post(`/v1/reset/${token}`)
          .send({ password: newPassword, repeat_password: newPassword, urlSafeToken: encodeURIComponent(token) });
    
        expect(response.status).toBe(302);
        expect(response.header['location']).toBe('/login');
      });

      it('should handle invalid password reset request', async () => {
        const invalidToken = 'invalid_reset_token';
        const newPassword = 'new_password';
    
        const response = await supertest(app)
          .post(`/v1/reset/${invalidToken}`)
          .send({ password: newPassword, repeat_password: newPassword, urlSafeToken: invalidToken });
    
        expect(response.status).toBe(404);
        expect(response.body.message).toBe('link is wrong or already used');
      });
    });
    