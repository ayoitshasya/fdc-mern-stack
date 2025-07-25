import React, { useEffect, useState } from 'react';
import Header from '../../Components/Header';
import { useNavigate } from 'react-router';

function ReimbursementStatus() {
  const [applications, setApplications] = useState([]);
  const [view, setView] = useState('pending');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await fetch('/api/applications'); // isko actual api se replace kardo bhai
        const data = await response.json();
        setApplications(data);
      } catch (error) {
        console.error('Error fetching applications:', error);
      }
    };

    fetchApplications();
  }, []);

  const pending = applications.filter(app => app.status === 'Pending');
  const approved = applications.filter(app => app.status !== 'Pending');

  const activeList = view === 'pending' ? pending : approved;

  return (
    <div className='w-full h-full flex flex-col'>
      <Header />
      <div className='bg-[url(/campus.jpg)] bg-cover w-full h-full flex flex-col items-center p-6'>
        <div className='bg-white bg-opacity-90 rounded-3xl p-6 px-10 max-w-6xl w-full shadow-md flex flex-col'>
          <h1 className='text-2xl font-semibold text-center text-[#B7202E] mb-6'>Reimbursement Forms</h1>

          {/* Toggle Tabs */}
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

          {/* Table Headers */}
          <div className={`grid ${view === 'pending' ? 'grid-cols-3' : 'grid-cols-4'} font-semibold border-b py-2 text-sm text-[#3D3D3D]`}>
            <span>Application ID</span>
            <span>Applicant Name</span>
            {view === 'approved' && <span>Status</span>}
            <span>Submitted</span>
          </div>

          {/* Table Rows */}
          {activeList.map((app) => (
            <div key={app.id} className={`grid ${view === 'pending' ? 'grid-cols-3' : 'grid-cols-4'} border-b py-2 text-sm text-[#3D3D3D]`}>
              <span>{app.id}</span>
              <span>{app.name}</span>
              {view === 'approved' && <span>{app.status}</span>}
              <span>{app.submittedOn}</span>
            </div>
          ))}

          {activeList.length === 0 && (
            <div className="text-center text-gray-500 py-6">No applications to display.</div>
          )}

          <div className="flex justify-between items-center mt-5">
          <button
            className="rounded-4xl bg-gray-400 text-white px-40 py-3 font-semibold cursor-pointer hover:bg-gray-500 duration-200"
            onClick={() => navigate("/")}
          >
            Back
          </button>

          <button className='rounded-4xl w-fit self-center mt-5 bg-[#B7202E] text-white px-30 p-3 font-semibold cursor-pointer hover:bg-[#d23646] duration-200' onClick={() => {navigate("/fdc-reimbursement/step-1")}}>New Reimbursement</button>
        </div>
        </div>
      </div>
    </div>
  );
}

export default ReimbursementStatus 
