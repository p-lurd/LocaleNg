import { LGAModel, LGADocument } from "../models/lgaModel";
import { RegionModel, RegionDocument } from '../models/regionModel';
import { StateDocument, StateModel } from '../models/stateModel';
import { FilterQuery } from 'mongoose';
import { cache } from "./cache";

const findLGA = async function(searchTerms: {}): Promise< any []> {
    const key = Object.keys(searchTerms);
    const cacheKey = `lga_${key}`
    const cachedLGA: any = cache.get(cacheKey);
    if(cachedLGA){
        return cachedLGA;
    }else{
        const lga = await LGAModel.find(searchTerms);
        cache.set(cacheKey, lga);
        return lga;
    }
};


// const findRegion = function(searchTerms: {}){
//     return RegionModel.find(searchTerms)
// }


async function findRegion(searchTerms: Record<string, any>): Promise<any[]> {
    const key = Object.keys(searchTerms);
    const cacheKey = `region_${key}`
    const cachedRegion: any = cache.get(cacheKey);
    if(cachedRegion){
        return cachedRegion;
    }else{
        const region = await RegionModel.find(searchTerms);
        cache.set(cacheKey, region);
        return region;
    }
}

const findState = async function(searchTerms: {}): Promise< any []>{
    const key = Object.keys(searchTerms);
    const cacheKey = `state_${key}`
    const cachedState: any = cache.get(cacheKey);
    if(cachedState){
        return cachedState;
    }else{
        const state = await StateModel.find(searchTerms);
        cache.set(cacheKey, state);
        return state;
    }
}


export{findLGA, findRegion, findState}