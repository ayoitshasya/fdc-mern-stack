import React, { useState } from 'react';
import Header from '../../Components/Header';
import { useParams, useNavigate } from 'react-router';

function ApplicationFDC() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [committeeDate, setCommitteeDate] = useState('');
  const [finalRemark, setFinalRemark] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const [recommendation, setRecommendation] = useState(''); // "Approve" | "Not-Approve"
  const [amountSanctioned, setAmountSanctioned] = useState('');
  const [odSanctioned, setOdSanctioned] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      // basic validation
      if (
        recommendation === '' ||
        committeeDate === '' ||
        !isChecked ||
        amountSanctioned === '' ||
        odSanctioned === ''
      ) {
        alert('Enter all required fields.');
        setLoading(false);
        return;
      }

      // map UI recommendation to backend status string
      // adjust mapping if your backend expects a different value
      let stat = recommendation === 'Approve' ? 'approve' : 'disapprove';

      console.log('Payload:', {
        applicationId: id,
        status: stat,
        committee_meeting_date: committeeDate,
        final_remark: finalRemark,
        recommendation: recommendation,
        amount_sanctioned: amountSanctioned,
        od_sanctioned: odSanctioned,
      });

      const response = await fetch('http://localhost:4000/application/application-review', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          applicationId: id,
          status: stat,
          committee_meeting_date: committeeDate,
          final_remark: finalRemark,
          amount_sanctioned: Number(amountSanctioned),
          od_sanctioned: Number(odSanctioned),
        }),
      });

      setLoading(false);

      if (!response.ok) {
        console.error('Fetch failed with status:', response.status);
        alert('Error reviewing application');
        return;
      }

      // success
      navigate('/application/Status');
    } catch (err) {
      console.error('Error in fetchApplication:', err);
      alert('Error reviewing application');
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col">
      <Header />
      <div className="w-full h-full flex flex-col justify-center items-center">
        <div className="bg-[#FAFAFA] rounded-3xl p-4 px-8 flex flex-col items-center font-inter">
          <h1 className="text-xl text-[#3D3D3D] font-medium mb-4">FDC Approval</h1>

          <form className="w-full text-[#7F7F7F] font-normal flex flex-col" onSubmit={handleSubmit}>
            <label htmlFor="committee_meeting_date">Date of meeting for approval of committee: *</label>
            <input
              type="date"
              name="committee_meeting_date"
              id="committee_meeting_date"
              value={committeeDate}
              onChange={(e) => setCommitteeDate(e.target.value)}
              className="w-full border rounded-lg p-1 outline-none mt-1 mb-2"
            />

            <label htmlFor="final_remark">Final recommendation/Remark at committee: *</label>
            <input
              type="text"
              name="final_remark"
              value={finalRemark}
              onChange={(e) => setFinalRemark(e.target.value)}
              className="w-full border rounded-lg p-1 outline-none mt-1 mb-2"
            />

            <label htmlFor="recommendation">Committee Recommendation: *</label>
            <select
              name="recommendation"
              id="recommendation"
              value={recommendation}
              onChange={(e) => setRecommendation(e.target.value)}
              className="w-full border rounded-lg p-1 outline-none mt-1 mb-2"
            >
              <option value="" disabled>
                Select option
              </option>
              <option value="Approve">Approve</option>
              <option value="Not-Approve">Not Approve</option>
            </select>

            <label htmlFor="amount_sanctioned">Amount sanctioned: *</label>
            <div className="relative mt-1 mb-2">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
              <input
                type="number"
                name="amount_sanctioned"
                value={amountSanctioned}
                onChange={(e) => setAmountSanctioned(e.target.value)}
                className="w-full border rounded-lg p-1 pl-7 outline-none"
                min="0"
                step="1"
              />
            </div>

            <label htmlFor="ods_sanctioned">Number of ODs sanctioned: *</label>
            <input
              type="number"
              name="ods_sanctioned"
              value={odSanctioned}
              onChange={(e) => setOdSanctioned(e.target.value)}
              className="w-full border rounded-lg p-1 outline-none mt-1 mb-2"
              min="0"
              step="1"
            />

            <p className="font-medium text-[#666666]">Check above details and click submit</p>
            <div className="flex items-center mb-4">
              <span className="font-light">I have checked the above details</span>
              <input
                type="checkbox"
                name="checked"
                id="checked"
                className="ml-2 accent-[#B7202E]"
                checked={isChecked}
                onChange={(e) => setIsChecked(e.target.checked)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="rounded-4xl bg-[#B7202E] text-white w-fit self-center p-2 px-40 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center"
            >
              {loading ? (
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              ) : null}
              {loading ? 'Submitting...' : 'Submit'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ApplicationFDC;
