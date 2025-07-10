import React from 'react'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Home from './pages/Home'
import Application1 from './pages/Application/Application1'
import { Routes, Route } from 'react-router-dom'
// Add these imports:
import Reimb1 from './Reimb1';  
import Reimb2 from './Reimb2';  
import Reimb3 from './Reimb3';  
import Reimb4 from './Reimb4';  


function App() {


  return (
    <>
    <div className='h-screen flex flex-col'>
      <div  className='h-6 bg-[#B7202E] w-full z-10 top-0'></div>
      <div className='bg-[url(/campus.jpg)] bg-cover w-screen flex-1'>
        <Routes>
          <Route path="/" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/application" element={<Application1 />} />
          {/* Added reimbursement routes */}
          <Route index element={<Reimb1 />} />  {/* Default to Reimb1 */}
          <Route path="1" element={<Reimb1 />} />
          <Route path="2" element={<Reimb2 />} />
          <Route path="3" element={<Reimb3 />} />
          <Route path="4" element={<Reimb4 />} />
        </Routes>
      </div>
    </div>
      
    </>
  )
}

export default App
