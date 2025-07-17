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
import ApplicationFDC from './pages/Application/ApplicationFDC'
import ApplicationPDF from './pages/Application/ApplicationPDF'
import Reimbursement1 from './pages/Reimbursement/Reimbursement1'
import Reimbursement2 from './pages/Reimbursement/Reimbursement2'
import Reimbursement3 from './pages/Reimbursement/Reimbursement3'
import Reimbursement4 from './pages/Reimbursement/Reimbursement4'
import ReimbursementHOD from './pages/Reimbursement/ReimbursementHOD'
import ReimbursementFDC from './pages/Reimbursement/ReimbursementFDC'

function App() {
  

  
  
  return (
    <>
    <div className='h-screen flex flex-col'>
      <div  className='h-6 bg-[#B7202E] w-full text-[#B7202E]'>.</div>
      <div className='bg-[url(/campus.jpg)] bg-cover w-full flex-1'>
             { <Routes>
          <Route path="/" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/fdc-application/step-1" element={<Application1 />} />
          <Route path="/fdc-application/step-2" element={<Application2 />} />
          <Route path="/fdc-application/step-3" element={<Application3 />} />
          <Route path="/fdc-application/step-4" element={<ApplicationPDF />} />
          <Route path="/application/Status" element={<ApplicationStatus />} />
          <Route path="/application/HOD" element={<ApplicationHOD />} />
          <Route path="/application/FDC" element={<ApplicationFDC />} />
          <Route path="/fdc-reimbursement/step-1" element={<Reimbursement1 />} />
          <Route path="/fdc-reimbursement/step-2" element={<Reimbursement2 />} />
          <Route path="/fdc-reimbursement/step-3" element={<Reimbursement3 />} />
          <Route path="/fdc-reimbursement/step-4" element={<Reimbursement4 />} />
          <Route path="/fdc-reimbursement/HOD" element={<ReimbursementHOD />} />
          <Route path="/fdc-reimbursement/FDC" element={<ReimbursementFDC />} />
        </Routes> }

      </div>
    </div>
      
    </>
  )
}

export default App
