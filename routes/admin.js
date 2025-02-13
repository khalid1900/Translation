import express from "express";
import * as admin from "../controllers/admin.js";
import { requireSignIn } from "../middleware/authWall.js";

const router = express.Router();


router.get("/", requireSignIn, admin.getMe);
router.post("/signup", admin.signUp);
router.post("/signin", admin.signIN);
router.put("/forgotPassword", admin.resetPass);


export { router as adminRoutes };






