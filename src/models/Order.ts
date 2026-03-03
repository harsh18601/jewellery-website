import mongoose, { Schema, Document } from 'mongoose';

export interface IOrder extends Document {
    userId: mongoose.Types.ObjectId;
    products: {
        productId: string;
        productName?: string;
        productImage?: string;
        sku?: string;
        metalType?: string;
        metalPurity?: string;
        metalWeight?: number;
        stoneType?: string;
        stoneShape?: string;
        caratWeight?: string;
        deliveryTime?: string;
        certification?: string;
        chainLength?: string;
        warranty?: string;
        returnEligibility?: string;
        quantity: number;
        price: number;
    }[];
    couponCode?: string;
    totalSavings?: number;
    estimatedDelivery?: string;
    totalPrice: number;
    shippingAddress?: {
        id?: number;
        name?: string;
        street?: string;
        city?: string;
        state?: string;
        zip?: string;
        phone?: string;
        country?: string;
        isDefault?: boolean;
    };
    paymentStatus: 'Pending' | 'Paid' | 'Failed';
    orderStatus: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
    createdAt: Date;
}

const OrderSchema: Schema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    products: [{
        productId: { type: String, required: true },
        productName: { type: String },
        productImage: { type: String },
        sku: { type: String },
        metalType: { type: String },
        metalPurity: { type: String },
        metalWeight: { type: Number },
        stoneType: { type: String },
        stoneShape: { type: String },
        caratWeight: { type: String },
        deliveryTime: { type: String },
        certification: { type: String },
        chainLength: { type: String },
        warranty: { type: String },
        returnEligibility: { type: String },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
    }],
    couponCode: { type: String },
    totalSavings: { type: Number, default: 0 },
    estimatedDelivery: { type: String },
    totalPrice: { type: Number, required: true },
    shippingAddress: {
        id: Number,
        name: String,
        street: String,
        city: String,
        state: String,
        zip: String,
        phone: String,
        country: String,
        isDefault: Boolean,
    },
    paymentStatus: { type: String, enum: ['Pending', 'Paid', 'Failed'], default: 'Pending' },
    orderStatus: { type: String, enum: ['Processing', 'Shipped', 'Delivered', 'Cancelled'], default: 'Processing' },
    createdAt: { type: Date, default: Date.now },
});

const existingOrderModel = mongoose.models.Order as mongoose.Model<IOrder> | undefined;
if (
    existingOrderModel &&
    (
        !existingOrderModel.schema.path('products.productName') ||
        !existingOrderModel.schema.path('products.sku') ||
        !existingOrderModel.schema.path('couponCode')
    )
) {
    delete mongoose.models.Order;
}

export const Order = (mongoose.models.Order as mongoose.Model<IOrder>) || mongoose.model<IOrder>('Order', OrderSchema);

export interface IReview extends Document {
    productId: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    rating: number;
    comment: string;
    createdAt: Date;
}

const ReviewSchema: Schema = new Schema({
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

export const Review = mongoose.models.Review || mongoose.model<IReview>('Review', ReviewSchema);
