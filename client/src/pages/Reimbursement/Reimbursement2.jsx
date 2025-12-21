import React, { useEffect, useState } from "react";
import Header from "../../Components/Header";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useFormContext } from "../../context/FormContext";

function Reimbursement2() {
  const { formReady, updateFormData, getFormData } = useFormContext();
  const navigate = useNavigate();

  const formName = "fdcReimbursement";
  const formData = getFormData(formName);


  const [approvedApplications, setApprovedApplications] = useState([]);
  const [selectedAppId, setSelectedAppId] = useState("");

  useEffect(() => {
    const fetchApprovedApplications = async () => {
      try {
        const res = await axios.get("http://localhost:4000/application/fetch-applications", {
          withCredentials: true,
        });
        console.log(res.data.applications)
        const apps = res.data.applications.filter((app)=> app.status === "approved-by-fdc")
        setApprovedApplications(apps); 
      } catch (err) {
        console.error("Error fetching approved applications:", err);
      }
    };

    fetchApprovedApplications();
  }, []);

  const handleNext = (e) => {
    if (!selectedAppId) {
      alert("Please select an approved application to proceed.");
      return;
    }

    e.preventDefault();
    navigate("/fdc-reimbursement/step-3")
  };

  if (!formReady) {
    return <div>Loading...</div>;
  }

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
            onChange={(e) => {
              setSelectedAppId(e.target.value);  
              updateFormData(formName, {application_id: e.target.value});  
            }}
          >
            <option value="" disabled>Select an approved application</option>
            {(approvedApplications.length > 0) ? 
            approvedApplications.map((app) => (
              <option key={app._id} value={app._id}>
                {app.purpose + ` Application #${app._id}`} 
              </option>
            ))
            :
              <>
              </>
            }
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
