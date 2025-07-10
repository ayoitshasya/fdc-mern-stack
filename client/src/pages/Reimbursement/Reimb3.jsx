import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Header from '../../Components/Header';
import './styles/Reimb3.css';

function Reimbursement3() {
  const navigate = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const applicationId = query.get('applicationId');

  const [formData, setFormData] = useState({
    registration_amount: '',
    ta_amount: '',
    da_amount: '',
    attachments: null
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      attachments: e.target.files[0]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const formPayload = new FormData();
      formPayload.append('application_id', applicationId);
      formPayload.append('registration_amount', formData.registration_amount);
      formPayload.append('ta_amount', formData.ta_amount);
      formPayload.append('da_amount', formData.da_amount);
      formPayload.append('attachments', formData.attachments);
      formPayload.append('status', 'pending');

      await axios.post('/api/reimbursements', formPayload, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        withCredentials: true
      });

      navigate('/reimbursement/4');
    } catch (err) {
      console.error("Error submitting reimbursement:", err);
    }
  };

  return (
    <div className="reimbursement-container">
      <Header />
      <div className="form-container">
        <h2>Expense Details</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Registration Amount (₹):</label>
            <input
              type="number"
              name="registration_amount"
              value={formData.registration_amount}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>TA Amount (₹):</label>
            <input
              type="number"
              name="ta_amount"
              value={formData.ta_amount}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>DA Amount (₹):</label>
            <input
              type="number"
              name="da_amount"
              value={formData.da_amount}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Attach Receipts:</label>
            <input
              type="file"
              name="attachments"
              onChange={handleFileChange}
              required
            />
          </div>

          <button type="submit" className="next-btn">
            Submit Reimbursement
          </button>
        </form>
      </div>
    </div>
  );
}

export default Reimbursement3;