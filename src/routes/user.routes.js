import { Router } from "express";
import {registerUser} from "../controllers/user.controller.js"
import {upload} from "../middlewares/multer.middleware.js"      // for file handling

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

export default router

// now, we have to export this routes in app.js (standard practice)