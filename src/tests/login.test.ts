import UserModel from "../models/user";
import { connectToDatabase, startMongoDB, stopMongoDB } from "./testUtils";

const supertest = require("supertest");

const {app, server} = require("../index");

describe("POST to /login route", () => {
  beforeAll(async () => {
    const mongoUri = await startMongoDB();
    await connectToDatabase(mongoUri);
    
    // create user
    const user = await UserModel.create({
      name: "Tol",
      email: "johndoe@example.com",
      password: "securePassword",
      created_at: Date.now(),
      secret_key: "it is a secret",
    })
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

  it('should login successfully with correct credientials', async () => {
    const loginUser = {
        email: 'johndoe@example.com',
        password: 'securePassword'
    };

    // Send a POST request with invalid data
    const response = await supertest(app)
      .post('/login')
      .send(loginUser);

    // Assert the response status and error handling
    expect(response.status).toBe(302); // redirects to home page
    expect(response.header['location']).toBe("/?message=Login%20successful"); //redirects to home page
    
  });

  it('should return an error on wrong login parameters', async () => {
    const loginUser = {
        email: 'johndoe@example.com',
        password: 'wrongPassword'
    };

    // Send a POST request with wrong password
    const response = await supertest(app)
      .post('/login')
      .send(loginUser);

    // Assert the response status and error handling
    expect(response.status).toBe(302); // redirects to own login page with error
    expect(response.header['location']).toBe("/login?error=username%20or%20password%20is%20wrong"); //redirects to login page with error parameters
    
  });

});