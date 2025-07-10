import React from 'react'
import Header from '../../Components/Header'

function ApplicationHOD() {
  return (
    <div className='w-full h-full flex flex-col'>
      <Header/>
      <div className='w-full h-full flex flex-col justify-center items-center'>
        <div className='bg-[#FAFAFA] rounded-3xl p-4 px-8 flex flex-col items-center font-inter'>
          <h1 className='text-xl text-[#3D3D3D] font-medium mb-4'>FDC Approval</h1>
          <form className='w-full text-[#7F7F7F] font-normal flex flex-col'>
            <label htmlFor="committee_meeting_date">Date of meeting for approval of committee: *</label>
            <input type="date" name='committee_meeting_date' id="committee_meeting_date" placeholder="Select a date" className='w-full border rounded-lg p-1 outline-none mt-1 mb-2'/>

            <label htmlFor="final_remark">Final recommendation/Remark at committee: *</label>
            <input type="text" name='final_remark' className='w-full border rounded-lg p-1 outline-none mt-1 mb-2'/>
            
            <label htmlFor="amount_sanctioned">Amount sanctioned: *</label>
            <div className="relative mt-1 mb-2">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                <input type="number" name="amount_sanctioned" className="w-full border rounded-lg p-1 pl-7 outline-none" min="0" step="1"/>
            </div>

            <label htmlFor="ods_sanctioned">Number of ODs sanctioned: *</label>
            <input type="number" name='ods_sanctioned' className='w-full border rounded-lg p-1 outline-none mt-1 mb-2'/>

            <p className='font-medium text-[#666666]'>Check above details and click submit</p>
            <div className='flex items-center mb-4'>
                <span className='font-light'>I have checked the above details</span>
                <input type="checkbox" name="checked" id="checked" className='ml-2 accent-[#B7202E]'/>
            </div>
            
            <button className='rounded-4xl bg-[#B7202E] text-white w-fit self-center p-2 px-40 cursor-pointer'>Submit</button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ApplicationHOD