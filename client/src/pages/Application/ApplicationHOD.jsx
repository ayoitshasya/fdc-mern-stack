import React, { useState } from 'react'
import Header from '../../Components/Header'
import { useParams, useNavigate } from 'react-router'
import toast from 'react-hot-toast'

function ApplicationHOD() {
  const {id} = useParams();
  const navigate = useNavigate();
  const [isChecked, setIsChecked] = useState(false)
  const [loadChecked, setLoadChecked] = useState(false)
  const [brochureChecked, setBrochureChecked] = useState(false)
  const [recommended, setRecommended] = useState("")
  const [reason, setReason] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if(recommended === "" || !isChecked || !loadChecked || !brochureChecked || reason === ""){
        toast.error("Enter All Required Fields.")
        setLoading(false)
        return;
      }

      else{
        let stat;
        
        if(recommended === "Recommended"){
          stat = "approve";
        } else if(recommended === "Not-Recommended"){
          stat = "disapprove";
        }
        console.log(stat)
        console.log("Payload:", {
          applicationId: id,
          status: stat,
          HOD_recommendation: recommended,
          HOD_reason: reason
        });
        
        const response = await fetch('http://localhost:4000/application/application-review', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        
        body: JSON.stringify({ applicationId: id, status:stat, HOD_recommendation:recommended, HOD_reason: reason}),
        });

        setLoading(false);
        if (!response.ok) {
          console.error("Fetch failed with status:", response.status);
          toast.error("Error reviewing application");
          return;
        }
        else{
          navigate('/application/Status')
        }
        
      }
      
    } catch (err) {
      console.error("Error in fetchApplication:", err);
      toast.error("Error reviewing application");
    }
  }

  

  return (
    <div className='w-full h-full flex flex-col'>
      <Header/>
      <div className='w-full h-full flex flex-col justify-center items-center'>
        <div className='bg-[#FAFAFA] rounded-3xl p-4 px-8 flex flex-col items-center font-inter'>
          <h1 className='text-xl text-[#3D3D3D] font-medium mb-4'>Recommendation from HOD</h1>
          <form className='w-full text-[#7F7F7F] font-normal flex flex-col'>
            <label htmlFor="recommended" className=''>Recommended/Non-Recommended: *</label>
            <select name="recommended" className='w-full border rounded-lg p-1 outline-none mt-1 mb-2'  value={recommended} onChange={(e)=>{ setRecommended(e.target.value)} }>
            <   option value="" disabled>Select option</option>
                <option value="Recommended">Recommended</option>
                <option value="Not-Recommended">Not-Recommended</option>
            </select>

            <div className='flex items-center justify-between mb-2'>
                <label htmlFor="checkedLoadAdjustment" className='text-[#3D3D3D] text-sm md:text-base mt-2 mb-1'>
                I have checked load adjustment form *
                </label>
                <input type="checkbox" name="checkedLoadAdjustment" id="checkedLoadAdjustment" className='accent-[#B7202E] w-5 h-5' checked={loadChecked} onChange={(e) => setLoadChecked(e.target.checked)}/>
            </div>

            <div className='flex items-center justify-between mb-4'>
                <label htmlFor="checkedLoadAdjustment" className='text-[#3D3D3D] text-sm md:text-base mt-2 mb-1'>
                I have checked brochure *
                </label>
                <input type="checkbox" name="checkedLoadAdjustment" id="checkedLoadAdjustment" className='accent-[#B7202E] w-5 h-5' checked={brochureChecked} onChange={(e) => setBrochureChecked(e.target.checked)}/>
            </div>
              
            <label htmlFor="reason">Reason for Recommendation/Non-Recommendation *</label>
            <input type="text" name='reason' className='w-full border rounded-lg p-1 outline-none mt-1 mb-2' value={reason} onChange={(e)=>{setReason(e.target.value)}}/>
            
            <p className='font-medium text-[#666666]'>Check above details and click submit</p>
            <div className='flex items-center mb-4'>
                <span className='font-light'>I have checked the above details</span>
                <input type="checkbox" name="checked" id="checked" className='ml-2 accent-[#B7202E]' checked={isChecked} onChange={(e) => setIsChecked(e.target.checked)}/>
            </div>
            
            <button className='rounded-4xl bg-[#B7202E] text-white w-fit self-center p-2 px-40 cursor-pointer' onClick={handleSubmit}>
              {loading ? <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div> : <>Submit</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ApplicationHOD
