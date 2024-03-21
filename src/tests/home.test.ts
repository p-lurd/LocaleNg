
import UserModel from "../models/user";
import { connectToDatabase, startMongoDB, stopMongoDB } from "./testUtils";

const supertest = require("supertest");

const {app, server} = require("../index");

describe("GET /", () => {
  beforeAll(async () => {
    const mongoUri = await startMongoDB();
    await connectToDatabase(mongoUri);
  });
  beforeEach(async () => {
    // create user
    
  });

  afterEach(async () => {
    // await connection.cleanup();
  });

  // after hook
  afterAll(async () => {
      await stopMongoDB();
      await server.close();
  });

  it('responds with a rendered "home" template', async () => {
    // Using supertest to make a GET request to the route
    const response = await supertest(app).get("/");

    // checking the response status code
    expect(response.status).toBe(200);
    expect(response.text).toContain('Locale is a developer tool')
  });
  
});