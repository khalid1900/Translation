import express from "express";
import { uploadFile, getFiles, downloadFile, dummyForm, getAllFiles } from "../controllers/file.js";
import { requireSignIn,isAdmin } from "../middleware/authWall.js";

const router = express.Router();

router.post("/upload", requireSignIn,  uploadFile); 
router.post("/kk", dummyForm);  

router.get("/:id", requireSignIn, getFiles);

router.get("/download/:id", requireSignIn, downloadFile);

router.get("/admin/files", requireSignIn, isAdmin, getAllFiles);

export { router as fileRoutes };
