import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("http://localhost:4000/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setSent(true);
      } else {
        toast.error(data.message || "Something went wrong.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-full w-full">
      <div className="min-w-7/10 bg-[#FAFAFA] rounded-4xl p-6 flex flex-col items-center">
        <img src="/university-logo.svg" className="h-12 self-start" />

        {sent ? (
          <div className="flex flex-col items-center font-inter gap-4 tracking-wide font-medium mt-8 mb-10 text-center px-8">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-2">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-[#3F3F3F]">Check your email</h3>
            <p className="text-[#797979] text-sm max-w-xs">
              If <span className="font-semibold text-[#3F3F3F]">{email}</span> is registered, you'll receive a password reset link shortly. The link expires in 1 hour.
            </p>
            <p className="text-[#797979] text-xs mt-2">
              Didn't receive it? Check your spam folder or{" "}
              <span
                onClick={() => setSent(false)}
                className="text-[#B7202E] cursor-pointer hover:underline"
              >
                try again
              </span>.
            </p>
            <button
              onClick={() => navigate("/")}
              className="mt-4 min-w-[60%] rounded-4xl bg-[#B7202E] text-white p-3 text-sm font-semibold cursor-pointer hover:bg-[#d23646] duration-200"
            >
              Back to Login
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="w-full flex flex-col items-center font-inter gap-4 tracking-wide font-medium mt-5 mb-10"
          >
            <h3 className="text-4xl font-semibold text-[#3F3F3F]">Forgot Password</h3>
            <p className="text-[#797979] text-sm text-center max-w-xs mb-2">
              Enter your registered email address and we'll send you a link to reset your password.
            </p>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="min-w-[60%] border rounded-4xl p-3 border-[#777777] outline-none pl-6"
              placeholder="Email address"
              required
            />

            <button
              type="submit"
              disabled={loading}
              className={`min-w-[60%] rounded-4xl bg-[#B7202E] text-white p-3 font-semibold cursor-pointer hover:bg-[#d23646] duration-200 flex items-center justify-center gap-2 ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
            >
              {loading && (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              )}
              {loading ? "Sending..." : "Send Reset Link"}
            </button>

            <p className="text-[#797979] font-medium text-sm">
              Remember your password?{" "}
              <span
                onClick={() => navigate("/")}
                className="text-[#B7202E] cursor-pointer hover:underline"
              >
                Login Here
              </span>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;
