import { Router } from "express";
import {
    registerUser,
    loginUser, 
    logoutUser, 
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage,
    getUserChannelProfile,
    getWatchHistory
} from "../controllers/user.controller.js"
import {upload} from "../middlewares/multer.middleware.js"      // for file handling
import {verifyJWT} from "../middlewares/auth.middleware.js"


const router = Router();

router.route("/register").post(
    upload.fields(
        [
            {
                name: "avatar",             // this should remain same with frontend
                maxCount: 1
            }, {
                name: "cover",
                maxCount: 1,
            }
        ]
    ),
    registerUser);

router.route("/login").post(loginUser)


// secured routes:
// if data is sent, we will write post, else not
router.route("/logout").post(verifyJWT, logoutUser)     // verifyJWT is a middleware here

router.route("/refresh-token").post(refreshAccessToken)

router.route("/change-password").post(verifyJWT, changeCurrentPassword)

router.route("/current-user").get(verifyJWT, getCurrentUser)

router.route("/update-account").patch(verifyJWT, updateAccountDetails)  // patch is for partial update

router.route("/avatar").patch(verifyJWT, upload.single("avatar"), updateUserAvatar)

router.route("/cover-image").patch(verifyJWT, upload.single("coverImage"), updateUserCoverImage)

router.route("/c/:username").get(verifyJWT, getUserChannelProfile)

router.route("/history").get(verifyJWT, getWatchHistory)

export default router

// now, we have to export this routes in app.js (standard practice)