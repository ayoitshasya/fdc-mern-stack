import React, { useState, useEffect } from "react";
import Header from "../../Components/Header";
import { useFormContext } from "../../context/FormContext";
import { useNavigate } from "react-router-dom";

function Application2() {
  const { formReady, updateFormData, getFormData } = useFormContext();
  const navigate = useNavigate();

  const formName = "fdcApplication";
  const formData = getFormData(formName);

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [numberOfDays, setNumberOfDays] = useState("");
  const [selectedPurpose, setSelectedPurpose] = useState("")
  const [customPurpose, setCustomPurpose] = useState("")

  useEffect(() => {
    if (fromDate && toDate) {
      const start = new Date(fromDate);
      const end = new Date(toDate);
      const diffTime = end.getTime() - start.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
      if (diffDays > 0) {
        setNumberOfDays(diffDays);
        updateFormData(formName, { total_days: diffDays });
      } else {
        setNumberOfDays("");
      }
    } else {
      setNumberOfDays("");
    }
  }, [fromDate, toDate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/fdc-application/step-3");
  };

  if (!formReady) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full h-full flex flex-col">
      <Header />
      <div className="w-full h-full flex flex-col items-center p-4">
        <div className="bg-[#FAFAFA] rounded-3xl p-4 px-8 flex flex-col items-center font-inter">
          <h1 className="text-xl text-[#3D3D3D] font-medium mb-4">
            Details about STTPS/Symposium/Workshop/Conference/Seminar/NPTEL
            Course
          </h1>
          <form onSubmit={handleSubmit} className="w-full text-[#7F7F7F] font-normal flex flex-col">
            <label htmlFor="purpose" className="">
              Select purpose for FDC: *
            </label>
            <select
              name="purpose"
              className="w-full border rounded-lg p-1 outline-none mt-1 mb-2"
              value={formData?.purpose || ""}
              required
              onChange={(e) => {
                const value = e.target.value;
                setSelectedPurpose(value); // ✅ update local state
                updateFormData(formName, { purpose: value }); // ✅ update context
              }}
            >
              <option value="" disabled>
                Select option
              </option>
              <option value="STTP">STTP</option>
              <option value="Symposium">Symposium</option>
              <option value="Workshop">Workshop</option>
              <option value="National Conference">National Conference</option>
              <option value="International Conference">
                International Conference
              </option>
              <option value="NPTEL Course">NPTEL Course</option>
              <option value="FDP">FDP</option>
              <option value="Summit">Summit</option>
              <option value="Others">Others</option>
            </select>

          {selectedPurpose === 'Others' && (
            <>
              <label htmlFor="customPurpose">Please specify the purpose: *</label>
              <input type="text" name="customPurpose" className="w-full border rounded-lg p-1 outline-none mt-1 mb-2" value={customPurpose} onChange={(e) => setCustomPurpose(e.target.value)} placeholder="Enter your custom purpose"/>
            </>
          )}

            <label htmlFor="name_of_organising_institution" className="">
              Name and address of organising Institution: *
            </label>
            <input
              type="text"
              name="name_of_organising_institution"
              value={formData?.org_institution || ""}
              className="w-full border rounded-lg p-1 outline-none mt-1 mb-2"
              required
              onChange={(e) => {
                updateFormData(formName, { org_institution: e.target.value });
              }}
            />

            <label htmlFor="others">
              Other supporting organization worth mentioning (e.g., EEE/SAE
              etc): *
            </label>
            <input
              type="text"
              name="others"
              value={formData?.supporting_org || ""}
              className="w-full border rounded-lg p-1 outline-none mt-1 mb-2"
              placeholder="If none, enter 'NA'"
              required
              onChange={(e) => {
                updateFormData(formName, { supporting_org: e.target.value });
              }}
            />

            <label htmlFor="date_and_duration_from">
              Date and duration from: *
            </label>
            <div className="flex gap-4 mt-1 mb-2">
              <input
                type="date"
                name="date_and_duration_from"
                className="w-full border rounded-lg p-1 outline-none"
                value={fromDate}
                onChange={(e) => {
                  setFromDate(e.target.value);
                  updateFormData(formName, { duration_from: e.target.value });
                }}
                placeholder="From"
                required
              />
              <input
                type="date"
                name="date_and_duration_to"
                className="w-full border rounded-lg p-1 outline-none"
                value={toDate}
                onChange={(e) => {
                  setToDate(e.target.value);
                  updateFormData(formName, { duration_to: e.target.value });
                }}
                placeholder="To"
                min={fromDate}
                required
              />
            </div>

            <label htmlFor="number_of_days">Total number of days: *</label>
            <input
              type="text"
              name="number_of_days"
              className="w-full border rounded-lg p-1 outline-none mt-1 mb-2"
              value={numberOfDays}
              readOnly
            />

            <label htmlFor="last_day">Last day of registration: *</label>
            <input
              type="date"
              name="last_day"
              value={formData?.registration_last_day || ""}
              className="w-full border rounded-lg p-1 outline-none mt-1 mb-2"
              required
              max={fromDate}
              onChange={(e) => {
                updateFormData(formName, {
                  registration_last_day: e.target.value,
                });
              }}
            />

            <label htmlFor="registration_fee">Registration Fee: *</label>
            <div className="relative mt-1 mb-2">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                ₹
              </span>
              <input
                type="number"
                name="registration_fee"
                value={formData?.registration_fee || ""}
                placeholder="Enter registration fee"
                className="w-full border rounded-lg p-1 pl-7 outline-none"
                min="0"
                step="1"
                required
                onChange={(e) => {
                  updateFormData(formName, {
                    registration_fee: e.target.value,
                  });
                }}
              />
            </div>

            <label htmlFor="vacation_non_vacation">
              The program is during: *
            </label>
            <select
              name="vacation_non_vacation"
              value={formData?.vacation_period || ""}
              className="w-full border rounded-lg p-1 outline-none mt-1 mb-2"
              required
              onChange={(e) => {
                updateFormData(formName, {
                  vacation_period: e.target.value,
                });
              }}
            >
              <option value="" disabled>
                Select option
              </option>
              <option value="Vacation">Vacation</option>
              <option value="Non-vacation">Non-vacation</option>
            </select>

            <label htmlFor="ods_required">No. of ODs required: *</label>
            <input
              type="number"
              name="ods_required"
              value={formData?.ods_required || ""}
              className="w-full border rounded-lg p-1 outline-none mt-1 mb-2"
              min="0"
              max="7"
              required
              onChange={(e) => {
                updateFormData(formName, { ods_required: e.target.value });
              }}
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
              />
            </div>
            
            <div className="flex justify-center gap-4 mt-3.5">
            <button
              type="button"
              onClick={() => navigate("/fdc-application/step-1")}
              className="rounded-4xl bg-gray-400 text-white px-40 py-2 cursor-pointer"
            >
            Back
            </button>
            
            <button
              type="submit"
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

export default Application2;
