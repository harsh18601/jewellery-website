"use server"

import dbConnect from "@/lib/dbConnect";
import { Order } from "@/models/Order";
import CustomOrder from "@/models/CustomOrder";
import { revalidatePath } from "next/cache";

export async function createOrder(orderData: any) {
    await dbConnect();
    try {
        const order = new Order(orderData);
        await order.save();
        revalidatePath("/admin");
        return { success: true, orderId: order._id.toString() };
    } catch (error) {
        console.error("Error creating order:", error);
        return { success: false, error: "Failed to create order" };
    }
}

export async function submitCustomOrder(formData: FormData) {
    await dbConnect();
    try {
        const name = formData.get("name") as string;
        const email = formData.get("email") as string;
        const phone = formData.get("phone") as string;
        const stoneType = formData.get("stoneType") as string;
        const metal = formData.get("metal") as string;
        const size = formData.get("size") as string;
        const engraving = formData.get("engraving") as string;
        const carats = formData.get("carats") as string;

        // Handle Image Uploads
        const imageFiles = formData.getAll("referenceImages") as File[];
        const referenceImages: string[] = [];

        if (imageFiles && imageFiles.length > 0 && imageFiles[0].size > 0) {
            const { v2: cloudinary } = await import('cloudinary');
            cloudinary.config({
                cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
                api_key: process.env.CLOUDINARY_API_KEY,
                api_secret: process.env.CLOUDINARY_API_SECRET,
            });

            for (const file of imageFiles) {
                if (file.size === 0) continue;
                const arrayBuffer = await file.arrayBuffer();
                const buffer = Buffer.from(arrayBuffer);
                const base64Image = `data:${file.type};base64,${buffer.toString('base64')}`;

                const result = await cloudinary.uploader.upload(base64Image, {
                    folder: 'jewellery/custom_orders',
                });
                referenceImages.push(result.secure_url);
            }
        }

        const customOrder = new CustomOrder({
            userDetails: { name, email, phone },
            selectedOptions: { stoneType, metal, size, engraving, carats },
            referenceImages,
            quotationStatus: "Pending",
        });

        await customOrder.save();
        revalidatePath("/admin");
        return { success: true };
    } catch (error) {
        console.error("Error submitting custom order:", error);
        return { success: false, error: "Failed to submit custom order" };
    }
}
