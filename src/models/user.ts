import mongoose from 'mongoose';
import { IUser } from '../utils/type';

const userSchema:any = new mongoose.Schema<IUser>({
    firstName: { type: String, required: false },
    lastName: { type: String, required: false },
    age: { type: Number, required: false },
    email: { type: String, required: false },
    password: { type: String, required: false },
});

const User = mongoose.model('User', userSchema);
export default User;
