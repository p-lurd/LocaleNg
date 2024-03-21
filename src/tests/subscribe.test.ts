import UserModel from "../models/user";
import { connectToDatabase, startMongoDB, stopMongoDB } from "./testUtils";

const supertest = require("supertest");

const {app, server} = require("../index");

describe("POST to /subscibe. it uses an external api and might fail based on certain conditions", () => {
    let token: string;
    let _id = "65f761e6611d8b44fb035e5d";
    let user_id = "65f761e6611d8b44fb035e5d";
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
      secret_key: "it is a secret",
    })
    const response = await supertest(app)
      .post("/login")
      .set("content-type", "application/json")
      .send({
        email: "johndoe@example.com",
        password: "securePassword",
      });
    const setCookieHeader = response.headers["set-cookie"];

    if (setCookieHeader) {
      const tokenCookie = setCookieHeader
        .map((cookie: string) => cookie.split(";")[0])
        .find((cookie: string) => cookie.startsWith("token="));

      if (tokenCookie) {
        token = tokenCookie.split("=")[1]; // Extract the token valu
      } else {
        // Handling the case where the 'token' cookie is not found
        console.error("Token cookie not found in the response headers.");
      }
    } else {
      // Handling the case where the 'set-cookie' header is not present in the response
      console.error("'set-cookie' header is not present in the response.");
    }
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


  //.......this text uses an external api, therefore adequate internet connection is required
  it("should be able to get subscription link", async () => {
    const response = await supertest(app)
      .post(`/subscribe`)
      .send({amount: 5000})
      .set("Cookie", `user_id=${user_id}`)
      .set("Cookie", `token=${token}`);
      

    expect(response.status).toBe(200);
    expect(response.text).toContain("squad");// a squad link will be generated
  });

});