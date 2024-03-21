const mongoose = require('mongoose');
import dotenv from 'dotenv';
dotenv.config();
const MONGODB_URL = process.env.MONGODB_URL


export const connect = async (url: string)=>{
    // mongoose.connect(url || process.env.MONGODB_URL || 'mongodb://127.0.0.1/locale');
    mongoose.connect(MONGODB_URL);
    mongoose.connection.on("connected", ()=>{
        console.log('connected to db successfully');
    })
    mongoose.connection.on("error", (err: Object)=>{
        console.log('db connection unsuccessful');
        console.log(err);
    })
}

// module.exports = {
//     connect
// }