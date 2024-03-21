import mongoose, { Schema, Document, Model } from 'mongoose';

export interface TransactionDocument extends Document {
    id?: object;
    email: string;
    transaction_ref: string;
    user_id: string;
    amount: number;
    created_at?: Date;
}

interface TransactionModel extends Model<TransactionDocument> {
    // static methods here if needed
    
}


const transactionSchema = new Schema<TransactionDocument, TransactionModel>({
    email: { type: String, required: true, unique: false },
    transaction_ref: { type: String, required: true, unique: true},
    user_id: { type: String, required: true},
    amount: { type: Number, required: true},
    created_at: { type: Date, default: Date.now()}
});

const TransactionModel = mongoose.model<TransactionDocument, TransactionModel>('Transaction', transactionSchema);

export default TransactionModel;