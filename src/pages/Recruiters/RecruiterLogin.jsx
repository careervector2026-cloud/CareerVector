import React, { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { loginRecruiter, clearRecruiterErrors } from "../../redux/recruiterRedux/recruiterSlice";

const RecruiterLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { loading, error, isAuthenticated } = useSelector((state) => state.recruiter);

  useEffect(() => {
    if (isAuthenticated) navigate("/recruiter/home");
    return () => { dispatch(clearRecruiterErrors()); };
  }, [isAuthenticated, navigate, dispatch]);

  const onSubmit = (data) => dispatch(loginRecruiter(data));

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#87a6e9] to-[#1e40af] flex items-center justify-center font-sans">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-[400px]">
        <h2 className="text-center text-2xl font-bold text-blue-900 mb-6">Recruiter Login</h2>
        
        {error && <div className="bg-red-100 text-red-500 p-2 rounded text-center text-sm mb-4">{error}</div>}

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <input {...register("emailOrUsername", { required: true })} placeholder="Email or Username" className="w-full p-3.5 rounded-lg border border-slate-300 outline-none focus:border-indigo-500" />
          <input type="password" {...register("password", { required: true })} placeholder="Password" className="w-full p-3.5 rounded-lg border border-slate-300 outline-none focus:border-indigo-500" />
          
          <button type="submit" disabled={loading} className="w-full p-3.5 rounded-lg bg-indigo-600 text-white font-semibold mt-2 hover:bg-indigo-700 disabled:opacity-70">
            {loading ? "Logging in..." : "Continue"}
          </button>
        </form>

        <p className="text-center mt-5 text-sm text-slate-500">
          New user? <Link to="/recruiter/signup" className="text-indigo-600 font-semibold">Sign up</Link>
        </p>
      </motion.div>
    </div>
  );
};
export default RecruiterLogin;