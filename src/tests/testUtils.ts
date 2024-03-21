import mongoose, { ConnectOptions } from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongod: MongoMemoryServer;

export async function startMongoDB(): Promise<string> {
    mongod = await MongoMemoryServer.create();
    const mongoUri = mongod.getUri();
    return mongoUri;
}

export async function stopMongoDB(): Promise<void> {
    if (mongod) {
        await mongod.stop();
    }
}
export async function connectToDatabase(uri: string): Promise<void> {
    try {
        await mongoose.connect(uri);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}


