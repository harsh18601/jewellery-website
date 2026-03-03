import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import Product from "@/models/Product";
import mongoose from "mongoose";
import { contentfulClient } from "@/lib/contentful";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        const sessionUserId = (session.user as any).id;
        const userQuery = sessionUserId ? { _id: sessionUserId } : { email: session.user.email };

        await dbConnect();
        const user = await User.findOne(userQuery);
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        const rawCart = Array.isArray(user.cart) ? user.cart : [];
        const mongoIds = new Set<string>();
        const contentfulIds = new Set<string>();

        for (const item of rawCart as any[]) {
            const id = String(item?.id || "");
            if (!id) continue;
            const needsHydration = !item?.sku || !item?.metalType || item?.metalWeight === undefined || item?.metalWeight === null;
            if (!needsHydration) continue;
            if (mongoose.Types.ObjectId.isValid(id)) mongoIds.add(id);
            else contentfulIds.add(id);
        }

        const mongoMap = new Map<string, any>();
        if (mongoIds.size > 0) {
            const products = await Product.find({ _id: { $in: Array.from(mongoIds) } })
                .select("_id metal stoneType certification")
                .lean();
            for (const product of products as any[]) {
                mongoMap.set(String(product._id), {
                    metalType: product.metal || "",
                    stoneType: product.stoneType || "",
                    certification: product.certification || "",
                });
            }
        }

        const contentfulMap = new Map<string, any>();
        const cfClient = contentfulClient;
        if (cfClient && contentfulIds.size > 0) {
            const entries = await Promise.all(
                Array.from(contentfulIds).map(async (id) => {
                    try {
                        const entry = await cfClient.getEntry(id);
                        const fields = (entry as any)?.fields || {};
                        return {
                            id,
                            sku: String(fields.sku || ""),
                            metalType: String(fields.metalType || fields.metal || ""),
                            metalPurity: String(fields.metalPurity || ""),
                            metalWeight: Number(fields.metalWeight || 0) || undefined,
                            stoneType: String(fields.stoneType || ""),
                            stoneShape: String(fields.stoneShape || ""),
                            totalCaratWeight: String(fields.totalCaratWeight || ""),
                            deliveryTime: String(fields.deliveryTime || fields.deliveryDays || ""),
                            certification: String(fields.certificationType || fields.certification || ""),
                        };
                    } catch {
                        return null;
                    }
                })
            );
            for (const entry of entries) {
                if (!entry) continue;
                contentfulMap.set(entry.id, entry);
            }
        }

        const hydratedCart = rawCart.map((item: any) => {
            const id = String(item?.id || "");
            const fromMongo = mongoMap.get(id) || {};
            const fromContentful = contentfulMap.get(id) || {};
            return {
                ...item,
                sku: item?.sku || fromContentful.sku || "",
                metalType: item?.metalType || item?.metal || fromContentful.metalType || fromMongo.metalType || "",
                metalPurity: item?.metalPurity || fromContentful.metalPurity || "",
                metalWeight: item?.metalWeight ?? fromContentful.metalWeight,
                stoneType: item?.stoneType || fromContentful.stoneType || fromMongo.stoneType || "",
                stoneShape: item?.stoneShape || fromContentful.stoneShape || "",
                totalCaratWeight: item?.totalCaratWeight || item?.caratWeight || fromContentful.totalCaratWeight || "",
                deliveryTime: item?.deliveryTime || item?.deliveryDays || fromContentful.deliveryTime || "",
                certification: item?.certification || fromContentful.certification || fromMongo.certification || "",
            };
        });

        return NextResponse.json({
            name: user.name,
            email: user.email,
            passwordUpdatedAt: user.passwordUpdatedAt || null,
            wishlist: user.wishlist || [],
            cart: hydratedCart,
            addresses: user.addresses || [],
        });
    } catch (error) {
        console.error("Sync fetch error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        const sessionUserId = (session.user as any).id;
        const userQuery = sessionUserId ? { _id: sessionUserId } : { email: session.user.email };

        let payload: Record<string, unknown> = {};
        try {
            payload = await req.json();
        } catch {
            payload = {};
        }
        const { wishlist, cart, name, email, addresses } = payload;

        const updateData: any = {};
        if (typeof name === 'string' && name.trim()) updateData.name = name.trim();
        if (typeof email === 'string' && email.trim()) updateData.email = email.trim().toLowerCase();
        if (wishlist !== undefined) updateData.wishlist = wishlist;
        if (cart !== undefined) updateData.cart = cart;
        if (Array.isArray(addresses)) updateData.addresses = addresses;

        await dbConnect();
        await User.findOneAndUpdate(
            userQuery,
            { $set: updateData },
            { returnDocument: 'after' }
        );

        return NextResponse.json({ message: "Sync successful" });
    } catch (error) {
        console.error("Sync save error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
