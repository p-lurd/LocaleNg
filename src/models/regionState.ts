import mongoose, { Schema, Document, Model } from 'mongoose';

// export interface NigeriaDocument extends Document {
//     id?: object;
//     region: string;
//     state: string;
//     created_at: Date;
// }
// interface NigeriaModel extends Model<NigeriaDocument> {
//     // You can add any static methods here if needed
    
// }



// const NigeriaSchema = new Schema<NigeriaDocument, NigeriaModel>({
//     region: { type: String, required: true },
//     state: { type: String, required: true, unique: true },
//     created_at: { type: Date, default: Date.now }
// });


// // const User = new Schema ({
// //     name: {
// //         type: String,
// //         required: true
// //     },
// //     username: {
// //         type: String,
// //         required: true,
// //         unique: true
// //     },
// //     password: { type: String, required: true},
// //     // repeat_password: { type: String, required: true},
// //     created_at: { type: Date, default: new Date() },
// //     secret_key: {
// //         type
// //     }
// // })





// const NigeriaModel = mongoose.model<NigeriaDocument, NigeriaModel>('Nigeria', NigeriaSchema);



// // module.exports = UserModel
// export default NigeriaModel;



interface State extends Document {
    name: string;
    landmass?: string;
    predominantTribe?: string;
    mineralResources?: string[];
    governor?: string;
}

const stateSchema: Schema<State> = new Schema({
    name: { type: String, required: true },
    landmass: String,
    predominantTribe: String,
    mineralResources: [String],
    governor: String
});

//Mongoose schema for the region
export interface Region extends Document {
    region: string;
    states: State[];
}

const regionSchema: Schema<Region> = new Schema({
    region: { type: String, required: true },
    states: [stateSchema]
});

// Mongoose model based on the region schema
export const RegionModel: Model<Region> = mongoose.model('Region', regionSchema);