import React, { useState, useEffect } from "react";
// Correcting paths based on your folder structure
import AdminLayout from "./components/AdminLayout";
import { HomeView, AnalyticsView, StudentsView } from "./components/AdminDashboard";

const AdminPortal = () => {
  const [activeTab, setActiveTab] = useState("Home");
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    // 1. Fetching data from the exact key shown in your screenshot
    const storedData = localStorage.getItem("careerVectorAdmin");
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        setAdmin(parsedData);
      } catch (error) {
        console.error("Error parsing admin data:", error);
      }
    }
  }, []);

  const handleLogout = () => {
    if (window.confirm("Logout from Career Vector?")) {
      localStorage.clear();
      window.location.href = "/login";
    }
  };

  // 2. This prevents the "Loading" hang by rendering once admin data is found
  if (!admin) {
    return (
      <div className="h-screen bg-[#020617] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
          <p className="text-slate-400 font-bold italic tracking-tight">Loading Admin Profile...</p>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case "Home": return <HomeView admin={admin} />;
      case "Analytics": return <AnalyticsView />;
      case "Student Details": return <StudentsView />;
      case "Profile": return <ProfileSettingsView admin={admin} setAdmin={setAdmin} />;
      default: return <HomeView admin={admin} />;
    }
  };

  return (
    <AdminLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      isDarkMode={isDarkMode}
      setIsDarkMode={setIsDarkMode}
      handleLogout={handleLogout}
      admin={admin}
    >
      {renderContent()}
    </AdminLayout>
  );
};

// Internal Settings View
const ProfileSettingsView = ({ admin, setAdmin }) => {
  const [temp, setTemp] = useState({ ...admin });

  const handleUpdate = () => {
    setAdmin(temp);
    localStorage.setItem("careerVectorAdmin", JSON.stringify(temp));
    alert("Profile Updated Successfully!");
  };

  return (
    <div className="max-w-4xl space-y-8 animate-in fade-in duration-500">
      <div className="bg-white dark:bg-slate-800 p-10 rounded-[2rem] shadow-sm border dark:border-slate-700">
        <h3 className="text-xl font-black mb-8 italic">Manage Profile Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <InputBox label="Full Name" value={temp.name} onChange={(v) => setTemp({ ...temp, name: v })} />
          <InputBox label="Username" value={temp.userName} onChange={(v) => setTemp({ ...temp, userName: v })} />
          <InputBox label="Email" value={temp.email} onChange={(v) => setTemp({ ...temp, email: v })} />
          <InputBox label="Institution" value={temp.instituteName} onChange={(v) => setTemp({ ...temp, instituteName: v })} />
          <div className="md:col-span-2 pt-4">
            <button onClick={handleUpdate} className="bg-blue-600 text-white px-10 py-3 rounded-xl font-black text-xs shadow-lg hover:bg-blue-700 transition-all">
              SAVE CHANGES
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const InputBox = ({ label, value, onChange }) => (
  <div className="space-y-1">
    <label className="text-[10px] font-black text-slate-400 uppercase">{label}</label>
    <input
      className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border dark:border-slate-700 text-sm"
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);

export default AdminPortal;