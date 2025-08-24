import React, { useContext } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import ProfilePage from './pages/ProfilePage'
import { Toaster } from 'react-hot-toast'
import { AuthContext } from '../context/AuthContext'

const App = () => {
  //only auth user should access homrpage for that we use authuser which has checkuser fuction
  const {authUser} =useContext(AuthContext);
  return (
    <div className="bg-[url('./src/assets/bgImage.svg')] bg-contain">
      <Toaster/>
      <Routes>
        <Route path='/' element={ authUser ? <HomePage/> : <Navigate to="/login" />} />
        <Route path='/login' element={ !authUser ? <LoginPage/> : <Navigate to="/" />} />
        // for login ! auth user it will navigate to login page
        <Route path='/profile' element={authUser ? <ProfilePage/> : <Navigate to="/login" />} />
      </Routes>
      
    </div>
  )
}

export default App
