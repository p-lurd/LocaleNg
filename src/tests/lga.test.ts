import { LGAModel } from "../models/lgaModel";
import UserModel from "../models/user";
import { connectToDatabase, startMongoDB, stopMongoDB } from "./testUtils";

const supertest = require("supertest");

const {app, server} = require("../index");

describe("GET /lga", () => {
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
    const lga = await LGAModel.create({

    "geographicalCoordinates": {
        "latitude": 7.656496,
        "longitude": 4.922343
      },
      "_id": "65e6f3502843f3b5a7224b02",
      "lgaName": "Efon",
      "state": "Ekiti",
      "region": "South West",
      "landmass": 467,
      "population": 69600
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


  it('should give lga details', async () => {
    
    // Send a POST request containing the query parameters
    const response = await supertest(app)
      .get('/v1/lga?lga=Efon')
      .set('Authorization', `Bearer ${key}`)
      
    // Asserting the response
    expect(response.status).toBe(200); 
    expect(response.text).toContain("Ekiti"); // constains the details of the state
    
  });

  it('should give lga details when request is sent in req.body', async () => {
    const body = {
        "lga": "Efon",
        "state": false,
        "region": false
      }
    
    // Send a POST request containing the query parameters
    const response = await supertest(app)
      .get('/v1/lga')
      .set('Authorization', `Bearer ${key}`)
      .send(body)
      
    // Asserting the response
    expect(response.status).toBe(200); 
    expect(response.text).toContain("Ekiti"); // contains a detail of the lga
    
  });


  it('should throw an error if no bearer token', async () => {
    
    // Send a POST request containing the query parameters
    const response = await supertest(app)
      .get('/v1/lga?lga=Efon')
      // bearer token not set
      
    // Asserting the response
    expect(response.status).toBe(401); 
    expect(response.text).toContain("{\"message\":\"Unauthorized\"}"); // throw an errro
    
  });

});