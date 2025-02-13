import FileModel from "../models/file.js"; 
import { uploadFile as uploadToS3 } from "../helper/aws.js";
import { extractTextFromImage } from "../utils/ocr.js"; 
import dummy from "../models/dummy.js";

/**
 * Handles file upload and optional OCR text extraction.
 */
// export const uploadFile = async (req, res, next) => {
//   try {
//     if (!req.user) {
//       return res.status(401).json({ message: "Unauthorized: User not found" });
//     }

//     const { fileUrl, fileType } = req.body;
//     let extractedText = null;

//     if (fileType.startsWith("image/")) {
//       extractedText = await extractTextFromImage(fileUrl);
//     }

//     const newFile = await FileModel.create({
//       user: req.user._id, // This is now available!
//       fileUrl,
//       fileType,
//       extractedText,
//       status: "Uploaded",
//     });

//     res.status(201).json({ message: "File uploaded successfully", data: newFile });
//   } catch (error) {
//     next(error);
//   }
// };


export const uploadFile = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Upload file to S3 or another storage service
    const fileUrl = await uploadToS3(req.file);

    let extractedText = null;
    if (req.file.mimetype.startsWith("image/")) {
      extractedText = await extractTextFromImage(fileUrl);
    }

    const newFile = await FileModel.create({
      user: req.user._id,
      fileUrl,
      fileType: req.file.mimetype,
      extractedText,
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

