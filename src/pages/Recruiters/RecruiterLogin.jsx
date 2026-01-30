import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { loginRecruiter, clearRecruiterErrors } from "../../redux/recruiterRedux/recruiterSlice";
import axiosInstance from "../../config/AxiosConfig";

const RecruiterLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Redux for Login
  const { loading, error, isAuthenticated } = useSelector((state) => state.recruiter);

  // Local State for Forgot Password Flow
  const [view, setView] = useState("login"); // "login", "forgot", "reset"
  const [resetEmail, setResetEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState(null);
  const [localSuccess, setLocalSuccess] = useState(null);
  const [localLoading, setLocalLoading] = useState(false);

  // Forms
  const { register: loginRegister, handleSubmit: loginSubmit } = useForm();

  useEffect(() => {
    if (isAuthenticated) navigate("/recruiter/home");
    return () => { dispatch(clearRecruiterErrors()); };
  }, [isAuthenticated, navigate, dispatch]);

  const onLogin = (data) => dispatch(loginRecruiter(data));

  // --- Step 1: Send OTP for Password Reset ---
  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setLocalLoading(true);
    setLocalError(null);
    setLocalSuccess(null);

    try {
      await axiosInstance.post("/api/recruiter/forgot-password", { email: resetEmail });
      setLocalSuccess("OTP sent to your email.");
      setView("reset");
    } catch (err) {
      setLocalError(err.response?.data || "Email not found.");
    } finally {
      setLocalLoading(false);
    }
  };

  // --- Step 2: Reset Password ---
  const handleResetSubmit = async (e) => {
    e.preventDefault();
    if(newPassword !== confirmPassword) {
      setLocalError("Passwords do not match");
      return;
    }
    setLocalLoading(true);
    setLocalError(null);
    setLocalSuccess(null);

    try {
      await axiosInstance.post("/api/recruiter/reset-password", { 
        email: resetEmail,
        otp: otp,
        newPassword: newPassword
      });
      setLocalSuccess("Password reset successful. Please login.");
      // Small delay before switching view so user sees success message
      setTimeout(() => {
        setView("login");
        setLocalSuccess(null);
      }, 2000);
    } catch (err) {
      setLocalError(err.response?.data || "Failed to reset password. Invalid OTP.");
    } finally {
      setLocalLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#87a6e9] to-[#1e40af] flex items-center justify-center font-sans p-4">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-[400px]">
        
        {/* Header Changes Based on View */}
        <h2 className="text-center text-2xl font-bold text-blue-900 mb-2">
          {view === "login" ? "Recruiter Login" : view === "forgot" ? "Forgot Password" : "Reset Password"}
        </h2>
        <p className="text-center text-slate-500 mb-6 text-sm">
          {view === "login" ? "Access your recruitment dashboard" : view === "forgot" ? "Enter your email to receive an OTP" : "Enter OTP and new password"}
        </p>

        {/* Global Errors */}
        {(error || localError) && <div className="bg-red-100 text-red-500 p-2 rounded text-center text-sm mb-4">{error || localError}</div>}
        {localSuccess && <div className="bg-green-100 text-green-600 p-2 rounded text-center text-sm mb-4">{localSuccess}</div>}

        {/* --- VIEW 1: LOGIN --- */}
        {view === "login" && (
          <form onSubmit={loginSubmit(onLogin)} className="flex flex-col gap-4">
            <input {...loginRegister("emailOrUsername", { required: true })} placeholder="Email or Username" className="w-full p-3.5 rounded-lg border border-slate-300 outline-none focus:border-indigo-500" />
            <input type="password" {...loginRegister("password", { required: true })} placeholder="Password" className="w-full p-3.5 rounded-lg border border-slate-300 outline-none focus:border-indigo-500" />
            
            <button type="submit" disabled={loading} className="w-full p-3.5 rounded-lg bg-indigo-600 text-white font-semibold mt-2 hover:bg-indigo-700 disabled:opacity-70 transition-all">
              {loading ? "Logging in..." : "Continue"}
            </button>
            
            <p className="text-right text-sm text-indigo-500 cursor-pointer hover:underline" onClick={() => setView("forgot")}>Forgot Password?</p>
          </form>
        )}

        {/* --- VIEW 2: FORGOT PASSWORD (EMAIL) --- */}
        {view === "forgot" && (
          <form onSubmit={handleForgotSubmit} className="flex flex-col gap-4">
            <input 
              type="email" 
              placeholder="Enter your registered email" 
              className="w-full p-3.5 rounded-lg border border-slate-300 outline-none focus:border-indigo-500"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              required
            />
            
            <button type="submit" disabled={localLoading} className="w-full p-3.5 rounded-lg bg-indigo-600 text-white font-semibold mt-2 hover:bg-indigo-700 disabled:opacity-70 transition-all">
              {localLoading ? "Sending OTP..." : "Send Verification Code"}
            </button>
            
            <p className="text-center text-sm text-slate-500 cursor-pointer hover:text-indigo-600" onClick={() => setView("login")}>Back to Login</p>
          </form>
        )}

        {/* --- VIEW 3: RESET PASSWORD (OTP) --- */}
        {view === "reset" && (
          <form onSubmit={handleResetSubmit} className="flex flex-col gap-4">
            <div className="bg-blue-50 text-blue-700 text-xs p-2 rounded text-center mb-2">Code sent to: {resetEmail}</div>
            
            <input 
              type="text" 
              placeholder="Enter 6-digit OTP" 
              className="w-full p-3.5 rounded-lg border border-slate-300 outline-none focus:border-indigo-500 text-center tracking-widest font-mono"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
              required
            />
            <input 
              type="password" 
              placeholder="New Password" 
              className="w-full p-3.5 rounded-lg border border-slate-300 outline-none focus:border-indigo-500"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <input 
              type="password" 
              placeholder="Confirm Password" 
              className="w-full p-3.5 rounded-lg border border-slate-300 outline-none focus:border-indigo-500"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            
            <button type="submit" disabled={localLoading} className="w-full p-3.5 rounded-lg bg-green-600 text-white font-semibold mt-2 hover:bg-green-700 disabled:opacity-70 transition-all">
              {localLoading ? "Updating..." : "Set New Password"}
            </button>
            
            <p className="text-center text-sm text-slate-500 cursor-pointer hover:text-indigo-600" onClick={() => setView("forgot")}>Resend OTP</p>
          </form>
        )}

        {view === "login" && (
          <p className="text-center mt-5 text-sm text-slate-500">
            New user? <Link to="/recruiter/signup" className="text-indigo-600 font-semibold hover:underline">Sign up</Link>
          </p>
        )}
      </motion.div>
    </div>
  );
};

export default RecruiterLogin;