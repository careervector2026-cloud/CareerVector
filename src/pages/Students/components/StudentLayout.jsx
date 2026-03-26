import React from "react";
import StudentSidebar from "./StudentSidebar"; // Sibling import

const StudentLayout = ({
  children,
  activeTab,
  setActiveTab,
  isDarkMode,
  toggleTheme,
  handleLogout,
  currentUser,
  menuItems,
}) => {

  // Helper to generate profile initials
  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.split(" ");
    return parts.length >= 2
      ? (parts[0][0] + parts[1][0]).toUpperCase()
      : name.substring(0, 2).toUpperCase();
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? "dark" : ""}`}>
      <div className="flex h-screen w-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-50 overflow-hidden transition-colors duration-300">
        
        {/* --- 1. SIDEBAR --- */}
        <StudentSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isDarkMode={isDarkMode}
          toggleTheme={toggleTheme}
          handleLogout={handleLogout}
          menuItems={menuItems}
        />

        {/* --- 2. MAIN CONTENT AREA --- */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          
          {/* Top Navigation / Header */}
          <div className="h-16 bg-slate-900 flex items-center justify-between px-8 shadow-md z-10 flex-shrink-0 border-b border-slate-800">
            <div className="text-slate-400 text-sm font-medium">
              Dashboard / <span className="text-white font-bold tracking-tight">{activeTab}</span>
            </div>

            <div className="flex items-center gap-4">
                <div className="hidden md:block text-right">
                    <p className="text-[10px] text-slate-500 uppercase font-black tracking-[0.2em] leading-none mb-1">Authenticated Student</p>
                    <p className="text-sm font-bold text-white leading-none">
                        {currentUser?.fullName || "Guest User"}
                    </p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black text-sm shadow-lg shadow-indigo-500/20 ring-2 ring-slate-800 uppercase italic transition-transform hover:scale-105">
                    {getInitials(currentUser?.fullName)}
                </div>
            </div>
          </div>

          {/* Page Content (Expanded Width) */}
          <div className="flex-1 overflow-y-auto p-4 md:p-10 scroll-smooth bg-slate-50 dark:bg-slate-950">
            {/* Changed from max-w-7xl (1280px) to max-w-[1800px] 
                to give all internal components more breathing room 
            */}
            <div className="max-w-[1800px] w-full mx-auto animate-fade-in">
                {children}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default StudentLayout;