import mongoose, { Document, Schema } from 'mongoose';

//nterface for the LGA object
interface LGADocument extends Document {
  lgaName: string;
  state: string;
  region: string;
  geographicalCoordinates: {
    latitude: number;
    longitude: number;
  };
  landmass: number;
  population: number;
}

// schema for the LGA object
const lgaSchema = new Schema<LGADocument>({
  lgaName: { type: String, required: true },
  state: { type: String, required: true },
  region: { type: String, required: true },
  geographicalCoordinates: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true }
  },
  landmass: { type: Number, required: true },
  population: { type: Number, required: true }
});

// Mongoose model for the LGA object
const LGAModel = mongoose.model<LGADocument>('LGA', lgaSchema);



// function to insert the local governments
async function insertLGAs(data: any[]) {
    try {
      const result = await LGAModel.insertMany(data);
      console.log(`${result.length} LGAs inserted successfully.`);
    } catch (error) {
      console.error('Error inserting LGAs:', error);
    }
  }

export{LGADocument, LGAModel, insertLGAs}