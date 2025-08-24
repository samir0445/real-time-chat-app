import jwt from "jsonwebtoken";
import "dotenv/config";
import User from "../models/user.model.js";

// middleware to pretect route
export const protectRoute = async (req,res , next)=>{
    try {

        // const authHeader = req.headers.authorization;

        // if (!authHeader || !authHeader.startsWith("Bearer ")) {
        //     return res.status(401).json({ success: false, message: "JWT must be provided" });
        // }

        // const token = authHeader.split(" ")[1];
        const token = req.header.token ;
        // //decode token
        const decode = jwt.verify(token , process.env.JWT_SECRET_KEY);
       
        

        const user = await User.findById(decode.userId).select("-password");
        if(!user) {
             return res.status(401).json({ success : false , message : " user not found" });
        }
        req.user = user;




        next();
    } catch (error) {
        console.log(error.message);
        
        return res.status(500).json({ success : false , message : error.message});
    }
}