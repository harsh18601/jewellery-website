import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadImage = async (fileUri: string) => {
    try {
        const result = await cloudinary.uploader.upload(fileUri, {
            folder: 'jewellery/custom_orders',
        });
        return result.secure_url;
    } catch (error) {
        console.error('Error uploading to Cloudinary:', error);
        throw error;
    }
};

export default cloudinary;
