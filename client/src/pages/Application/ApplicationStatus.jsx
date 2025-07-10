import React, { useEffect, useState } from 'react';
import Header from '../../Components/Header';

function ApplicationStatus() {
  const [applications, setApplications] = useState([]);
  const [view, setView] = useState('pending'); 

  useEffect(() => {
    // dood gpt told to replace this with actual backend api call :p
    const fetchApplications = async () => {
      try {
        const response = await fetch('/api/applications'); // gaizzz replace this :p
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
        <div className='bg-white bg-opacity-90 rounded-3xl p-6 px-10 max-w-6xl w-full shadow-md'>
          <h1 className='text-2xl font-semibold text-center text-[#B7202E] mb-6'>Application Forms</h1>

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
          <div className={`grid ${view === 'pending' ? 'grid-cols-4' : 'grid-cols-5'} font-semibold border-b py-2 text-sm text-[#3D3D3D]`}>
            <span>Application ID</span>
            <span>Name</span>
            <span>Purpose</span>
            {view === 'approved' && <span>Status</span>}
            <span>Submitted</span>
          </div>

          {/* Table Rows */}
          {activeList.map((app) => (
            <div key={app.id} className={`grid ${view === 'pending' ? 'grid-cols-4' : 'grid-cols-5'} border-b py-2 text-sm text-[#3D3D3D]`}>
              <span>{app.id}</span>
              <span>{app.name}</span>
              <span>{app.purpose}</span>
              {view === 'approved' && <span>{app.status}</span>}
              <span>{app.submittedOn}</span>
            </div>
          ))}

          {activeList.length === 0 && (
            <div className="text-center text-gray-500 py-6">No applications to display.</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ApplicationStatus;
