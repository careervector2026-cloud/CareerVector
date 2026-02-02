import React from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute"; // Make sure this path is correct

// Pages
import Index from "../pages/Index.jsx";

// Student Pages
import StudentLogin from "../pages/Students/StudentLogin.jsx";
import StudentSignup from "../pages/Students/StudentSignup.jsx"; // Check file casing!
import StudentPortal from "../pages/Students/StudentPortal.jsx";
// Recruiter Pages
import RecruiterLogin from "../pages/Recruiters/RecruiterLogin.jsx";
import RecruiterSignup from "../pages/Recruiters/RecruiterSignup.jsx";
import RecruiterPortal from "../pages/Recruiters/RecruiterPortal.jsx";

// Admin Pages
import AdminLogin from "../pages/Admins/AdminLogin.jsx";


const MainRouter = () => {
  return (
    <Routes>
      {/* ==============================
          PUBLIC ROUTES (No Login Required)
      =============================== */}
      <Route path="/" element={<Index />} />
      
      {/* Student Public */}
      <Route path="/student/login" element={<StudentLogin />} />
      <Route path="/student/signup" element={<StudentSignup />} />

      {/* Recruiter Public */}
      <Route path="/recruiter/signup" element={<RecruiterSignup />} />
      <Route path="/recruiter/login" element={<RecruiterLogin />} />

      {/* Admin Public */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* ==============================
          PROTECTED ROUTES (Login Required)
      =============================== */}
      
      {/* 🛡️ Recruiter Protected Area */}
      {/* Any route nested inside here checks state.recruiter.isAuthenticated */}
      <Route element={<ProtectedRoute roleType="recruiter" />}>
        <Route path="/recruiter/home" element={<RecruiterPortal/>} />
        {/* Add more recruiter routes here later, e.g., /recruiter/post-job */}
      </Route>

      {/* 🛡️ Admin Protected Area */}
      <Route element={<ProtectedRoute roleType="admin" />}>
         {/* Placeholder for future admin dashboard */}
         {/* <Route path="/admin/dashboard" element={<AdminDashboard />} /> */}
      </Route>

      {/* 🛡️ Student Protected Area */}
      <Route element={<ProtectedRoute roleType="student" />}>
         {/* Placeholder for future student profile */}
         {/* <Route path="/student/profile" element={<StudentProfile />} /> */}
         <Route path="/student/home" element={<StudentPortal></StudentPortal>}></Route>
      </Route>

      {/* Catch-all: Redirects unknown routes to Home */}
      <Route path="*" element={<Index />} />
    </Routes>
  );
};

export default MainRouter;