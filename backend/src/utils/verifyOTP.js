import crypto from "crypto";
import EmailVerification from "../models/emailVerification.model.js";

const verifyOtp = async (email, userOtp) => {
  console.log(userOtp);
  const record = await EmailVerification
    .findOne({ email })
    .select("+otpHash");

  if (!record) {
    throw new Error("OTP not found or expired. Go to registration");
  }

  const userOtpHash = crypto
    .createHash("sha256")
    .update(userOtp)
    .digest("hex");

  if (userOtpHash !== record.otpHash) {
    console.log('here is the error');
    console.log('user otp hash: '+ userOtpHash);
    console.log('record otp hash: '+ record.otpHash);
    throw new Error("Invalid OTP");
  }

  if (record.otpExpiry < Date.now()) {
    throw new Error("OTP expired");
  }
  
  record.verified = true;
  await record.save();

  return true;
};

export default verifyOtp;
