import { Router } from "express";
import {registerUser, loginUser, logoutUser, refreshAccessToken} from "../controllers/user.controller.js"
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
router.route("/logout").post(verifyJWT, logoutUser)     // verifyJWT is a middleware here

router.route("/refresh-token").post(refreshAccessToken)


export default router

// now, we have to export this routes in app.js (standard practice)