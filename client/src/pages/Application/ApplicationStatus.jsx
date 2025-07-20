import React, { useEffect, useState } from 'react';
import Header from '../../Components/Header';
import { useNavigate } from 'react-router';
import { useUser } from '../../context/UserContext';

function ApplicationStatus() {
  const [applications, setApplications] = useState([]);
  const [applicationsLoading, setApplicationsLoading] = useState(false);
  const [view, setView] = useState('pending'); 
  const navigate = useNavigate();
  const {user} = useUser()


  useEffect(() => {
    
    const fetchApplications = async () => {
      setApplicationsLoading(true)
      try {

        const response = await fetch('http://localhost:4000/application/fetch-applications', {
          method: 'GET',
          credentials: 'include',
        });
        const data = await response.json();
        console.log(data)
        setApplications(data.applications);
        setApplicationsLoading(false);
      } catch (error) {
        console.error('Error fetching applications:', error);
        setApplicationsLoading(false)
      }
    };

    fetchApplications();
  }, []);

  let pending;
  let approved;
  if(applications){
    pending = applications.filter(app => app.status !== "approved-by-convenor");
    approved = applications.filter(app => app.status === "approved-by-convenor");
  }
  

  const activeList = view === 'pending' ? pending : approved;

  return (
    <div className='w-full h-full flex flex-col'>
      <Header />
      <div className='bg-[url(/campus.jpg)] bg-cover w-full h-full flex flex-col items-center p-6'>
        <div className='bg-white bg-opacity-90 rounded-3xl p-6 px-10 max-w-6xl w-full shadow-md flex flex-col'>
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
            <span>Status</span>
            <span>Submitted</span>
          </div>


          {applicationsLoading ? (
            <div className="h-5 w-5 border-3 border-grey border-t-transparent rounded-full animate-spin mr-2 self-center mt-5 mb-3"></div>
            ):

            <>
              {activeList.map((app) => (
                <div key={app.id} className={`grid ${view === 'pending' ? 'grid-cols-4' : 'grid-cols-5'} border-b py-2 text-sm text-[#3D3D3D]`}>
                  <span>{app._id}</span>
                  <span>{user.fname} {user.lname}</span>
                  <span>{app.purpose}</span>
                  <span>{app.status.replace(/-/g, " ")}</span>
                  <span>{app.submittedOn}</span>
                </div>
              ))}

          {activeList.length === 0 && (
            <div className="text-center text-gray-500 py-6">No applications to display.</div>
          )}
            </>
            }

          {/* Table Rows */}
          

          
          
          <button className='rounded-4xl w-fit self-center mt-5 bg-[#B7202E] text-white p-3 font-semibold cursor-pointer hover:bg-[#d23646] duration-200' onClick={() => {navigate("/fdc-application/step-1")}}>New Application</button>
        </div>
      </div>
    </div>
  );
}

export default ApplicationStatus;
