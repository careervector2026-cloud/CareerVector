import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { logoutRecruiter } from "../../redux/recruiterRedux/recruiterSlice";

import RecruiterLayout from "./components/RecruiterLayout";
import RecruiterDashboard from "./components/RecruiterDashboard";
import RecruiterSettings from "./components/RecruiterSettings"; 
import RecruiterJobs from "./components/RecruiterJobs";
import Candidates from "./components/Candidates";
import RecruiterInterviews from "./components/RecruiterInterviews";

const RecruiterPortal = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  const { currentRecruiter } = useSelector((state) => state.recruiter || {});
  const [activeTab, setActiveTab] = useState("Dashboard");

  // NEW: Effect to catch tab changes passed through navigation state
  useEffect(() => {
    if (location.state && location.state.activeTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [location]);

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

  const handleLogout = () => {
    dispatch(logoutRecruiter());
    navigate("/recruiter/login");
  };

  const menuItems = [
    { name: "Dashboard", icon: "📊" },
    { name: "Jobs", icon: "💼" },
    { name: "Candidates", icon: "👥" },
    { name: "Interviews", icon: "🎤" },
    { name: "Analytics", icon: "📈" },
    { name: "Settings", icon: "⚙️" },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "Dashboard":
        return <RecruiterDashboard />; 
      case "Settings":
        return <RecruiterSettings recruiter={currentRecruiter} />; 
      case "Jobs":
        return <RecruiterJobs />;
      case "Candidates":
        return <Candidates />;
      case "Interviews":
        return <RecruiterInterviews/>
      default:
        return (
          <div className="flex flex-col items-center justify-center h-96 text-center animate-pulse">
            <div className="w-16 h-16 bg-slate-200 dark:bg-slate-800 rounded-full flex items-center justify-center text-3xl mb-4">
                🚧
            </div>
            <h3 className="text-2xl font-bold text-slate-700 dark:text-slate-300">{activeTab}</h3>
            <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-sm">
              This feature is currently under development. Check back soon!
            </p>
          </div>
        );
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
      {/* Content will now be rendered inside the layout with consistent styling */}
      <div className="max-w-7xl mx-auto">
        {renderContent()}
      </div>
    </RecruiterLayout>
  );
};

export default RecruiterPortal;