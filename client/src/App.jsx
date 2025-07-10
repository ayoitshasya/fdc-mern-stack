import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Home from './pages/Home'
import Application1 from './pages/Application/Application1'
import Application2 from './pages/Application/Application2'
import Application3 from './pages/Application/Application3'
import ApplicationStatus from './pages/Application/ApplicationStatus'

function App() {


  return (
    <>
    <div className='h-screen flex flex-col'>
      <div  className='h-6 bg-[#B7202E] w-full z-10 top-0'></div>
      <div className='bg-[url(/campus.jpg)] bg-cover w-screen flex-1'>
        { <Routes>
          <Route path="/" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/application/1" element={<Application1 />} />
          <Route path="/application/2" element={<Application2 />} />
          <Route path="/application/3" element={<Application3 />} />
          <Route path="/application/Status" element={<ApplicationStatus />} />
        </Routes> }
      </div>
    </div>
      
    </>
  )
}

export default App
