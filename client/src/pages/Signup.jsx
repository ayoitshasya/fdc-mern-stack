import React from 'react'

function Signup() {
  return (
    <div className='flex justify-center items-center h-full w-full'>
        <div className='min-w-7/10  bg-[#FAFAFA] rounded-4xl p-4 flex flex-col items-center'>
            <img src="/university-logo.svg" className='h-12 self-start'/>
            <div className='w-full flex-1 flex flex-col  items-center font-inter gap-[0.35rem] tracking-wide font-medium mt-5 mb-6'>

                <h3 className='text-4xl font-semibold text-[#3F3F3F] '>Welcome to KJSCE FDC Application</h3>
                <p className='text-2xl text-[#797979] mb-4'>Enter Details to Create an Acount</p>

                <input type="text" className='min-w-[60%] border rounded-4xl p-3 text-sm border-[#777777] outline-none pl-6 mb-2'placeholder='Name'/>

                <div className='flex min-w-[60%] justify-between'>
                    <input type="text" className='w-[49%] border rounded-4xl p-3 text-sm border-[#777777] outline-none pl-6 mb-2'placeholder='Employee ID'/>
                    <input type="Password" className='w-[49%] border rounded-4xl p-3 text-sm border-[#777777] outline-none pl-6 mb-2'placeholder='Password'/>
                </div>

                <div className='flex min-w-[60%] justify-between'>
                    <select name="" className='w-[49%] border rounded-4xl p-3 text-sm border-[#777777] text-[#777777] outline-gray-500 pl-6 mb-2' >
                        <option value="none" selected>Select a Department</option>
                        <option value="SAH">SAH</option>
                        <option value="COMPS">COMPS</option>
                        <option value="IT">IT</option>
                        <option value="EXTC">EXTC</option>
                        <option value="EXCP">EXCP</option>
                        <option value="MECH">MECH</option>
                    </select>

                    <input type="text" className='w-[49%] border rounded-4xl p-3 text-sm border-[#777777] outline-none pl-6 mb-2'placeholder='Enter your Designation'/>
                </div>

                <div className='flex min-w-[60%] justify-between'>
                    <div className='w-[49%]'>
                        <p className='text-[#777777] pl-3 mb-1'>Date of Appointment</p>
                        <input type="date" className='w-full border rounded-4xl p-3 text-sm border-[#777777] text-[#777777] outline-none pl-6 mb-2'placeholder='Date of Appointment'/>
                    </div>

                    <div className='w-[49%]'>
                        <p className='text-[#777777] pl-3 mb-1'>Date of Appointment on Post</p>
                        <input type="date" className='w-full border rounded-4xl p-3 text-sm border-[#777777] text-[#777777] outline-none pl-6 mb-2'placeholder='Date of Appointment on present post'/>
                    </div>
                </div>
                
                
                
                <button className='min-w-[60%] rounded-4xl bg-[#B7202E] text-white p-3 font-semibold cursor-pointer hover:bg-[#d23646] duration-200'>Create Account</button>
            
                <span className='text-[#797979]'>OR</span>
                <button className='flex items-center gap-2 text-[#797979] border border-[#777777] text-[0.9rem] rounded-4xl py-2 px-4 cursor-pointer'>
                <img src="/google.png" className='h-5' /> Sign In Using Google Account
                </button>

                
            </div>
            <p className='text-[#797979] font-inter font-medium text-[1.1rem] mb-1'>Already have an account? <span className='text-[#B7202E] cursor-pointer hover:underline'>Login Here</span></p>
        </div>
    </div>
  )
}

export default Signup