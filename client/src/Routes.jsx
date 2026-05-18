import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Home from './pages/Home'
import Profile from './pages/Profile'
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
import ReimbursementPDF from './pages/Reimbursement/ReimbursementPDF'
import ReimbursementFDC from './pages/Reimbursement/ReimbursementFDC'
import ReimbursementStatus from './pages/Reimbursement/ReimbursementStatus'
import ReimbursementStatusHOD from './pages/Reimbursement/ReimbursementStatusHOD'
import ReimbursementPDF_HOD from './pages/Reimbursement/ReimbursementPDF_HOD'
import ReimbursementHOD from './pages/Reimbursement/ReimbursementHOD'
import ApplicationStatusHOD from './pages/Application/ApplicationStatusHOD'
import ApplicationPDF_HOD from './pages/Application/ApplicationPDF_HOD'
import ApplicationStatusFDC from './pages/Application/ApplicationStatusFDC'
import { useUser } from './context/UserContext'
import ApplicationPDF_FDC from './pages/Application/ApplicationPDF_FDC'
import ReimbursementStatusFDC from './pages/Reimbursement/ReimbursementStatusFDC'
import ReimbursementPDF_FDC from './pages/Reimbursement/ReimbursementPDF_FDC'

function AppRoutes(){
    const {loggedIn, user} = useUser();
    return(

            <Routes>
                {!loggedIn ? (
                    <>
                        <Route path='/' element={<Login />} />
                        <Route path="/signup" element={<Signup />} />
                        <Route path='*' element={<Navigate to='/' />} />
                    </> 
                    ) : (
                    <>
                        <Route path='/' element={<Home />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/fdc-application/step-1" element={<Application1 />} />
                        <Route path="/fdc-application/step-2" element={<Application2 />} />
                        <Route path="/fdc-application/step-3" element={<Application3 />} />
                        <Route path="/fdc-application/step-4" element={<ApplicationPDF />} />

                        {user.user_type === "employee" && (
                        <>
                            <Route path="/application/Status" element={<ApplicationStatus />} />
                            <Route path="/reimbursement/Status" element={<ReimbursementStatus />} />
                        </>
                        )}

                        {user.user_type === "hod" && (
                        <>
                            <Route path="/application/Status" element={<ApplicationStatusHOD />} />
                            <Route path="/application/review/:id" element={<ApplicationHOD />} />
                            <Route path="/application/:id" element={<ApplicationPDF_HOD />} />
                            <Route path="/reimbursement/Status" element={<ReimbursementStatusHOD />} />
                            <Route path="/reimbursement/:id" element={<ReimbursementPDF_HOD />} />
                            <Route path="/reimbursement/review/:id" element={<ReimbursementHOD />} />
                        </>
                        )}

                        {(user.user_type === "fdc-convenor" || user.user_type === "fdc") && (
                        <>
                            <Route path="/application/Status" element={<ApplicationStatusFDC />} />
                            <Route path="/application/review/:id" element={<ApplicationFDC />} />
                            <Route path="/application/:id" element={<ApplicationPDF_FDC />} />
                            <Route path="/reimbursement/Status" element={<ReimbursementStatusFDC />} />
                            <Route path="/reimbursement/:id" element={<ReimbursementPDF_FDC />} />
                            <Route path="/reimbursement/review/:id" element={<ReimbursementFDC />} />
                        </>
                        )}
                        
                        
                        
                        <Route path="/fdc-reimbursement/step-1" element={<Reimbursement1 />} />
                        <Route path="/fdc-reimbursement/step-2" element={<Reimbursement2 />} />
                        <Route path="/fdc-reimbursement/step-3" element={<Reimbursement3 />} />
                        <Route path="/fdc-reimbursement/step-4" element={<Reimbursement4 />} />
                        <Route path="/fdc-reimbursement/step-5" element={<ReimbursementPDF />} />
                        
                        
                        <Route path='*' element={<Navigate to='/' />} />
                    </>
                )}
    
            </Routes> 

    )
}


export default AppRoutes