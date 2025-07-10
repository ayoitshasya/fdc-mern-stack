import React from 'react'
import Header from '../../Components/Header'

function ApplicationHOD() {
  return (
    <div className='w-full h-full flex flex-col'>
      <Header/>
      <div className='w-full h-full flex flex-col justify-center items-center'>
        <div className='bg-[#FAFAFA] rounded-3xl p-4 px-8 flex flex-col items-center font-inter'>
          <h1 className='text-xl text-[#3D3D3D] font-medium mb-4'>Recommendation from HOD</h1>
          <form className='w-full text-[#7F7F7F] font-normal flex flex-col'>
            <label htmlFor="recommended" className=''>Recommended/Non-Recommended: *</label>
            <select name="recommended" className='w-full border rounded-lg p-1 outline-none mt-1 mb-2' defaultValue="">
            <   option value="" disabled>Select option</option>
                <option value="Recommended">Recommended</option>
                <option value="Not-Recommended">Not-Recommended</option>
            </select>

            <div className='flex items-center justify-between mb-4'>
                <label htmlFor="checkedLoadAdjustment" className='text-[#3D3D3D] text-sm md:text-base mt-2 mb-1'>
                I have checked the Load Adjustment Form *
                </label>
                <input type="checkbox" name="checkedLoadAdjustment" id="checkedLoadAdjustment" className='accent-[#B7202E] w-5 h-5'/>
            </div>

            <div className='flex items-center justify-between mb-4'>
                <label htmlFor="checkedLoadAdjustment" className='text-[#3D3D3D] text-sm md:text-base mt-0 mb-1'>
                I have checked brochure *
                </label>
                <input type="checkbox" name="checkedLoadAdjustment" id="checkedLoadAdjustment" className='accent-[#B7202E] w-5 h-5'/>
            </div>

            <label htmlFor="reason">Reason for Recommendation/Non-Recommendation *</label>
            <input type="text" name='reason' className='w-full border rounded-lg p-1 outline-none mt-1 mb-2'/>
            
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