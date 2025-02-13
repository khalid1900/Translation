import express from "express";
import * as client from "../controllers/client.js";
import { requireSignIn } from "../middleware/authWall.js";

const router = express.Router();


router.get("/", requireSignIn, client.getMe);
router.post("/signup", client.signUp);
router.post("/signin", client.signIN);
router.put("/forgotPassword", client.resetPass);


export { router as clientRoutes };
