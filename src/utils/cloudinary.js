// import {v2} from "cloudinary"; // this is also correct but writing v2 as cloudinary is a good practice

import {v2 as cloudinary} from "cloudinary";   
import fs from "fs";          // fs: file system comes with node js

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
  });

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null
        // upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, 
            {
                resource_type: "auto",      // gives the file extension
            })
            // file has been uploaded successfully
            console.log("File is uploaded on cloudinary successfully",response.url)     // In this case, we only want the public url after uploading
            return response         // user will access whatever he wants from this response
    } 
    catch (error) {
        fs.unlinkSync(localFilePath)    // remove the locally saved temporary file as the upload operation gets failed
        return null;
        
    }
}

export {uploadOnCloudinary}