import React, { useEffect, useState } from "react";
import Header from "../../Components/Header";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

function ReimbursementFDC() {
  const navigate = useNavigate();
  const [isChecked, setIsChecked] = useState(false);

  // form & application can be null while loading
  const [form, setForm] = useState(null);
  const [application, setApplication] = useState(null);

  // loading / error states
  const [formLoading, setFormLoading] = useState(false);
  const [appLoading, setAppLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [appError, setAppError] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);

  const { id } = useParams();

  useEffect(() => {
    if (!id) {
      setFormError("Missing reimbursement id");
      return;
    }

    const controller = new AbortController();
    const signal = controller.signal;

    const fetchReimbursement = async () => {
      setFormLoading(true);
      setFormError("");
      try {
        const response = await fetch(
          "http://localhost:4000/reimbursement/fetch-reimbursement-by-id",
          {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ reimbursement_id: id }),
            signal,
          }
        );

        if (!response.ok) {
          const text = await response.text().catch(() => "");
          throw new Error(
            `Fetch failed (${response.status}) ${response.statusText} ${text}`
          );
        }

        const data = await response.json();
        setForm(data ?? null);
      } catch (err) {
        if (err.name === "AbortError") {
          // fetch cancelled
          return;
        }
        console.error("Error in fetching reimbursement form:", err);
        setFormError(err.message || "Failed to fetch reimbursement form");
        setForm(null);
      } finally {
        setFormLoading(false);
      }
    };

    fetchReimbursement();

    return () => controller.abort();
  }, [id]);

  useEffect(() => {
    // If there is no form or no application_id, reset application states
    if (!form || !form.application_id) {
      setApplication(null);
      setAppError("");
      return;
    }

    const controller = new AbortController();
    const signal = controller.signal;

    const fetchApplication = async () => {
      setAppLoading(true);
      setAppError("");
      try {
        const response = await fetch(
          "http://localhost:4000/application/fetch-application-by-id",
          {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ application_id: form.application_id }),
            signal,
          }
        );

        if (!response.ok) {
          const text = await response.text().catch(() => "");
          throw new Error(
            `Fetch failed (${response.status}) ${response.statusText} ${text}`
          );
        }

        const data = await response.json();
        setApplication(data ?? null);
      } catch (err) {
        if (err.name === "AbortError") return;
        console.error("Error in fetchApplication:", err);
        setAppError(err.message || "Failed to fetch application");
        setApplication(null);
      } finally {
        setAppLoading(false);
      }
    };

    fetchApplication();

    return () => controller.abort();
  }, [form]);



  // Defensive date formatter that returns '' for invalid dates
  const formatDate = (d) => {
    try {
      const date = new Date(d);
      if (Number.isNaN(date.getTime())) return "";
      const yyyy = date.getFullYear();
      const mm = String(date.getMonth() + 1).padStart(2, "0");
      const dd = String(date.getDate()).padStart(2, "0");
      return `${yyyy}-${mm}-${dd}`;
    } catch (err) {
      return "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitLoading(true);
      if(!isChecked){
        toast.error("Enter All Required Fields.")
        setSubmitLoading(false)
        return;
      }

      else{
        let stat = "approve";
        console.log("Payload:", {
          reimbursementId: id,
          status: stat,
        });
        
        const response = await fetch('http://localhost:4000/reimbursement/reimbursement-review', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        
        body: JSON.stringify({ reimbursementId: id, status:stat}),
        });

        setSubmitLoading(false);
        if (!response.ok) {
          console.error("Fetch failed with status:", response.status);
          toast.error("Error reviewing form");
          return;
        }
        else{
          navigate('/reimbursement/Status')
        }
        
      }
      
    } catch (err) {
      console.error("Error in fetchReimbursement:", err);
      toast.error("Error reviewing reimbursement form");
    }
  }

  

  // Small helpers for safe values
  const getSubmittedName = () => {
    const fname = form?.submitted_by?.fname ?? "";
    const lname = form?.submitted_by?.lname ?? "";
    return (fname || lname) ? `${fname} ${lname}`.trim() : "";
  };

  const safeText = (val) => (val ?? "") === null ? "" : String(val ?? "");

  const safeNumber = (val) => {
    const n = val ?? "";
    // if null/undefined return empty string so input shows blank
    return n === null ? "" : String(n ?? "");
  };

  return (
    <div className="w-full h-full flex flex-col">
      <Header />
      <div className="w-full h-full flex flex-col justify-center items-center">
        <div className="bg-[#FAFAFA] rounded-3xl p-4 px-8 flex flex-col items-center font-inter w-full max-w-2xl">
          <h1 className="text-xl text-[#3D3D3D] font-medium mb-4">
            Approval by FDC to Disburse Expenses
          </h1>

          {/* Error / Loading notices */}
          {formLoading && <p className="text-sm text-gray-500">Loading form…</p>}
          {formError && <p className="text-sm text-red-600">Error: {formError}</p>}
          {appLoading && <p className="text-sm text-gray-500">Loading application…</p>}
          {appError && <p className="text-sm text-red-600">Error: {appError}</p>}

          <form className="w-full text-[#7F7F7F] font-normal flex flex-col" onSubmit={(e) => e.preventDefault()}>
            <label className="mb-1">To, The Account's Department, Kindly disburse:</label>
            <input
              type="text"
              value={safeText("")}
              className="w-full border rounded-lg p-2 bg-gray-100 mb-3"
              readOnly
            />

            <label className="mb-1">To Mr./Ms.:</label>
            <input
              type="text"
              value={getSubmittedName()}
              className="w-full border rounded-lg p-2 bg-gray-100 mb-3"
              readOnly
            />

            <label className="mb-1">In cash towards the registration fees paid for attending:</label>
            <input
              type="text"
              value={safeText(application?.purpose)}
              className="w-full border rounded-lg p-2 bg-gray-100 mb-3"
              readOnly
            />

            <label className="mb-1">Amount paid for registration (₹):</label>
            <input
              type="number"
              value={safeNumber(form?.registration_amount)}
              className="w-full border rounded-lg p-2 bg-gray-100 mb-3"
              readOnly
            />

            <label className="mb-1">TA (₹):</label>
            <input
              type="number"
              value={safeNumber(form?.ta_amount)}
              className="w-full border rounded-lg p-2 bg-gray-100 mb-3"
              readOnly
            />

            <label className="mb-1">DA (₹):</label>
            <input
              type="number"
              value={safeNumber(form?.da_amount)}
              className="w-full border rounded-lg p-2 bg-gray-100 mb-3"
              readOnly
            />

            <label className="mb-1">Amount Sanctioned (₹):</label>
            <input
              type="number"
              value={safeNumber(application?.amount_sanctioned ?? "")}
              className="w-full border rounded-lg p-2 bg-gray-100 mb-3"
              readOnly
            />

            <label className="mb-1">Date:</label>
            <input
              type="date"
              // prefer form date if present, else use createdAt or today as fallback
              value={
                formatDate(Date.now()) || ""
              }
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
                disabled={formLoading || appLoading}
              />
            </div>

            <div className='flex justify-center gap-4 mt-2'>
              <button
                type="button"
                onClick={() => navigate(" ")} // ye route replace karna FDC status page se
                className="rounded-4xl bg-gray-400 text-white px-40 py-2 cursor-pointer"
              >
                Back
              </button>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={
                submitLoading ||
                formLoading ||
                appLoading ||
                !!formError ||
                !!appError ||
                !form // require form to exist
              }
              className={`rounded-4xl bg-[#B7202E] text-white w-fit self-center p-2 px-40 cursor-pointer disabled:opacity-60`}
            >
              {submitLoading ? "Submitting…" : "Submit"}
            </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ReimbursementFDC;
