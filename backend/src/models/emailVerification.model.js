import mongoose from "mongoose";

const emailVerificationSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    otpHash: {
      type: String,
      required: true,
      select: false,
    },
    docExpiry:{
      type: Date,
      required: true
    },
    otpExpiry: {
      type: Date,
      required: true,
    },
    resendExpiry:{
      type: Date,
      required: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// TTL INDEX
emailVerificationSchema.index(
    { docExpiry: 1 },
    { expireAfterSeconds: 0 }
  );

const EmailVerification = mongoose.model("EmailVerification", emailVerificationSchema );
export default EmailVerification;
