import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Home from './pages/Home'
import ApplicationStatus from './pages/Application/ApplicationStatus'
import Application1 from './pages/Application/Application1'
import Application2 from './pages/Application/Application2'
import Application3 from './pages/Application/Application3'
import ApplicationHOD from './pages/Application/ApplicationHOD'
import ApplicationPrincipal from './pages/Application/ApplicationPrincipal'
import { useState } from 'react'

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
      <div  className='h-6 bg-[#B7202E] w-full'></div>
      <div className='bg-[url(/campus.jpg)] bg-cover w-full flex-1'>
        { <Routes>
            <Route path="/" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/home" element={<Home />} />
            <Route path="/application/1" element={<Application1 />} />
            <Route path="/application/2" element={<Application2 />} />
            <Route path="/application/3" element={<Application3 />} />
            <Route path="/application/Status" element={<ApplicationStatus />} />
            <Route path="/application/HOD" element={<ApplicationHOD />} />
            <Route path="/application/Principal" element={<ApplicationPrincipal />} />
        </Routes> }
      </div>
    </div>
      
    </>
  )
}

export default App
