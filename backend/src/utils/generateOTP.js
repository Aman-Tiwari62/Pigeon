import crypto from "crypto";

const generateOtp = () => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  const otpHash = crypto
    .createHash("sha256")
    .update(otp)
    .digest("hex");

  return { otp, otpHash };
};

export default generateOtp;
