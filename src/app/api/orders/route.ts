import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import dbConnect from "@/lib/dbConnect";
import { Order } from "@/models/Order";
import User from "@/models/User";
import Product from "@/models/Product";
import mongoose from "mongoose";
import { contentfulClient } from "@/lib/contentful";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();

        let userId = (session.user as any).id as string | undefined;
        if (!userId && session.user.email) {
            const user = await User.findOne({ email: session.user.email }).select("_id");
            if (user?._id) userId = user._id.toString();
        }

        if (!userId) {
            return NextResponse.json({ orders: [] });
        }

        const orders = await Order.find({ userId }).sort({ createdAt: -1 }).lean();

        const mongoProductIdsToHydrate = new Set<string>();
        const contentfulProductIdsToHydrate = new Set<string>();
        for (const order of orders as any[]) {
            for (const product of order.products || []) {
                if (!product?.productId) continue;
                if (product.productName && product.productImage) continue;
                const id = String(product.productId);
                if (mongoose.Types.ObjectId.isValid(id)) {
                    mongoProductIdsToHydrate.add(id);
                } else {
                    contentfulProductIdsToHydrate.add(id);
                }
            }
        }

        const productMap = new Map<string, { title: string; image: string }>();
        if (mongoProductIdsToHydrate.size > 0) {
            const products = await Product.find({ _id: { $in: Array.from(mongoProductIdsToHydrate) } })
                .select("_id title images")
                .lean();

            for (const product of products as any[]) {
                productMap.set(String(product._id), {
                    title: product.title || "",
                    image: Array.isArray(product.images) ? product.images[0] || "" : "",
                });
            }
        }

        const cfClient = contentfulClient;
        if (cfClient && contentfulProductIdsToHydrate.size > 0) {
            const contentfulEntries = await Promise.all(
                Array.from(contentfulProductIdsToHydrate).map(async (id) => {
                    try {
                        const entry = await cfClient.getEntry(id);
                        const fields = (entry as any)?.fields || {};
                        const images = Array.isArray(fields.images) ? fields.images : [];
                        const firstImage = images[0]?.fields?.file?.url
                            ? `https:${images[0].fields.file.url}`
                            : "";
                        return {
                            id,
                            title: String(fields.title || ""),
                            image: firstImage,
                        };
                    } catch {
                        return null;
                    }
                })
            );

            for (const entry of contentfulEntries) {
                if (!entry) continue;
                productMap.set(entry.id, { title: entry.title, image: entry.image });
            }
        }

        const hydratedOrders = (orders as any[]).map((order) => ({
            ...order,
            products: (order.products || []).map((product: any) => {
                const fallback = productMap.get(String(product.productId));
                return {
                    ...product,
                    productName: product.productName || fallback?.title || "",
                    productImage: product.productImage || fallback?.image || "",
                };
            }),
        }));

        return NextResponse.json({ orders: hydratedOrders });
    } catch (error) {
        console.error("Orders fetch error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
