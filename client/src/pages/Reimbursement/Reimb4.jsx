import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../Components/Header';
import './styles/Reimb4.css';

function Reimbursement4() {
  const navigate = useNavigate();

  const handleBackToDashboard = () => {
    navigate('/home');
  };

  return (
    <div className="reimbursement-container">
      <Header />
      <div className="confirmation-container">
        <h2>Reimbursement Submitted Successfully</h2>
        <div className="confirmation-message">
          <p>Your reimbursement request has been submitted for approval.</p>
          <p>You will be notified once it's processed.</p>
        </div>
        <button 
          className="dashboard-btn"
          onClick={handleBackToDashboard}
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}

export default Reimbursement4;