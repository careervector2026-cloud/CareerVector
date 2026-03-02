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
import PostJobs from "../pages/Recruiters/components/PostJobs.jsx";
import EditJobs from "../pages/Recruiters/components/EditJobs.jsx";
import ClosedJobs from "../pages/Recruiters/components/ClosedJobs.jsx";
import Candidates from "../pages/Recruiters/components/Candidates.jsx";
// Admin Pages
import AdminLogin from "../pages/Admins/AdminLogin.jsx";
import AdminSignup from "../pages/Admins/AdminSignup.jsx";

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
      <Route path="/admin/signup" element={<AdminSignup></AdminSignup>}></Route>

      {/* ==============================
          PROTECTED ROUTES (Login Required)
      =============================== */}
      
      {/* 🛡️ Recruiter Protected Area */}
      {/* Any route nested inside here checks state.recruiter.isAuthenticated */}
      <Route element={<ProtectedRoute roleType="recruiter" />}>
        <Route path="/recruiter/home" element={<RecruiterPortal/>} />
        <Route path="/recruiter/home/post-jobs" element={<PostJobs />} />
        <Route path="/recruiter/home/edit-jobs" element={<EditJobs/>} />
        <Route path="/recruiter/home/close-jobs" element={<ClosedJobs/>} />
        <Route path="/recruiter/home/candidates" element={<Candidates />} />
        {/* Add more recruiter routes here later, e.g., /recruiter/post-job */}
      </Route>

      {/* 🛡️ Admin Protected Area */}
      <Route element={<ProtectedRoute roleType="admin" />}>
         {/* Placeholder for future admin dashboard */}
         <Route path="/admin/dashboard" element={<h2>Welcome Mr.Admin</h2>} />
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