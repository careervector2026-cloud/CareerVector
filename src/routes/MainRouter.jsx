import React from "react";
import { Routes, Route } from "react-router-dom";

import Index from "../pages/Index.jsx";
import StudentLogin from "../pages/Students/StudentLogin.jsx";
import StudentSignup from "../pages/Students/studentsignup.jsx";
import RecruiterLogin from "../pages/Recruiters/RecruiterLogin.jsx";
import AdminLogin from "../pages/Admins/AdminLogin.jsx";

import RecruiterSignup from "../pages/Recruiters/RecruiterSignup.jsx";
import RecruiterVerify from "../pages/Recruiters/RecruiterVerify.jsx"; 
const MainRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/student/login" element={<StudentLogin />} />
      <Route path="/student/signup" element={<StudentSignup />} />
      <Route path="/recruiter/signup" element={<RecruiterSignup />} />

        {/* ✅ ADDED ROUTE */}
        <Route path="/recruiter/verify" element={<RecruiterVerify />} />

      <Route path="/recruiter/login" element={<RecruiterLogin />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="*" element={<Index />} />
    </Routes>
  );
};

export default MainRouter;
