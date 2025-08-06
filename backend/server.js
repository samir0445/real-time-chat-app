import express from "express";
import cors from "cors";
import http from "http";
import "dotenv/config"

import connectDB from "./config/db.js";
import userRoute from "./routes/user.route.js";
import messageRouter from "./routes/message.route.js";
import Server from "socket.io";

const app = express();
// creating basic node server for socket io bcz we need in futher process
const server = http.createServer(app);

// initialized socket.io server
export const io = new Server(server , {
    cors : {origin :"*"}
})

// store all online users
export const userSocketMap ={}; // {userid : socket.io} form of this obj

// socket io connection handler

io.on("connection" ,(socket)=>{
    const userId = socket.handshake.query.userId;
    console.log(" user conneted ", userId);

    if(userId) {
        userSocketMap[userId] = socket.id;
    }
    //emit online users to all connected clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnected" , ()=>{
        console.log(" user disconnected " ,userId);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers" ,Object.keys(userSocketMap))
        
    })
    
})


// mongo connection
await connectDB();


// middle wares
app.use(express.json({limit :"4mb"}));
app.use(cors());

// routesss
app.use("/api/auth" ,userRoute);

app.use("/api/messages" ,messageRouter);




server.listen( process.env.PORT , ()=>{
    console.log(" server start baby");
    
    
})
