import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { sendAdminOtp, signupAdmin, resetSignupFlow, clearAdminErrors } from "../../redux/adminRedux/adminSlice";

 // List of 50-70 Colleges
  const collegesList = [
  "Indian Institute of Technology (IIT) Hyderabad",
  "National Institute of Technology (NIT) Warangal",
  "International Institute of Information Technology (IIIT) Hyderabad",
  "BITS Pilani, Hyderabad Campus",
  "Jawaharlal Nehru Technological University (JNTU), Hyderabad",
  "JNTUH College of Engineering, Jagtial",
  "JNTUH College of Engineering, Manthani",
  "JNTUH College of Engineering, Sulthanpur",
  "Osmania University College of Engineering (OUCE), Hyderabad",
  "Kakatiya University (KU), Warangal",
  "Chaitanya Bharathi Institute of Technology (CBIT), Hyderabad",
  "Vasavi College of Engineering (VCE), Hyderabad",
  "VNR Vignana Jyothi Institute of Engineering and Technology (VNRVJIET)",
  "Gokaraju Rangaraju Institute of Engineering and Technology (GRIET)",
  "Mahatma Gandhi Institute of Technology (MGIT), Hyderabad",
  "Sreenidhi Institute of Science and Technology (SNIST)",
  "CVR College of Engineering, Hyderabad",
  "Vardhaman College of Engineering, Hyderabad",
  "Anurag University (Anurag Group of Institutions), Hyderabad",
  "MVSR Engineering College, Hyderabad",
  "Kakatiya Institute of Technology and Science (KITS), Warangal",
  "Muffakham Jah College of Engineering and Technology (MJCET)",
  "G. Narayanamma Institute of Technology and Science (GNITS) - For Women",
  "B.V. Raju Institute of Technology (BVRIT), Narsapur",
  "BVRIT Hyderabad College of Engineering for Women",
  "Keshav Memorial Institute of Technology (KMIT), Hyderabad",
  "Neil Gogte Institute of Technology (NGIT), Hyderabad",
  "CMR College of Engineering & Technology (CMRCET)",
  "CMR Institute of Technology (CMRIT)",
  "CMR Technical Campus (CMRTC)",
  "Malla Reddy Engineering College (MREC)",
  "Malla Reddy College of Engineering and Technology (MRCET)",
  "Institute of Aeronautical Engineering (IARE), Hyderabad",
  "MLR Institute of Technology (MLRIT)",
  "Marri Laxman Reddy Institute of Technology and Management (MLRITM)",
  "Matrusri Engineering College, Hyderabad",
  "Geethanjali College of Engineering and Technology, Hyderabad",
  "Vidya Jyothi Institute of Technology (VJIT), Hyderabad",
  "Guru Nanak Institutions Technical Campus (GNITC)",
  "Guru Nanak Institute of Technology (GNIT)",
  "Sphoorthy Engineering College, Hyderabad",
  "TKR College of Engineering and Technology, Hyderabad",
  "Teegala Krishna Reddy Engineering College, Hyderabad",
  "Vignan Institute of Technology and Science, Hyderabad",
  "Deccan College of Engineering and Technology, Hyderabad",
  "Lords Institute of Engineering and Technology, Hyderabad",
  "St. Martin's Engineering College, Hyderabad",
  "Stanley College of Engineering and Technology for Women",
  "Methodist College of Engineering and Technology, Hyderabad",
  "J.B. Institute of Engineering and Technology (JBIET), Hyderabad",
  "KG Reddy College of Engineering and Technology, Hyderabad",
  "Holy Mary Institute of Technology and Science, Hyderabad",
  "Avanthi Institute of Engineering and Technology, Hyderabad",
  "Kommuri Pratap Reddy Institute of Technology (KPRIT)",
  "Vaagdevi College of Engineering, Warangal",
  "SR University, Warangal",
  "Sumathi reddy Institue of Technology,Warangal",
  "SVS Group of Enginerring,Warangal",
  "Jayamukhi Institute of Technological Sciences, Warangal",
  "Kamala Institute of Technology and Science, Karimnagar",
  "Jyothishmathi Institute of Technology and Science, Karimnagar",
  "Nalla Malla Reddy Engineering College, Hyderabad",
  "Others"
];

