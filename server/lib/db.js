import mongoose from "mongoose";

//Function to connect to the mongodb database
export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "chat-app",
    });

    mongoose.connection.once("connected", () => {
      console.log("✅ MongoDB connected successfully");
    });
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  }
};
