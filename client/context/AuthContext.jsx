import { createContext, useEffect, useState } from "react"
import axios from "axios"
import {toast} from 'react-hot-toast'

import { io } from "socket.io-client"


const backendUrl = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = backendUrl;



export const AuthContext =   createContext();

export const AuthProvider = ( {childern})=>{
 // common states

    const [token , setToken] = useState(localStorage.getItem("token"));
    const [authUser , setAuthUser] = useState(null);
    const [onlineUsers , setOnlineUsers] = useState([]);
    const [socket , setSocket] = useState(null);
    // check if user is authenticated is so set the use rdata and connect the socket
     const checkAuth = async ()=>{
        // it should run whenever user comes to app useEffect

        try {
            const { data } =await axios.get("/api/auth/check");
            if(data.success){
                setAuthUser(data.user);
                connectsocket(data.user);
            }
        } catch (error) {
            // use toast notification
            toast.error(error.message)
        }
     }

     // login function threw which user can logged in and socket connetion

     const login = async(state , credentials)=>{
        try {
            const  { data } = axios.post(`/api/auth/${state}`);
            if(data.success){
                setAuthUser(data.userData);
                connectsocket(data.userData);
                axios.defaults.headers.common["token"] = data.token;
                setToken(data.token);
                localStorage.setItem("token" , data.token);
                toast.success(data.message)

            }else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message);
        }

     }
     //logout function to handle user logout and socket disconnection
     const logout = async()=>{
        localStorage.removeItem("token");
        setAuthUser(null);
        setToken(null);
        setOnlineUsers([]);
        axios.defaults.headers.common["token"] =null;
        toast.success("logout Successfully");
        socket.disconnect();
     }

     // update profile function to handle user profile update
     const updateProfile = async(body)=>{
        try {
            const { data } = await axios.put("/api/auth/update-profile" ,body);
            if(data.success){
                setAuthUser(data.user);
                toast.success("profile update successfully");

            }
            
        } catch (error) {
            toast.error(error.message);
        }
     }

     //connect socket to handle socket connection and online user update
     const connectsocket = (userData)=>{
        if(!userData || socket?.connected) return;
        const newSocket = io(backendUrl ,{
            query :{
                userId :userData._id,
            }
        });
        newSocket.connect();
        setSocket(newSocket);
        newSocket.on("getOnlineUser", (userIds)=>{
            setOnlineUsers(userIds)
        })
     }

     useEffect(()=>{
        if(token){
            // it make token avialble for all axios stuff
            axios.defaults.headers.common["token"] = token;
        }
         checkAuth();
     },[])


    const value = {
        axios,
        authUser,
        onlineUsers,
        socket,
        login,
        logout,
        updateProfile,


    }
     return(
        <AuthContext.Provider value={value}>
            {childern}
        </AuthContext.Provider>
     )

}