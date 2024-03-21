import UserModel from "../models/user";
import { connectToDatabase, startMongoDB, stopMongoDB } from "./testUtils";

const supertest = require("supertest");

const {app, server} = require("../index");

describe("GET /v1/reset/:token", () => {
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

  it("should be able to view reset token page even when not logged in", async () => {
    const response = await supertest(app).get(`/reset/%242b%2410%24x`)
      

    expect(response.status).toBe(200);
    expect(response.text).toContain("$2b$10$x"); // response should contain the decoded token

    });
});