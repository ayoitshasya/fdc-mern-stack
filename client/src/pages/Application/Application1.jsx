import React, { useEffect, useState } from "react";
import Header from "../../Components/Header";
import { useNavigate } from "react-router-dom";
import { useFormContext } from "../../context/FormContext";
import axios from "axios";

function Application1() {
  const navigate = useNavigate();
  const [isChecked, setIsChecked] = useState(false);

  const { updateFormData, getFormData } = useFormContext();
  const formName = "fdcApplication";

  const [userData, setUserData] = useState({
    fname: "",
    lname: "",
    e_id: "",
    department: "",
    designation: "",
    date_of_appointment: "",
    date_of_appointment_present: "",
  });

  const handleNext = () => {
    if (isChecked) {
      updateFormData(formName, {
        e_id: userData.e_id,
        fname: userData.fname,
        lname: userData.lname,
        date_of_appointment: userData.date_of_appointment,
        designation: userData.designation,
        department: userData.department
      });
      navigate("/fdc-application/step-2");
    } else {
      alert("Please confirm the details by checking the box.");
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("http://localhost:4000/auth/profile", {
          withCredentials: true,
        });
        
        setUserData({
          fname: res.data.fname || "",
          lname: res.data.lname || "",
          e_id: res.data.e_id || "",
          department: res.data.department || "",
          designation: res.data.designation || "",
          date_of_appointment: res.data.date_of_appointment?.slice(0, 10) || "",
          present_appointment: res.data.present_appointment?.slice(0, 10) || "",
        });
      } catch (err) {
        console.error("Error fetching user profile:", err);
      }
    };

    fetchProfile();
  }, []);

  return (
    <div className="w-full h-full flex flex-col">
      <Header />
      <div className="w-full h-full flex flex-col justify-center items-center">
        <div className="bg-[#FAFAFA] rounded-3xl p-4 px-8 flex flex-col items-center font-inter">
          <h1 className="text-xl text-[#3D3D3D] font-medium mb-4">
            Application to attend STTPS and
            Symposium/Workshop/Seminar/Conference/NPTEL Course
          </h1>
          <form className="w-full text-[#7F7F7F] font-normal flex flex-col">
            <label htmlFor="name" className="">
              Name: *
            </label>
            <input
              type="text"
              name="name"
              className="w-full border rounded-lg p-1 outline-none mt-1 mb-2 bg-gray-100"
              value={`${userData.fname} ${userData.lname}` || ""}
              readOnly
            />

            <label htmlFor="employeeId" className="">
              Employee ID: *
            </label>
            <input
              type="text"
              name="employeeId"
              className="w-full border rounded-lg p-1 outline-none mt-1 mb-2 bg-gray-100"
              value={userData.e_id || ""}
              readOnly
            />

            <label htmlFor="department">Department: *</label>
            <input
              type="text"
              name="department"
              className="w-full border rounded-lg p-1 outline-none mt-1 mb-2 bg-gray-100"
              value={userData.department || ""}
              readOnly
            />

            <label htmlFor="designation">Designation: *</label>
            <input
              type="text"
              name="designation"
              className="w-full border rounded-lg p-1 outline-none mt-1 mb-2 bg-gray-100"
              value={userData.designation || ""}
              readOnly
            />

            <label htmlFor="date_of_appointment">Date of Appointment: *</label>
            <input
              type="date"
              name="date_of_appointment"
              className="w-full border rounded-lg p-1 outline-none mt-1 mb-2 bg-gray-100"
              value={userData.date_of_appointment || ""}
              readOnly
            />

            <label htmlFor="date_of_appointment_present">
              Date of Appointment on the present post: *
            </label>
            <input
              type="date"
              name="date_of_appointment_present"
              className="w-full border rounded-lg p-1 outline-none mt-1 mb-2 bg-gray-100"
              value={userData.present_appointment || ""}
              readOnly
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
                checked={isChecked}
                onChange={(e) => setIsChecked(e.target.checked)}
              />
            </div>

            <div className="flex justify-center gap-10 mt-2">
            <button
                type="button"
                onClick={() => navigate("/application/Status")}
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

export default Application1;
