import express from "express";
import cors from "cors";
import http from "http";
import "dotenv/config"
import { log } from "console";

const app = express();
// creating basic node server for socket io bcz we need in futher process
const server = http.createServer(app);

// middle wares
app.use(express.json({limit :"4mb"}));
app.use(cors());

app.get("/" , (req,res)=>{
    res.send(" hello baby")
})
app.listen( process.env.PORT , ()=>{
    console.log(" server start baby");
    
})
