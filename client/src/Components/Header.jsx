import React from 'react'

function Header() {
  return (
    <div className='w-full bg-white py-2 px-8 flex justify-between items-center'>
        <div className='h-full flex items-center gap-8'>
            <img src="/mini-logo.png" className='h-14' />
            <h1 className='font-inter font-light text-lg'>Welcome, Ashish Dhiwar</h1>
        </div>
        <div className='h-full flex items-center gap-4'>
            <button className='flex items-center gap-2 border rounded-4xl p-2 border-[#6F6F6F] cursor-pointer'>
                <img src="/user.png" className='h-6' />
                <span className='text-[1rem] font-light font-inter mr-1'>Profile</span>
            </button>
            <button className='border rounded-full p-3 border-[#6F6F6F] cursor-pointer'>
                <img src="/logout.png" className='h-4' />
            </button>
        </div>
        
    </div>
  )
}

export default Header