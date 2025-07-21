import React, { useState, useEffect } from "react";
import Header from "../../Components/Header";
import { useFormContext } from "../../context/FormContext";
import { useNavigate } from "react-router-dom";


function Application3() {
  const { updateFormData, getFormData } = useFormContext();
  const navigate = useNavigate();

  const formName = "fdcApplication";
  const formData = getFormData(formName);

  const [amountClaimedDate, setAmountClaimedDate] = useState("");
  const [totalOds, setTotalOds] = useState(0);

  const [loadAdjustmentFile, setLoadAdjustmentFile] = useState(null);
  const [conferenceBrochureFile, setConferenceBrochureFile] = useState(null);
  const [emailUploadFile, setEmailUploadFile] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      // yo gpt said to replace this with actual backend call, so figure out thanks
      const response = { amountClaimedDate: "", totalOds: 0 };
      setAmountClaimedDate(response.amountClaimedDate);
      setTotalOds(response.totalOds);
    };

    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    updateFormData(formName, {
      load_adjustment_file: loadAdjustmentFile,
      conference_brochure_file: conferenceBrochureFile,
      email_upload_file: emailUploadFile,
      purpose_scope: formData.purpose_scope || "",
    });

    navigate("/fdc-application/step-4")
  }

    return (
      <div className="w-full h-full flex flex-col">
        <Header />
        <div className="w-full h-full flex flex-col justify-center items-center">
          <div className="bg-[#FAFAFA] rounded-3xl p-4 px-8 flex flex-col items-center font-inter">
            <h1 className="text-xl text-[#3D3D3D] font-medium mb-4">
              Details of FDC Facility availed if any
            </h1>
            <form onSubmit={handleSubmit} className="w-full text-[#7F7F7F] font-normal flex flex-col">
              <label htmlFor="amount_claimed_date" className="">
                Amount claimed for year: *
              </label>
              <input
                type="date"
                name="amount_claimed_date"
                className="w-full border rounded-lg p-1 outline-none mt-1 mb-2 bg-gray-100 cursor-not-allowed"
                value={amountClaimedDate || ""}
                readOnly
              />

              <label htmlFor="total_ods" className="">
                Total ODs availed for the year: *
              </label>
              <input
                type="number"
                name="total_ods"
                className="w-full border rounded-lg p-1 outline-none mt-1 mb-2  bg-gray-100 cursor-not-allowed"
                value={totalOds || ""}
                readOnly
              />

              <label htmlFor="upload_load_adjustment">
                Upload Load adjustment sheet (.pdf, .docx, .doc): *
              </label>
              <a
                href="/templates/Load_Adjustment_Format.docx"
                download
                className="text-blue-600 underline text-sm mb-1"
              >
                Download Load Adjustment Sheet Format
              </a>
              <input
                type="file"
                name="upload_load_adjustment"
                onChange={(e) => setLoadAdjustmentFile(e.target.files[0])}
                required
                accept=".pdf,.doc,.docx"
                className="w-full border rounded-lg p-1 outline-none mt-1 mb-2"
              />

              <label htmlFor="upload_cb">Upload Conference brochure (.pdf, .docx, .doc): *</label>
              <input
                type="file"
                name="upload_cb"
                onChange={(e) => setConferenceBrochureFile(e.target.files[0])}
                required
                accept=".pdf,.doc,.docx"
                className="w-full border rounded-lg p-1 outline-none mt-1 mb-2"
              />

              <label htmlFor="upload_email">
                Upload email screenshot if high authority has mailed(jpeg, jpg, png)
              </label>
              <input
                type="file"
                name="upload_email"
                onChange={(e) => setEmailUploadFile(e.target.files[0])}
                accept=".jpeg, .png, .jpg"
                className="w-full border rounded-lg p-1 outline-none mt-1 mb-2"
              />

              <label htmlFor="purpose">
                Purpose/scope for attending the
                STTP/Symposium/workshop/conference/seminar: *
              </label>
              <input
                type="text"
                name="purpose"
                value={formData?.purpose_scope || ""}
                onChange={(e) => {
                  updateFormData(formName, { purpose_scope: e.target.value });
                }}
                className="w-full border rounded-lg p-1 outline-none mt-1 mb-2"
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
              onClick={() => navigate("/fdc-application/step-2")}
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
  };

export default Application3;
