import cloudinary from "../config/cloudinary.js";
import Message from "../models/message.models.js";
import User from "../models/user.model.js";
import { io, userSocketMap } from "../server.js";


// get all user except the logged in user
// middleware is appllied
export const getUsersForSidebar = async (req ,res)=>{

    try {
         const userId = req.user._id;
         const filteredUsers = await User.find({ _id : {$ne : userId}}).select("-password");
         
         // get the all unseen message from all the user that is receive by login user

         const unseenMessages = {} // key value pair set which has iser sid and number od unread message
         const promises =filteredUsers.map(async (user)=>{
            const message = await Message.find({ senderId : user._id , receiverId : userId , seen : false});
            if(message.length >0) {
                // set key value pair
                unseenMessages[user._id] = message.length;
            }

         })
         // process promise
         await Promise.all(promises);
         res.status(200).json({ success : true , users : filteredUsers , unseenMessages });

        
    } catch (error) {
        return res.status(500).json({ success : false , message : error.message});
    }
    
}

// get all message for selected user

// many stuff to do is get message which take placed between both user
// and make seen property true for every massage in between both of them
export const getMessage = async (req,res)=>{
    try {
        const { id : selectedUserId} = req.params ;
        const myId = req.user._id;
        // select messsage
        const messages = await Message.find({
            $or: [
                {senderId : myId , receiverId : selectedUserId},
                {senderId : selectedUserId , receiverId : myId},
                // it gives all messages that pass any of this param

            ]
        })
        // make all message seen
        await Message.updateMany({ senderId : selectedUserId , receiverId : myId}, { seen : true});

        res.status(200).json({ success : true , messages })

        
    } catch (error) {
        return res.status(500).json({ success : false , message : error.message});
    }
}

// apis to marks messaages as seen using messages id

export const markMessageAsSeen = async(req,res)=>{
    try {
        const { id} = req.params;
        await Message.findByIdAndUpdate(id ,{ seen : true})
        res.json({ success : true})
        
    } catch (error) {
        console.log(" from marks Mesage seen");
        
        return res.status(500).json({ success : false , message : error.message});
        
    }
}

// api for sending messge for selected user

export const sendMessage = async(req , res)=>{
    try {
        const receiverId = req.params.id;
        const senderId = req.user._id;
        // destructure texts and images
        const { text , image} = req.body;

        // if user sends images then we have to upload images into cloudinary

        let imageUrl;
        if(image) {
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }
        
        const newMessage = await Message.create({
            senderId,
            receiverId,
            text,
            image : imageUrl
        })

        // emit the new message to the receivers socket

        const receiverSocketId = userSocketMap[receiverId];
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage" , newMessage)
        }

        res.json({ success : true , newMessage});
        // at this point we have just created and send the message but not reflect at receiver
        // to make it real time we use socket.io


    } catch (error) {
        console.log(" while sending message");
        
        return res.status(500).json({ success : false , message : error.message});
        
    }
}