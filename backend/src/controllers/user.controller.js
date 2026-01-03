import User from "../models/user.model.js";
import Follow from "../models/follow.model.js"
import cloudinary from "../config/cloudinary.js";

export async function searchUsers(req,res){
    console.log("search route hit");
    try{
        const userId = req.user._id;
        const { query } = req.query;
        if (!query) {
            console.log('query not found');
            return res.status(200).json({
                success: true,
                message: "Users fetched successfully",
                users: []
            });
        }
        const users = await User.find({
            username: { $regex: query, $options: "i" },
            _id: { $ne: userId }, // exclude self
        }).select("username email profilePhoto");
        return res.status(200).json({
            success: true,
            message: "Users fetched successfully",
            users
        });
    }catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            message:"Internal Server Error"
        })
    }
}

export async function profileUpload(req,res){
    console.log("profile upload");
    try {
        // 1️⃣ Check file existence
        if (!req.file) {
          return res.status(400).json({
            success: false,
            message: "No image file provided",
          });
        }
    
        // 2️⃣ Upload to cloudinary
        const result = await cloudinary.uploader.upload(
          `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`,
          {
            folder: "profile_photos_pigeon",
            transformation: [
              { width: 300, height: 300, crop: "fill" }, // optional optimization
            ],
          }
        );
    
        // 3️⃣ Update user's profile photo URL
        req.user.profilePhoto = result.secure_url;
        await req.user.save();
    
        // 4️⃣ Send response
        return res.status(200).json({
          success: true,
          message: "Profile photo uploaded successfully",
          user: req.user,
        });
    
      } catch (error) {
        console.error("Profile upload error:", error);
        return res.status(500).json({
          success: false,
          message: "Profile upload failed",
        });
      }
}

export const getUserProfile = async (req, res) => {
  try {
    const { username } = req.params;

    const user = await User.findOne({ username })
      .select("username profilePhoto followersCount followingCount");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      success: true,
      message:"user fetched successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const followLogic = async (req,res) => {
  try {
    const followerId = req.user._id;        // logged-in user
    const followingId = req.params.userId;  // profile user

    if (followerId.equals(followingId)) {
      return res.status(400).json({
        success: false,
        message: "You cannot follow yourself",
      });
    }

    // Create follow document
    await Follow.create({
      follower: followerId,
      following: followingId,
    });

    // Update counts atomically
    await User.findByIdAndUpdate(followerId, {
      $inc: { followingCount: 1 },
    });

    await User.findByIdAndUpdate(followingId, {
      $inc: { followersCount: 1 },
    });

    return res.status(200).json({
      success: true,
      message: "User followed successfully",
    });

  } catch (error) {
    console.log(error);
    // Duplicate follow error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Already following this user",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
}

export const unfollowLogic = async (req, res) => {
  try {
    const followerId = req.user._id;
    const followingId = req.params.userId;

    const deleted = await Follow.findOneAndDelete({
      follower: followerId,
      following: followingId,
    });

    if (!deleted) {
      return res.status(400).json({
        success: false,
        message: "You are not following this user",
      });
    }

    await User.findByIdAndUpdate(followerId, {
      $inc: { followingCount: -1 },
    });

    await User.findByIdAndUpdate(followingId, {
      $inc: { followersCount: -1 },
    });

    return res.status(200).json({
      success: true,
      message: "User unfollowed successfully",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const checkFollowingLogic = async (req, res) =>{
  try {
    const loggedInUserId = req.user._id;
    const targetUserId = req.params.userId;

    if (!targetUserId) {
      return res.status(400).json({
        success: false,
        message: "Target user id is required",
      });
    }

    // cannot follow yourself
    if (loggedInUserId.toString() === targetUserId) {
      return res.status(200).json({
        success: true,
        isFollowing: false,
      });
    }

    const followDoc = await Follow.findOne({
      follower: loggedInUserId,
      following: targetUserId,
    }).select("_id");

    return res.status(200).json({
      success: true,
      isFollowing: !!followDoc,
    });
  } catch (error) {
    console.error("checkFollowingLogic error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
}



