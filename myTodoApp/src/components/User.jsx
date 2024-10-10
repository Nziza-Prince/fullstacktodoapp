import React, { useContext, useEffect, useState } from 'react';
import { FaUser} from "react-icons/fa";
import { jwtDecode } from "jwt-decode";
import axios from 'axios';
import { ThemeContext } from '../store/ThemeContext';

const User = () => {
  const token = localStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const userId = decodedToken.userId;
  const backendUrl = `${import.meta.env.VITE_UBASE_URL}/${userId}`;
  const [user, setUser] = useState(null); // Initialize user state to null
  const [loading, setLoading] = useState(true); // Add a loading state
  const {isDark} = useContext(ThemeContext)
  const fetchUser  = async () => {
    try {
      const response = await axios.get(backendUrl, {
        headers: {
          Authorization: `Bearer ${token}`, // Include JWT in headers
        },
      });
      setUser(response.data);
      console.log(response.data);
      setLoading(false); // Set loading to false when data is received
    } catch (err) {
      console.log("Couldn't get the user", err);
      setLoading(false); // Set loading to false on error
    }
  };

  useEffect(() => {
    fetchUser ();
  }, []);

  return (
    <div>
      <div className='dark:text-white'>
        <h1 className="mb-10 text-5xl font-bold text-center">
          {loading ? "Loading..." : `${user}!!`}
        </h1>
      </div>
    </div>
  );
};

export default User;