import React, { useState, useEffect } from 'react'  
import Header from '../../Components/Header'


function Application2() {
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [numberOfDays, setNumberOfDays] = useState('');
  
    useEffect(() => {
    if (fromDate && toDate) {
      const start = new Date(fromDate);
      const end = new Date(toDate);
      const diffTime = end.getTime() - start.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
      if (diffDays > 0) {
        setNumberOfDays(diffDays);
      } else {
        setNumberOfDays('');
      }
    } else {
      setNumberOfDays('');
    }
  }, [fromDate, toDate]);

  return (
    <div className='w-full h-full flex flex-col'>
      <Header/>
      <div className='w-full h-full flex flex-col justify-center items-center'>
        <div className='bg-[#FAFAFA] rounded-3xl p-4 px-8 flex flex-col items-center font-inter'>
          <h1 className='text-xl text-[#3D3D3D] font-medium mb-4'>Details about STTPS/Symposium/Workshop/Conference/Seminar/NPTEL Course</h1>
          <form className='w-full text-[#7F7F7F] font-normal flex flex-col'>
            <label htmlFor="purpose" className=''>Select purpose for FDC: *</label>
            <select name="purpose" className="w-full border rounded-lg p-1 outline-none mt-1 mb-2" defaultValue="">
                <option value="" disabled>Select option</option>
                <option value="STTP">STTP</option>
                <option value="Symposium">Symposium</option>
                <option value="Workshop">Workshop</option>
                <option value="National Conference">National Conference</option>
                <option value="International Conference">International Conference</option>
                <option value="NPTEL Course">NPTEL Course</option>
                <option value="FDP">FDP</option>
                <option value="Summit">Summit</option>
            </select>

            <label htmlFor="org_institution" className=''>Name and address of organising Institution: *</label>
            <input type="text" name='org_institution' className='w-full border rounded-lg p-1 outline-none mt-1 mb-2'/>

            <label htmlFor="others">Other supporting organization worth mentioning (e.g., EEE/SAE etc): *</label>
            <input type="text" name='others' className='w-full border rounded-lg p-1 outline-none mt-1 mb-2'/>

            <label htmlFor="date_and_duration_from">Date and duration from: *</label>
            <div className='flex gap-4 mt-1 mb-2'>
                <input type="date" name='duration_from' className='w-full border rounded-lg p-1 outline-none' value={fromDate} onChange={(e) => setFromDate(e.target.value)} placeholder='From'/>
                <input type="date" name='duration_to' className='w-full border rounded-lg p-1 outline-none' value={toDate} onChange={(e) => setToDate(e.target.value)} placeholder='To'/>
            </div>

            <label htmlFor="total_days">Total number of days: *</label>
            <input type="text" name='total_days' className='w-full border rounded-lg p-1 outline-none mt-1 mb-2' value={numberOfDays} readOnly/>

            <label htmlFor="registration_last_day">Last day of registration: *</label>
            <input type="date" name='registration_last_day' className='w-full border rounded-lg p-1 outline-none mt-1 mb-2'y/>

            <label htmlFor="registration_fee">Registration Fee: *</label>
            <div className="relative mt-1 mb-2">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                <input type="number" name="registration_fee" className="w-full border rounded-lg p-1 pl-7 outline-none" min="0" step="1"/>
            </div>
            
            <label htmlFor="vacation_period">The program is during: *</label>
            <select name="vacation_period" className="w-full border rounded-lg p-1 outline-none mt-1 mb-2" defaultValue="">
                <option value="" disabled>Select option</option>
                <option value="Vacation">Vacation</option>
                <option value="Non-vacation">Non-vacation</option>
            </select>

            <label htmlFor="ods_required">No. of ODs required: *</label>
            <input type="number" name='ods_required' className='w-full border rounded-lg p-1 outline-none mt-1 mb-2' min="0" max="7"/>

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

export default Application2