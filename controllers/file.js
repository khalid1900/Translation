import FileModel from "../models/file.js"; 
import { uploadFile as uploadToS3 } from "../helper/aws.js";
import { extractTextFromImage } from "../utils/ocr.js"; 
import dummy from "../models/dummy.js";





export const uploadFile = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const file = req.files[0]; // Get first file
    const uploadedFile = await uploadToS3(file);

    let extractedText = null;
    if (file.mimetype.startsWith("image/")) { // ✅ Use file.mimetype instead of req.file.mimetype
      extractedText = await extractTextFromImage(uploadedFile);
    }

    const newFile = await FileModel.create({
      user: req.user._id,
      fileUrl: uploadedFile,
      fileType: file.mimetype, // ✅ Corrected `mimetype` reference
      extractedText: extractedText, // ✅ Now stores extracted text if available
      status: "Uploaded",
    });

    res.status(201).json({ message: "File uploaded successfully", data: newFile });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all files for the authenticated user
 */
export const getFiles = async (req, res, next) => {
  try {
    const files = await FileModel.find({ user: req.user._id });
    res.status(200).json({ message: "Files fetched successfully", data: files });
  } catch (error) {
    next(error);
  }
};

/**
 * Download file by ID
 */
export const downloadFile = async (req, res, next) => {
  try {
    const file = await FileModel.findById(req.params.id);
    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }
    res.status(200).json({ fileUrl: file.fileUrl });
  } catch (error) {
    next(error);
  }
};


export const getAllFiles = async (req, res, next) => {
  try {
    const files = await FileModel.find()
      .populate("user", "name email language") 
      .select("fileUrl fileType status user"); 

    if (!files.length) {
      return res.status(404).json({ message: "No files found" });
    }

    // Format response data
    const formattedFiles = files.map(file => ({
      name: file.user ? file.user.name : "Unknown",  // ✅ Safe check
      email: file.user ? file.user.email : "Unknown",
      language: file.user ? file.user.language : "Unknown",
      fileUrl: file.fileUrl,
      status: file.status
    }));

    res.status(200).json({ message: "Files fetched successfully", data: formattedFiles });
  } catch (error) {
    next(error);
  }
};





export const dummyForm = async (req, res) => {
  console.log(req.body,"first")
  try {

    console.log(req.body,"send")
      const emprsume = req.files[0];
      const uploadedResume = await uploadToS3(emprsume);
      const newDummy = new dummy({
        resume:uploadedResume
      });
        const savedDummy = await newDummy.save();
  
      res.status(201).json({message: "Speculative form send successfully",data:savedDummy});
     
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };

