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

        await dbConnect();
        const user = await User.findOne({ email: session.user.email });
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        return NextResponse.json({
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

        const { wishlist, cart } = await req.json();

        const updateData: any = {};
        if (wishlist !== undefined) updateData.wishlist = wishlist;
        if (cart !== undefined) updateData.cart = cart;

        await dbConnect();
        const user = await User.findOneAndUpdate(
            { email: session.user.email },
            { $set: updateData },
            { returnDocument: 'after' }
        );

        return NextResponse.json({ message: "Sync successful" });
    } catch (error) {
        console.error("Sync save error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
