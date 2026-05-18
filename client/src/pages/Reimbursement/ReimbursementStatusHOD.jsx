import React, { useEffect, useState } from 'react';
import Header from '../../Components/Header';
import { useNavigate } from 'react-router';
import { useUser } from '../../context/UserContext';
import { API_BASE } from '../../config';

function ReimbursementStatusHOD() {
  const [reimbursements, setReimbursements] = useState([]);
  const [reimbursementsLoading, setReimbursementsLoading] = useState(false);
  const [view, setView] = useState('pending');
  const [viewedIds, setViewedIds] = useState([]);
  const navigate = useNavigate();
  const {user} = useUser();

  const storageKey = `viewed_reim_${user?.e_id}`;

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem(storageKey) || '[]');
    setViewedIds(stored);
  }, [storageKey]);

  const markAsViewed = (id) => {
    const stored = JSON.parse(localStorage.getItem(storageKey) || '[]');
    if (!stored.includes(id)) {
      const updated = [...stored, id];
      localStorage.setItem(storageKey, JSON.stringify(updated));
      setViewedIds(updated);
    }
  };

  const formatDate = d => {
    const date = new Date(d);
    return `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth()+1).toString().padStart(2, '0')}-${date.getFullYear()}`;
  };

  useEffect(() => {
    const fetchReimbursements = async () => {
      setReimbursementsLoading(true);
      try {
        const response = await fetch(`${API_BASE}/reimbursement/fetch-reimbursement-forms`, {
          method: 'GET',
          credentials: 'include',
        });
        const data = await response.json();
        setReimbursements(data.forms);
        setReimbursementsLoading(false);
      } catch (error) {
        console.error('Error fetching Forms:', error);
        setReimbursementsLoading(false);
      }
    };

    fetchReimbursements();
  }, []);

  let pending = [];
  let approved = [];
  if (reimbursements) {
    pending = reimbursements.filter(app => app.status === "pending");
    approved = reimbursements.filter(app => app.status !== "pending");
  }

  const activeList = view === 'pending' ? pending : approved;

  return (
    <div className='w-full h-full flex flex-col'>
      <Header />
      <div className='bg-[url(/campus.jpg)] bg-cover w-full h-full flex flex-col items-center p-6'>
        <div className='bg-white bg-opacity-90 rounded-3xl p-6 px-10 max-w-6xl w-full shadow-md flex flex-col'>
          <h1 className='text-2xl font-semibold text-center text-[#B7202E] mb-6'>Reimbursement Forms</h1>

          <div className='flex justify-center gap-4 mb-6'>
            <button
              className={`relative px-6 py-2 rounded-full font-medium ${view === 'pending' ? 'bg-[#B7202E] text-white' : 'bg-gray-200 text-[#B7202E]'}`}
              onClick={() => setView('pending')}
            >
              Pending
              {pending.filter(a => !viewedIds.includes(a._id)).length > 0 && (
                <span className="absolute -top-1 -right-1 bg-yellow-400 text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {pending.filter(a => !viewedIds.includes(a._id)).length}
                </span>
              )}
            </button>
            <button
              className={`px-6 py-2 rounded-full font-medium ${view === 'approved' ? 'bg-[#B7202E] text-white' : 'bg-gray-200 text-[#B7202E]'}`}
              onClick={() => setView('approved')}
            >
              Reviewed
            </button>
          </div>

          <div className='grid grid-cols-4 font-semibold border-b py-2 text-sm text-[#3D3D3D]'>
            <span>Form ID</span>
            <span>Name</span>
            <span>Status</span>
            <span>Submitted</span>
          </div>

          {reimbursementsLoading ? (
            <div className="h-5 w-5 border-3 border-grey border-t-transparent rounded-full animate-spin mr-2 self-center mt-5 mb-3"></div>
          ) : (
            <>
              {activeList.map((app) => {
                const isUnread = !viewedIds.includes(app._id);
                return (
                  <div
                    key={app._id}
                    onClick={view === "pending" ? () => { markAsViewed(app._id); navigate(`/reimbursement/${app._id}`); } : undefined}
                    className={`hover:bg-gray-100 grid grid-cols-4 border-b py-2 text-sm text-[#3D3D3D] cursor-pointer ${isUnread && view === 'pending' ? 'bg-yellow-50 font-semibold' : ''}`}
                  >
                    <span className="flex items-center gap-1">
                      {isUnread && view === 'pending' && <span className="w-2 h-2 rounded-full bg-yellow-400 inline-block flex-shrink-0"></span>}
                      <span className="truncate">{app._id}</span>
                    </span>
                    <span>{app.submitted_by.fname} {app.submitted_by.lname}</span>
                    <span>{app.status.replace(/-/g, " ")}</span>
                    <span>{formatDate(app.createdAt)}</span>
                  </div>
                );
              })}

              {activeList.length === 0 && (
                <div className="text-center text-gray-500 py-6">No forms to display.</div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ReimbursementStatusHOD;
