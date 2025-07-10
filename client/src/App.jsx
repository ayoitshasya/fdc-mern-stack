import React, { useState } from 'react'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Home from './pages/Home'
import Application1 from './pages/Application/Application1'

function App() {
  async function handleLogin(e){
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:4000/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({e_id: employeeId, password}),
        credentials: 'include',
      });
      console.log({employeeId, password})

      const data = await res.json();
      console.log(data);
    } catch (error) {
      console.log(error)
    }
    
  }


  async function getProfile(e){
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:4000/auth/profile", {
        method: "GET",
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'   // <== this is critical
      });

      const data = await res.json();
      console.log(data);
    } catch (error) {
      console.log(error)
    }
  }
  
  const[employeeId, setEmployeeId] = useState("");
  const[password, setPassword] = useState("");
  
  return (
    <>
    <div className='h-screen flex flex-col'>
      <div  className='h-6 bg-[#B7202E] w-full z-10 top-0'></div>
      <div className='bg-[url(/campus.jpg)] bg-cover w-screen flex-1'>


        <Application1/>

          {/* <form action="" className='bg-white flex flex-col w-1/2 p-4'>
            <input type="text" className='border p-2' placeholder='Employee id' value={employeeId} onChange={(e)=>{setEmployeeId(e.target.value);}}/>
            <input type="password" className='border p-2' placeholder='Password' value={password} onChange={(e)=>{setPassword(e.target.value);}}/>
            <button className='border p-2' onClick={handleLogin}>Login</button>
          </form>

          <button className='border p-2' onClick={getProfile}>Profile</button> */}
      

          
      </div>
    </div>
      
    </>
  )
}

export default App
