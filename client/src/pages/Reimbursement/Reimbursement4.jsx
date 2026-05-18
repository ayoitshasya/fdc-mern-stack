import React, { useEffect, useState } from "react";
import Header from "../../Components/Header";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useFormContext } from "../../context/FormContext";
import toast from "react-hot-toast";

function Reimbursement4() {
  const navigate = useNavigate();
  const [isChecked, setIsChecked] = useState(false);
  const { updateFormData, getFormData } = useFormContext();
  const formName = "fdcReimbursement";
  const formData = getFormData(formName);

  // store only the id string
  const [userId, setUserId] = useState("");

  const [fdcData, setFdcData] = useState({
    amount_claimed: "",
    total_od_availed: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("http://localhost:4000/auth/profile", {
          withCredentials: true,
        });

        // set the id string (previous code set res.data.e_id to an object incorrectly)
        setUserId(res.data?.e_id || "");
      } catch (err) {
        console.error("Error fetching user profile:", err);
      }
    };

    fetchProfile();
  }, []);

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

  // renamed from handleSubmit -> handleNext since we're not submitting to server here
  const handleNext = () => {
    if (!isChecked) {
      toast.error("Please confirm the details by checking the box.");
      return;
    }

    // Merge existing formData (from previous steps) with the fetched fdcData
    // and add submitted_by/userId so final submit can use it later.
    // If there are conflicting keys, fdcData will override.
    const combined = {
      ...formData,
      ...fdcData,
      submitted_by: userId,
    };

    // Update the form context so the reimbursement form contains the FDC info too
    updateFormData(formName, combined);

    // Navigate to the next step (change route if you have a different path)
    navigate("/fdc-reimbursement/step-5");
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

            <div className="flex justify-center gap-4 mt-2">
            <button
                type="button"
                onClick={() => navigate("/fdc-reimbursement/step-3")}
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

export default Reimbursement4;
