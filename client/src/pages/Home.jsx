import React from 'react'
import Header from '../Components/Header'

function Home() {
  return (
    <div className='w-full h-full flex flex-col'>
      <Header/>
      <div className='w-full h-full flex flex-col justify-center items-center'>
        <div className='min-w-[60%] bg-[#FAFAFA] rounded-4xl p-10 py-20 flex flex-col items-center font-inter font-bold text-[#3D3D3D]'>
          <h1 className='text-6xl text-center mb-4 '>Welcome to the</h1>
          <h1 className='text-6xl text-center mb-14 tracking-wide'>FDC Application</h1>
          <div className='flex w-full justify-center gap-4 text-xl'>
              <button className='w-[38%] rounded-4xl bg-[#B7202E] text-white p-3 font-semibold cursor-pointer hover:bg-[#d23646] duration-200'>Application for FDC</button>
              <button className='w-[38%] rounded-4xl border border-[#B7202E] text-[#B7202E] p-3 font-semibold cursor-pointer hover:text-[#d23646] duration-200'>FDC Reimbursement Form</button>
          </div>
        </div>
      </div>
    </div>
    
  )
}

export default Home