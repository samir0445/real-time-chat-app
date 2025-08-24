import { createContext, useContext, useEffect, useState } from "react"
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";
import axios from "axios";


export const ChatContext = createContext();

export const ChatProvider = ({children})=>{
    const [messages ,setMessages] = useState([]);
    const [users ,setUsers] = useState([]);
    const [selectedUser ,setSelectedUser] = useState(null);
    const [unseenMessages ,setUnseenMessages] = useState({});

    const {socket ,axios} =useContext(AuthContext);

    // funn to get all user for side bar
    const getUsers = async()=>{

        try {
            const { data } = await axios.get("/api/messages/users");
            if(data.success){
                setUsers(data.users)
                setUnseenMessages(data.unseenMessages)
            }
            
        } catch (error) {
            toast.error(error.message);
            
        }
    }

    // funn to get messages for selected user
    const getMessages = async() => {
        try {
            const { data } = await axios.get(`/api/messages/${userId}`);
            if(data.success){
                setMessage(data.messages)
            }
            
        } catch (error) {
            toast.error(error.message);
        }
    }

    // func to send message to selected user
    const sendMessage = async(messageData)=>{
        try {
            const {data} = await axios.post(`/api/message/send/${selectedUser._id}`,messageData);
            if(data.success){
                setMessages((prevMessages)=>[...prevMessages,data.newMassage])
            }else{
                toast.error(data.message);
            }
            
        } catch (error) {
            toast.error(error.message);
        }

    }

    // func to subscribe to messages for selected user
    const subscribeToMessages = async ()=>{
        if(!socket) return;

        socket.on("newMessage", (newMassage)=>{
            if(selectedUser && newMassage.senderId === selectedUser._id){
                newMassage.seen = true;
                setMessages((prevMessages)=>[...prevMessages , newMassage]);
                axios.put(`/api/messages/mark/${newMassage._id}`);
            }else{
                setUnseenMessages((prevUnseenMessages)=>({
                    ...prevUnseenMessages, [newMassage.senderId] : prevUnseenMessages[newMassage.senderId]? prevUnseenMessages[newMassage.senderId]+1:1
                }))
            }
        })
    }

      // func to unsubscribe to messages for selected user
    const unsubscribeFromMessages = ()=>{
        if(socket) socket.off("newMessage");
    }

    useEffect(()=>{
        subscribeToMessages();
        return ()=> unsubscribeFromMessages();
    },[socket,selectedUser])


    const value = {
        messages , users ,selectedUser ,getUsers ,getMessages ,sendMessage ,
        setSelectedUser , unseenMessages,setUnseenMessages

    }

    return(
        <ChatContext.Provider value={value}>
            { children }
        </ChatContext.Provider>
    )

}