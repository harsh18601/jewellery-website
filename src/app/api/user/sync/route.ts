import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

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

        return NextResponse.json({
            name: user.name,
            email: user.email,
            passwordUpdatedAt: user.passwordUpdatedAt || null,
            wishlist: user.wishlist || [],
            cart: user.cart || [],
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
        const { wishlist, cart, name, email } = payload;

        const updateData: any = {};
        if (typeof name === 'string' && name.trim()) updateData.name = name.trim();
        if (typeof email === 'string' && email.trim()) updateData.email = email.trim().toLowerCase();
        if (wishlist !== undefined) updateData.wishlist = wishlist;
        if (cart !== undefined) updateData.cart = cart;

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
