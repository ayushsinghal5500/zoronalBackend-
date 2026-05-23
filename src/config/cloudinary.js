import { v2 as cloudinary } from "cloudinary";
import 'dotenv/config';

// Debug logs for environment variables
if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  console.error("DEBUG: Cloudinary credentials missing in environment variables!");
} else {
  console.log("DEBUG: Cloudinary credentials found.");
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;