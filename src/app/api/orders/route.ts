import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import dbConnect from "@/lib/dbConnect";
import { Order } from "@/models/Order";
import User from "@/models/User";

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
        return NextResponse.json({ orders });
    } catch (error) {
        console.error("Orders fetch error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