const AdminSignup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [timer, setTimer] = useState(0);
  const { loading, error, successMessage, otpSent } = useSelector((state) => state.admin);

  const { register, handleSubmit, watch, getValues, trigger, formState: { errors } } = useForm();
  
  const password = watch("password");
  const selectedInstitute = watch("institute"); // Watch the dropdown value

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
    // Dynamically check validation fields (adding customInstitute if "Others" is selected)
    const fieldsToValidate = ["name", "username", "email", "institute", "password", "confirmPassword"];
    if (selectedInstitute === "Others") {
      fieldsToValidate.push("customInstitute");
    }

    const isValid = await trigger(fieldsToValidate);
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
    
    // Handle dynamic institute selection
    const finalInstituteName = data.institute === "Others" ? data.customInstitute : data.institute;
    formData.append("institute", finalInstituteName);
    
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
                  <div className="w-full">
                    <input {...register("name", { required: "Name required" })} placeholder="Full Name" className="w-full bg-blue-50/50 border border-blue-200 rounded-lg px-4 py-2.5 text-sm" />
                    {errors.name && <p className="text-red-500 text-[10px] mt-1">{errors.name.message}</p>}
                  </div>
                  <div className="w-full">
                    <input {...register("username", { required: "Username required" })} placeholder="Username" className="w-full bg-blue-50/50 border border-blue-200 rounded-lg px-4 py-2.5 text-sm" />
                    {errors.username && <p className="text-red-500 text-[10px] mt-1">{errors.username.message}</p>}
                  </div>
                </div>

                <div className="w-full">
                  <input {...register("email", { required: "Email required", pattern: { value: /^\S+@\S+$/i, message: "Invalid email" } })} placeholder="Official Email" className="w-full bg-blue-50/50 border border-blue-200 rounded-lg px-4 py-2.5 text-sm" />
                  {errors.email && <p className="text-red-500 text-[10px] mt-1">{errors.email.message}</p>}
                </div>

                {/* --- NEW COLLEGE DROPDOWN --- */}
                <div className="w-full flex flex-col gap-2">
                  <select 
                    {...register("institute", { required: "Institute selection required" })} 
                    className={`w-full bg-blue-50/50 border border-blue-200 rounded-lg px-4 py-2.5 text-sm appearance-none outline-none ${!selectedInstitute ? 'text-gray-500' : 'text-slate-800'}`}
                    defaultValue=""
                  >
                    <option value="" disabled>Select Institute Name</option>
                    {collegesList.map(c => (
                      <option key={c} value={c} className="text-slate-800 bg-white">{c}</option>
                    ))}
                  </select>
                  {errors.institute && <p className="text-red-500 text-[10px]">{errors.institute.message}</p>}
                  
                  {/* Conditional Textbox for "Others" */}
                  {selectedInstitute === "Others" && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="w-full">
                      <input 
                        {...register("customInstitute", { required: "Please specify your institute" })} 
                        placeholder="Type your Institute Name" 
                        className="w-full bg-white border border-blue-300 rounded-lg px-4 py-2.5 text-sm focus:border-blue-500 outline-none transition-colors" 
                      />
                      {errors.customInstitute && <p className="text-red-500 text-[10px] mt-1">{errors.customInstitute.message}</p>}
                    </motion.div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="w-full">
                    <input type="password" {...register("password", { required: "Min 8 chars", minLength: { value: 8, message: "Too short" } })} placeholder="Password" className="w-full bg-blue-50/50 border border-blue-200 rounded-lg px-4 py-2.5 text-sm" />
                    {errors.password && <p className="text-red-500 text-[10px] mt-1">{errors.password.message}</p>}
                  </div>
                  <div className="w-full">
                    <input type="password" {...register("confirmPassword", { validate: v => v === password || "Mismatch" })} placeholder="Confirm Password" className="w-full bg-blue-50/50 border border-blue-200 rounded-lg px-4 py-2.5 text-sm" />
                    {errors.confirmPassword && <p className="text-red-500 text-[10px] mt-1">{errors.confirmPassword.message}</p>}
                  </div>
                </div>

                <button type="button" onClick={handleSendOtp} disabled={loading} className="w-full bg-blue-600 text-white font-bold rounded-lg py-3 hover:bg-blue-700 transition shadow-md mt-2">
                  {loading ? "Sending..." : "Next: Verify Email"}
                </button>
              </>
            ) : (
              <div className="flex flex-col items-center">
                <p className="text-sm text-slate-600 mb-4">Code sent to: <b>{getValues("email")}</b></p>
                
                <div className="w-full">
                  <input {...register("otpCode", { required: "OTP is required" })} placeholder="000000" maxLength={6} className="w-full text-center text-3xl tracking-[10px] p-3 border-b-2 border-blue-400 bg-transparent outline-none font-bold mb-2" />
                  {errors.otpCode && <p className="text-red-500 text-xs text-center">{errors.otpCode.message}</p>}
                </div>

                <button type="submit" disabled={loading} className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 mt-4">
                  {loading ? "Verifying..." : "Verify & Complete"}
                </button>

                <div className="mt-4 text-center">
                  {timer > 0 ? <p className="text-xs text-slate-500">Resend in {timer}s</p> : 
                  <button type="button" onClick={handleSendOtp} className="text-xs text-blue-600 font-bold underline">Resend OTP</button>}
                </div>
                <button type="button" onClick={() => dispatch(resetSignupFlow())} className="mt-4 text-xs text-slate-400 hover:text-slate-600 transition-colors">Back to Edit Details</button>
              </div>
            )}
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminSignup;