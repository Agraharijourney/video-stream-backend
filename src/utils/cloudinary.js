import { v2 as cloudinary } from "cloudinary";
import fs from "node:fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudnary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    //upload th file on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    // file has been uploaded successfully
    console.log("file is uploaded on cloudenary", response.url);
    return response;
  } catch (error) {
    console.log(`Exception while doing something: ${error}`);
    fs.unlinkSync(localFilePath); //removed the localy saved temporary file as the upload
    return null;
  }
};

export {uploadOnCloudnary}