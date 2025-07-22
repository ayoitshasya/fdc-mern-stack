import React, { useEffect, useState } from "react";
import Header from "../../Components/Header";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Reimbursement2() {
  const [approvedApplications, setApprovedApplications] = useState([]);
  const [selectedAppId, setSelectedAppId] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApprovedApplications = async () => {
      try {
        const res = await axios.get("http://localhost:4000/fdc/approved", {
          withCredentials: true,
        });

        setApprovedApplications(res.data); // Make sure res.data is an array of approved apps (gpt baba ne bola)
      } catch (err) {
        console.error("Error fetching approved applications:", err);
      }
    };

    fetchApprovedApplications();
  }, []);

  const handleNext = () => {
    if (!selectedAppId) {
      alert("Please select an approved application to proceed.");
      return;
    }

    // handle storing the selected application if needed
    console.log("Selected Application ID:", selectedAppId);
    // navigate or update context here if needed
  };

  return (
    <div className="w-full h-full flex flex-col">
      <Header />
      <div className="w-full h-full flex flex-col justify-center items-center">
        <div className="bg-[#FAFAFA] rounded-3xl p-6 px-8 flex flex-col items-center font-inter w-full max-w-xl shadow-md">
          <h1 className="text-xl text-[#3D3D3D] font-medium mb-6">
            Select the approved application box
          </h1>

          <label className="mb-2 text-[#3D3D3D] font-medium w-full text-left">
            Approved Application: *
          </label>
          <select
            className="w-full border rounded-lg p-2 outline-none mb-6 bg-white text-[#3D3D3D]"
            value={selectedAppId}
            onChange={(e) => setSelectedAppId(e.target.value)}
          >
            <option value="" disabled>Select an approved application</option>
            {approvedApplications.map((app) => (
              <option key={app._id} value={app._id}>
                {app.title || `Application #${app._id}`}
              </option>
            ))}
          </select>

          <div className="flex justify-center gap-4 mt-2">
            <button
                type="button"
                onClick={() => navigate("/fdc-reimbursement/step-1")}
                className="rounded-4xl bg-gray-400 text-white px-25 py-2 cursor-pointer"
            >
              Back
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="rounded-4xl bg-[#B7202E] text-white w-fit self-center p-2 px-25 cursor-pointer"
            >
              Next
            </button>
            </div>
        </div>
      </div>
    </div>
  );
}

export default Reimbursement2;
