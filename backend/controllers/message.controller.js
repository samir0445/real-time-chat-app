import Message from "../models/message.models.js";
import User from "../models/user.model.js";


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