import React, { useState, useEffect } from "react";
import axiosInstance from "../../config/AxiosConfig"; 
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser, clearErrors } from "../../redux/studentRedux/studentSlice";

const StudentLogin = () => {
  const [step, setStep] = useState("login"); // login | forgot | reset
  
  // Login Form State
  const [identifier, setIdentifier] = useState(""); // Can be Email OR Username
  const [password, setPassword] = useState("");
  
  // Password Reset State
  const [resetEmail, setResetEmail] = useState(""); 
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Access Redux State
  const { loading, error, isAuthenticated } = useSelector((state) => state.student);

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/student/home");
    }
    return () => { dispatch(clearErrors()); };
  }, [isAuthenticated, navigate, dispatch]);

  // --- Login Handler ---
  const handleLogin = (e) => {
    e.preventDefault();
    // Send 'emailOrUsername' to match Backend DTO
    dispatch(loginUser({ emailOrUsername: identifier, password }));
  };

  // --- Password Reset Handlers ---
  const handleCheckEmail = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post("/api/student/check-email", { email: resetEmail });
      setStep("reset");
    } catch (err) {
      alert(err.response?.data?.message || "Email not found");
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) return alert("Passwords do not match");
    
    try {
      await axiosInstance.post("/api/student/reset-password", { email: resetEmail, newPassword });
      alert("Password reset successful. Please login.");
      setStep("login");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to reset password");
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 to-blue-900 flex items-center justify-center relative overflow-hidden text-white font-sans">
      
      {/* Background Glow Effects */}
      <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-blue-500/35 rounded-full blur-[120px]" />
      <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] bg-purple-500/35 rounded-full blur-[120px]" />

      <div className="relative z-10 w-[90%] max-w-4xl flex flex-col md:flex-row justify-between gap-10 items-center">
        
        {/* Left Side: Branding */}
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-5xl font-extrabold mb-2 tracking-tight">CareerVector</h1>
          <p className="text-lg text-indigo-200">Your smart placement companion</p>
        </div>

        {/* Right Side: Glass Card */}
        <div className="flex-1 w-full max-w-md bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-2xl shadow-2xl">
          
          {/* --- LOGIN FORM --- */}
          {step === "login" && (
            <form onSubmit={handleLogin} className="flex flex-col gap-5">
              <h2 className="text-2xl font-bold text-white">Student Login</h2>

              {error && (
                <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-3 rounded-lg text-sm text-center">
                  {typeof error === 'string' ? error : "Login Failed"}
                </div>
              )}

              {/* INPUT 1: Email OR Username */}
              <input
                type="text" 
                placeholder="Email or Username"
                className="w-full p-3.5 rounded-xl border border-white/25 bg-white/10 text-white placeholder-gray-300 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
              />

              {/* INPUT 2: Password */}
              <input
                type="password"
                placeholder="Password"
                className="w-full p-3.5 rounded-xl border border-white/25 bg-white/10 text-white placeholder-gray-300 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <button 
                className="w-full p-3.5 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white font-semibold shadow-lg transform active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </button>

              <div className="flex flex-col items-center gap-2 mt-2">
                <p 
                  className="text-sm text-blue-300 hover:text-blue-200 cursor-pointer transition-colors"
                  onClick={() => setStep("forgot")}
                >
                  Forgot password?
                </p>
                <p className="text-sm text-slate-300">
                  Don't have an account?{" "}
                  <span 
                    className="font-bold text-white underline cursor-pointer hover:text-blue-200 ml-1"
                    onClick={() => navigate("/student/signup")}
                  >
                    Sign Up
                  </span>
                </p>
              </div>
            </form>
          )}

          {/* --- VERIFY EMAIL FORM (Forgot Password) --- */}
          {step === "forgot" && (
            <form onSubmit={handleCheckEmail} className="flex flex-col gap-5">
              <h2 className="text-2xl font-bold">Verify Email</h2>
              <input
                type="email"
                placeholder="Enter registered email"
                className="w-full p-3.5 rounded-xl border border-white/25 bg-white/10 text-white placeholder-gray-300 outline-none focus:border-blue-400"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                required
              />
              <button className="w-full p-3.5 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-500 hover:opacity-90 font-semibold transition-all">
                Continue
              </button>
              <p className="text-center text-sm text-blue-300 cursor-pointer hover:text-white" onClick={() => setStep("login")}>
                Back to login
              </p>
            </form>
          )}

          {/* --- RESET PASSWORD FORM --- */}
          {step === "reset" && (
            <form onSubmit={handleResetPassword} className="flex flex-col gap-5">
              <h2 className="text-2xl font-bold">Reset Password</h2>
              <input
                type="password"
                placeholder="New Password"
                className="w-full p-3.5 rounded-xl border border-white/25 bg-white/10 text-white placeholder-gray-300 outline-none"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Confirm Password"
                className="w-full p-3.5 rounded-xl border border-white/25 bg-white/10 text-white placeholder-gray-300 outline-none"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button className="w-full p-3.5 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-500 hover:opacity-90 font-semibold transition-all">
                Update Password
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};

export default StudentLogin;