import express from "express";
import sendMessage, { getAllMessages } from "../controllers/message.controller.js"
import { isAdminAuthenticated } from "../middlewares/auth.js";


const router = express.Router();

router.post("/send",sendMessage);
router.get("/getAll", isAdminAuthenticated, getAllMessages)

export default router;