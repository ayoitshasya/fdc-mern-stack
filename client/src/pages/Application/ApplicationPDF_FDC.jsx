import React, { useEffect, useState } from 'react'
import Header from '../../Components/Header';
import { useNavigate, useParams } from "react-router-dom";
import toast from 'react-hot-toast';
import { API_BASE } from "../../config";


function ApplicationPDF_FDC() {
    const navigate = useNavigate();
    const uniqueId = Date.now().toString();
    const [application, setApplication] = useState(null)
    const { id } = useParams();
 
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth(); // 0-indexed: Jan = 0, Dec = 11

// If between Jan (0) and June (5), use previousYear-currentYear
const academicYear =
  currentMonth <= 5
    ? `${currentYear - 1}-${currentYear}`
    : `${currentYear}-${currentYear + 1}`;


    useEffect(() => {
        const fetchApplication = async () => {
          try {
            console.log("Sending fetch request with ID:", id);
            const response = await fetch(`${API_BASE}/application/fetch-application-by-id`, {
              method: 'POST',
              credentials: 'include',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ application_id: id }),
            });
      
      
            if (!response.ok) {
              console.error("Fetch failed with status:", response.status);
              return;
            }
      
            const data = await response.json();
            setApplication(data);
            console.log(data)
          } catch (err) {
            console.error("Error in fetchApplication:", err);
          }
        };
      
        fetchApplication();
      }, []);
      
      
      const formatDate = d => {
        const date = new Date(d);
        return `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth()+1).toString().padStart(2, '0')}-${date.getFullYear()}`;
      };

    const handlePrint = () => {
        const content = document.getElementById("print-section");
        const printWindow = window.open("", "_blank", "width=800,height=600");
      
        if (!printWindow) {
          toast.error("Popup blocked! Please allow popups for this website.");
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


        {application ? (
        <>
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
                            <td className="border p-2">{application.submitted_by.fname} {application.submitted_by.lname}</td>
                            <th className="border p-2 text-left" style={{ backgroundColor: "#E9ECEF" }}>Date of Appointment</th>
                            <td className="border p-2" colSpan={3}>{formatDate(application.submitted_by.date_of_appointment)}</td>
                        </tr>
                        <tr>
                            <th className="border p-2 text-left" style={{ backgroundColor: "#E9ECEF" }}>Emp. Code and Designation</th>
                            <td className="border p-2">{application.submitted_by.designation}</td>
                            <th className="border p-2 text-left" style={{ backgroundColor: "#E9ECEF" }}>Department</th>
                            <td className="border p-2" >{application.submitted_by.department}</td>
                            <th className="border p-2 text-left" style={{ backgroundColor: "#E9ECEF" }}>Date of Appointment <br/> of present post</th>
                            <td className="border p-2" >{formatDate(application.submitted_by.present_appointment)}</td>
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
                            <td className="border p-2" colSpan="3">{application.purpose}</td>
                        </tr>
                        <tr>
                            <th className="border p-2 text-left" style={{ backgroundColor: "#E9ECEF" }}>Name and Address of Organizing Institution</th>
                            <td className="border p-2" colSpan="3">{application.org_institution}</td>
                        </tr>
                        <tr>
                            <th className="border p-2 text-left" style={{ backgroundColor: "#E9ECEF" }}>Supporting Organization</th>
                            <td className="border p-2" colSpan="3">{application.supporting_org}</td>
                        </tr>
                        <tr>
                            <th className="border p-2 text-left" style={{ backgroundColor: "#E9ECEF" }}>Date and Duration</th>
                            <td className="border p-2">From: {formatDate(application.duration_from)}</td>
                            <td className="border p-2">To: {formatDate(application.duration_to)}</td>
                            <td className="border p-2">Total No. of Days: {application.total_days}</td>
                        </tr>
                        <tr>
                            <th className="border p-2 text-left" style={{ backgroundColor: "#E9ECEF" }}>Last Date of Registration</th>
                            <td className="border p-2" colSpan="3">{formatDate(application.registration_last_day)}</td>
                        </tr>
                        <tr>
                            <th className="border p-2 text-left" style={{ backgroundColor: "#E9ECEF" }}>Registration Fee</th>
                            <td className="border p-2" colSpan="3">Rs. {application.registration_fee}</td>
                        </tr>
                        <tr>
                            <th className="border p-2 text-left" style={{ backgroundColor: "#E9ECEF" }}>The Program is During</th>
                            <td className="border p-2" colSpan="3">{application.vacation_period} Period</td>
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
                    <p className="border p-2 mb-4 text-sm">{application.purpose_scope}</p>

                    <h3 className="font-semibold text-sm mb-2">HOD Remarks</h3>
                    <p className="border p-2 mb-4 text-sm">{application.HOD_reason}</p>

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
        
        <div className='flex mt-2 gap-2 bg-white p-2'>
            <a className="rounded-3xl  bg-gray-300 text-[#b7202e] font-medium p-2 px-4" href={application.load_adjustment_path}>Download Load Adjustment File</a>
            <a className="rounded-3xl  bg-gray-300 text-[#b7202e] font-medium p-2 px-4" href={application.conference_brochure_path}>Download Conference Brochure File</a>
            {application.email_upload_path &&
            <a className="rounded-3xl  bg-gray-300 text-[#b7202e] font-medium p-2 px-4" href={application.email_upload_path}>Download Email Screenshot</a>
            }
        </div>
        
        </>
        ) : (
            <>
            </>
        )}

        
                    
        <div className="mt-4 mb-2 no-print flex gap-4 justify-center">
                    <button
                    className="bg-gray-400 text-white px-8 py-2 rounded-4xl cursor-pointer"
                    onClick={() => navigate("/application/Status")}
                    >
                    Back
                    </button>
                    <button
                    className="bg-[#B7202E] text-white px-8 py-2 rounded-4xl cursor-pointer"
                    onClick={handlePrint}
                    >
                    Print
                    </button>
                    <button
                    className="bg-[#B7202E] text-white px-8 py-2 rounded-4xl cursor-pointer"
                    onClick={()=>{navigate(`/application/review/${application._id}`)}}
                    >
                    Next
                    </button>
        </div>

    </div>
  );
}

export default ApplicationPDF_FDC