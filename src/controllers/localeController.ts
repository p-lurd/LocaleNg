import { findLGA, findRegion, findState } from "../helpers/searchHelper";
import express, { Request, Response, NextFunction } from "express";
import { HttpError } from "../helpers/errorHelper";

interface ResponseObject {
  localGovernment?: {};
  state?: {};
  region?: {};
}

async function lgaGetter(req: Request, res: Response, next: NextFunction) {
  try {
    let response, regionName, regiondB, statedB, stateName, localGovernment;
    if (Object.keys(req.query).length > 0) {
      const { lga, region, state } = req.query;
      response = await findLGA({ lgaName: lga });
      if (response.length > 0) {
        localGovernment = response[0]; // since I'm expecting a single object in the arrray, but  using a generalised function returning an array
        regionName = localGovernment.region;
        stateName = localGovernment.state;
        const responseObject: ResponseObject = { localGovernment };

        if (region === "true") {
          regiondB = await findRegion({ name: `${regionName}` });
          if (regiondB && regiondB.length > 0) {
            responseObject.region = regiondB[0];
          }else{
              throw new HttpError('region not found', 404, 'LC10')
            }
        }
        if (state === "true") {
          statedB = await findState({ name: `${stateName}` });
          if (statedB && statedB.length > 0) {
            responseObject.state = statedB[0];
          }else{
            throw new HttpError('state not found', 404, 'LC10')
          }
        }
        
        res.status(200).json(responseObject);
      } else {
        // thow error of response not found
        throw new HttpError('Resource not found', 404, 'LC10');
      }
    } else {
      const { lga, region, state } = req.body;
      const response = await findLGA({ lgaName: lga });
      if (response.length > 0) {
        localGovernment = response[0]; // since I'm expecting a single object in the arrray, but  using a generalised function returning an array
        regionName = localGovernment.region;
        stateName = localGovernment.state;
        const responseObject: ResponseObject = { localGovernment };

        if (region === true) {
          regiondB = await findRegion({ name: `${regionName}` });
          if (regiondB && regiondB.length > 0) {
            responseObject.region = regiondB[0];
          }else{
              throw new HttpError('region not found', 404, 'LC11')
            }
        }
        if (state === true) {
          statedB = await findState({ name: `${stateName}` });
          if (statedB && statedB.length > 0) {
            responseObject.state = statedB[0];
          }else{
            throw new HttpError('state not found', 404, 'LC11')
          }
        }
        
        res.status(200).json(responseObject);
      } else {
        // thow error of response not found
        throw new HttpError('Resource not found', 404, 'LC11');
      }
    }
  } catch (error) {
    next(error);
  }
}

// for state route

async function stateGetter(req: Request, res: Response, next: NextFunction) {
  try {
    let regionName, regiondB, statedB, lgadB;
    if (Object.keys(req.query).length > 0) {
      const { lga, region, state } = req.query;
      const response = await findState({ name: state });
      if (response.length > 0) {
        statedB = response[0]; // since I'm expecting a single object in the arrray, but  using a generalised function returning an array
        regionName = statedB.region;
        const responseObject: ResponseObject = { state: statedB };
        if (lga === "true") {
          lgadB = await findLGA({ state: `${state}` });
          if (lgadB && lgadB.length > 0) {
            responseObject.localGovernment = lgadB;
          }else{
            throw new HttpError('Local Government not found', 404, 'LC20')
          }
        }
        if (region === "true") {
          regiondB = await findRegion({ name: `${regionName}` });
          if (regiondB && regiondB.length > 0) {
            responseObject.region = regiondB[0];
          }else{
            throw new HttpError('State not found', 404, 'LC20')
        }
        }
         
        res.status(200).json(responseObject);
      } else {
        // throw error of response not found
        throw new HttpError('Resource not found', 404, 'LC20');
      }
    } else {
      const { lga, region, state } = req.body;
      const response = await findState({ name: state });
      if (response.length > 0) {
        statedB = response[0]; // since I'm expecting a single object in the arrray, but  using a generalised function returning an array
        regionName = statedB.region;
        const responseObject: ResponseObject = { state: statedB };
        if (lga === true) {
          lgadB = await findLGA({ state: `${state}` });
          if (lgadB && lgadB.length > 0) {
            responseObject.localGovernment = lgadB;
          }else{
            throw new HttpError('Local Government not found', 404, 'LC21')
          }
        }
        if (region === true) {
          regiondB = await findRegion({ name: `${regionName}` });
          if (regiondB && regiondB.length > 0) {
            responseObject.region = regiondB[0];
          }else{
            throw new HttpError('State not found', 404, 'LC21')
        }
        }
         
        res.status(200).json(responseObject);
      } else {
        // throw error of response not found
        throw new HttpError('Resource not found', 404, 'LC21');
      }
    }
  } catch (error) {
    next(error);
  }
}

async function regionGetter(req: Request, res: Response, next: NextFunction) {
  try {
    let statedB, lgadB;
    if (Object.keys(req.query).length > 0) {
      const { lga, region, state } = req.query;
      const response = await findRegion({ name: `${region}` });
      if (response.length > 0) {
        const regiondB = response[0];
        const responseObject: ResponseObject = { region: regiondB };

        if (lga === "true") {
          lgadB = await findLGA({ region });
          if (lgadB && lgadB.length > 0) {
            responseObject.localGovernment = lgadB;
          }else{
              throw new HttpError('Local Government not found', 404, 'LC31')
          }
        }
        if (state === "true") {
          statedB = await findState({ region });
          if (statedB && statedB.length > 0) {
            responseObject.state = statedB;
          }else{
              throw new HttpError('State not found', 404, 'LC31')
          }
        }
        res.status(200).json(responseObject);
      } else {
        // throw not found
        throw new HttpError('Resource not found', 404, 'LC30');
      }
    } else {
      const { lga, region, state } = req.body;
      const response = await findRegion({ name: `${region}` });
      if (response.length > 0) {
        const regiondB = response[0];
        const responseObject: ResponseObject = { region: regiondB };

        if (lga === true) {
          lgadB = await findLGA({ region });
          if (lgadB && lgadB.length > 0) {
            responseObject.localGovernment = lgadB;
          }else{
              throw new HttpError('Local Government not found', 404, 'LC31')
          }
        }
        if (state === true) {
          statedB = await findState({ region });
          if (statedB && statedB.length > 0) {
            responseObject.state = statedB;
          }else{
              throw new HttpError('State not found', 404, 'LC31')
          }
        }
        
        
        res.status(200).json(responseObject);
      } else {
        // throw not found
        throw new HttpError('Resource not found', 404, 'LC31');
      }
    }
  } catch (error) {
    next(error);
  }
}

export { lgaGetter, stateGetter, regionGetter };
