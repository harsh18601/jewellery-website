import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    name: string;
    email: string;
    password?: string;
    role: 'admin' | 'customer';
    addresses: {
        street: string;
        city: string;
        state: string;
        zip: string;
        country: string;
    }[];
    createdAt: Date;
}

const UserSchema: Schema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    role: { type: String, enum: ['admin', 'customer'], default: 'customer' },
    addresses: [{
        street: String,
        city: String,
        state: String,
        zip: String,
        country: String,
    }],
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
