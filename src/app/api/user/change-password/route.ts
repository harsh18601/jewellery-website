import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import bcrypt from "bcryptjs";
import { authOptions } from "@/auth";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user?.email) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        const sessionUserId = (session.user as any).id;
        const userQuery = sessionUserId ? { _id: sessionUserId } : { email: session.user.email };

        const { currentPassword, newPassword } = await req.json();
        if (!currentPassword || !newPassword) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }
        if (String(newPassword).length < 8) {
            return NextResponse.json({ message: "New password must be at least 8 characters." }, { status: 400 });
        }

        await dbConnect();
        const user = await User.findOne(userQuery);
        if (!user || !user.password) {
            return NextResponse.json({ message: "Password account not found." }, { status: 404 });
        }

        const isValid = await bcrypt.compare(currentPassword, user.password);
        if (!isValid) {
            return NextResponse.json({ message: "Current password is incorrect." }, { status: 400 });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        user.passwordUpdatedAt = new Date();
        await user.save();

        return NextResponse.json({ message: "Password updated successfully", passwordUpdatedAt: user.passwordUpdatedAt });
    } catch (error) {
        console.error("Change password error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
