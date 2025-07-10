import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import Application1 from './pages/Application/Application1';
import Reimb1 from './pages/Reimbursement/Reimb1';
import Reimb2 from './pages/Reimbursement/Reimb2';
import Reimb3 from './pages/Reimbursement/Reimb3';
import Reimb4 from './pages/Reimbursement/Reimb4';

function App() {
  return (
    <>
      <div className='h-screen flex flex-col'>
        <div className='h-6 bg-[#B7202E] w-full z-10 top-0'></div>
        <div className='bg-[url(/campus.jpg)] bg-cover w-screen flex-1'>
          <Routes>
            <Route path="/" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/home" element={<Home />} />
            <Route path="/application" element={<Application1 />} />
            
            {/* Corrected reimbursement routes */}
            <Route path="/reimbursement">
              <Route index element={<Navigate to="1" replace />} />
              <Route path="1" element={<Reimb1 />} />
              <Route path="2" element={<Reimb2 />} />
              <Route path="3" element={<Reimb3 />} />
              <Route path="4" element={<Reimb4 />} />
            </Route>
          </Routes>
        </div>
      </div>
    </>
  );
}

export default App;