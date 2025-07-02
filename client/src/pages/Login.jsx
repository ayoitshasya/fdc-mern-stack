import React from 'react'

function Login() {
  return (
    <div className='min-w-7/10  bg-[#FAFAFA] rounded-4xl p-6 flex flex-col items-center'>
        <img src="/university-logo.svg" className='h-12 self-start'/>
        <div className='w-full flex-1 flex flex-col  items-center font-inter gap-4 tracking-wide font-medium mt-5 mb-10'>

            <h3 className='text-4xl font-semibold text-[#3F3F3F] '>Welcome to KJSCE FDC Application</h3>
            <p className='text-2xl text-[#797979] mb-4'>Enter Employee ID and password to sign in</p>

            <input type="text" className='min-w-[60%] border rounded-4xl p-3 border-[#777777] outline-none pl-6 mb-2'placeholder='Employee ID'/>
            <input type="Password" className='min-w-[60%] border rounded-4xl p-3 border-[#777777] outline-none pl-6 mb-3'placeholder='Password'/>
            
            <button className='min-w-[60%] rounded-4xl bg-[#B7202E] text-white p-3 font-semibold cursor-pointer hover:bg-[#d23646] duration-200'>Sign In</button>
           
            <span className='text-[#797979]'>OR</span>
            <button className='flex items-center gap-2 text-[#797979] border border-[#777777] text-[1rem] rounded-4xl py-2 px-4'>
              <img src="/google.png" className='h-5' /> Sign In Using Google Account
            </button>

            
        </div>
        <p className='text-[#797979] font-inter font-medium text-[1.1rem] mb-1'>New to FDC Application? <span className='text-[#B7202E]'>Signup Here</span></p>
    </div>
  )
}

export default Login