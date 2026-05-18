import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [invalid, setInvalid] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("http://localhost:4000/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resetToken: token, newPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        setDone(true);
        toast.success("Password reset successfully!");
      } else if (res.status === 400) {
        setInvalid(true);
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

        {invalid ? (
          <div className="flex flex-col items-center font-inter gap-4 tracking-wide font-medium mt-8 mb-10 text-center px-8">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-2">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-[#3F3F3F]">Link expired</h3>
            <p className="text-[#797979] text-sm max-w-xs">
              This password reset link is invalid or has expired. Reset links are only valid for 1 hour.
            </p>
            <button
              onClick={() => navigate("/forgot-password")}
              className="mt-4 min-w-[60%] rounded-4xl bg-[#B7202E] text-white p-3 text-sm font-semibold cursor-pointer hover:bg-[#d23646] duration-200"
            >
              Request New Link
            </button>
          </div>
        ) : done ? (
          <div className="flex flex-col items-center font-inter gap-4 tracking-wide font-medium mt-8 mb-10 text-center px-8">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-2">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-[#3F3F3F]">Password reset!</h3>
            <p className="text-[#797979] text-sm max-w-xs">
              Your password has been updated. You can now log in with your new password.
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
            <h3 className="text-4xl font-semibold text-[#3F3F3F]">Reset Password</h3>
            <p className="text-[#797979] text-sm text-center max-w-xs mb-2">
              Enter a new password for your account.
            </p>

            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="min-w-[60%] border rounded-4xl p-3 border-[#777777] outline-none pl-6"
              placeholder="New password"
              required
            />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="min-w-[60%] border rounded-4xl p-3 border-[#777777] outline-none pl-6"
              placeholder="Confirm new password"
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
              {loading ? "Resetting..." : "Reset Password"}
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

export default ResetPassword;
