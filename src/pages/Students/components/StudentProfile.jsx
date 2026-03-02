import React, { useState, useEffect, memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
  uploadProfileImage, 
  uploadResume, 
  updateStudentProfile 
} from "../../../redux/studentRedux/studentSlice";
import axiosInstance from "../../../config/AxiosConfig";

// --- REUSABLE COMPONENT (OUTSIDE TO PREVENT FOCUS LOSS) ---
const FieldRow = memo(({ label, name, placeholder, type = "text", value, onChange, onSave }) => (
  <div className="flex flex-col gap-2">
    <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">
      {label}
    </label>
    <div className="flex gap-8 items-center"> {/* Increased gap from 4 to 8 for more space */}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="flex-1 px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-slate-300 dark:placeholder:text-slate-600"
      />
      <button
        onClick={() => onSave(name, label)}
        className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shadow-sm active:scale-95"
      >
        Save
      </button>
    </div>
  </div>
));

const StudentProfile = () => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.student);

  const [formData, setFormData] = useState({
    mobileNumber: "",
    githubUrl: "",
    leetcodeUrl: "",
    hackerrankUrl: "",
    codechefUrl: "",
    clgName: "",
    password: "",
    confirmPassword: "",
    gpa_sem_1: "", gpa_sem_2: "", gpa_sem_3: "", gpa_sem_4: "",
    gpa_sem_5: "", gpa_sem_6: "", gpa_sem_7: "", gpa_sem_8: "",
  });

  const [selectedProfilePic, setSelectedProfilePic] = useState(null);
  const [profilePicPreview, setProfilePicPreview] = useState(null);
  const [selectedResume, setSelectedResume] = useState(null);

  useEffect(() => {
    if (currentUser) {
      setFormData((prev) => ({
        ...prev,
        mobileNumber: currentUser.mobileNumber || "",
        githubUrl: currentUser.githubUrl || "",
        leetcodeUrl: currentUser.leetcodeUrl || currentUser.leetcodeurl || "",
        hackerrankUrl: currentUser.hackerrankUrl || currentUser.hackerrankurl || "",
        codechefUrl: currentUser.codechefUrl || currentUser.codechefurl || "",
        clgName: currentUser.clgName || "",
        gpa_sem_1: currentUser.gpa_sem_1 || "",
        gpa_sem_2: currentUser.gpa_sem_2 || "",
        gpa_sem_3: currentUser.gpa_sem_3 || "",
        gpa_sem_4: currentUser.gpa_sem_4 || "",
        gpa_sem_5: currentUser.gpa_sem_5 || "",
        gpa_sem_6: currentUser.gpa_sem_6 || "",
        gpa_sem_7: currentUser.gpa_sem_7 || "",
        gpa_sem_8: currentUser.gpa_sem_8 || "",
      }));

      if (currentUser.profileImageUrl) {
        setProfilePicPreview(currentUser.profileImageUrl);
      }
    }
  }, [currentUser]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveField = async (fieldName, label) => {
    const value = formData[fieldName];
    const updatePayload = { 
        email: currentUser?.email,
        [fieldName]: value        
    };
    
    const resultAction = await dispatch(updateStudentProfile(updatePayload));
    if (updateStudentProfile.fulfilled.match(resultAction)) {
      alert(`${label} updated successfully!`);
    } else {
      alert(`Failed to update ${label}: ${resultAction.payload}`);
    }
  };

  const handleUpdatePassword = async () => {
    if (!formData.password) return alert("Please enter a new password.");
    if (formData.password !== formData.confirmPassword) {
      return alert("Passwords do not match!");
    }

    try {
      const response = await axiosInstance.patch(`/api/student/change-password`, { 
        email: currentUser?.email,
        password: formData.password 
      });

      if (response.status === 200) {
        alert("Password updated successfully!");
        setFormData((prev) => ({ ...prev, password: "", confirmPassword: "" }));
      }
    } catch (error) {
      alert("Failed to update password: " + (error.response?.data || error.message));
    }
  };

  const handleFileSelect = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    if (type === "Profile Pic") {
      setSelectedProfilePic(file);
      setProfilePicPreview(URL.createObjectURL(file));
    } else {
      setSelectedResume(file);
    }
  };

  const handleUploadSave = async (type) => {
    const file = type === "Profile Pic" ? selectedProfilePic : selectedResume;
    if (!file) return alert(`Please select a ${type} first.`);

    const uploadFormData = new FormData();
    uploadFormData.append("file", file);
    uploadFormData.append("email", currentUser?.email);

    const action = type === "Profile Pic" ? uploadProfileImage : uploadResume;
    const resultAction = await dispatch(action(uploadFormData));

    if (action.fulfilled.match(resultAction)) {
      alert(`${type} updated successfully!`);
      type === "Profile Pic" ? setSelectedProfilePic(null) : setSelectedResume(null);
    } else {
      alert("Upload failed: " + resultAction.payload);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 md:p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 transition-colors duration-300 my-10">
      <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-8 pb-4 border-b border-slate-200 dark:border-slate-700">
        Profile Settings
      </h2>

      {/* --- PERSONAL DETAILS --- */}
      <section className="mb-10">
        <h4 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-5 border-l-4 border-blue-600 pl-3">
          Personal Details
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { label: "Full Name", val: currentUser?.fullName },
            { label: "Email ID", val: currentUser?.email },
            { label: "Roll Number", val: currentUser?.rollNumber },
            { label: "Branch", val: currentUser?.branch },
          ].map((item, idx) => (
            <div key={idx} className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">{item.label}</label>
              <input
                value={item.val || ""}
                readOnly
                className="px-4 py-2.5 rounded-lg border border-transparent bg-slate-100 dark:bg-slate-700/50 text-slate-500 dark:text-slate-300 font-bold text-sm cursor-not-allowed focus:outline-none"
              />
            </div>
          ))}
        </div>
      </section>

      {/* --- CONTACT & LINKS --- */}
      <section className="mb-10">
        <h4 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-5 border-l-4 border-blue-600 pl-3">
          Contact & Coding Profiles
        </h4>
        <div className="flex flex-col gap-6">
          <FieldRow label="Mobile Number" name="mobileNumber" value={formData.mobileNumber} onChange={handleInputChange} onSave={handleSaveField} placeholder="Enter mobile number" />
          <FieldRow label="College Name" name="clgName" value={formData.clgName} onChange={handleInputChange} onSave={handleSaveField} placeholder="Enter College Name" />
          <FieldRow label="GitHub URL" name="githubUrl" value={formData.githubUrl} onChange={handleInputChange} onSave={handleSaveField} placeholder="https://github.com/..." />
          <FieldRow label="LeetCode URL" name="leetcodeUrl" value={formData.leetcodeUrl} onChange={handleInputChange} onSave={handleSaveField} placeholder="https://leetcode.com/..." />
        </div>
      </section>

      {/* --- ACADEMIC GRADES --- */}
      <section className="mb-10">
        <h4 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-5 border-l-4 border-blue-600 pl-3">
          Semester GPAs
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8"> {/* Increased grid gap here too */}
          {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
            <FieldRow
              key={sem}
              label={`Sem ${sem} SGPA`}
              name={`gpa_sem_${sem}`}
              type="number"
              value={formData[`gpa_sem_${sem}`]}
              onChange={handleInputChange}
              onSave={handleSaveField}
              placeholder="0.00"
            />
          ))}
        </div>
      </section>

      {/* --- DOCUMENTS & SECURITY --- */}
      <section className="mb-6">
        <h4 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-5 border-l-4 border-blue-600 pl-3">
          Documents & Security
        </h4>

        {/* Password Update */}
        <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-5">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">New Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="New password"
                className="px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm password"
                className="px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <button
            onClick={handleUpdatePassword}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors shadow-md active:scale-95"
          >
            Update Password
          </button>
        </div>

        {/* File Uploads */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* PROFILE PICTURE */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Profile Picture</label>
            <div className="flex gap-4 items-center">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileSelect(e, "Profile Pic")}
                className="flex-1 text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-slate-700 dark:file:text-slate-200 transition-all cursor-pointer"
              />
              <button
                onClick={() => handleUploadSave("Profile Pic")}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors shadow-sm"
              >
                Save
              </button>
            </div>
          </div>

          {/* RESUME UPLOAD */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Resume (PDF)</label>
            <div className="flex gap-4 items-center">
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => handleFileSelect(e, "Resume")}
                className="flex-1 text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-slate-700 dark:file:text-slate-200 transition-all cursor-pointer"
              />
              <button
                onClick={() => handleUploadSave("Resume")}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors shadow-sm"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default StudentProfile;