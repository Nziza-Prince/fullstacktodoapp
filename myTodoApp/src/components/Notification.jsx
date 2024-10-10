import React, { useContext } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThemeContext } from "../store/ThemeContext";
const Notification = () => {
  const {isDark} = useContext(ThemeContext)
  return (
    <div>
      <ToastContainer 
      position="top-right"
      theme={isDark?'dark':'light'}
      />
    </div>
  );
};

export default Notification;
