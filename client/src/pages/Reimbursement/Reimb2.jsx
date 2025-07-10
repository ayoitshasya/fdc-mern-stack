import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../../Components/Header';
import './styles/Reimb2.css';

function Reimbursement2() {
  const navigate = useNavigate();
  const [approvedApplications, setApprovedApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApprovedApplications = async () => {
      try {
        const res = await axios.get('/api/applications/approved', { 
          withCredentials: true 
        });
        setApprovedApplications(res.data);
      } catch (err) {
        console.error("Error fetching applications:", err);
        setError('Failed to load approved applications. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchApprovedApplications();
  }, []);

  const handleNext = () => {
    if (selectedApplication) {
      navigate(`/reimbursement/3?applicationId=${selectedApplication}`);
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <Header />
        <div className="card">
          <div className="loading-spinner">Loading approved applications...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <Header />
        <div className="card">
          <div className="error-message">{error}</div>
          <button 
            onClick={() => window.location.reload()}
            className="submit-btn"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <Header />
      <div className="card">
        <h2>Select Approved Application</h2>
        
        <form>
          <div className="form-group">
            <label>Approved Application</label>
            <select
              value={selectedApplication}
              onChange={(e) => setSelectedApplication(e.target.value)}
              className="form-input"
              required
            >
              <option value="">Select an application</option>
              {approvedApplications.map(app => (
                <option key={app._id} value={app._id}>
                  {app.purpose} ({new Date(app.duration_from).toLocaleDateString()} to {new Date(app.duration_to).toLocaleDateString()})
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            className={`submit-btn ${!selectedApplication ? 'disabled' : ''}`}
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