import mongoose, { Schema, Document } from 'mongoose';

export interface ICustomOrder extends Document {
    userDetails: {
        name: string;
        email: string;
        phone: string;
    };
    selectedOptions: {
        stoneType: string;
        metal: string;
        size: string;
        carats?: string;
        engraving?: string;
    };
    referenceImages: string[];
    quotationStatus: 'Pending' | 'PendingAuth' | 'Sent' | 'Accepted' | 'Rejected';
    createdAt: Date;
}

const CustomOrderSchema: Schema = new Schema({
    userDetails: {
        name: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true },
    },
    selectedOptions: {
        stoneType: { type: String, required: true },
        metal: { type: String, required: true },
        size: { type: String, required: true },
        carats: { type: String },
        engraving: { type: String },
    },
    referenceImages: { type: [String] },
    quotationStatus: { type: String, enum: ['Pending', 'PendingAuth', 'Sent', 'Accepted', 'Rejected'], default: 'Pending' },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.CustomOrder || mongoose.model<ICustomOrder>('CustomOrder', CustomOrderSchema);
