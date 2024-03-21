import mongoose, { Schema, Document, Model } from 'mongoose';
const bcrypt = require('bcrypt');


export interface UserDocument extends Document {
    id?: object;
    name: string;
    email: string;
    password: string;
    created_at: Date;
    isValidPassword(password: string): Promise<boolean>;
    secret_key: string;
    resetToken?: string;
    resetTime?: Date;
}
interface UserModel extends Model<UserDocument> {
    // static methods here if needed
    
}



const userSchema = new Schema<UserDocument, UserModel>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    created_at: { type: Date, default: Date.now },
    secret_key:{type: String, required: true, unique: true},
    resetToken:{type: String, required: false, default: null},
    resetTime:{type: Date, required: false, default: null}
});





// before save
userSchema.pre<UserDocument>('save', async function (next) {
    const user = this;
    const hash = await bcrypt.hash(user.password, 10);
    user.password = hash;

    // for hashing secret key
    // const key = await bcrypt.hash(user.secret_key, 10);
    // user.secret_key = key;
    // next();
});



userSchema.methods.isValidPassword = async function(password: string){
    const user = this;
    const compare = await bcrypt.compare(password, user.password);

    return compare
}



// const UserModel = mongoose.model('users', User);
const UserModel = mongoose.model<UserDocument, UserModel>('User', userSchema);



// module.exports = UserModel
export default UserModel;
