import React, { useContext, useState } from 'react'
import Sidebar from '../components/Sidebar'
import RightSidebar from '../components/RightSidebar'
import ChatContainer from '../components/chatContainer'
import { ChatContext } from '../../context/ChatContext'

const HomePage = () => {
  //create state variable
// control how many component of homepage will displayed

   const { selectedUser } =useContext(ChatContext);
   
  return (
    <div className='border w-full h-screen sm:px-[15%] sm:py-[5%]'>
      <div className={`backdrop-blur-xl border-2 border-gray-600 rounded-2x1 overflow-hidden h-[100%] grid grid-clos-1 relative ${selectedUser ?'md:grid-cols-[1fr_1.5fr_1fr] x1:grid-cols-[1fr_2fr_1fr]':'md:grid-cols-2' }`}>
        <Sidebar />
        <ChatContainer />
        <RightSidebar  />
      </div>
     
    </div>
  )
}

export default HomePage
