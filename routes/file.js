import express from "express";
import { uploadFile, getFiles, downloadFile, dummyForm } from "../controllers/file.js";
import { requireSignIn } from "../middleware/authWall.js";

const router = express.Router();

router.post("/upload", requireSignIn, uploadFile);
router.post("/kk", dummyForm);
router.get("/", requireSignIn, getFiles);
router.get("/:id/download", requireSignIn, downloadFile);

export { router as fileRoutes };
