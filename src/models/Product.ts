import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
    title: string;
    description: string;
    category: 'Lab-Grown' | 'Custom' | 'Gemstones' | 'Silver' | 'Lightweight';
    metal: 'Gold' | 'Silver' | 'Platinum' | 'Rose Gold';
    stoneType: string;
    labGrown: boolean;
    price: number;
    images: string[];
    certification?: string;
    inventory: number;
    createdAt: Date;
}

const ProductSchema: Schema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: {
        type: String,
        enum: ['Lab-Grown', 'Custom', 'Gemstones', 'Silver', 'Lightweight'],
        required: true
    },
    metal: {
        type: String,
        enum: ['Gold', 'Silver', 'Platinum', 'Rose Gold'],
        required: true
    },
    stoneType: { type: String, required: true },
    labGrown: { type: Boolean, default: false },
    price: { type: Number, required: true },
    images: { type: [String], required: true },
    certification: { type: String },
    inventory: { type: Number, required: true, default: 0 },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);
