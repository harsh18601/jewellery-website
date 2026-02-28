"use server"

import dbConnect from "@/lib/dbConnect";
import Product, { IProduct } from "@/models/Product";
import { revalidatePath } from "next/cache";

export async function getProducts(query: any = {}) {
    await dbConnect();
    try {
        const { searchTerm, cat, metal, ...otherFilters } = query;
        let mongoQuery: any = { ...otherFilters };

        if (cat) {
            mongoQuery.category = { $regex: new RegExp(`^${cat}$`, 'i') };
        }
        if (metal) {
            mongoQuery.metal = { $regex: new RegExp(`^${metal}$`, 'i') };
        }

        if (searchTerm) {
            mongoQuery = {
                ...mongoQuery,
                $or: [
                    { title: { $regex: searchTerm, $options: 'i' } },
                    { description: { $regex: searchTerm, $options: 'i' } },
                    { stoneType: { $regex: searchTerm, $options: 'i' } }
                ]
            };
        }

        const products = await Product.find(mongoQuery).sort({ createdAt: -1 }).lean();
        return JSON.parse(JSON.stringify(products));
    } catch (error) {
        console.error("Error fetching products:", error);
        return [];
    }
}


export async function getProductById(id: string) {
    await dbConnect();
    try {
        const product = await Product.findById(id).lean();
        return JSON.parse(JSON.stringify(product));
    } catch (error) {
        console.error("Error fetching product:", error);
        return null;
    }
}

export async function addProduct(formData: FormData) {
    await dbConnect();
    try {
        const title = formData.get("title") as string;
        const description = formData.get("description") as string;
        const category = formData.get("category") as any;
        const metal = formData.get("metal") as any;
        const stoneType = formData.get("stoneType") as string;
        const price = Number(formData.get("price"));
        const inventory = Number(formData.get("inventory"));
        const images = (formData.get("images") as string).split(",");

        const product = new Product({
            title,
            description,
            category,
            metal,
            stoneType,
            price,
            inventory,
            images,
        });

        await product.save();
        revalidatePath("/shop");
        revalidatePath("/admin");
        return { success: true };
    } catch (error) {
        console.error("Error adding product:", error);
        return { success: false, error: "Failed to add product" };
    }
}
