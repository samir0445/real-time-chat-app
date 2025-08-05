import mongoose from "mongoose";
import "dotenv/config";
const connectDB = async ()=>{
    try {
        mongoose.connection.on("connected" , ()=>{
            console.log(" database connected");
            
        });
        
        await mongoose.connect(`${process.env.MONGODB_URL}`);
    } catch (error) {
        console.log(" mongo coonection error  --- " + error);
        
    }

    
}

export default connectDB;