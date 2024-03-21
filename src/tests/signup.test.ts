import UserModel from "../models/user";
import { connectToDatabase, startMongoDB, stopMongoDB } from "./testUtils";

const supertest = require("supertest");

const {app, server} = require("../index");

describe("POST to /signup route", () => {
  beforeAll(async () => {
    const mongoUri = await startMongoDB();
    await connectToDatabase(mongoUri);
    
    // create user
    const user = await UserModel.create({
      name: "Tol",
      email: "johndoe@example.com",
      password: "12345",
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

  it('should be able to signup a user', async () => {
    const userData = {
        name: "Tolu",
        email: "tolu@gmail.com",
        password: "12345",
        confirm_password: "12345",
      };
    // Using supertest to make a GET request to the route
    const res = await supertest(app)
    .post("/signup").send(userData);

    // checking the response status code
    expect(res.status).toBe(200);
    expect(res.text).toContain("secret_key can only be viewed once");
  });

  it('should handle invalid user data', async () => {
    const invalidUserData = {
      name: 'John',
      // Missing email, password, confirm_password
    };

    // Send a POST request with invalid data
    const response = await supertest(app)
      .post('/signup')
      .send(invalidUserData);

    // Assert the response status and error handling
    expect(response.status).toBe(302); // redirects back to the signup page
    expect(response.header['location']).toBe("/signup?error=Valid%20email%20is%20required%2C%20Password%20is%20required"); 
    
  });

  it('should handle duplicate user creation', async () => {
    const userData = {
      name: 'Doe',
      email: 'johndoe@example.com', // An email that already exists
      password: 'securePassword',
      confirm_password: 'securePassword',
      };

    // Sending a POST request with duplicate user data
    const response = await supertest(app)
      .post('/signup')
      .send(userData);

    // Asserting the response status and error handling
    expect(response.status).toBe(302); // redirects to signup page to display error message and user retries
    expect(response.header['location']).toBe("/signup?error=User%20already%20exists"); // Passes the eror ecountered in header for rendering

  });
  
});