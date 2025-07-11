import React, { useEffect, useState } from "react";
import Header from "../../Components/Header";
import { useNavigate } from "react-router-dom";
import { useFormContext } from "../../layouts/FormContext";
import axios from "axios";

function ReimbursementPrincipal() {
  const navigate = useNavigate();
  const [isChecked, setIsChecked] = useState(false);

  const { updateFormData } = useFormContext();
  const formName = "fdcReimbursement";

  const [formData, setFormData] = useState({
    recipient_name: "",
    program_purpose: "",
    registrationAmount: "",
    ta: "",
    da: "",
    amountSanctioned: "",
    date: "",
  });

  useEffect(() => {
    const fetchReimbursementSummary = async () => {
      try {
        const res = await axios.get("http://localhost:4000/fdc/reimbursement-summary", {
          withCredentials: true,
        });
        setFormData({
          recipient_name: res.data.recipient_name || "",
          program_purpose: res.data.program_purpose || "",
          registrationAmount: res.data.registrationAmount || "",
          ta: res.data.ta || "",
          da: res.data.da || "",
          amountSanctioned: res.data.amountSanctioned || "",
          date: res.data.date?.slice(0, 10) || "",
        });
      } catch (err) {
        console.error("Error fetching reimbursement summary:", err);
      }
    };

    fetchReimbursementSummary();
  }, []);

  const handleSubmit = () => {
    if (!isChecked) {
      alert("Please confirm the details by checking the box.");
      return;
    }

    updateFormData(formName, formData);
    alert("Reimbursement form has been submitted successfully!");
    navigate("/home");
  };

  return (
    <div className="w-full h-full flex flex-col">
      <Header />
      <div className="w-full h-full flex flex-col justify-center items-center">
        <div className="bg-[#FAFAFA] rounded-3xl p-4 px-8 flex flex-col items-center font-inter">
          <h1 className="text-xl text-[#3D3D3D] font-medium mb-4">
            Approval by Principal to Disburse Expenses
          </h1>
          <form className="w-full text-[#7F7F7F] font-normal flex flex-col">
            <label className="mb-1">To, The Account's Department, Kindly disburse:</label>
            <input
              type="text"
              value=""
              className="w-full border rounded-lg p-2 bg-gray-100 mb-3"
              readOnly
            />

            <label className="mb-1">To Mr./Ms.:</label>
            <input
              type="text"
              value={formData.recipient_name}
              className="w-full border rounded-lg p-2 bg-gray-100 mb-3"
              readOnly
            />

            <label className="mb-1">In cash towards the registration fees paid for attending:</label>
            <input
              type="text"
              value={formData.program_purpose}
              className="w-full border rounded-lg p-2 bg-gray-100 mb-3"
              readOnly
            />

            <label className="mb-1">Amount paid for registration (₹):</label>
            <input
              type="number"
              value={formData.registrationAmount}
              className="w-full border rounded-lg p-2 bg-gray-100 mb-3"
              readOnly
            />

            <label className="mb-1">TA (₹):</label>
            <input
              type="number"
              value={formData.ta}
              className="w-full border rounded-lg p-2 bg-gray-100 mb-3"
              readOnly
            />

            <label className="mb-1">DA (₹):</label>
            <input
              type="number"
              value={formData.da}
              className="w-full border rounded-lg p-2 bg-gray-100 mb-3"
              readOnly
            />

            <label className="mb-1">Amount Sanctioned (₹):</label>
            <input
              type="number"
              value={formData.amountSanctioned}
              className="w-full border rounded-lg p-2 bg-gray-100 mb-3"
              readOnly
            />

            <label className="mb-1">Date:</label>
            <input
              type="date"
              value={formData.date}
              className="w-full border rounded-lg p-2 bg-gray-100 mb-6"
              readOnly
            />

            <p className="font-medium text-[#666666]">
              Check above details and click submit to finalize
            </p>
            <div className="flex items-center mb-4">
              <span className="font-light">I have checked the above details</span>
              <input
                type="checkbox"
                name="checked"
                id="checked"
                className="ml-2 accent-[#B7202E]"
                required
                checked={isChecked}
                onChange={(e) => setIsChecked(e.target.checked)}
              />
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              className="rounded-4xl bg-[#B7202E] text-white w-fit self-center p-2 px-40 cursor-pointer"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ReimbursementPrincipal;
