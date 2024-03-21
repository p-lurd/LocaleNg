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
        secret_key: 'test_key'
    });
      });
      beforeEach(async () => {});
      
    
      afterEach(async () => {});
    
      // after hook
      afterAll(async () => {
        await stopMongoDB();
        await server.close();
      });
    it('should attempt to send an email to the defined email', async () => {
        const mockValidData = { email: 'test@example.com' };
      const response = await supertest(app)
        .post('/v1/request-reset')
        .send(mockValidData);
  
      expect(response.statusCode).toBe(302);
      expect(response.text).toContain("Found. Redirecting to /");
    });
  });