import UserModel from "../models/user";
import { connectToDatabase, startMongoDB, stopMongoDB } from "./testUtils";

const supertest = require("supertest");

const {app, server} = require("../index");

describe("GET /signup route", () => {
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

  it("should be able to view signup page even when not logged in", async () => {
    const response = await supertest(app).get(`/signup`)
      

    expect(response.status).toBe(200);
    expect(response.text).toContain("<h2>Signup</h2>");

    });
});