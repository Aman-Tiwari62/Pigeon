import User from "../models/user.model.js";
import EmailVerification from "../models/emailVerification.model.js";
import generateToken from "../utils/generateToken.js";
import generateOtp from "../utils/generateOTP.js";
import sendEmail from "../utils/sendEmail.js";
import verifyOtp from "../utils/verifyOTP.js";
import jwt from "jsonwebtoken";
 
function isValidEmail(email) {
  const emailRegex =
    /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  return emailRegex.test(email);
}

export const requestOtpForRegistration = async (req, res) => {
  try{

    const {email} = req.body;

    // basic email validation

    if(!email){
      return res.status(400).json({
        success:false,
        message:"Missing credentials"
      });
    } 

    if (!isValidEmail(email)) {
      return res.status(400).json({
        success:false,
        message: "Invalid email address",
      });
    }  
      
    // check if email is registered but not verified or profile is incomplete

    // registered:

    const record = await EmailVerification.findOne({email});

    if(record){
      if(Date.now() > record.resendExpiry){
        const {otp,otpHash} = generateOtp();
        record.otpHash = otpHash;
        record.otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
        record.resendExpiry = new Date(Date.now() + 30 * 1000); // 30 seconds
        await record.save();
        // send email here:
        await sendEmail({
          to: email,
          subject: "Verify your email",
          text: `Your OTP is ${otp}`,
          html: `
            <h2>Email Verification</h2>
            <p>Your OTP is:</p>
            <h1>${otp}</h1>
            <p>This OTP expires in 10 minutes.</p>
          `,
        });
        return res.status(201).json({
          success:true,
          message:"otp sent to email",
          resendAvailableAt: Date.now()+ 30*1000
        });
      } 
      else return res.status(200).json({
        success:true,
        message:"otp already sent. Wait for 1 minutes before requesting another otp.",
        resendAvailableAt: record.resendExpiry.getTime()
      })
    }

    // check if email is already registered
    const user = await User.findOne({email}); 
    if(user) return res.status(400).json({
      success:false,
      message:"Email already registered."
    })

    // not registered:
    const { otp, otpHash } = generateOtp();
    await EmailVerification.create({
      email,
      otpHash,
      otpExpiry : new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
      resendExpiry : new Date(Date.now() + 30 * 1000),// 30 seconds
      docExpiry: new Date( Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day
    });

    await sendEmail({
      to: email,
      subject: "Verify your email",
      text: `Your OTP is ${otp}`,
      html: `
        <h2>Email Verification</h2>
        <p>Your OTP is:</p>
        <h1>${otp}</h1>
        <p>This OTP expires in 10 minutes.</p>
      `,
    });
    
    return res.status(200).json({
      success:true, 
      message:"otp sent",
      resendAvailableAt: Date.now()+ 30*1000,
    });

  } catch(error){
    console.error(error);
    return res.status(500).json({
      success:false,
      message:"Internal server error"
    });
  }
}

export const resendOtpForRegistration = async (req, res) => {
  console.log("resend otp request received");
  try{
    console.log('try block');
    const {email} = req.body;
    if(!email) return res.status(400).json({message:"Email required"});
    if(!isValidEmail(email)) return res.status(400).json({message:"Invalid email format"});

    const record = await EmailVerification.findOne({email});
    if(record){
      if(Date.now() > record.resendExpiry){
        const {otp,otpHash} = generateOtp();
        record.otpHash = otpHash;
        record.otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
        record.resendExpiry = new Date(Date.now() + 30 * 1000); // 30 seconds
        await record.save();
        // send email here:
        await sendEmail({
          to: email,
          subject: "Verify your email",
          text: `Your OTP is ${otp}`,
          html: `
            <h2>Email Verification</h2>
            <p>Your OTP is:</p>
            <h1>${otp}</h1>
            <p>This OTP expires in 10 minutes.</p>
          `,
        });
        return res.status(200).json({success:true, message:"otp sent to email", resendAvailableAt:Date.now()+30*1000});
      }
      else return res.status(400).json({success:false, message:"Wait for sometime before requesting another otp."});
    }
    else return res.status(400).json({success:false, message:"Invalid request"});

  } catch(err){
    console.error(err);
    return res.status(500).json({success:false, message:"Internal Server Error"});
  }
};

export const verifyOtpForRegistration = async (req, res) => {
  console.log("verify otp route is hit");
  try {
    const { email, otp } = req.body;

    await verifyOtp(email, otp);

    const registrationToken = jwt.sign(
      {
        email,
        purpose: "registration",
      },
      process.env.JWT_SECRET,
      { expiresIn: "10m" }
    );

    res.cookie("registrationToken", registrationToken, {
      httpOnly: true,                 //  JS cannot access
      secure: process.env.NODE_ENV === "production", // HTTPS only in prod
      sameSite: "lax",              // CSRF protection
      maxAge: 10 * 60 * 1000,           // 10 minutes
    });

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const registerUser = async (req, res) => {
  console.log("register user route ")
  try {
    const { username, password} = req.body;
    if(!username || !password) return res.status(400).json({success:false, message:"Missing fields"});

    const registrationToken = req.cookies.registrationToken;
    // console.log(registrationToken);

    if (!registrationToken) {
      return res.status(401).json({
        success: false,
        message: "Registration session expired bhai sahab",
      });
    }
    // Verify registration token
    const decoded = jwt.verify(
      registrationToken,
      process.env.JWT_SECRET
    );

    if (decoded.purpose !== "registration") {
      return res.status(401).json({
        success: false,
        message: "Invalid registration token",
      });
    }

    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Username already taken"
      });
    }


    const email = decoded.email;

    // now create user safely
    const user = await User.create({
      username,
      email,
      password,
    });

    await EmailVerification.deleteOne({email});

    // issue final auth token
    const authToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("authToken", authToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    // 7️⃣ Clear registration cookie
    res.clearCookie("registrationToken");

    res.json({
      success: true,
      message:"User Created successfully",
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
      }
    });
    
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if(!email || !password){
      return res.status(401).json({message:"Incomplete credentials"});
    }

    // 1. Check user
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ message: "Email not found. Register first" });
    }

    // 2. Compare password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const authToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("authToken", authToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 15 minutes
    });

    // 3. Send token
    res.json({
      success: true,
      message:"Login successfull",
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
      }
    });
    

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};