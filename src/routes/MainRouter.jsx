import React from 'react'
import { Routes,Route } from 'react-router-dom'
import Index from "../pages/Index.jsx"
import StudentLogin from "../pages/Students/StudentLogin.jsx"
import RecruiterLogin from "../pages/Recruiters/RecruiterLogin.jsx"
import AdminLogin from "../pages/Admins/AdminLogin.jsx"
const MainRouter = () => {
  return (
    <Routes>
        <Route path="/" element={<Index></Index>}></Route>
        <Route path="/student/login" element={<StudentLogin></StudentLogin>}></Route>
        <Route path="/recruiter/login" element={<RecruiterLogin></RecruiterLogin>}></Route>
        <Route path="/admin/login" element={<AdminLogin></AdminLogin>}></Route>
        <Route path="*" element={<Index></Index>}></Route>
    </Routes>
  )
}
export default MainRouter