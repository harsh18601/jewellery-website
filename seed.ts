import mongoose from 'mongoose';
import dbConnect from './src/lib/dbConnect';
import Product from './src/models/Product';

const seedProducts = [
    {
        title: "Eternal Solitaire Ring",
        description: "A timeless 2ct Lab-Grown Diamond set in 18K Solid Gold. Perfect for engagements that last forever.",
        category: "Lab-Grown",
        metal: "18K Gold",
        stoneType: "Diamond",
        price: 125000,
        images: ["https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&q=80&w=800"],
        inventory: 5
    },
    {
        title: "Jaipur Emerald Drops",
        description: "Hand-carved Emeralds from the heart of Jaipur, suspended from 14K White Gold chains.",
        category: "Silver",
        metal: "14K White Gold",
        stoneType: "Emerald",
        price: 85000,
        images: ["https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=800"],
        inventory: 3
    },
    {
        title: "Celestial Diamond Necklace",
        description: "A constellation of small Lab-Grown Diamonds forming a delicate necklace for daily luxury.",
        category: "Lab-Grown",
        metal: "18K Rose Gold",
        stoneType: "Diamond",
        price: 210000,
        images: ["https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800"],
        inventory: 2
    }
];

async function seed() {
    const MONGODB_URI = "mongodb://localhost:27017/jewellery-platform";
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB for seeding...");

    await Product.deleteMany({});
    await Product.insertMany(seedProducts);

    console.log("Seeding complete!");
    process.exit(0);
}

seed().catch(err => {
    console.error(err);
    process.exit(1);
});
