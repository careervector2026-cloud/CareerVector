import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { sendAdminOtp, signupAdmin, resetSignupFlow, clearAdminErrors } from "../../redux/adminRedux/adminSlice";

const AdminSignup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [timer, setTimer] = useState(0);
  const { loading, error, successMessage, otpSent } = useSelector((state) => state.admin);

  const { register, handleSubmit, watch, getValues, trigger, formState: { errors } } = useForm();
  const password = watch("password");

  useEffect(() => {
    return () => { dispatch(resetSignupFlow()); };
  }, [dispatch]);

  useEffect(() => {
    if (successMessage) {
      alert(successMessage);
      dispatch(clearAdminErrors());
      navigate("/admin/login");
    }
  }, [successMessage, navigate, dispatch]);

  useEffect(() => {
    let interval;
    if (otpSent && timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [otpSent, timer]);

  const handleSendOtp = async () => {
    const isValid = await trigger(["name", "username", "email", "institute", "password", "confirmPassword"]);
    if (isValid) {
      dispatch(sendAdminOtp(getValues("email")));
      setTimer(60);
    }
  };

  const onFinalSubmit = (data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("username", data.username);
    formData.append("email", data.email);
    formData.append("institute", data.institute);
    formData.append("password", data.password);
    formData.append("otp", data.otpCode);
    if (data.profilePhoto?.[0]) formData.append("profilePhoto", data.profilePhoto[0]);

    dispatch(signupAdmin(formData));
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#e0f2fe] via-[#bae6fd] to-[#7dd3fc] font-sans relative overflow-hidden">
      <div className="relative z-10 max-w-5xl w-full flex flex-col md:flex-row items-center justify-center gap-10">
        
        <div className="text-center md:text-left flex-1">
          <h1 className="text-5xl md:text-6xl font-black text-slate-800 tracking-tight mb-2">
            Career<span className="text-blue-600">Vector</span>
          </h1>
          <p className="text-slate-600 text-lg md:text-xl font-semibold uppercase tracking-widest">Admin Initialization</p>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-lg bg-white/60 backdrop-blur-xl border border-white/40 rounded-2xl p-8 shadow-xl">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">{otpSent ? "Verify Email" : "Admin Sign Up"}</h2>

          {error && <div className="bg-red-100 border border-red-200 text-red-600 p-2 rounded text-xs mb-4">{typeof error === 'string' ? error : "Error occurred"}</div>}

          <form onSubmit={handleSubmit(onFinalSubmit)} className="flex flex-col gap-4">
            {!otpSent ? (
              <>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase ml-1">Profile Photo</label>
                  <input type="file" accept="image/*" {...register("profilePhoto")} className="w-full text-xs bg-blue-50/50 p-2 rounded-lg border border-blue-200" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <input {...register("name", { required: "Name required" })} placeholder="Full Name" className="w-full bg-blue-50/50 border border-blue-200 rounded-lg px-4 py-2.5 text-sm" />
                  <input {...register("username", { required: "Username required" })} placeholder="Username" className="w-full bg-blue-50/50 border border-blue-200 rounded-lg px-4 py-2.5 text-sm" />
                </div>

                <input {...register("email", { required: "Email required", pattern: /^\S+@\S+$/i })} placeholder="Official Email" className="w-full bg-blue-50/50 border border-blue-200 rounded-lg px-4 py-2.5 text-sm" />
                <input {...register("institute", { required: "Institute required" })} placeholder="Institute Name" className="w-full bg-blue-50/50 border border-blue-200 rounded-lg px-4 py-2.5 text-sm" />

                <div className="grid grid-cols-2 gap-4">
                  <input type="password" {...register("password", { required: "Min 8 chars", minLength: 8 })} placeholder="Password" className="w-full bg-blue-50/50 border border-blue-200 rounded-lg px-4 py-2.5 text-sm" />
                  <input type="password" {...register("confirmPassword", { validate: v => v === password || "Mismatch" })} placeholder="Confirm Password" className="w-full bg-blue-50/50 border border-blue-200 rounded-lg px-4 py-2.5 text-sm" />
                </div>

                <button type="button" onClick={handleSendOtp} disabled={loading} className="w-full bg-blue-600 text-white font-bold rounded-lg py-3 hover:bg-blue-700 transition shadow-md">
                  {loading ? "Sending..." : "Next: Verify Email"}
                </button>
              </>
            ) : (
              <div className="flex flex-col items-center">
                <p className="text-sm text-slate-600 mb-4">Code sent to: <b>{getValues("email")}</b></p>
                <input {...register("otpCode", { required: "Required" })} placeholder="000000" maxLength={6} className="w-full text-center text-3xl tracking-[10px] p-3 border-b-2 border-blue-400 bg-transparent outline-none font-bold mb-6" />
                
                <button type="submit" disabled={loading} className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700">
                  {loading ? "Verifying..." : "Verify & Complete"}
                </button>

                <div className="mt-4 text-center">
                  {timer > 0 ? <p className="text-xs text-slate-500">Resend in {timer}s</p> : 
                  <button type="button" onClick={handleSendOtp} className="text-xs text-blue-600 font-bold underline">Resend OTP</button>}
                </div>
                <button type="button" onClick={() => dispatch(resetSignupFlow())} className="mt-4 text-xs text-slate-400">Back to Edit</button>
              </div>
            )}
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminSignup;