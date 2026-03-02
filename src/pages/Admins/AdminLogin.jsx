import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { loginAdmin, clearAdminErrors } from "../../redux/adminRedux/adminSlice";

const AdminLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Destructuring state from admin slice
  const { loading, error, isAuthenticated } = useSelector((state) => state.admin);

  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm();

  // If already authenticated, redirect to dashboard
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/admin/dashboard");
    }
    // Cleanup errors when mounting/unmounting
    return () => dispatch(clearAdminErrors());
  }, [isAuthenticated, navigate, dispatch]);

  const onLoginSubmit = async (data) => {
    // 'data' will now contain { emailOrUsername: "...", password: "..." }
    // which matches your Java LoginData DTO perfectly.
    dispatch(loginAdmin(data));
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#e0f2fe] via-[#bae6fd] to-[#7dd3fc] font-sans">
      <div className="relative z-10 max-w-5xl w-full flex flex-col md:flex-row items-center justify-center gap-12 md:gap-24">
        
        {/* Left Side: Branding */}
        <div className="text-center md:text-left flex-1">
          <h1 className="text-5xl md:text-6xl font-black text-slate-800 tracking-tight mb-2">
            Career<span className="text-blue-600">Vector</span>
          </h1>
          <p className="text-slate-600 text-lg md:text-xl font-semibold uppercase tracking-widest">Admin Portal</p>
        </div>

        {/* Right Side: Login Card */}
        <div className="w-full max-w-md bg-white/60 backdrop-blur-xl border border-white/40 rounded-2xl p-8 shadow-xl">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">Admin Login</h2>

          <form onSubmit={handleSubmit(onLoginSubmit)} className="flex flex-col gap-5">
            
            {/* emailOrUsername Field */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 ml-1 uppercase">Email or Username</label>
              <input 
                {...register("emailOrUsername", { required: "Email or Username is required" })}
                type="text"
                placeholder="admin@institute.edu"
                className={`w-full bg-blue-50/50 border ${errors.emailOrUsername ? 'border-red-400' : 'border-blue-200'} text-slate-800 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 transition-all`}
              />
              {errors.emailOrUsername && (
                <span className="text-red-500 text-[10px] font-bold ml-1">{errors.emailOrUsername.message}</span>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 ml-1 uppercase">Password</label>
              <input 
                type="password"
                {...register("password", { required: "Password is required" })}
                placeholder="••••••••"
                className={`w-full bg-blue-50/50 border ${errors.password ? 'border-red-400' : 'border-blue-200'} text-slate-800 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 transition-all`}
              />
              {errors.password && (
                <span className="text-red-500 text-[10px] font-bold ml-1">{errors.password.message}</span>
              )}
            </div>

            {/* Error Message from Backend */}
            {error && (
              <div className="bg-red-100/80 border border-red-200 text-red-600 text-xs font-bold p-3 rounded-lg">
                {typeof error === 'string' ? error : (error.message || "Invalid Credentials")}
              </div>
            )}

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={loading} 
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold rounded-lg px-4 py-3 transition-all shadow-lg active:scale-95"
            >
              {loading ? "Verifying..." : "Log In"}
            </button>

            <div className="flex flex-col items-center gap-2 mt-2">
              <p className="text-sm text-slate-500">
                New administrator?{" "}
                <span 
                  className="font-bold text-blue-600 underline cursor-pointer hover:text-blue-700 ml-1" 
                  onClick={() => navigate("/admin/signup")}
                >
                  Sign Up
                </span>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;