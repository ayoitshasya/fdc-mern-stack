import React, { useEffect, useState } from "react";
import Header from "../../Components/Header";
import axios from "axios";
import { useFormContext } from "../../layouts/FormContext";

function Reimbursement4() {
  const [isChecked, setIsChecked] = useState(false);
  const { updateFormData } = useFormContext();
  const formName = "fdcReimbursement";

  const [fdcData, setFdcData] = useState({
    amount_claimed: "",
    total_od_availed: "",
  });

  useEffect(() => {
    const fetchFdcSummary = async () => {
      try {
        const res = await axios.get("http://localhost:4000/fdc/summary", {
          withCredentials: true,
        });
        setFdcData({
          amount_claimed: res.data.amount_claimed || "",
          total_od_availed: res.data.total_od_availed || "",
        });
      } catch (err) {
        console.error("Error fetching FDC summary:", err);
      }
    };

    fetchFdcSummary();
  }, []);

  const handleSubmit = async () => {
    if (!isChecked) {
      alert("Please confirm the details by checking the box.");
      return;
    }

    try {
      updateFormData(formName, fdcData);

      // Optionally post to backend:
      await axios.post("http://localhost:4000/fdc/submit", fdcData, {
        withCredentials: true,
      });

      alert("Your reimbursement form has been submitted successfully!");
    } catch (error) {
      console.error("Submission error:", error);
      alert("Something went wrong while submitting the form. Please try again.");
    }
  };

  return (
    <div className="w-full h-full flex flex-col">
      <Header />
      <div className="w-full h-full flex flex-col justify-center items-center">
        <div className="bg-[#FAFAFA] rounded-3xl p-4 px-8 flex flex-col items-center font-inter">
          <h1 className="text-xl text-[#3D3D3D] font-medium mb-4">
            Details of FDC facility availed, if any
          </h1>
          <form className="w-full text-[#7F7F7F] font-normal flex flex-col">

            <label className="mb-1">Amount claimed for the year (₹):</label>
            <input
              type="text"
              className="w-full border rounded-lg p-2 bg-gray-100 mb-4"
              value={fdcData.amount_claimed}
              readOnly
            />

            <label className="mb-1">Total ODs availed for the year:</label>
            <input
              type="text"
              className="w-full border rounded-lg p-2 bg-gray-100 mb-6"
              value={fdcData.total_od_availed}
              readOnly
            />

            <p className="font-medium text-[#666666]">
              Check above details and click submit to complete the form
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

export default Reimbursement4;
