import React from 'react'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Home from './pages/Home'
import Application1 from './pages/Application/Application1'
import Application2 from './pages/Application/Application2'
import Application3 from './pages/Application/Application3'
import { Routes, Route } from 'react-router-dom'

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
          <Route path="/application" element={<Application1 />} />
          <Route path="/application" element={<Application2 />} />
          <Route path="/application" element={<Application3 />} />
        </Routes> }
      </div>
    </div>
      
    </>
  )
}

export default App
