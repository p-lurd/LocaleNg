import mongoose, { Document, Schema } from 'mongoose';

// Interface for the Region object
interface RegionDocument extends Document {
  name: string;
  numberOfStates: number;
  predominantTribes: string[];
  mineralResources: string[];
  population: number;
  landmass: number;
}

// Schema for the Region object
const regionSchema = new Schema<RegionDocument>({
  name: { type: String, required: true },
  numberOfStates: { type: Number, required: true },
  predominantTribes: { type: [String], required: true },
  mineralResources: { type: [String], required: true },
  population: { type: Number, required: true },
  landmass: { type: Number, required: true }
});

// Model for the Region object
const RegionModel = mongoose.model<RegionDocument>('Region', regionSchema);

// Function to insert the Region object into MongoDB
async function insertRegion(data: any) {
  try {
    const result = await RegionModel.insertMany(data);
    console.log(`Region ${result.length} inserted successfully.`);
  } catch (error) {
    console.error('Error inserting Region:', error);
  }
}

export { RegionDocument, RegionModel, insertRegion };
