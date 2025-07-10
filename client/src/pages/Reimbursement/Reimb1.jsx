import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../../Components/Header';
import './styles/Reimb1.css';

function Reimbursement1() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axios.get('/api/auth/profile', { 
          withCredentials: true 
        });
        setUserData(res.data);
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError('Failed to load user data. Please try again.');
        if (err.response?.status === 401) {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [navigate]);

  const handleNext = () => {
    if (checked) {
      navigate('/reimbursement/2');
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <Header />
        <div className="card">
          <div className="loading-spinner">Loading...</div>
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
            className="retry-btn"
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
        <h2>FDC Reimbursement Form</h2>
        
        {userData ? (
          <form>
            <div className="form-group">
              <label>Name:</label>
              <input 
                type="text" 
                value={`${userData.fname} ${userData.lname}`} 
                readOnly 
                className="form-input"
              />
            </div>
            
            <div className="form-group">
              <label>Employee ID:</label>
              <input 
                type="text" 
                value={userData.e_id} 
                readOnly 
                className="form-input"
              />
            </div>
            
            <div className="form-group">
              <label>Department:</label>
              <input 
                type="text" 
                value={userData.department} 
                readOnly 
                className="form-input"
              />
            </div>

            <div className="checkbox-group">
              <input 
                type="checkbox" 
                id="details-checked" 
                checked={checked}
                onChange={() => setChecked(!checked)}
                className="verification-checkbox"
              />
              <label htmlFor="details-checked">
                I have verified the above details
              </label>
            </div>

            <button 
              type="button" 
              className={`submit-btn ${!checked ? 'disabled' : ''}`}
              onClick={handleNext}
              disabled={!checked}
            >
              Next
            </button>
          </form>
        ) : (
          <div className="no-data-message">
            No user data available. Please contact support.
          </div>
        )}
      </div>
    </div>
  );
}

export default Reimbursement1;