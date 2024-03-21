import { LGAModel } from "../models/lgaModel";
import { RegionModel } from "../models/regionModel";
import UserModel from "../models/user";
import { connectToDatabase, startMongoDB, stopMongoDB } from "./testUtils";

const supertest = require("supertest");

const {app, server} = require("../index");

describe("GET /region route", () => {
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
    const region = await RegionModel.create({
            "_id": "65e6f3502843f3b5a7224aff",
            "name": "South West",
            "numberOfStates": 6,
            "predominantTribes": [
              "Yoruba"
            ],
            "mineralResources": [
              "Kaolin",
              "Feldspar",
              "Tantalite",
              "Bitumen",
              "Silica Sand",
              "Clay",
              "Phosphate",
              "Crude Oil",
              "Aqua Marine",
              "Marble"
            ],
            "population": 25000000,
            "landmass": 79615
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


  it('should give region details when request is sent in query', async () => {
    
    // Send a POST request containing the query parameters
    const response = await supertest(app)
      .get('/v1/region?region=South West')
      .set('Authorization', `Bearer ${key}`)
      
    // Asserting the response
    expect(response.status).toBe(200); 
    expect(response.text).toContain("Yoruba"); // constains a detail of the region
    
  });

  it('should give region details when request is sent in req.body', async () => {
    const body = {
        "region": "South West",
        "state": false,
        "lga": false
      }
    
    // Send a POST request containing the query parameters
    const response = await supertest(app)
      .get('/v1/region')
      .set('Authorization', `Bearer ${key}`)
      .send(body)
      
    // Asserting the response
    expect(response.status).toBe(200); 
    expect(response.text).toContain("Yoruba"); // contains a detail of the region
    
  });


  it('should throw an error if no bearer token', async () => {
    
    // Send a POST request containing the query parameters
    const response = await supertest(app)
      .get('/v1/region?region=South West')
      // bearer token not set
      
    // Asserting the response
    expect(response.status).toBe(401); 
    expect(response.text).toContain("{\"message\":\"Unauthorized\"}"); // throw an errro
    
  });

});