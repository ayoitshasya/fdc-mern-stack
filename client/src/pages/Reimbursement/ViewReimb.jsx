import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './View_Reimbursement.css';

const ViewReimbursement = () => {
  const [reimbursements, setReimbursements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // This would come from your authentication context or session
  const userType = 'employee'; // or 'Principal' - you'll need to get this from your auth system
  const eid = '12345'; // Replace with actual employee ID from session

  useEffect(() => {
    const fetchReimbursements = async () => {
      try {
        let url = '';
        if (userType === 'employee') {
          url = `http://localhost:4000/api/reimbursements?eid=${eid}`;
        } else if (userType === 'Principal') {
          url = 'http://localhost:4000/api/reimbursements?status=submitted for approval';
        }

        const response = await fetch(url, {
          credentials: 'include' // for session cookies if using them
        });

        if (!response.ok) {
          throw new Error('Failed to fetch reimbursements');
        }

        const data = await response.json();
        setReimbursements(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReimbursements();
  }, [userType, eid]);

  const handleRowClick = (applicationId) => {
    if (userType === 'Principal') {
      navigate(`/principal-reimbursement/${applicationId}`);
    }
  };

  const handleNewApplication = () => {
    navigate('/reimbursement-page1');
  };

  const handleBack = () => {
    navigate('/loggedin');
  };

  if (loading) return <div className="card">Loading...</div>;
  if (error) return <div className="card">Error: {error}</div>;

  return (
    <div>
      <div className="card">
        <table>
          <thead>
            <tr>
              <th>Application ID</th>
              <th>Applicant Name</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {reimbursements.length > 0 ? (
              reimbursements.map((reimbursement) => (
                <tr 
                  key={reimbursement.application_id}
                  onClick={() => handleRowClick(reimbursement.application_id)}
                  style={{ cursor: 'pointer' }}
                >
                  <td>{reimbursement.application_id}</td>
                  <td>{`${reimbursement.user?.fname} ${reimbursement.user?.lname}`}</td>
                  <td>{reimbursement.status}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3">No applications found</td>
              </tr>
            )}
          </tbody>
        </table>
        {userType === 'employee' && (
          <button onClick={handleNewApplication}>New Application</button>
        )}
        <button onClick={handleBack}>Back</button>
      </div>
    </div>
  );
};

export default ViewReimbursement;