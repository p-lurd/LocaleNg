import mongoose, { Document, Schema } from 'mongoose';

// Interface for the State object
interface StateDocument extends Document {
  name: string;
  region: string;
  predominantTribe: string;
  landmass: string;
  mineralResources: string[];
  governor: string;
  population: number;
  numberOfLocalGovernments: number;
}

// Schema for the State object
const stateSchema = new Schema<StateDocument>({
  name: { type: String, required: true },
  region: { type: String, required: true },
  predominantTribe: { type: String, required: true },
  landmass: { type: String, required: true },
  mineralResources: { type: [String], required: true },
  governor: { type: String, required: true },
  population: { type: Number, required: true },
  numberOfLocalGovernments: { type: Number, required: true }
});

// Model for the State object
const StateModel = mongoose.model<StateDocument>('State', stateSchema);

// Function to insert an array of States into MongoDB
async function insertStates(data: any[]) {
  try {
    const result = await StateModel.insertMany(data);
    console.log(`${result.length} States inserted successfully.`);
  } catch (error) {
    console.error('Error inserting States:', error);
  }
}

export { StateDocument, StateModel, insertStates };