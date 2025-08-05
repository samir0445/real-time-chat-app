import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import { generateToken } from "../config/util.js";
import cloudinary from "../config/cloudinary.js";



export const createUser = async(req,res)=>{

    const { email , fullName , password , bio }= req.body;


    try {

        if(!email ||  !fullName || !password ){
        return res.status(400).json({ success : false , message : " email or full name pr password is requie"})
    }
    const existuser = await User.findOne({email});
    if(existuser){
        return res.status(400).json({ success : false , message : " user already exist"});

    }
     // hashed pass
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash( password , salt);

    const newuser = await User.create({
        email,
        fullName,
        password : hashedPass,
        bio : bio || "",
    });

     const token = generateToken(newuser._id);
    
     res.json({ success : true ,data : newuser ,token , message :" account created successfully"})
        
    } catch (error) {
         return res.status(500).json({ success : false , message : error.message});
    }

}

// login a user

export const login = async(req,res)=>{
    try {
     const { email , password} = req.body;

        if(!email || !password ){
        return res.status(400).json({ success : false , message : " email or  password is requie"})
        }

        const user = await User.findOne({email});
        if(!user){
            return res.status(401).json({ success : false , message : " register yourself first"});
        }
        // password comapre
        const isPassCorrect = await bcrypt.compare(password , user.password);
        if(!isPassCorrect ){
            return res.status(400).json({ success : false , message : "incorrect password"})
        }
        // generate token
        const token = generateToken(user._id);

        res.json({ success : true , data : user ,token , message :" account login successfully"})
        
    } catch (error) {
         return res.status(500).json({ success : false , message : error.message});
    }
    
}

//controllerrrr to check if user is authenticate 
export const checkAuth = (req,res)=>{
    res.json({ success : true , user : req.user});
}
//update profile and include profile pic alse
// we will get user detail by req.user bca we are making it protectRoute

export const updateProfile =async (req,res)=>{
    try {
        const { pic , bio ,fullName} = req.body;

        const userId = req.user._id;
        let updateUser;
     // there are 2 casse that user upload his pic or not
        if(!pic) {
            updateUser = await User.findByIdAndUpdate( userId , { bio , fullName} ,{ new :true});
        }else{
            // first get the cloudinay url
            const upload = await cloudinary.uploader.upload(pic);
            updateUser = await User.findByIdAndUpdate( userId , { pic : upload.secure_url , bio , fullName} ,{ new :true});
        }
         res.json({ success : true ,data : updateUser });

        
    } catch (error) {
        return res.status(500).json({ success : false , message : error.message});
    }
    

    
}