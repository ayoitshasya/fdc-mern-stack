import fs from "fs/promises";
import path from "path";
import cloudinary from "../utils/cloudinary.js";

export const saveTempFile = async (buffer, fileName) => {
    const tempDir = "./temp";
    await fs.mkdir(tempDir, { recursive: true });
    const filePath = path.join(tempDir, fileName);
    await fs.writeFile(filePath, buffer);
    return filePath;
  };
  
export const uploadFile = async (filePath, folder, resourceType = "raw") => {
    const result = await cloudinary.uploader.upload(filePath, {
      folder,
      resource_type: resourceType,
      use_filename: true,
      type: "upload",
    });
    return result.secure_url;
  };
  
export const deleteFile = async (filePath) => {
    try {
      await fs.unlink(filePath);
    } catch (err) {
      console.error("Error deleting temp file:", filePath, err.message);
    }
  };