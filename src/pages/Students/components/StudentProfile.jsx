import React, { useState, useEffect } from "react";
// import axios from "axios"; // TODO: Uncomment when ready
// import { useDispatch } from "react-redux"; // TODO: Uncomment for state updates
// import { updateStudentSuccess } from "../../../redux/studentSlice"; // TODO: Example action

const StudentProfile = ({ currentUser }) => {
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

  // Load data from Redux/Props
  useEffect(() => {
    if (currentUser) {
      setFormData((prev) => ({
        ...prev,
        mobileNumber: currentUser.mobileNumber || "",
        githubUrl: currentUser.githubUrl || "",
        // Check for both camelCase and lowercase variations from DB
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
    }
  }, [currentUser]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // =================================================================================
  // 1. SAVE SINGLE FIELD (Contact Links, GPAs, etc.)
  // =================================================================================
  const handleSaveField = async (fieldName, label) => {
    const value = formData[fieldName];
    
    // Construct payload dynamically based on the field being saved
    const updatePayload = { [fieldName]: value };
    
    console.log(`[Mock API] Updating ${label} with payload:`, updatePayload);

    /* // --- API INTEGRATION LOGIC ---
    try {
      // Endpoint: PATCH /api/v1/student/profile
      // Headers: Authorization: Bearer <token>
      const response = await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/v1/student/profile`, 
        updatePayload,
        { withCredentials: true } 
      );

      if (response.status === 200) {
        alert(`${label} updated successfully!`);
        // dispatch(updateStudentSuccess(response.data.student)); // Update Redux Store
      }
    } catch (error) {
      console.error("Update failed:", error);
      alert(`Failed to update ${label}. Please try again.`);
    }
    */
    
    // Temporary Success Message for UI Demo
    alert(`${label} updated successfully!`);
  };

  // =================================================================================
  // 2. UPDATE PASSWORD
  // =================================================================================
  const handleUpdatePassword = async () => {
    if (!formData.password) return alert("Please enter a new password.");
    if (formData.password !== formData.confirmPassword) {
      return alert("Passwords do not match!");
    }

    const payload = { password: formData.password };
    console.log("[Mock API] Updating Password:", payload);

    /* // --- API INTEGRATION LOGIC ---
    try {
      // Endpoint: POST /api/v1/student/change-password
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/student/change-password`, 
        payload,
        { withCredentials: true }
      );

      if (response.status === 200) {
        alert("Password updated successfully!");
        // Clear fields on success
        setFormData((prev) => ({ ...prev, password: "", confirmPassword: "" }));
      }
    } catch (error) {
      const errMsg = error.response?.data?.message || "Failed to update password";
      alert(errMsg);
    }
    */

    // Temporary Success Message for UI Demo
    alert("Password updated successfully!");
    setFormData((prev) => ({ ...prev, password: "", confirmPassword: "" }));
  };

  // =================================================================================
  // 3. FILE HANDLING (Selection & Preview)
  // =================================================================================
  const handleFileSelect = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate File Size (Example: Max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      return alert("File size exceeds 2MB limit.");
    }

    if (type === "Profile Pic") {
      setSelectedProfilePic(file);
      // Create a local URL for instant preview
      const previewUrl = URL.createObjectURL(file);
      setProfilePicPreview(previewUrl);
    } else {
      setSelectedResume(file);
    }
  };

  // =================================================================================
  // 4. SAVE UPLOAD (Profile Pic / Resume)
  // =================================================================================
  const handleUploadSave = async (type) => {
    const file = type === "Profile Pic" ? selectedProfilePic : selectedResume;
    
    if (!file) {
      return alert(`Please select a ${type} to upload first.`);
    }

    console.log(`[Mock API] Uploading ${type}:`, file.name);

    /* // --- API INTEGRATION LOGIC ---
    try {
      const uploadFormData = new FormData();
      uploadFormData.append("file", file); // 'file' must match backend middleware (e.g., multer)

      // Determine Endpoint based on type
      const endpoint = type === "Profile Pic" 
        ? "/api/v1/student/upload-avatar" 
        : "/api/v1/student/upload-resume";

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}${endpoint}`, 
        uploadFormData, 
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true
        }
      );

      if (response.status === 200) {
        alert(`${type} uploaded successfully!`);
        // dispatch(updateStudentSuccess(response.data.student)); // Update Redux with new URL
        
        // Clear preview if it was an avatar update
        if (type === "Profile Pic") {
           // setProfilePicPreview(null); // Optional: keep or clear
        }
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert(`Failed to upload ${type}.`);
    }
    */

    // Temporary Success Message
    alert(`${type} uploaded successfully!`);
  };

  // --- REUSABLE COMPONENT: INPUT + SAVE BUTTON ---
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

      {/* --- ACADEMIC GRADES (3 Columns) --- */}
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;