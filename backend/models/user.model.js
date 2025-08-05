import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email : {
         type : String,
         required : [ true , "email is requied"],
         unique : true
    },
    fullName: {
         type : String,
         required : [ true , "password is requied"],
    },
    password : {
         type : String,
         required : [ true , "password is requied"],
         minlength : 6
    },
    pic : {
         type : String,
         default : ""
    },
    bio : {
         type : String,
         
    },

} , { timestamps : true});

const User = mongoose.model("User" , userSchema);

export default User;