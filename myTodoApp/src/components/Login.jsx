import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import './login.css';
import { FaRegEye } from "react-icons/fa6";
import { FaRegEyeSlash } from "react-icons/fa6";

const Login = () => {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const backendUrl = import.meta.env.VITE_LOGIN_URL;
    const navigate = useNavigate();
    const [showPassword,setShowPassword] = useState(false)
    useEffect(() => {
        // Redirect to /home if the token exists
        const token = localStorage.getItem("token");
        if (token) {
            navigate('/home', { replace: true });
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post(backendUrl, { email, password });
            const token = response.data.token;
            if (token) {
                localStorage.setItem("token", token);
                navigate("/home", { replace: true });
            } else {
                toast.error("Invalid credentials");
            }
        } catch (err) {
            console.error("Login failed", err);
            toast.error("Invalid credentials");
        } finally {
            setLoading(false);
        }
    };
    

    return (
        <div className='flex justify-center align-middle p-20'>
            <form action="" onSubmit={handleSubmit} className='border-2 inline-block justify-center align-middle p-10 bg-white'>
                <h1 className='font-extrabold text-center text-5xl mb-10'>Login</h1>
                <div className='flex flex-col mb-5'>
                    <label htmlFor="email" className='font-bold ml-1 mb-2 text-lg text-left'>Email</label>
                    <input
                        className='border-2 w-[300px] border-gray-300 h-10 rounded-md focus:outline-none indent-2 text-gray-600 text-md font-bold'
                        type="email"
                        name='email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className='flex flex-col mb-5'>
        <label htmlFor="password" className='font-bold ml-1 mb-2 text-lg text-left'>Password</label>
        <div className="relative">
            <input
                className='border-2 w-[300px] border-gray-300 h-10 rounded-md focus:outline-none indent-2 text-gray-600 text-md font-bold'
                type={showPassword ? "text" : "password"}
                name='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
                {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
            </button>
        </div>
    </div>
                <button
                    type="submit"
                    disabled={loading}
                    className='bg-green-500 px-5 py-2 rounded-md text-white font-bold text-center text-lg hover:bg-green-400 mt-5 w-[100%]'
                >
                    {loading ? <div className='spinner'></div> : "Sign In"}
                </button>
                <Link className='text-sm float-right mt-5 text-blue-600 underline' to="/register">Register now</Link>
            </form>
        </div>
    );
};

export default Login;
