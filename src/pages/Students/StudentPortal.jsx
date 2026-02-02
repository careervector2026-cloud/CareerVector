import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
// Adjust this import path if your redux folder is located elsewhere
import { logoutStudent } from "../../redux/studentRedux/studentSlice";

// Import local components
import StudentLayout from "./components/StudentLayout"
import StudentDashboard from "./components/StudentDashboard";
import StudentProfile from "./components/StudentProfile";

const StudentPortal = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.student || {});

  // --- STATE MANAGEMENT ---
  const [activeTab, setActiveTab] = useState("Home");
  
  // Initialize theme from localStorage so the preference persists on refresh
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  // --- THEME EFFECT ---
  // This adds/removes the 'dark' class on the HTML <html> tag
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
    dispatch(logoutStudent());
    navigate("/login");
  };

  const menuItems = [
    { name: "Home", icon: "🏠" },
    { name: "Profile", icon: "👤" },
    { name: "Resume Analyzer", icon: "📄" },
    { name: "Skill Gap Detector", icon: "📊" },
    { name: "Interview Simulator", icon: "🎤" },
    { name: "Placement Insights", icon: "📈" },
    { name: "Learning Path", icon: "🎓" },
  ];

  // --- RENDER CONTENT ---
  const renderContent = () => {
    switch (activeTab) {
      case "Home":
        return <StudentDashboard currentUser={currentUser} />;
      
      case "Profile":
        return <StudentProfile currentUser={currentUser} />;
      
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
    <StudentLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      isDarkMode={isDarkMode}
      toggleTheme={toggleTheme}
      handleLogout={handleLogout}
      currentUser={currentUser}
      menuItems={menuItems}
    >
      {/* The active component is passed as a child to the layout */}
      {renderContent()}
    </StudentLayout>
  );
};

export default StudentPortal;