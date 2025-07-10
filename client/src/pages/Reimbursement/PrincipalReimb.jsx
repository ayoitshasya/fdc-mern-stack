import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../../Components/Header';
import './styles/PrincipalReimb.css';

function PrincipalReimbursement() {
  const navigate = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const applicationId = query.get('id');

  const [formData, setFormData] = useState({
    registration_amount: 0,
    ta_amount: 0,
    da_amount: 0,
    date: new Date().toISOString().split('T')[0]
  });

  const [application, setApplication] = useState(null);
  const [employee, setEmployee] = useState(null);
  const [isApproved, setIsApproved] = useState(false);

  // Mock data fetch - replace with actual API calls
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const mockData = {
          application: {
            purpose: "International Conference on Computer Science",
            amount_sanctioned: 5000
          },
          employee: {
            fname: "John",
            lname: "Doe"
          }
        };
        
        setApplication(mockData.application);
        setEmployee(mockData.employee);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    
    fetchData();
  }, [applicationId]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate approval submission
    console.log("Approving reimbursement:", {
      applicationId,
      ...formData,
      total: formData.registration_amount + formData.ta_amount + formData.da_amount
    });
    
    setIsApproved(true);
    
    // Auto-redirect after 3 seconds (optional)
    setTimeout(() => navigate('/principal/dashboard'), 3000);
  };

  if (isApproved) {
    return (
      <div className="principal-reimbursement-container">
        <Header />
        <div className="card approval-success">
          <h2>Approval Successful!</h2>
          <p>The reimbursement has been processed.</p>
          <p>Total Amount: ₹{formData.registration_amount + formData.ta_amount + formData.da_amount}</p>
          <button 
            onClick={() => navigate('/principal/dashboard')}
            className="back-button"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="principal-reimbursement-container">
      <Header />
      <div className="card">
        <form onSubmit={handleSubmit}>
          <label id="lab">Approval by principal to disburse expenses</label>
          
          <div className="form-group">
            <label htmlFor="disburse_request">
              To,<br />
              The account's department,<br />
              Kindly disburse ₹ 
              <input 
                type="number" 
                value={formData.registration_amount + formData.ta_amount + formData.da_amount} 
                readOnly
              /> to Mr./Ms. 
              <input 
                type="text" 
                value={employee ? `${employee.fname} ${employee.lname}` : ''} 
                readOnly
              /> for attending 
              <input 
                type="text" 
                value={application?.purpose || ''} 
                readOnly
              />
            </label>
          </div>

          <table>
            <tbody>
              <tr>
                <td>Registration Amount:</td>
                <td>₹ <input 
                  type="number" 
                  name="registration_amount" 
                  value={formData.registration_amount}
                  onChange={handleChange}
                  min="0"
                  required
                /></td>
              </tr>
              <tr>
                <td>TA Amount:</td>
                <td>₹ <input 
                  type="number" 
                  name="ta_amount" 
                  value={formData.ta_amount}
                  onChange={handleChange}
                  min="0"
                /></td>
              </tr>
              <tr>
                <td>DA Amount:</td>
                <td>₹ <input 
                  type="number" 
                  name="da_amount" 
                  value={formData.da_amount}
                  onChange={handleChange}
                  min="0"
                /></td>
              </tr>
              <tr>
                <td>Total Sanctioned:</td>
                <td>₹ <input 
                  type="number" 
                  value={formData.registration_amount + formData.ta_amount + formData.da_amount} 
                  readOnly
                /></td>
              </tr>
            </tbody>
          </table>

          <div className="form-group">
            <label>Date:<span className="asterisk">*</span></label>
            <input 
              type="date" 
              name="date" 
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>

          <input type="hidden" name="application_id" value={applicationId} />
          <button type="submit" id="button">Approve Reimbursement</button>
        </form>
      </div>
    </div>
  );
}

export default PrincipalReimbursement;