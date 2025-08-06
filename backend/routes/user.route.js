import express from "express";
import { checkAuth, createUser, login, updateProfile } from "../controllers/user.controller.js";
import { protectRoute } from "../middleware/auth.midleware.js";

const userRoute = express.Router();

userRoute.post("/signup", createUser); // working 

userRoute.post("/login" ,login );

userRoute.put("/update-profile" ,protectRoute , updateProfile); // checking pending

userRoute.get("/check" ,protectRoute , checkAuth);

export default userRoute;