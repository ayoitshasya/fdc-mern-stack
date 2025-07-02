import React from 'react'

function Home() {
  return (
    <div className='min-w-[65%]  bg-[#FAFAFA] rounded-4xl p-10 py-22 flex flex-col items-center font-inter font-bold text-[#3D3D3D]'>
        <h1 className='text-6xl text-center mb-4 '>Welcome to the</h1>
        <h1 className='text-6xl text-center mb-12 tracking-wide'>FDC Application</h1>
        <div className='flex w-full justify-center gap-2 text-xl'>
            <button className='w-[40%] rounded-4xl bg-[#B7202E] text-white p-3 font-semibold cursor-pointer hover:bg-[#d23646] duration-200'>Application for FDC</button>
            <button className='w-[40%] rounded-4xl border border-[#B7202E] text-[#B7202E] p-3 font-semibold cursor-pointer hover:text-[#d23646] duration-200'>FDC Reimbursement Form</button>
        </div>
    </div>
  )
}

export default Home