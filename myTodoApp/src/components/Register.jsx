import React, { useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import {toast} from 'react-toastify'
import './login.css'
const Register = () => {
    const [userName,setUserName]=useState("")
    const [email,setEmail]=useState("")
    const [password,setPassword]=useState("")
    const [registerLoading,setRegisterLoading] = useState(false)
     const navigate = useNavigate()
     const backendUrl = import.meta.env.VITE_REGISTER_URL
    const handleSubmit = async(e)=>{
        setRegisterLoading(true)
        e.preventDefault()
        axios.post(backendUrl,{userName,email,password})
        .then(result=>{
            navigate("/",{replace:true})
            console.log(result)
             toast.success("Account created successfully")
             setRegisterLoading(false)
        })
        .catch(err=>{
           console.error(err)
            toast.error({message:err.message})
            setRegisterLoading(false)
        }
        )
    }
  return (
    <div className='flex justify-center align-middle p-20'>
     <form action="" onSubmit={handleSubmit} className='border-2 inline-block justify-center align-middle p-10 bg-white'>
        <h1 className=' font-extrabold text-center text-5xl mb-10'>Sign Up</h1>
        <div className='flex flex-col mb-5'>
            <label htmlFor="name" className='font-bold ml-1 mb-2 text-lg text-left'>Name</label>
            <input className='border-2 w-[300px] border-gray-300 h-10 rounded-md focus:outline-none indent-2 text-gray-600 text-md font-bold' type="text" name='name'
            value={userName}
            onChange={(e)=>setUserName(e.target.value)}
            required/>
        </div>
        <div className='flex flex-col mb-5'>
            <label htmlFor="email" className='font-bold ml-1 mb-2 text-lg text-left'>Email</label>
            <input className='border-2 w-[300px] border-gray-300 h-10 rounded-md focus:outline-none indent-2 text-gray-600 text-md font-bold' type="emai;" name='email' 
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
        <button type="submit" className='bg-green-500 px-5 py-2 rounded-md text-white text-center font-bold text-lg hover:bg-green-400 w-[100%] mt-5'>{registerLoading ? <div className='spinner'></div> : "Signup"}</button>
        <Link className='text-lg float-right mt-5 text-blue-600 underline' to="/">Signin</Link>
     </form>
    </div>
  )
}

export default Register
