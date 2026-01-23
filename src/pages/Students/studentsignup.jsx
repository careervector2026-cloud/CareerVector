import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { signupUser, sendOtp, resetSignupFlow, clearErrors } from "../../redux/studentRedux/studentSlice";

const StudentSignup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [step, setStep] = useState(1);
  const [timer, setTimer] = useState(0); // Timer state
  
  const { loading, error: reduxError, successMessage, otpSent } = useSelector((state) => state.student);

  // Initialize RHF
  const { 
    register, 
    handleSubmit, 
    watch, 
    trigger, 
    getValues,
    formState: { errors } 
  } = useForm({
    mode: "onChange",
    defaultValues: {
      semesterGPAs: {}
    }
  });

  const password = watch("password");
  const currentSem = watch("sem");

  // Cleanup on unmount
  useEffect(() => {
    return () => { dispatch(resetSignupFlow()); };
  }, [dispatch]);

  // Handle Redux Success
  useEffect(() => {
    if (successMessage) {
      alert(successMessage);
      dispatch(clearErrors());
      navigate("/student/login");
    }
  }, [successMessage, navigate, dispatch]);

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

  // Navigation Logic (Steps 1 & 2)
  const next = async () => {
    let valid = false;

    if (step === 1) {
      valid = await trigger(["fullName", "email", "password", "confirmPassword"]);
    } else if (step === 2) {
      const gpaFields = [];
      if (currentSem && currentSem > 1) {
        for (let i = 1; i < currentSem; i++) {
          gpaFields.push(`semesterGPAs.sem${i}`);
        }
      }
      valid = await trigger(["mobile", "roll", "year", "dept", "branch", "sem", ...gpaFields]);
    }

    if (valid) setStep((prev) => prev + 1);
  };

  // Handle Send OTP
  const handleSendOtp = async () => {
     const isValid = await trigger("email");
     if(isValid) {
        dispatch(sendOtp(getValues("email")));
        setTimer(60); // Start Timer
     }
  };

  // Handle Resend OTP
  const handleResendOtp = () => {
     dispatch(sendOtp(getValues("email")));
     setTimer(60); // Reset Timer
  };

  // Final Submission (Verify + Signup)
  const onFinalSubmit = (data) => {
    const formData = new FormData();

    Object.keys(data).forEach((key) => {
      if (key !== "semesterGPAs" && key !== "profilePic" && key !== "resume" && key !== "otpCode") {
        formData.append(key, data[key]);
      }
    });

    if (data.profilePic && data.profilePic[0]) formData.append("profilePic", data.profilePic[0]);
    if (data.resume && data.resume[0]) formData.append("resume", data.resume[0]);
    formData.append("semesterGPAs", JSON.stringify(data.semesterGPAs));
    formData.append("otp", data.otpCode);

    dispatch(signupUser(formData));
  };

  // --- Styles ---
  const inputBaseClass = "w-full p-3.5 rounded-lg border bg-slate-950 text-white outline-none text-sm transition-colors duration-200 focus:border-blue-500";
  const inputNormal = "border-slate-700";
  const inputError = "border-red-500";
  const btnPrimary = "w-full p-3.5 rounded-lg bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-semibold text-base mt-3 transition-transform duration-100 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed";
  const btnSecondary = "w-full p-3 rounded-lg border border-slate-600 bg-transparent text-slate-300 font-semibold text-sm hover:bg-white/5";

  // Dynamic GPA Inputs Helper
  const renderSemesterInputs = () => {
    const semValue = parseInt(currentSem);
    if (!semValue || isNaN(semValue)) return null;

    const inputs = [];
    for (let i = 1; i <= semValue; i++) {
      const isCurrent = i === semValue;
      const fieldName = `semesterGPAs.sem${i}`;
      inputs.push(
        <div key={i} className="flex flex-col">
          <label className="text-[11px] text-slate-300 mb-1 ml-0.5 font-medium">
            Sem {i} {isCurrent ? <span className="text-slate-500 italic font-normal">(Optional)</span> : <span className="text-red-500">*</span>}
          </label>
          <input
            type="number"
            step="0.01"
            placeholder={isCurrent ? "Pending" : "GPA"}
            className={`w-full p-2.5 rounded-lg bg-slate-900 outline-none text-sm transition-all ${errors?.semesterGPAs?.[`sem${i}`] ? 'border border-red-500' : (isCurrent ? 'border border-dashed border-slate-600 text-slate-400' : 'border border-slate-600 text-white focus:border-blue-500')}`}
            {...register(fieldName, { required: !isCurrent && "Required" })}
          />
        </div>
      );
    }
    return (
      <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700 mt-2">
        <p className="text-xs text-slate-400 mb-3 text-center leading-relaxed">
          Enter GPA details below. <br />
          <span className="opacity-70 text-[10px]">Previous semesters are required. Current is optional.</span>
        </p>
        <div className="grid grid-cols-3 gap-3">{inputs}</div>
      </div>
    );
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-950 to-blue-950 flex items-center justify-center py-10 px-4 font-sans">
      <div className="w-full max-w-[520px] bg-slate-900/95 backdrop-blur-sm p-8 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] border border-white/10 text-white">
        
        <h1 className="text-center text-3xl font-extrabold mb-6 text-blue-50 tracking-wide">CareerVector</h1>

        {/* Progress Bar */}
        <div className="flex items-center justify-center mb-8">
          {[1, 2, 3].map((num) => (
            <React.Fragment key={num}>
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-300
                ${step >= num ? "bg-blue-500 border-blue-500 text-white shadow-[0_0_10px_rgba(59,130,246,0.5)]" : "bg-slate-900 border-slate-600 text-slate-400"}`}>
                {num}
              </div>
              {num < 3 && <div className="w-10 h-0.5 bg-slate-600 mx-2" />}
            </React.Fragment>
          ))}
        </div>

        {/* --- STEP 1: Account Info --- */}
        {step === 1 && (
          <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <h2 className="text-xl font-bold">Account Setup</h2>
            <div>
              <input className={`${inputBaseClass} ${errors.fullName ? inputError : inputNormal}`} placeholder="Full Name" {...register("fullName", { required: "Full Name is required" })} />
              {errors.fullName && <p className="text-red-400 text-xs mt-1">{errors.fullName.message}</p>}
            </div>
            <div>
              <input className={`${inputBaseClass} ${errors.email ? inputError : inputNormal}`} placeholder="Email" {...register("email", { required: "Email is required", pattern: { value: /^\S+@\S+$/i, message: "Invalid email" } })} />
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
            </div>
            <input className={`${inputBaseClass} ${inputNormal}`} placeholder="Username (optional)" {...register("username")} />
            <div>
              <input className={`${inputBaseClass} ${errors.password ? inputError : inputNormal}`} type="password" placeholder="Password" {...register("password", { required: "Password is required", pattern: { value: /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/, message: "1 capital, 1 number, 1 special char" } })} />
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
            </div>
            <div>
              <input className={`${inputBaseClass} ${errors.confirmPassword ? inputError : inputNormal}`} type="password" placeholder="Confirm Password" {...register("confirmPassword", { required: "Confirm Password required", validate: (val) => val === password || "Passwords do not match" })} />
              {errors.confirmPassword && <p className="text-red-400 text-xs mt-1">{errors.confirmPassword.message}</p>}
            </div>
            <button className={btnPrimary} onClick={next}>Next</button>
          </div>
        )}

        {/* --- STEP 2: Academic Info --- */}
        {step === 2 && (
          <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <h2 className="text-xl font-bold">Academic Info</h2>
            <input className={`${inputBaseClass} ${errors.mobile ? inputError : inputNormal}`} placeholder="Mobile Number" {...register("mobile", { required: true })} />
            <div className="flex gap-3">
              <input className={`${inputBaseClass} flex-1 ${errors.roll ? inputError : inputNormal}`} placeholder="Roll Number" {...register("roll", { required: true })} />
              <input className={`${inputBaseClass} flex-1 ${errors.year ? inputError : inputNormal}`} placeholder="Year" {...register("year", { required: true })} />
            </div>
            <input className={`${inputBaseClass} ${errors.dept ? inputError : inputNormal}`} placeholder="Department" {...register("dept", { required: true })} />
            <input className={`${inputBaseClass} ${errors.branch ? inputError : inputNormal}`} placeholder="Branch" {...register("branch", { required: true })} />
            <input className={`${inputBaseClass} ${errors.sem ? inputError : inputNormal}`} type="number" placeholder="Current Semester (e.g. 6)" {...register("sem", { required: true })} />
            
            {renderSemesterInputs()}

            <div className="mt-2">
              <label className="text-sm text-slate-300 block mb-1">Profile Picture</label>
              <input type="file" accept="image/*" className="text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-500/10 file:text-blue-400 hover:file:bg-blue-500/20" {...register("profilePic")} />
            </div>
            <div>
              <label className="text-sm text-slate-300 block mb-1">Resume (PDF)</label>
              <input type="file" accept=".pdf" className="text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-500/10 file:text-blue-400 hover:file:bg-blue-500/20" {...register("resume")} />
            </div>
            <input className={`${inputBaseClass} ${inputNormal}`} placeholder="LeetCode URL" {...register("leetcode")} />
            <input className={`${inputBaseClass} ${inputNormal}`} placeholder="GitHub URL" {...register("github")} />

            <button className={btnPrimary} onClick={next}>Next</button>
            <button className={btnSecondary} onClick={() => setStep(step - 1)}>Back</button>
          </div>
        )}

        {/* --- STEP 3: Verification & Submit --- */}
        {step === 3 && (
          <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <h2 className="text-xl font-bold">{otpSent ? "Verify Email" : "Final Review"}</h2>
            
            {reduxError && (
               <div className="text-red-400 bg-red-400/10 p-2 rounded text-center text-sm border border-red-400/20">
                 {typeof reduxError === 'string' ? reduxError : "An error occurred"}
               </div>
            )}

            {!otpSent && (
              <>
                <p className="text-slate-400 text-sm">
                  You are about to create an account for <strong>{getValues("email")}</strong>. 
                  Click below to receive a verification code.
                </p>
                
                <button 
                  className={btnPrimary}
                  onClick={handleSendOtp}
                  disabled={loading}
                >
                  {loading ? "Sending OTP..." : "Send Verification Code"}
                </button>
                
                <button className={btnSecondary} onClick={() => setStep(step - 1)} disabled={loading}>Edit Details</button>
              </>
            )}

            {otpSent && (
              <>
                <p className="text-center text-slate-400 text-sm mb-2">
                  Enter the 6-digit code sent to your email.
                </p>

                <input 
                    {...register("otpCode", { required: "OTP is required" })}
                    placeholder="000000"
                    className="w-full text-center text-3xl tracking-[8px] p-4 border border-blue-500 bg-slate-800 rounded-lg outline-none font-bold text-white focus:shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                    maxLength={6}
                />
                {errors.otpCode && <span className="text-red-500 text-xs block text-center mt-2">{errors.otpCode.message}</span>}

                <button 
                  className={`${btnPrimary} bg-green-600 hover:bg-green-700 from-green-600 to-green-700`}
                  onClick={handleSubmit(onFinalSubmit)}
                  disabled={loading}
                >
                  {loading ? "Verifying..." : "Verify & Signup"}
                </button>

                {/* Resend OTP Timer */}
                <div className="text-center mt-3">
                    {timer > 0 ? (
                        <p className="text-xs text-slate-400">
                            Resend code in <span className="text-blue-400 font-bold">{timer}s</span>
                        </p>
                    ) : (
                        <button
                            type="button"
                            onClick={handleResendOtp}
                            disabled={loading}
                            className="text-xs text-blue-400 hover:text-blue-300 font-semibold underline bg-transparent border-none cursor-pointer"
                        >
                            Resend OTP
                        </button>
                    )}
                </div>

                <button 
                    className="mt-2 text-slate-500 text-sm hover:text-slate-300 underline" 
                    onClick={() => dispatch(resetSignupFlow())}
                >
                    Incorrect Email? Go Back
                </button>
              </>
            )}

            {!otpSent && (
                <p className="text-center mt-4 text-sm text-blue-400 hover:text-blue-300 underline cursor-pointer" onClick={() => navigate("/student/login")}>
                Already have an account? Login
                </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentSignup;