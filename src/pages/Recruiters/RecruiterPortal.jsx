import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
// Adjust path to your redux slice
import { logoutRecruiter } from "../../redux/recruiterRedux/recruiterSlice";

// Components
import RecruiterLayout from "./components/RecruiterLayout";
import RecruiterDashboard from "./components/RecruiterDashboard";

const RecruiterPortal = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentRecruiter } = useSelector((state) => state.recruiter || {});

  // --- STATE ---
  const [activeTab, setActiveTab] = useState("Dashboard");

  // Theme State (Persisted)
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  // --- THEME EFFECT ---
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  // --- ACTIONS ---
  const handleLogout = () => {
    dispatch(logoutRecruiter());
    navigate("/recruiter/login");
  };

  const menuItems = [
    { name: "Dashboard", icon: "📊" },
    { name: "Jobs", icon: "💼" },
    { name: "Candidates", icon: "👥" },
    { name: "Analytics", icon: "📈" },
    { name: "Settings", icon: "⚙️" },
  ];

  // --- CONTENT RENDERER ---
  const renderContent = () => {
    switch (activeTab) {
      case "Dashboard":
        return <RecruiterDashboard recruiter={currentRecruiter} />;
      
      // Placeholders for future modules
      case "Jobs":
      case "Candidates":
      case "Analytics":
      case "Settings":
        return (
          <div className="flex flex-col items-center justify-center h-96 text-center animate-fade-in">
            <div className="w-16 h-16 bg-slate-200 dark:bg-slate-800 rounded-full flex items-center justify-center text-3xl mb-4">
                🚧
            </div>
            <h3 className="text-2xl font-bold text-slate-700 dark:text-slate-300">{activeTab}</h3>
            <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-sm">
              The {activeTab} module is coming soon.
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <RecruiterLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      isDarkMode={isDarkMode}
      toggleTheme={toggleTheme}
      handleLogout={handleLogout}
      currentRecruiter={currentRecruiter}
      menuItems={menuItems}
    >
      {renderContent()}
    </RecruiterLayout>
  );
};

export default RecruiterPortal;