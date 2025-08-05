import express from "express";
import cors from "cors";
import http from "http";
import "dotenv/config"

import connectDB from "./config/db.js";
import userRoute from "./routes/user.route.js";

const app = express();
// creating basic node server for socket io bcz we need in futher process
const server = http.createServer(app);


// mongo connection
await connectDB();


// middle wares
app.use(express.json({limit :"4mb"}));
app.use(cors());

// routesss
app.use("/api/auth" ,userRoute);


server.listen( process.env.PORT , ()=>{
    console.log(" server start baby");
    
    
})
