import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    e_id: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.post(
        "http://localhost:4000/auth/login",
        formData,
        {
          withCredentials: true,
        }
      );
      if (res.status === 200) {
        navigate("/home");
      }
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.message);
      } else {
        setError("Something went wrong");
      }
    }
  };

  return (
    <div className="flex justify-center items-center h-full w-full">
      <div className="min-w-7/10  bg-[#FAFAFA] rounded-4xl p-6 flex flex-col items-center">
        <img src="/university-logo.svg" className="h-12 self-start" />
        <form
          onSubmit={handleSubmit}
          className="w-full flex-1 flex flex-col  items-center font-inter gap-4 tracking-wide font-medium mt-5 mb-10"
        >
          <h3 className="text-4xl font-semibold text-[#3F3F3F] ">
            Welcome to KJSCE FDC Application
          </h3>
          <p className="text-2xl text-[#797979] mb-4">
            Enter Employee ID and password to sign in
          </p>

          <input
            type="text"
            name="e_id"
            value={formData.e_id}
            onChange={handleChange}
            className="min-w-[60%] border rounded-4xl p-3 border-[#777777] outline-none pl-6 mb-2"
            placeholder="Employee ID"
            required
          />
          <input
            type="Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="min-w-[60%] border rounded-4xl p-3 border-[#777777] outline-none pl-6 mb-3"
            placeholder="Password"
            required
          />
          {error && <p className="text-red-500">{error}</p>}

          <button
            type="submit"
            className="min-w-[60%] rounded-4xl bg-[#B7202E] text-white p-3 font-semibold cursor-pointer hover:bg-[#d23646] duration-200"
          >
            Sign In
          </button>

          <span className="text-[#797979]">OR</span>
          <button
            onClick={() =>
              (window.location.href = "http://localhost:4000/auth/google-login")
            }
            className="flex items-center gap-2 text-[#797979] border border-[#777777] text-[1rem] rounded-4xl py-2 px-4 cursor-pointer"
          >
            <img src="/google.png" className="h-5" /> Sign In Using Google
            Account
          </button>
        </form>
        <p className="text-[#797979] font-inter font-medium text-[1.1rem] mb-1">
          New to FDC Application?{" "}
          <span
            onClick={() => navigate("/")}
            className="text-[#B7202E] cursor-pointer hover:underline"
          >
            Signup Here
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;
