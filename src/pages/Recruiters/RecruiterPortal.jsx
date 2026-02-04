import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutRecruiter } from "../../redux/recruiterRedux/recruiterSlice";

// Components
import RecruiterLayout from "./components/RecruiterLayout";
import RecruiterDashboard from "./components/RecruiterDashboard";
import RecruiterSettings from "./components/RecruiterSettings"; 

const RecruiterPortal = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // 1. Get Recruiter Data from Redux
  const { currentRecruiter } = useSelector((state) => state.recruiter || {});

  // 2. Tab State
  const [activeTab, setActiveTab] = useState("Dashboard");

  // 3. Theme Logic
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');

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

  // 4. Logout Action
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

  // 5. Render Logic
  const renderContent = () => {
    switch (activeTab) {
      case "Dashboard":
        return <RecruiterDashboard />; // Renders JUST the widgets
      
      case "Settings":
        // Passes data to settings form
        return <RecruiterSettings recruiter={currentRecruiter} />; 

      case "Jobs":
      case "Candidates":
      case "Analytics":
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
    // The Layout wraps everything ONE time here
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