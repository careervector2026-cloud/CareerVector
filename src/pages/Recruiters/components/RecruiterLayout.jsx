import React from "react";
import RecruiterSidebar from "./RecruiterSidebar";

const RecruiterLayout = ({
  children,
  activeTab,
  setActiveTab,
  isDarkMode,
  toggleTheme,
  handleLogout,
  currentRecruiter,
  menuItems,
}) => {
  
  const getInitials = (name) => {
    if (!name) return "RC";
    const parts = name.split(" ");
    return parts.length >= 2
      ? (parts[0][0] + parts[1][0]).toUpperCase()
      : name.substring(0, 2).toUpperCase();
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? "dark" : ""}`}>
      <div className="flex h-screen w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 overflow-hidden transition-colors duration-300">
        
        {/* SIDEBAR */}
        <RecruiterSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isDarkMode={isDarkMode}
          toggleTheme={toggleTheme}
          handleLogout={handleLogout}
          menuItems={menuItems}
        />

        {/* MAIN CONTENT AREA */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          
          {/* TOP HEADER */}
          <div className="h-16 bg-white dark:bg-slate-900 flex items-center justify-between px-8 shadow-sm border-b border-slate-200 dark:border-slate-800 z-10 flex-shrink-0 transition-colors">
            
            {/* Title */}
            <div>
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                {activeTab}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {currentRecruiter?.companyName ? `Recruiting for ${currentRecruiter.companyName}` : "Manage your hiring pipeline"}
              </p>
            </div>

            {/* Profile Section */}
            <div className="flex items-center gap-4">
                <div className="hidden md:flex items-center bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
                    <span className="mr-2">🔍</span>
                    <input type="text" placeholder="Search candidates..." className="bg-transparent border-none outline-none text-sm text-slate-600 dark:text-slate-300 w-40"/>
                </div>
                <div className="w-px h-8 bg-slate-200 dark:bg-slate-700 mx-1"></div>
                <div className="flex items-center gap-3">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-bold text-slate-800 dark:text-slate-200 leading-none">
                            {currentRecruiter?.fullName || "Recruiter"}
                        </p>
                        {/* Mapped 'role' from your data */}
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            {currentRecruiter?.role || "HR"}
                        </p>
                    </div>
                    
                    {/* Mapped 'imageUrl' from your data */}
                    {currentRecruiter?.imageUrl ? (
                        <img src={currentRecruiter.imageUrl} alt="Profile" className="w-10 h-10 rounded-full object-cover border-2 border-indigo-500" />
                    ) : (
                        <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-md">
                            {getInitials(currentRecruiter?.fullName)}
                        </div>
                    )}
                </div>
            </div>
          </div>

          {/* SCROLLABLE CONTENT */}
          <div className="flex-1 overflow-y-auto p-6 md:p-8 scroll-smooth">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
export default RecruiterLayout;