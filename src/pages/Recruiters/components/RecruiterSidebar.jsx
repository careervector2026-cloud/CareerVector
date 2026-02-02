import React from "react";

const RecruiterSidebar = ({ activeTab, setActiveTab, isDarkMode, toggleTheme, handleLogout, menuItems }) => {
  return (
    <div className="w-64 min-w-[16rem] h-screen bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col flex-shrink-0 z-20 transition-colors duration-300">
      
      {/* Brand Logo */}
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-500/30">
          CV
        </div>
        <div>
          <h1 className="text-xl font-extrabold text-slate-800 dark:text-white tracking-tight">
            CareerVector
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Recruiter Panel</p>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1.5">
        {menuItems.map((item) => (
          <div
            key={item.name}
            onClick={() => setActiveTab(item.name)}
            className={`
              flex items-center gap-3 px-4 py-3 cursor-pointer text-sm font-semibold transition-all duration-200 rounded-xl group
              ${activeTab === item.name 
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20" 
                : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400"
              }
            `}
          >
            <span className={`text-lg transition-transform duration-200 ${activeTab === item.name ? "scale-110" : "group-hover:scale-110"}`}>
                {item.icon}
            </span>
            {item.name}
          </div>
        ))}
      </nav>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
        <button 
          onClick={toggleTheme}
          className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors"
        >
          <span className="text-lg">{isDarkMode ? "☀️" : "🌙"}</span>
          {isDarkMode ? "Light Mode" : "Dark Mode"}
        </button>
        
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-colors"
        >
          <span className="text-lg">🚪</span> Logout
        </button>
      </div>
    </div>
  );
};

export default RecruiterSidebar;