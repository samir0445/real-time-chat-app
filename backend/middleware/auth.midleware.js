import jwt from "jsonwebtoken";
import "dotenv/config";
import User from "../models/user.model.js";

// middleware to pretect route
export const protectRoute = async (req,res , next)=>{
    try {
        const token = req.header.token ;
        //decode token
        const decode = jwt.verify(token , process.env.JWT_SECRET_KEY);
        console.log(decode);
        

        const user = await User.findById(decode.userId).select("-password");
        if(!user) {
             return res.status(401).json({ success : false , message : " user not found" });
        }
        req.user = user;




        next();
    } catch (error) {
        return res.status(500).json({ success : false , message : error.message});
    }
}