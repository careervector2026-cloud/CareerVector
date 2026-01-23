import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { signupRecruiter, sendOtp, resetSignupFlow, clearRecruiterErrors } from "../../redux/recruiterRedux/recruiterSlice";

const RecruiterSignup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Local state for OTP timer
  const [timer, setTimer] = useState(0);

  // React Hook Form
  const { 
    register, 
    handleSubmit, 
    watch, 
    getValues, 
    trigger, 
    formState: { errors } 
  } = useForm();

  const { loading, error: reduxError, successMessage, otpSent } = useSelector((state) => state.recruiter);
  const password = watch("password");

  // Cleanup: Reset flow when leaving page
  useEffect(() => {
    return () => { dispatch(resetSignupFlow()); };
  }, [dispatch]);

  // Handle Timer Countdown
  useEffect(() => {
    let interval;
    if (otpSent && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpSent, timer]);

  // Handle Success: Redirect to Login
  useEffect(() => {
    if (successMessage === "Account created successfully! Please Login.") {
        alert(successMessage);
        dispatch(clearRecruiterErrors());
        navigate("/recruiter/login");
    }
  }, [successMessage, navigate, dispatch]);

  // STEP 1: Send OTP
  const handleSendOtp = async () => {
    const isValid = await trigger(["fullName", "email", "mobile", "companyName", "role", "password", "confirmPassword"]);
    
    if (isValid) {
        dispatch(sendOtp(getValues("email")));
        setTimer(60); // Start 60s countdown
    }
  };

  // Resend Handler
  const handleResendOtp = () => {
    dispatch(sendOtp(getValues("email")));
    setTimer(60); // Reset timer
  };

  // STEP 2: Final Submit
  const onFinalSubmit = (data) => {
    const formData = new FormData();
    formData.append("fullName", data.fullName);
    formData.append("email", data.email);
    formData.append("username", data.username || "");
    formData.append("mobile", data.mobile);
    formData.append("companyName", data.companyName);
    formData.append("role", data.role);
    formData.append("password", data.password);
    formData.append("otp", data.otpCode);

    if (data.image && data.image[0]) {
      formData.append("image", data.image[0]);
    }

    dispatch(signupRecruiter(formData));
  };

  return (
    <div className="min-h-screen flex items-center justify-center font-sans py-10 bg-gradient-to-br from-[#87a6e9] to-[#1e40af]">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-white p-10 rounded-2xl shadow-xl w-full max-w-2xl"
      >
        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">
          {otpSent ? "Verify Your Email" : "Recruiter Signup"}
        </h2>

        {reduxError && (
          <div className="bg-red-100 border border-red-200 text-red-500 p-3 rounded-lg text-center text-sm mb-6">
            {typeof reduxError === 'string' ? reduxError : "An error occurred"}
          </div>
        )}

        <form onSubmit={handleSubmit(onFinalSubmit)} className="space-y-6">
          
          {/* --- VIEW 1: DATA ENTRY --- */}
          {!otpSent && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                   <input {...register("fullName", { required: "Full Name is required" })} placeholder="Full Name *" className="w-full p-3 rounded border border-gray-300 outline-none focus:border-blue-500 transition" />
                   {errors.fullName && <span className="text-red-500 text-xs block mt-1">{errors.fullName.message}</span>}
                </div>
                <div>
                   <input {...register("email", { required: "Email is required", pattern: { value: /^\S+@\S+$/i, message: "Invalid email" } })} placeholder="Email *" className="w-full p-3 rounded border border-gray-300 outline-none focus:border-blue-500 transition" />
                   {errors.email && <span className="text-red-500 text-xs block mt-1">{errors.email.message}</span>}
                </div>
                <div>
                   <input {...register("username")} placeholder="Username (Optional)" className="w-full p-3 rounded border border-gray-300 outline-none focus:border-blue-500 transition" />
                </div>
                <div>
                   <input {...register("mobile", { required: "Mobile is required" })} placeholder="Mobile *" className="w-full p-3 rounded border border-gray-300 outline-none focus:border-blue-500 transition" />
                   {errors.mobile && <span className="text-red-500 text-xs block mt-1">{errors.mobile.message}</span>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <input {...register("companyName", { required: "Company Name is required" })} placeholder="Company Name *" className="w-full p-3 rounded border border-gray-300 outline-none focus:border-blue-500 transition" />
                    {errors.companyName && <span className="text-red-500 text-xs block mt-1">{errors.companyName.message}</span>}
                 </div>
                 <div>
                    <input {...register("role", { required: "Role is required" })} placeholder="Role (HR/Recruiter) *" className="w-full p-3 rounded border border-gray-300 outline-none focus:border-blue-500 transition" />
                    {errors.role && <span className="text-red-500 text-xs block mt-1">{errors.role.message}</span>}
                 </div>
              </div>

              <div className="border-2 border-dashed border-blue-200 p-4 rounded bg-blue-50 hover:bg-blue-100 transition">
                <label className="block text-sm text-gray-700 font-medium mb-2">Profile Photo (Optional)</label>
                <input type="file" accept="image/*" {...register("image")} className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <input type="password" {...register("password", { required: "Password required", minLength: { value: 6, message: "Min 6 chars" } })} placeholder="Password *" className="w-full p-3 rounded border border-gray-300 outline-none focus:border-blue-500 transition" />
                    {errors.password && <span className="text-red-500 text-xs block mt-1">{errors.password.message}</span>}
                 </div>
                 <div>
                    <input type="password" {...register("confirmPassword", { validate: val => val === password || "Passwords do not match" })} placeholder="Confirm Password *" className="w-full p-3 rounded border border-gray-300 outline-none focus:border-blue-500 transition" />
                    {errors.confirmPassword && <span className="text-red-500 text-xs block mt-1">{errors.confirmPassword.message}</span>}
                 </div>
              </div>

              <button
                type="button" 
                onClick={handleSendOtp}
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3.5 rounded-lg font-semibold hover:bg-blue-700 transition shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? "Sending Verification Code..." : "Next: Verify Email"}
              </button>
            </motion.div>
          )}

          {/* --- VIEW 2: OTP VERIFICATION --- */}
          {otpSent && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col items-center">
                <div className="text-center mb-8">
                    <p className="text-gray-600 mb-1">We have sent a 6-digit code to:</p>
                    <p className="font-bold text-lg text-blue-900">{getValues("email")}</p>
                </div>
                
                <div className="w-full mb-4">
                    <input 
                        {...register("otpCode", { required: "Verification code is required" })}
                        placeholder="000000"
                        className="w-full text-center text-4xl tracking-[10px] p-4 border-b-2 border-blue-300 focus:border-blue-600 outline-none font-bold text-gray-700 bg-transparent transition-colors"
                        maxLength={6}
                    />
                    {errors.otpCode && <span className="text-red-500 text-sm block text-center mt-3">{errors.otpCode.message}</span>}
                </div>

                <button
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-green-600 text-white py-3.5 rounded-lg font-semibold hover:bg-green-700 transition shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {loading ? "Verifying & Creating Account..." : "Verify & Complete Signup"}
                </button>

                {/* Resend OTP Timer */}
                <div className="mt-4 text-center">
                    {timer > 0 ? (
                        <p className="text-sm text-gray-500">
                            Resend code in <span className="text-blue-600 font-bold">{timer}s</span>
                        </p>
                    ) : (
                        <button
                            type="button"
                            onClick={handleResendOtp}
                            disabled={loading}
                            className="text-sm text-blue-600 hover:text-blue-800 font-semibold underline bg-transparent border-none cursor-pointer"
                        >
                            Resend OTP
                        </button>
                    )}
                </div>

                <button 
                    type="button" 
                    onClick={() => dispatch(resetSignupFlow())}
                    className="mt-4 text-gray-500 text-sm hover:text-gray-800 hover:underline transition"
                >
                    Entered wrong email? Go Back
                </button>
            </motion.div>
          )}

        </form>

        {!otpSent && (
            <p className="text-sm text-center text-gray-600 mt-8">
              Already have an account? <Link to="/recruiter/login" className="text-blue-600 font-semibold hover:underline">Log in</Link>
            </p>
        )}
      </motion.div>
    </div>
  );
};

export default RecruiterSignup;