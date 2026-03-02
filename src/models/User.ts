import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    name: string;
    email: string;
    password?: string;
    passwordUpdatedAt?: Date;
    role: 'admin' | 'customer';
    wishlist: any[];
    cart: any[];
    addresses: {
        id?: number;
        name?: string;
        street: string;
        city: string;
        state: string;
        zip: string;
        phone?: string;
        isDefault?: boolean;
        country: string;
    }[];
    createdAt: Date;
}

const UserSchema: Schema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    passwordUpdatedAt: { type: Date },
    role: { type: String, enum: ['admin', 'customer'], default: 'customer' },
    wishlist: { type: [Object], default: [] },
    cart: { type: [Object], default: [] },
    addresses: [{
        id: Number,
        name: String,
        street: String,
        city: String,
        state: String,
        zip: String,
        phone: String,
        isDefault: Boolean,
        country: String,
    }],
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
