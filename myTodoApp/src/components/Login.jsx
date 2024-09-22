import React, { useState } from 'react'
import { Link, redirect, useNavigate } from 'react-router-dom'
import axios from 'axios'
import {toast} from 'react-toastify'
import './login.css'
const Login = () => {
const [loading,setLoading] = useState(false);
    const [email,setEmail]=useState("")
    const [password,setPassword]=useState("")
     const navigate = useNavigate()
     const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true); // Start loading spinner
     try {
          const response = await axios.post("http://localhost:3000/login", { email, password });
          const token = response.data.token;
          if (token) {
              localStorage.setItem("token", token); // Store token in localStorage
              navigate("/home", { replace: true });
          } else {
              console.error("Token is undefined");
              toast.error("Invalid credentials")
          }
      } catch (err) {
          console.error("Login failed", err);
          toast.error("Invalid credentials")

      } finally {
          setLoading(false); // Stop loading spinner
      }
  };
  
  return (
    <div className='flex justify-center align-middle p-20'>
        <form action="" onSubmit={handleSubmit} className='border-2 inline-block justify-center align-middle p-10 bg-white'>
        <h1 className=' font-extrabold text-center text-5xl mb-10'>Login</h1>
      <div className='flex flex-col mb-5'>
            <label htmlFor="email" className='font-bold ml-1 mb-2 text-lg text-left'>Email</label>
            <input className='border-2 w-[300px] border-gray-300 h-10 rounded-md focus:outline-none indent-2 text-gray-600 text-md font-bold' type="email" name='email' 
             value={email}
             onChange={(e)=>setEmail(e.target.value)}
            required/>
        </div>
        <div className='flex flex-col mb-5'>
            <label htmlFor="password" className='font-bold ml-1 mb-2 text-lg text-left'>Password</label>
            <input className='border-2 w-[300px] border-gray-300 h-10 rounded-md focus:outline-none indent-2 text-gray-600 text-md font-bold' type="password" name='password' 
             value={password}
             onChange={(e)=>setPassword(e.target.value)}
            required/>
        </div>
        <button type="submit" disabled={loading} className='bg-green-500 px-5 py-2 rounded-md text-white font-bold text-center text-lg hover:bg-green-400 mt-5 w-[100%]'>{loading ? <div className='spinner'></div> : "Signin"}</button>
        <Link className='text-sm float-right mt-5 text-blue-600 underline' to="/register">Register now</Link>
     </form>
    </div>
  )
}

export default Login
