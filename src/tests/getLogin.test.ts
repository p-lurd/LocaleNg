import UserModel from "../models/user";
import { connectToDatabase, startMongoDB, stopMongoDB } from "./testUtils";

const supertest = require("supertest");

const {app, server} = require("../index");

describe("GET /login route", () => {
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

  it("should be able to view login page even when not logged in", async () => {
    const response = await supertest(app)
      .get(`/login`)

    expect(response.status).toBe(200);
    expect(response.text).toContain("<h2>Login</h2>");
  });


});