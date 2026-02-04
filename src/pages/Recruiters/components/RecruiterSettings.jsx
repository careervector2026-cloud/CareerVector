import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { 
  updateRecruiterProfile, 
  changePassword, 
  uploadRecruiterAvatar 
} from "../../../redux/recruiterRedux/recruiterSlice";

const RecruiterSettings = ({ recruiter }) => {
  const dispatch = useDispatch();

  // --- STATE ---
  const [mobile, setMobile] = useState("");
  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [passwords, setPasswords] = useState({ new: "", confirm: "" });
  const [profileImg, setProfileImg] = useState(null);

  // --- INIT STATE ---
  // Syncs local state with Redux data when the component loads or recruiter data updates
  useEffect(() => {
    if (recruiter) {
      setMobile(recruiter.mobile || "");
      setCompany(recruiter.companyName || "");
      setPosition(recruiter.role || ""); // Mapping backend 'role' to frontend 'position'
    }
  }, [recruiter]);

  // ========================================================================
  // 1. UNIFIED HANDLER FOR TEXT FIELDS
  // ========================================================================
  const handleUpdateField = async (fieldKey, value) => {
    // Basic validation
    if (!value || value.trim() === "") {
        alert(`${fieldKey} cannot be empty.`);
        return;
    }

    const updatePayload = {
      email: recruiter?.email,
      [fieldKey]: value,
    };

    try {
      // Dispatch action and wait for result
      const resultAction = await dispatch(updateRecruiterProfile(updatePayload));
      
      if (updateRecruiterProfile.fulfilled.match(resultAction)) {
        alert(`Successfully updated ${fieldKey === 'role' ? 'Position' : fieldKey}!`);
      } else {
        alert(`Failed to update: ${resultAction.payload}`);
      }
    } catch (error) {
      console.error("Update Error:", error);
      alert("An unexpected error occurred.");
    }
  };

  // ========================================================================
  // 2. CHANGE PASSWORD
  // ========================================================================
  const savePassword = async () => {
    if (passwords.new !== passwords.confirm) return alert("Passwords do not match!");
    if (!passwords.new) return alert("Enter a new password");

    const payload = {
      email: recruiter?.email,
      password: passwords.new,
    };

    try {
      const resultAction = await dispatch(changePassword(payload));
      
      if (changePassword.fulfilled.match(resultAction)) {
        alert("Password updated successfully!");
        setPasswords({ new: "", confirm: "" }); // Clear fields on success
      } else {
        alert(`Failed to update password: ${resultAction.payload}`);
      }
    } catch (error) {
      alert("An error occurred while updating password.");
    }
  };

  // ========================================================================
  // 3. UPLOAD PROFILE PICTURE
  // ========================================================================
  const saveProfilePic = async () => {
    if (!profileImg) return alert("Select an image first");

    const formData = new FormData();
    formData.append("email", recruiter?.email);
    formData.append("file", profileImg);

    try {
      const resultAction = await dispatch(uploadRecruiterAvatar(formData));
      
      if (uploadRecruiterAvatar.fulfilled.match(resultAction)) {
        alert("Profile picture uploaded successfully!");
        setProfileImg(null); // Clear file selection
      } else {
        alert(`Upload failed: ${resultAction.payload}`);
      }
    } catch (error) {
      alert("Error uploading image.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in pb-10">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        
        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">Update Profile</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Update your professional details. Core identity fields are read-only.
          </p>
        </div>

        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-10">
          
          {/* --- LOCKED FIELDS --- */}
          <div className="space-y-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2 mb-4">
              🔒 Identity (Locked)
            </h3>
            <ReadOnlyField label="Full Name" value={recruiter?.fullName} />
            <ReadOnlyField label="Username" value={recruiter?.userName} />
            <ReadOnlyField label="Email Address" value={recruiter?.email} />
          </div>

          {/* --- EDITABLE FIELDS --- */}
          <div className="space-y-8">
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-500 flex items-center gap-2 mb-4">
              ✏️ Editable Details
            </h3>

            <EditableField 
                label="Mobile Number" 
                value={mobile} 
                onChange={setMobile} 
                onSave={() => handleUpdateField("mobile", mobile)} 
                placeholder="+91..." 
            />

            <EditableField 
                label="Company" 
                value={company} 
                onChange={setCompany} 
                onSave={() => handleUpdateField("companyName", company)} 
            />

            <EditableField 
                label="Role / Position" 
                value={position} 
                onChange={setPosition} 
                onSave={() => handleUpdateField("role", position)} 
            />

            {/* Password Section */}
            <div className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 space-y-4">
                <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">Change Password</h4>
                <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">New Password</label>
                    <input 
                        type="password" 
                        value={passwords.new} 
                        onChange={(e) => setPasswords({...passwords, new: e.target.value})} 
                        className="input-field" 
                        placeholder="Enter new password" 
                    />
                </div>
                <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Confirm Password</label>
                    <input 
                        type="password" 
                        value={passwords.confirm} 
                        onChange={(e) => setPasswords({...passwords, confirm: e.target.value})} 
                        className="input-field" 
                        placeholder="Re-enter new password" 
                    />
                </div>
                <button 
                    onClick={savePassword} 
                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition-all shadow-md shadow-indigo-500/20"
                >
                    Update Password
                </button>
            </div>

            {/* Profile Picture */}
            <div className="flex items-center gap-4 pt-2">
                <div className="w-14 h-14 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex-shrink-0">
                    {profileImg ? (
                        <img src={URL.createObjectURL(profileImg)} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                        recruiter?.imageUrl ? (
                           <img src={recruiter.imageUrl} alt="Current" className="w-full h-full object-cover" />
                        ) : (
                           <div className="w-full h-full flex items-center justify-center text-xl">📷</div>
                        )
                    )}
                </div>
                <div className="flex-1">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">Profile Picture</label>
                      <input 
                        type="file" 
                        onChange={(e) => setProfileImg(e.target.files[0])} 
                        accept="image/*" 
                        className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 dark:file:bg-indigo-900/30 dark:file:text-indigo-400 transition-all" 
                      />
                </div>
                <button 
                    onClick={saveProfilePic} 
                    className="px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-white text-xs font-bold rounded-lg transition-all h-fit self-center"
                >
                    Upload
                </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Internal CSS for scoped styles */}
      <style>{`
        .input-field { width: 100%; padding: 10px 16px; border-radius: 12px; border: 1px solid #cbd5e1; background: #ffffff; outline: none; transition: all 0.2s; color: #1e293b; }
        .input-field:focus { border-color: #4f46e5; box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2); }
        .dark .input-field { background-color: #0f172a; border-color: #334155; color: #f8fafc; }
      `}</style>
    </div>
  );
};

// --- HELPER COMPONENTS ---

const ReadOnlyField = ({ label, value }) => (
    <div className="space-y-1.5">
        <label className="text-xs font-semibold text-slate-500">{label}</label>
        <input 
            type="text" 
            value={value || ""} 
            disabled 
            className="w-full px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-transparent text-slate-500 dark:text-slate-400 cursor-not-allowed outline-none" 
        />
    </div>
);

const EditableField = ({ label, value, onChange, onSave, placeholder }) => (
    <div className="flex items-end gap-3">
        <div className="space-y-1.5 flex-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">{label}</label>
            <input 
                type="text" 
                value={value} 
                onChange={(e) => onChange(e.target.value)} 
                className="input-field" 
                placeholder={placeholder} 
            />
        </div>
        <button 
            onClick={onSave} 
            className="px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition-all shadow-md shadow-indigo-500/20 h-[46px]"
        >
            Save
        </button>
    </div>
);

export default RecruiterSettings;