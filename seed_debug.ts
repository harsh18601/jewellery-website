import mongoose from 'mongoose';

const MONGODB_URI = "mongodb://localhost:27017/jewellery-platform";

const ProductSchema = new mongoose.Schema({
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
    inventory: { type: Number, required: true, default: 0 }
});

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

const seedProducts = [
    {
        title: "Eternal Solitaire Ring",
        description: "A timeless 2ct Lab-Grown Diamond set in Gold.",
        category: "Lab-Grown",
        metal: "Gold",
        stoneType: "Diamond",
        labGrown: true,
        price: 125000,
        images: ["https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&q=80&w=800"],
        inventory: 5
    }
];

async function seed() {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected...");
    await Product.deleteMany({});
    try {
        await Product.insertMany(seedProducts);
        console.log("Success!");
    } catch (err: unknown) {
        const errorPayload =
            err && typeof err === 'object' && 'errors' in err
                ? (err as { errors?: unknown }).errors
                : err;
        console.log("Error details:", JSON.stringify(errorPayload, null, 2));
    }
    process.exit(0);
}

seed();
