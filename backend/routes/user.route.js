import express from "express";
import { checkAuth, createUser, login, updateProfile } from "../controllers/user.controller.js";
import { protectRoute } from "../middleware/auth.midleware.js";

const userRoute = express.Router();

userRoute.post("/signup", createUser);

userRoute.post("/login" ,login );

userRoute.put("/update-profile" ,protectRoute , updateProfile);

userRoute.get("/check" ,protectRoute , checkAuth);

export default userRoute;