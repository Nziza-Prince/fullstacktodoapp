import React from 'react'

const ToggleTheme = () => {
    
  return (
    <div>
      {isDark ? <FiSun className="mt-5 ml-10 cursor-pointer text-2xl" onClick={()=>setDark(false)}/> : <FiMoon className="mt-3 ml-10 cursor-pointer text-2xl" onClick={()=>setDark(true)}/>}
    </div>
  )
}

export default ToggleTheme
