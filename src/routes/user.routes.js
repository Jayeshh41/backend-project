import { Router } from "express";
import {registerUser} from "../controllers/user.controller.js"

const router = Router();

router.route("/register").post(registerUser);

export default router

// now, we have to export this routes in app.js (standard practice)