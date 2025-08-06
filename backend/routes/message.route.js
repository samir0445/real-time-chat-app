import express from "express";
import { protectRoute } from "../middleware/auth.midleware.js";
import { getMessage, getUsersForSidebar, markMessageAsSeen, sendMessage } from "../controllers/message.controller.js";

const messageRouter = express.Router();

messageRouter.get("/user" , protectRoute , getUsersForSidebar);

messageRouter.get("/:id" , protectRoute , getMessage);

messageRouter.put("mark/:id" , protectRoute , markMessageAsSeen );

messageRouter.post("/send/:id" ,protectRoute , sendMessage);


export default messageRouter;