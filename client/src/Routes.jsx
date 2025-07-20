import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Home from './pages/Home'
import ApplicationStatus from './pages/Application/ApplicationStatus'
import Application1 from './pages/Application/Application1'
import Application2 from './pages/Application/Application2'
import Application3 from './pages/Application/Application3'
import ApplicationHOD from './pages/Application/ApplicationHOD'
import ApplicationFDCConvenor from './pages/Application/ApplicationFDCConvenor'
import ApplicationPrincipal from './pages/Application/ApplicationPrincipal'
import ApplicationPDF from './pages/Application/ApplicationPDF'
import Reimbursement1 from './pages/Reimbursement/Reimbursement1'
import Reimbursement2 from './pages/Reimbursement/Reimbursement2'
import Reimbursement3 from './pages/Reimbursement/Reimbursement3'
import Reimbursement4 from './pages/Reimbursement/Reimbursement4'
import ReimbursementPrincipal from './pages/Reimbursement/ReimbursementPrincipal'
import ReimbursementStatus from './pages/Reimbursement/ReimbursementStatus'

import { useUser } from './context/UserContext'

function AppRoutes(){
    const {loggedIn} = useUser();
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
                        <Route path="/fdc-application/step-1" element={<Application1 />} />
                        <Route path="/fdc-application/step-2" element={<Application2 />} />
                        <Route path="/fdc-application/step-3" element={<Application3 />} />
                        <Route path="/fdc-application/step-4" element={<ApplicationPDF />} />
                        <Route path="/application/Status" element={<ApplicationStatus />} />
                        <Route path="/application/HOD" element={<ApplicationHOD />} />
                        <Route path="/application/FDCConvenor" element={<ApplicationFDCConvenor />} />
                        <Route path="/application/Principal" element={<ApplicationPrincipal />} />
                        <Route path="/fdc-reimbursement/step-1" element={<Reimbursement1 />} />
                        <Route path="/fdc-reimbursement/step-2" element={<Reimbursement2 />} />
                        <Route path="/fdc-reimbursement/step-3" element={<Reimbursement3 />} />
                        <Route path="/fdc-reimbursement/step-4" element={<Reimbursement4 />} />
                        <Route path="/reimbursement/Principal" element={<ReimbursementPrincipal />} />
                        <Route path="/reimbursement/Status" element={<ReimbursementStatus />} />

                        <Route path='*' element={<Navigate to='/' />} />
                    </>
                )}
    
            </Routes> 

    )
}


export default AppRoutes