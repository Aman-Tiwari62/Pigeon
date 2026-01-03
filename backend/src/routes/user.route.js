import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import upload from "../middlewares/multer.middleware.js";
import {searchUsers, profileUpload, getUserProfile, followLogic, unfollowLogic, checkFollowingLogic} from "../controllers/user.controller.js";

const router = express.Router();

console.log('user route hit (auth awaited)');
router.use(authMiddleware);

console.log('user route hit (auth successfull)');

router.get('/', async (req,res) => {
    console.log("user found");
    res.status(200).json({
        success:true,
        message: "user found",
        user:req.user
    })
})

router.get('/search', searchUsers);
router.get('/follow/:userId', followLogic);
router.get('/unfollow/:userId', unfollowLogic);
router.get('/checkFollowing/:userId', checkFollowingLogic);
router.get('/fetch/:username', getUserProfile);
router.post('/profileUpload',upload.single("profilePhoto"), profileUpload);

export default router;
