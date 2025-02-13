import FileModel from "../models/file.js"; 
import { uploadFile as uploadToS3 } from "../helper/aws.js";
import { extractTextFromImage } from "../utils/ocr.js"; 
import dummy from "../models/dummy.js";





// export const uploadFile = async (req, res, next) => {
//   try {
//     if (!req.user) {
//       return res.status(401).json({ message: "Unauthorized: User not found" });
//     }

//     if (!req.files || req.files.length === 0) {
//       return res.status(400).json({ message: "No file uploaded" });
//     }

//     const file = req.files[0]; // Get first file
//     const uploadedFile = await uploadToS3(file);

//     let extractedText = null;
//     if (file.mimetype.startsWith("image/")) { // ✅ Use file.mimetype instead of req.file.mimetype
//       extractedText = await extractTextFromImage(uploadedFile);
//     }

//     const newFile = await FileModel.create({
//       user: req.user._id,
//       fileUrl: uploadedFile,
//       fileType: file.mimetype, // ✅ Corrected `mimetype` reference
//       extractedText: extractedText, // ✅ Now stores extracted text if available
//       status: "Uploaded",
//     });

//     res.status(201).json({ message: "File uploaded successfully", data: newFile });
//   } catch (error) {
//     next(error);
//   }
// };

export const uploadFile = async (req, res, next) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    const { fileUrl, fileType } = req.body; // File Picker sends URL & type

    if (!fileUrl || !fileType) {
      return res.status(400).json({ message: "File URL or type missing" });
    }

    let extractedText = null;

    // ✅ Extract text only if the file is an image
    if (fileType.startsWith("image/")) {
      try {
        extractedText = await extractTextFromImage(fileUrl);
      } catch (err) {
        console.error("Error extracting text from image:", err);
      }
    }

    // ✅ Save file details in DB
    const newFile = await FileModel.create({
      user: req.user._id,
      name: req.user.name,
      email: req.user.email,
      fileUrl, // File Picker URL
      fileType,
      extractedText,
      status: "Uploaded",
    });

    res.status(201).json({ message: "File uploaded successfully", data: newFile });
  } catch (error) {
    next(error);
  }
};
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
    const file = await FileModel.findOne({ user: req.params.id }); 
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
    const files = await FileModel.find();

    if (!files.length) {
      return res.status(404).json({ message: "No files found" });
    }

    res.status(200).json({ message: "Files fetched successfully", data: files });
  } catch (error) {
    next(error);
  }
};

export const dummyForm = async (req, res) => {
  try {

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

