import React from 'react'
import Header from '../../Components/Header';
import { useFormContext } from "../../layouts/FormContext";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

function ApplicationPDF() {
    const {  getFormData } = useFormContext();
    const navigate = useNavigate();
    const uniqueId = Date.now().toString();
    const formName = "fdcApplication";
    const formData = getFormData(formName);

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth(); // 0-indexed: Jan = 0, Dec = 11

// If between Jan (0) and June (5), use previousYear-currentYear
const academicYear =
  currentMonth <= 5
    ? `${currentYear - 1}-${currentYear}`
    : `${currentYear}-${currentYear + 1}`;

    const handleSubmit = async () => {
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
      
        form.append("load_adjustment_file", formData.load_adjustment_file);
        form.append("conference_brochure_file", formData.conference_brochure_file);
        if (formData.email_upload_file)
          form.append("email_upload_file", formData.email_upload_file);
      
        form.append("amount_claimed", "0");
        form.append("year", new Date().getFullYear().toString());
        form.append("total_ods", "0");
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
        }
      };

     

    const handlePrint = () => {
        const content = document.getElementById("print-section");
        const printWindow = window.open("", "_blank", "width=800,height=600");
      
        if (!printWindow) {
          alert("Popup blocked! Please allow popups for this website.");
          return;
        }
      
        printWindow.document.open();
        printWindow.document.write(`
          <html>
            <head>
              <title>fdc_application</title>
              <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
              <style>
                @page {
                    size: A4;
                    margin: 0;
                }

                body {
                    margin: 0;
                    padding: 0;
                    -webkit-print-color-adjust: exact !important;
                    print-color-adjust: exact !important;
                }

                .no-print {
                    display: none !important;
                }

                .avoid-break {
                    break-inside: avoid;
                    page-break-inside: avoid;
                }

                table, tr, td, th {
                    page-break-inside: avoid !important;
                    break-inside: avoid !important;
                    border: 1px solid;
                }
              </style>

            </head>
            <body class="font-sans">
              ${content.innerHTML}
            </body>
          </html>
        `);
        printWindow.document.close();
      
        printWindow.onload = () => {
          printWindow.focus();
          printWindow.print();
        };
      };
      

  return (
    <div className='w-full min-h-screen bg-[#e8e8e8] flex flex-col items-center'>
        <Header/>
        <div id="print-section">
            <div className="flex avoid-break w-full">
                <div className="w-[16px] h-auto" style={{ backgroundColor: "#B7202E", color:"#B7202E" }}>...</div>
                <div className="w-[778px] p-8 font-sans bg-white flex flex-col">
                    <div className='p-2 w-fit self-end mb-5 text-sm' style={{border: "1px solid"}}>
                        Application No. <span className='underline'>{uniqueId}</span> of {academicYear}
                    </div>
                    <div className=" text-center mb-6">
                        <h1 className="text-3xl font-bold">Somaiya Vidyavihar University</h1>
                        <h2 className="text-xl font-semibold">K J Somaiya College of Engineering</h2>
                        <p className="text-sm">
                        Application to Attend STTP/Symposium/Workshop/Conference/Seminar/NPTEL Course
                        </p>
                    </div>

                    <table className=" w-full border mb-4 border-collapse text-sm">
                        <tbody>
                        <tr>
                            <th className="border p-2 text-left" style={{ backgroundColor: "#E9ECEF" }}>Name</th>
                            <td className="border p-2">{formData.fname} {formData.lname}</td>
                            <th className="border p-2 text-left" style={{ backgroundColor: "#E9ECEF" }}>Date of Appointment</th>
                            <td className="border p-2" colSpan={3}>{formData.date_of_appointment}</td>
                        </tr>
                        <tr>
                            <th className="border p-2 text-left" style={{ backgroundColor: "#E9ECEF" }}>Emp. Code and Designation</th>
                            <td className="border p-2">{formData.designation}</td>
                            <th className="border p-2 text-left" style={{ backgroundColor: "#E9ECEF" }}>Department</th>
                            <td className="border p-2" >{formData.department}</td>
                            <th className="border p-2 text-left" style={{ backgroundColor: "#E9ECEF" }}>Date of Appointment <br/> of present post</th>
                            <td className="border p-2" >{formData.date_of_appointment}</td>
                        </tr>
                        </tbody>
                    </table>

                    <h3 className="font-semibold text-sm mb-2">
                        Details about STTP/Symposium/Workshop/Conference/Seminar/NPTEL Course
                    </h3>
                    <table className="table w-full border mb-4 border-collapse text-sm">
                        <tbody>
                        <tr>
                            <th className="border p-2 text-left" style={{ backgroundColor: "#E9ECEF" }}>
                            Title of STTP /Symposium /Workshop/Conference/NPTEL Course
                            </th>
                            <td className="border p-2" colSpan="3">{formData.purpose}</td>
                        </tr>
                        <tr>
                            <th className="border p-2 text-left" style={{ backgroundColor: "#E9ECEF" }}>Name and Address of Organizing Institution</th>
                            <td className="border p-2" colSpan="3">{formData.org_institution}</td>
                        </tr>
                        <tr>
                            <th className="border p-2 text-left" style={{ backgroundColor: "#E9ECEF" }}>Supporting Organization</th>
                            <td className="border p-2" colSpan="3">{formData.supporting_org}</td>
                        </tr>
                        <tr>
                            <th className="border p-2 text-left" style={{ backgroundColor: "#E9ECEF" }}>Date and Duration</th>
                            <td className="border p-2">From: {formData.duration_from}</td>
                            <td className="border p-2">To: {formData.duration_to}</td>
                            <td className="border p-2">Total No. of Days: {formData.total_days}</td>
                        </tr>
                        <tr>
                            <th className="border p-2 text-left" style={{ backgroundColor: "#E9ECEF" }}>Last Date of Registration</th>
                            <td className="border p-2" colSpan="3">Rs. {formData.registration_last_day}</td>
                        </tr>
                        <tr>
                            <th className="border p-2 text-left" style={{ backgroundColor: "#E9ECEF" }}>Registration Fee</th>
                            <td className="border p-2" colSpan="3">Rs. {formData.registration_fee}</td>
                        </tr>
                        <tr>
                            <th className="border p-2 text-left" style={{ backgroundColor: "#E9ECEF" }}>The Program is During</th>
                            <td className="border p-2" colSpan="3">{formData.vacation_period} Period</td>
                        </tr>
                        </tbody>
                    </table>

                    <h3 className="font-semibold text-sm mb-2">Details of FDC Facility Availed</h3>
                    <table className="table w-full border mb-4 border-collapse text-sm">
                        <tbody>
                        <tr>
                            <th className="border p-2 text-left" style={{ backgroundColor: "#E9ECEF" }}>Amount Claimed for Year</th>
                            <td className="border p-2">{new Date().getFullYear().toString()}: Rs 0</td>
                            <th className="border p-2 text-left" style={{ backgroundColor: "#E9ECEF" }}>ODs Availed</th>
                            <td className="border p-2">{new Date().getFullYear().toString()}: 0</td>
                        </tr>
                        </tbody>
                    </table>

                    <h3 className="font-semibold text-sm mb-2">Purpose/Scope of Attending</h3>
                    <p className="border p-2 mb-4 text-sm">{formData.purpose_scope}</p>

                    <div className="signature-section text-sm mt-2">
                        <div className="flex justify-between items-center">
                        <div>
                            <span className="font-semibold">Date:</span> ______________________
                        </div>
                        <div className="text-right">
                            <span className="font-semibold">Signature of Faculty/Staff:</span> ____________________
                        </div>
                        </div>
                    </div>

                    
                </div>
            </div>
        </div>

        <div className="mt-2 mb-2 no-print flex gap-4 justify-center">
                    <button
                    className="bg-[#B7202E] text-white px-6 py-2 rounded-4xl cursor-pointer"
                    onClick={handlePrint}
                    >
                    Print
                    </button>
                    <button
                    className="bg-gray-600 text-white px-6 py-2 rounded-4xl cursor-pointer"
                    onClick={handleSubmit}
                    > 
                    Submit
                    </button>
        </div>

    </div>
  );
}

export default ApplicationPDF;
