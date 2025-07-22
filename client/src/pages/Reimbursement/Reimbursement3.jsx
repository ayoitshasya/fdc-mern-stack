import React, { useEffect, useState } from "react";
import Header from "../../Components/Header";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useFormContext } from "../../context/FormContext";

function Reimbursement3() {
  const navigate = useNavigate();
  const [isChecked, setIsChecked] = useState(false);
  const { updateFormData } = useFormContext();
  const formName = "fdcReimbursement";

  const [programData, setProgramData] = useState({
    institution: "",
    date_from: "",
    date_to: "",
    total_days: "",
    vacation_status: "",
    od_days: "",
  });

  const [formInputs, setFormInputs] = useState({
    registrationAmount: "",
    ta: "",
    da: "",
    amountSanctioned: "",
    attachment: null,
  });

  useEffect(() => {
    const fetchProgramDetails = async () => {
      try {
        const res = await axios.get("http://localhost:4000/fdc/reimbursement-details", {
          withCredentials: true,
        });
        setProgramData({
          institution: res.data.institution || "",
          date_from: res.data.date_from || "",
          date_to: res.data.date_to || "",
          total_days: res.data.total_days || "",
          vacation_status: res.data.vacation_status || "",
          od_days: res.data.od_days || "",
        });
      } catch (err) {
        console.error("Error fetching program details:", err);
      }
    };

    fetchProgramDetails();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormInputs((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleNext = () => {
    if (!isChecked) {
      alert("Please confirm the details by checking the box.");
      return;
    }
    updateFormData(formName, formInputs);
    navigate("/fdc-reimbursement/step-4");
  };

  return (
    <div className="w-full h-full flex flex-col">
      <Header />
      <div className="w-full h-full flex flex-col justify-center items-center">
        <div className="bg-[#FAFAFA] rounded-3xl p-4 px-8 flex flex-col items-center font-inter">
          <h1 className="text-xl text-[#3D3D3D] font-medium mb-4">
            Details to be filled for claiming reimbursement
          </h1>
          <form className="w-full text-[#7F7F7F] font-normal flex flex-col">

            <label className="mb-1">Name and address of organizing Institution of Workshop:</label>
            <input
              type="text"
              className="w-full border rounded-lg p-2 bg-gray-100 mb-3"
              value={programData.institution}
              readOnly
            />

            <label className="mb-1">Date and Duration of program attended from:</label>
            <div className="flex gap-4 mb-3">
              <input
                type="date"
                className="w-full border rounded-lg p-2 bg-gray-100"
                value={programData.date_from || ""}
                readOnly
              />
              <input
                type="date"
                className="w-full border rounded-lg p-2 bg-gray-100"
                value={programData.date_to || ""}
                readOnly
              />
            </div>

            <label className="mb-1">Total number of days:</label>
            <input
              type="text"
              className="w-full border rounded-lg p-2 bg-gray-100 mb-3"
              value={programData.total_days}
              readOnly
            />

            <label className="mb-1">The program is during Vacation/Non-vacation period:</label>
            <input
              type="text"
              className="w-full border rounded-lg p-2 bg-gray-100 mb-3"
              value={programData.vacation_status}
              readOnly
            />

            <label className="mb-1">No. of days OD was sanctioned:</label>
            <input
              type="text"
              className="w-full border rounded-lg p-2 bg-gray-100 mb-6"
              value={programData.od_days}
              readOnly
            />

            {/* Editable Numeric Fields */}
            <label className="mb-1">Amount paid for registration (₹):</label>
            <input
              type="number"
              name="registrationAmount"
              className="w-full border rounded-lg p-2 mb-3"
              value={formInputs.registrationAmount}
              onChange={handleInputChange}
              min="0"
            />

            <label className="mb-1">TA (₹):</label>
            <input
              type="number"
              name="ta"
              className="w-full border rounded-lg p-2 mb-3"
              value={formInputs.ta}
              onChange={handleInputChange}
              min="0"
            />

            <label className="mb-1">DA (₹):</label>
            <input
              type="number"
              name="da"
              className="w-full border rounded-lg p-2 mb-3"
              value={formInputs.da}
              onChange={handleInputChange}
              min="0"
            />

            <label className="mb-1">Amount sanctioned (₹):</label>
            <input
              type="number"
              name="amountSanctioned"
              className="w-full border rounded-lg p-2 mb-6"
              value={formInputs.amountSanctioned}
              onChange={handleInputChange}
              min="0"
            />

            {/* File Upload */}
            <label className="mb-1">
              Attach Zip file of original receipt and xerox copy of certificate/attendance certificate if any:
            </label>
            <input
              type="file"
              name="attachment"
              accept=".pdf, .doc, .docx, .png, .jpeg, .jpg"
              className="w-full border rounded-lg p-2 mb-6"
              onChange={handleInputChange}
            />

            <p className="font-medium text-[#666666]">
              Check above details and click next to proceed further
            </p>
            <div className="flex items-center mb-4">
              <span className="font-light">
                I have checked the above details
              </span>
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

            <div className="flex justify-center gap-4 mt-2">
            <button
                type="button"
                onClick={() => navigate("/fdc-reimbursement/step-2")}
                className="rounded-4xl bg-gray-400 text-white px-40 py-2 cursor-pointer"
            >
              Back
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="rounded-4xl bg-[#B7202E] text-white w-fit self-center p-2 px-40 cursor-pointer"
            >
              Next
            </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Reimbursement3;
