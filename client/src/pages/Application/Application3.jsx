import React, { useState, useEffect } from "react";
import Header from "../../Components/Header";
import { useFormContext } from "../../layouts/FormContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Application3() {
  const { formReady, updateFormData, getFormData } = useFormContext();
  const navigate = useNavigate();

  const formName = "fdcApplication";
  const formData = getFormData(formName);
  console.log(formData);

  const [amountClaimedDate, setAmountClaimedDate] = useState("");
  const [totalOds, setTotalOds] = useState(0);

  const [loadAdjustmentFile, setLoadAdjustmentFile] = useState(null);
  const [conferenceBrochureFile, setConferenceBrochureFile] = useState(null);
  const [emailUploadFile, setEmailUploadFile] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      // yo gpt said to replace this with actual backend call, so figure out thanks
      const response = { amountClaimedDate: "", totalOds: "" };
      setAmountClaimedDate(response.amountClaimedDate);
      setTotalOds(response.totalOds);
    };

    fetchData();
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData();
    form.append("purpose", formData.purpose);
    form.append("org_institution", formData.org_institution);
    form.append("supporting_org", formData.supporting_org);
    form.append("duration_from", formData.duration_from);
    form.append("duration_to", formData.duration_to);
    form.append("total_days", formData.total_days);
    form.append("registration_last_day", formData.registration_last_day);
    form.append("registration_fee", formData.registration_fee);
    form.append("vacation_period", formData.vacation_period);
    form.append("ods_required", formData.ods_required);

    form.append("load_adjustment_file", loadAdjustmentFile);
    form.append("conference_brochure_file", conferenceBrochureFile);
    if (emailUploadFile) form.append("email_upload_file", emailUploadFile);

    form.append("amount_claimed", "0"); // Adjust if needed
    form.append("year", new Date().getFullYear().toString());
    form.append("total_ods", "0"); // Adjust if needed
    form.append("od_year", new Date().getFullYear().toString());
    form.append("purpose_scope", formData.purpose_scope || "");

    try {
      const res = await axios.post(
        "http://localhost:4000/application/submit-form",
        form,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("Application submitted successfully!");
      navigate("/home");
    } catch (err) {
      console.error("Submission error:", err);
      alert("Something went wrong while submitting the application.");
    }}

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

              <label htmlFor="upload_cb">Upload Conference brochure *</label>
              <input
                type="file"
                name="upload_cb"
                onChange={(e) => setConferenceBrochureFile(e.target.files[0])}
                required
                accept=".pdf,.doc,.docx"
                className="w-full border rounded-lg p-1 outline-none mt-1 mb-2"
              />

              <label htmlFor="upload_email">
                Upload email if high authority has mailed(jpeg, jpg, png, .pdf,
                .docx)
              </label>
              <input
                type="file"
                name="upload_email"
                onChange={(e) => setEmailUploadFile(e.target.files[0])}
                accept=".jpeg, .png, .jpg, .pdf,.doc,.docx"
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

              <button type="submit" className="rounded-4xl bg-[#B7202E] text-white w-fit self-center p-2 px-40 cursor-pointer">
                Next
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  };

export default Application3;
