import React, { useEffect, useState } from 'react';
import Header from '../../Components/Header';
import { useNavigate } from 'react-router';
import { useFormContext } from '../../context/FormContext';
import { useUser } from '../../context/UserContext';

function ReimbursementStatus() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState('pending');
  const navigate = useNavigate();
  const { resetFormData } = useFormContext();
  const { user } = useUser();

  const formatDate = d => {
    const date = new Date(d);
    return `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth()+1).toString().padStart(2, '0')}-${date.getFullYear()}`;
  };

  useEffect(() => {
    const fetchApplications = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:4000/reimbursement/fetch-reimbursement-forms', {
          method: 'GET',
          credentials: 'include',
        });
        const data = await response.json();
        setApplications(data.forms);
      } catch (error) {
        console.error('Error fetching reimbursements:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const pending = applications.filter(app => app.status !== 'approved-by-fdc');
  const approved = applications.filter(app => app.status === 'approved-by-fdc');

  const activeList = view === 'pending' ? pending : approved;

  return (
    <div className='w-full h-full flex flex-col'>
      <Header />
      <div className='bg-[url(/campus.jpg)] bg-cover w-full h-full flex flex-col items-center p-6'>
        <div className='bg-white bg-opacity-90 rounded-3xl p-6 px-10 max-w-6xl w-full shadow-md flex flex-col'>
          <h1 className='text-2xl font-semibold text-center text-[#B7202E] mb-6'>Reimbursement Forms</h1>

          <div className='flex justify-center gap-4 mb-6'>
            <button
              className={`px-6 py-2 rounded-full font-medium ${view === 'pending' ? 'bg-[#B7202E] text-white' : 'bg-gray-200 text-[#B7202E]'}`}
              onClick={() => setView('pending')}
            >
              Pending
            </button>
            <button
              className={`px-6 py-2 rounded-full font-medium ${view === 'approved' ? 'bg-[#B7202E] text-white' : 'bg-gray-200 text-[#B7202E]'}`}
              onClick={() => setView('approved')}
            >
              Approved
            </button>
          </div>

          <div className='grid grid-cols-4 font-semibold border-b py-2 text-sm text-[#3D3D3D]'>
            <span>Reimbursement ID</span>
            <span>Name</span>
            <span>Status</span>
            <span>Submitted</span>
          </div>

          {loading ? (
            <div className="h-5 w-5 border-3 border-grey border-t-transparent rounded-full animate-spin self-center mt-5 mb-3"></div>
          ) : (
            <>
              {activeList.map((app) => (
                <div key={app._id} className='grid grid-cols-4 border-b py-2 text-sm text-[#3D3D3D]'>
                  <span className="truncate">{app._id}</span>
                  <span>{user?.fname} {user?.lname}</span>
                  <span>{app.status.replace(/-/g, ' ')}</span>
                  <span>{formatDate(app.createdAt)}</span>
                </div>
              ))}
              {activeList.length === 0 && (
                <div className="text-center text-gray-500 py-6">No reimbursements to display.</div>
              )}
            </>
          )}

          <div className="flex justify-between items-center mt-5">
            <button
              className="rounded-4xl bg-gray-400 text-white px-40 py-3 font-semibold cursor-pointer hover:bg-gray-500 duration-200"
              onClick={() => navigate("/")}
            >
              Back
            </button>
            <button
              className='rounded-4xl w-fit self-center mt-5 bg-[#B7202E] text-white px-30 p-3 font-semibold cursor-pointer hover:bg-[#d23646] duration-200'
              onClick={() => { resetFormData("fdcReimbursement"); navigate("/fdc-reimbursement/step-1"); }}
            >
              New Reimbursement
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReimbursementStatus
