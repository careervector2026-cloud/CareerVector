import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
  uploadProfileImage, 
  uploadResume, 
  updateStudentProfile 
} from "../../../redux/studentRedux/studentSlice";
import axiosInstance from "../../../config/AxiosConfig";

const StudentProfile = () => {
  const dispatch = useDispatch();
  
  // Get currentUser from Redux Store
  const { currentUser } = useSelector((state) => state.student);

  // --- STATE MANAGEMENT ---
  const [formData, setFormData] = useState({
    mobileNumber: "",
    githubUrl: "",
    leetcodeUrl: "",
    hackerrankUrl: "",
    codechefUrl: "",
    password: "",
    confirmPassword: "",
    gpa_sem_1: "", gpa_sem_2: "", gpa_sem_3: "", gpa_sem_4: "",
    gpa_sem_5: "", gpa_sem_6: "", gpa_sem_7: "", gpa_sem_8: "",
  });

  // File State
  const [selectedProfilePic, setSelectedProfilePic] = useState(null);
  const [profilePicPreview, setProfilePicPreview] = useState(null);
  const [selectedResume, setSelectedResume] = useState(null);

  // Load data from Redux currentUser
  useEffect(() => {
    if (currentUser) {
      setFormData((prev) => ({
        ...prev,
        mobileNumber: currentUser.mobileNumber || "",
        githubUrl: currentUser.githubUrl || "",
        leetcodeUrl: currentUser.leetcodeUrl || currentUser.leetcodeurl || "",
        hackerrankUrl: currentUser.hackerrankUrl || currentUser.hackerrankurl || "",
        codechefUrl: currentUser.codechefUrl || currentUser.codechefurl || "",
        gpa_sem_1: currentUser.gpa_sem_1 || "",
        gpa_sem_2: currentUser.gpa_sem_2 || "",
        gpa_sem_3: currentUser.gpa_sem_3 || "",
        gpa_sem_4: currentUser.gpa_sem_4 || "",
        gpa_sem_5: currentUser.gpa_sem_5 || "",
        gpa_sem_6: currentUser.gpa_sem_6 || "",
        gpa_sem_7: currentUser.gpa_sem_7 || "",
        gpa_sem_8: currentUser.gpa_sem_8 || "",
      }));

      // Set Profile Pic Preview
      if (currentUser.profileImageUrl) {
        setProfilePicPreview(currentUser.profileImageUrl);
      }
    }
  }, [currentUser]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // =================================================================================
  // 1. SAVE SINGLE FIELD (Via Redux)
  // =================================================================================
  const handleSaveField = async (fieldName, label) => {
    const value = formData[fieldName];
    const updatePayload = { 
        email: currentUser?.email,
        [fieldName]: value        
    };
    
    // Dispatch Redux Action
    const resultAction = await dispatch(updateStudentProfile(updatePayload));
    
    if (updateStudentProfile.fulfilled.match(resultAction)) {
      alert(`${label} updated successfully!`);
    } else {
      alert(`Failed to update ${label}: ${resultAction.payload}`);
    }
  };

  // =================================================================================
  // 2. UPDATE PASSWORD (Direct Axios - No need for global state update)
  // =================================================================================
  const handleUpdatePassword = async () => {
    if (!formData.password) return alert("Please enter a new password.");
    if (formData.password !== formData.confirmPassword) {
      return alert("Passwords do not match!");
    }

    const payload = { 
        email: currentUser?.email,
        password: formData.password 
    };
    
    try {
      const response = await axiosInstance.patch(
        `/api/student/change-password`, 
        payload
      );

      if (response.status === 200) {
        alert("Password updated successfully!");
        setFormData((prev) => ({ ...prev, password: "", confirmPassword: "" }));
      }
    } catch (error) {
      alert("Failed to update password: " + (error.response?.data || error.message));
    }
  };

  // =================================================================================
  // 3. FILE HANDLING
  // =================================================================================
  const handleFileSelect = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    if (type === "Profile Pic") {
      setSelectedProfilePic(file);
      // Show local preview immediately before upload
      const previewUrl = URL.createObjectURL(file);
      setProfilePicPreview(previewUrl);
    } else {
      setSelectedResume(file);
    }
  };

  // =================================================================================
  // 4. SAVE UPLOAD (Via Redux)
  // =================================================================================
  const handleUploadSave = async (type) => {
    const file = type === "Profile Pic" ? selectedProfilePic : selectedResume;

    if (!file) {
      return alert(`Please select a ${type} to upload first.`);
    }

    const uploadFormData = new FormData();
    uploadFormData.append("file", file);
    uploadFormData.append("email", currentUser?.email);

    try {
      if (type === "Profile Pic") {
        const resultAction = await dispatch(uploadProfileImage(uploadFormData));
        if (uploadProfileImage.fulfilled.match(resultAction)) {
          alert("Profile Picture updated successfully!");
          setSelectedProfilePic(null);
        } else {
          alert("Upload failed: " + resultAction.payload);
        }
      } else {
        const resultAction = await dispatch(uploadResume(uploadFormData));
        if (uploadResume.fulfilled.match(resultAction)) {
          alert("Resume uploaded successfully!");
          setSelectedResume(null);
        } else {
          alert("Upload failed: " + resultAction.payload);
        }
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("An unexpected error occurred.");
    }
  };

  // Reusable Form Row
  const FieldRow = ({ label, name, placeholder, type = "text" }) => (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">{label}</label>
      <div className="flex gap-4 items-center">
        <input
          type={type}
          name={name}
          value={formData[name]}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="flex-1 px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-slate-300"
        />
        <button
          onClick={() => handleSaveField(name, label)}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shadow-sm"
        >
          Save
        </button>
      </div>
    </div>
  );

  return (
    <div className="animate-fade-in max-w-5xl mx-auto p-6 md:p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 transition-colors duration-300">
      <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-8 pb-4 border-b border-slate-200 dark:border-slate-700">
        Profile Settings
      </h2>

      {/* --- READ-ONLY IDENTITY --- */}
      <div className="mb-10">
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
      </div>

      {/* --- CONTACT & LINKS --- */}
      <div className="mb-10">
        <h4 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-5 border-l-4 border-blue-600 pl-3">
          Contact & Coding Profiles
        </h4>
        <div className="flex flex-col gap-6">
          <FieldRow label="Mobile Number" name="mobileNumber" placeholder="Enter mobile number" />
          <FieldRow label="GitHub URL" name="githubUrl" placeholder="https://github.com/..." />
          <FieldRow label="LeetCode URL" name="leetcodeUrl" placeholder="https://leetcode.com/..." />
          <FieldRow label="HackerRank URL" name="hackerrankUrl" placeholder="https://hackerrank.com/..." />
          <FieldRow label="CodeChef URL" name="codechefUrl" placeholder="https://codechef.com/users/..." />
        </div>
      </div>

      {/* --- ACADEMIC GRADES --- */}
      <div className="mb-10">
        <h4 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-5 border-l-4 border-blue-600 pl-3">
          Semester GPAs
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
            <FieldRow
              key={sem}
              label={`Sem ${sem} SGPA`}
              name={`gpa_sem_${sem}`}
              type="number"
              placeholder="0.00"
            />
          ))}
        </div>
      </div>

      {/* --- DOCUMENTS & SECURITY --- */}
      <div className="mb-6">
        <h4 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-5 border-l-4 border-blue-600 pl-3">
          Documents & Security
        </h4>

        {/* Password Update */}
        <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 mb-8 transition-colors">
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
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors shadow-md"
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
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shadow-sm"
              >
                Save
              </button>
            </div>
            {/* Preview Image */}
            {profilePicPreview && (
              <div className="mt-3 flex items-center gap-3 animate-fade-in">
                <img 
                  src={profilePicPreview} 
                  alt="Preview" 
                  className="w-16 h-16 rounded-full object-cover border-2 border-blue-500 shadow-sm" 
                />
                <span className="text-xs text-slate-400">Preview selected image</span>
              </div>
            )}
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
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shadow-sm"
              >
                Save
              </button>
            </div>
            {selectedResume && (
              <p className="mt-1 text-xs text-green-600 dark:text-green-400">
                Selected: {selectedResume.name}
              </p>
            )}

            {/* Resume Link from Redux currentUser */}
            {currentUser?.resumeUrl && (
              <div className="mt-2">
                <a 
                  href={currentUser.resumeUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-blue-600 underline hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  View Current Resume
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;