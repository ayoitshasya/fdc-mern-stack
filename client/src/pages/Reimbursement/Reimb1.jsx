import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../../Components/Header';
import './styles/Reimb1.css';

function Reimbursement1() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axios.get('/api/auth/profile', { withCredentials: true });
        setUserData(res.data);
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };
    fetchUserData();
  }, []);

  const handleNext = () => {
    if (checked) {
      navigate('/reimbursement/2');
    }
  };

  return (
    <div className="reimbursement-container">
      <Header />
      <div className="form-container">
        <h2>FDC Reimbursement Form</h2>
        
        {userData && (
          <form>
            <div className="form-group">
              <label>Name:</label>
              <input 
                type="text" 
                value={`${userData.fname} ${userData.lname}`} 
                readOnly 
              />
            </div>
            
            <div className="form-group">
              <label>Employee ID:</label>
              <input type="text" value={userData.e_id} readOnly />
            </div>
            
            {/* Include other fields from your schema */}
            <div className="form-group">
              <label>Department:</label>
              <input type="text" value={userData.department} readOnly />
            </div>

            <div className="checkbox-group">
              <input 
                type="checkbox" 
                id="details-checked" 
                checked={checked}
                onChange={() => setChecked(!checked)}
              />
              <label htmlFor="details-checked">
                I have verified the above details
              </label>
            </div>

            <button 
              type="button" 
              className="next-btn"
              onClick={handleNext}
              disabled={!checked}
            >
              Next
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default Reimbursement1;