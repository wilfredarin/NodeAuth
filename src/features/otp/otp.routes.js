import express from "express";
import { sendOTP,verifyOTP,getOTPView } from "../otp/otp.controller.js";

//create a express router object
const router = express.Router();

router.route("/").get(getOTPView);
router.route("/").post(sendOTP);
router.route("/verify-otp/:email").post(verifyOTP);

export default router;



