import React from 'react'
import Header from '../../Components/Header'

function Application1() {
  return (
    <div className='w-full h-full flex flex-col'>
      <Header/>
      <div className='w-full h-full flex flex-col justify-center items-center'>
        <div className='bg-[#FAFAFA] rounded-3xl p-4 px-8 flex flex-col items-center font-inter'>
          <h1 className='text-xl text-[#3D3D3D] font-medium mb-4'>Application to attend STTPS and Symposium/Workshop/Seminar/Conference/NPTEL Course</h1>
          <form className='w-full text-[#7F7F7F] font-normal flex flex-col'>
            <label htmlFor="name" className=''>Name: *</label>
            <input type="text" name='name' className='w-full border rounded-lg p-1 outline-none mt-1 mb-2'/>

            <label htmlFor="employeeId" className=''>Employee ID: *</label>
            <input type="text" name='employeeId' className='w-full border rounded-lg p-1 outline-none mt-1 mb-2'/>

            <label htmlFor="department">Department: *</label>
            <input type="text" name='department' className='w-full border rounded-lg p-1 outline-none mt-1 mb-2'/>

            <label htmlFor="designation">Designation: *</label>
            <input type="text" name='designation' className='w-full border rounded-lg p-1 outline-none mt-1 mb-2'/>

            <label htmlFor="date_of_appointment">Date of Appointment: *</label>
            <input type="date" name='date_of_appointment' className='w-full border rounded-lg p-1 outline-none mt-1 mb-2'/>

            <label htmlFor="date_of_appointment_present">Date of Appointment on the present post: *</label>
            <input type="date" name='date_of_appointment_present' className='w-full border rounded-lg p-1 outline-none mt-1 mb-2'/>
            
            <p className='font-medium text-[#666666]'>Check above details and click next to proceed further</p>
            <div className='flex items-center mb-4'>
                <span className='font-light'>I have checked the above details</span>
                <input type="checkbox" name="checked" id="checked" className='ml-2 accent-[#B7202E]'/>
            </div>
            
            <button className='rounded-4xl bg-[#B7202E] text-white w-fit self-center p-2 px-40 cursor-pointer'>Next</button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Application1