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
    <div className="page-container">
      <Header />
      <div className="card confirmation-card">
        <div className="success-icon">✓</div>
        <h2 className="confirmation-title">Reimbursement Submitted Successfully</h2>
        <div className="confirmation-message">
          <p>Your reimbursement request has been submitted for approval.</p>
          <p>You will be notified via email once it's processed.</p>
        </div>
        <div className="reference-number">
          <p>Reference ID: <strong>REIMB-{Date.now().toString().slice(-6)}</strong></p>
        </div>
        <button 
          className="submit-btn dashboard-btn"
          onClick={handleBackToDashboard}
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}

export default Reimbursement4;