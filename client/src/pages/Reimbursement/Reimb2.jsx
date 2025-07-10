import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../../Components/Header';
import './styles/Reimb2.css';

function Reimbursement2() {
  const navigate = useNavigate();
  const [approvedApplications, setApprovedApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState('');

  useEffect(() => {
    const fetchApprovedApplications = async () => {
      try {
        const res = await axios.get('/api/applications/approved', { 
          withCredentials: true 
        });
        setApprovedApplications(res.data);
      } catch (err) {
        console.error("Error fetching applications:", err);
      }
    };
    fetchApprovedApplications();
  }, []);

  const handleNext = () => {
    if (selectedApplication) {
      navigate(`/reimbursement/3?applicationId=${selectedApplication}`);
    }
  };

  return (
    <div className="reimbursement-container">
      <Header />
      <div className="form-container">
        <h2>Select Approved Application</h2>
        
        <form>
          <div className="form-group">
            <label>Approved Application:</label>
            <select
              value={selectedApplication}
              onChange={(e) => setSelectedApplication(e.target.value)}
              required
            >
              <option value="">Select an application</option>
              {approvedApplications.map(app => (
                <option key={app._id} value={app._id}>
                  {app.purpose} ({app.duration_from} to {app.duration_to})
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            className="next-btn"
            onClick={handleNext}
            disabled={!selectedApplication}
          >
            Next
          </button>
        </form>
      </div>
    </div>
  );
}

export default Reimbursement2;