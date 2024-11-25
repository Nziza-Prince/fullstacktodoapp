import {useState } from 'react'
import Register from './components/Register.jsx'
import Login from './components/Login.jsx'
import Home from './components/Home.jsx'
import { Routes,Route,BrowserRouter } from 'react-router-dom'
import Logout from './components/Logout.jsx'
import Notification from './components/Notification.jsx'
import PrivateRoute from './components/PrivateRoute.jsx'

function App() {
  return (
    <>
   <BrowserRouter>
     <Routes>
      <Route path="/" element={<Login/>}/>
      <Route path="/register" element={<Register/>}/>
      <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
      <Route path="/logout" element={<Logout/>}/>
      
    </Routes>
    <Notification/>
   </BrowserRouter>
    </>
  )
}

export default App
