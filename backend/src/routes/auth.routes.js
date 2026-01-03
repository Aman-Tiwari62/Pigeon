import express from "express";
import { registerUser, loginUser, requestOtpForRegistration, resendOtpForRegistration, verifyOtpForRegistration } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/requestOtpForRegistration", requestOtpForRegistration);
router.post("/resendOtpForRegistration", resendOtpForRegistration);
router.post("/verifyOtpForRegistration", verifyOtpForRegistration);
router.post("/login", loginUser);
router.post("/register", registerUser);

export default router;
