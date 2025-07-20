import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();
  const [sameAsDateOfAppointment, setSameAsDateOfAppointment] = useState(false);

  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    e_id: "",
    email: "",
    password: "",
    department: "",
    designation: "",
    date_of_appointment: "",
    present_appointment: "",
    user_type: "employee", // Default user type
  });

  useEffect(() => {
    if (sameAsDateOfAppointment) {
      setFormData((prev) => ({
        ...prev,
        present_appointment: prev.date_of_appointment,
      }));
    }
  }, [sameAsDateOfAppointment, formData.date_of_appointment]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:4000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Registration successful!");
        navigate("/");
      } else {
        alert(data.message || "Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert("Something went wrong");
    }
  };

  return (
    <div className="flex justify-center items-center h-full w-full">
      <div className="min-w-7/10  bg-[#FAFAFA] rounded-4xl p-4 flex flex-col items-center">
        <img src="/university-logo.svg" className="h-8 self-start" />
        <form
          onSubmit={handleSubmit}
          className="w-full flex-1 flex flex-col  items-center font-inter gap-[0.35rem] tracking-wide font-medium mt-3 mb-3"
        >
          <h3 className="text-[2rem] font-semibold text-[#3F3F3F] ">
            Welcome to KJSCE FDC Application
          </h3>
          <p className="text-2xl text-[#797979] mb-2">
            Enter Details to Create an Acount
          </p>

          <div className="flex min-w-[60%] justify-between">
            <input
              type="text"
              name="fname"
              value={formData.fname}
              onChange={handleChange}
              className="w-[49%] border rounded-4xl p-3 text-[0.8rem] border-[#777777] outline-none pl-6 mb-2"
              placeholder="First Name"
              required
            />
            <input
              type="text"
              name="lname"
              value={formData.lname}
              onChange={handleChange}
              className="w-[49%] border rounded-4xl p-3 text-[0.8rem] border-[#777777] outline-none pl-6 mb-2"
              placeholder="Last Name"
              required
            />
          </div>

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="min-w-[60%] border rounded-4xl p-3 text-[0.8rem] border-[#777777] outline-none pl-6 mb-2"
            placeholder="Email"
            required
          />

          <div className="flex min-w-[60%] justify-between">
            <input
              type="text"
              name="e_id"
              value={formData.e_id}
              onChange={handleChange}
              className="w-[49%] border rounded-4xl p-3 text-[0.8rem] border-[#777777] outline-none pl-6 mb-2"
              placeholder="Employee ID"
              required
            />
            <input
              type="Password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-[49%] border rounded-4xl p-3 text-[0.8rem] border-[#777777] outline-none pl-6 mb-2"
              placeholder="Password"
              required
            />
          </div>

          <div className="flex min-w-[60%] justify-between">
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="w-[49%] border rounded-4xl p-3 text-[0.8rem] border-[#777777] text-[#777777] outline-gray-500 pl-6 mb-2"
              required
            >
              <option value="none" selected>
                Select a Department
              </option>
              <option value="SAH">SAH</option>
              <option value="COMPS">COMPS</option>
              <option value="IT">IT</option>
              <option value="EXTC">EXTC</option>
              <option value="EXCP">EXCP</option>
              <option value="MECH">MECH</option>
            </select>

            <input
              type="text"
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              className="w-[49%] border rounded-4xl text-[0.8rem] border-[#777777] outline-none pl-6 mb-2"
              placeholder="Enter your Designation"
              required
            />
          </div>

          <div className="flex min-w-[60%] justify-between">
            <div className="w-[49%]">
              <p className="text-[#777777] pl-3 mb-1 text-[0.8rem]">Date of Appointment</p>
              <input
                type="date"
                name="date_of_appointment"
                value={formData.date_of_appointment}
                onChange={handleChange}
                className="w-full border rounded-4xl p-3 text-[0.8rem] border-[#777777] text-[#777777] outline-none pl-6 mb-2"
                placeholder="Date of Appointment"
                required
              />
            </div>

            <div className="w-[49%]">
              <p className="text-[#777777] pl-3 mb-1 text-[0.8rem]">
                Date of Appointment on Post
              </p>
              <input
                type="date"
                name="present_appointment"
                value={formData.present_appointment}
                onChange={handleChange}
                className="w-full border rounded-4xl p-3 text-[0.8rem] border-[#777777] text-[#777777] outline-none pl-6 mb-2"
                placeholder="Date of Appointment of Present Post"
                required
                disabled={sameAsDateOfAppointment}
              />
              <div className="flex items-center gap-2 pl-2">
                <input
                  type="checkbox"
                  id="sameDate"
                  checked={sameAsDateOfAppointment}
                  onChange={() =>
                    setSameAsDateOfAppointment(!sameAsDateOfAppointment)
                  }
                />
                <label htmlFor="sameDate" className="text-[#777777] text-[0.8rem]">
                  Same as date of appointment
                </label>
              </div>
            </div>
          </div>

          <button className="text-sm min-w-[60%] rounded-4xl bg-[#B7202E] text-white p-3 font-semibold cursor-pointer hover:bg-[#d23646] duration-200">
            Create Account
          </button>

          <span className="text-[#797979] text-sm">OR</span>
          <button
            onClick={() =>
              (window.location.href = "http://localhost:4000/auth/google-login")
            }
            className="flex items-center gap-2 text-[#797979] border border-[#777777] text-[0.9rem] rounded-4xl py-2 px-4 cursor-pointer"
          >
            <img src="/google.png" className="h-5" /> 
            <span className="text-[0.8rem]">Sign In Using Google Account</span>
          </button>
        </form>
        <p className="text-[#797979] font-inter font-medium text-[1rem] mb-1">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-[#B7202E] cursor-pointer hover:underline"
          >
            Login Here
          </span>
        </p>
      </div>
    </div>
  );
}

export default Signup;
