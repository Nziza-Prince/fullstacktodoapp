import {useState,useEffect } from "react";
import { ThemeContext } from "./ThemeContext";

export const ThemeProvider = ({children})=>{
    const [isDark,setIsDark] = useState(
        JSON.parse(localStorage.getItem("isDark")) || false
    )
    const toggleTheme = ()=>{
        setIsDark(!isDark)
    }
    useEffect(()=>{
        localStorage.setItem("isDark",isDark)
    },[isDark])

    return (
        <ThemeContext.Provider value={{isDark, toggleTheme}}>
            {children}
        </ThemeContext.Provider>
    )
}