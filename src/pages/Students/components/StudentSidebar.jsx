import React from "react";

const StudentSidebar = ({ activeTab, setActiveTab, isDarkMode, toggleTheme, handleLogout, menuItems }) => {
  return (
    <div className="w-64 min-w-[16rem] h-screen bg-slate-900 text-white flex flex-col flex-shrink-0 shadow-xl z-20">
      {/* Logo Section */}
      <div className="p-6 border-b border-white/10">
        <h1 className="text-2xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent m-0 tracking-tight">
          CareerVector
        </h1>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1 scrollbar-thin scrollbar-thumb-slate-700">
        {menuItems.map((item) => (
          <div
            key={item.name}
            onClick={() => setActiveTab(item.name)}
            className={`
              flex items-center gap-3 px-4 py-3 cursor-pointer text-sm font-medium transition-all duration-200 rounded-lg group
              ${activeTab === item.name 
                ? "bg-blue-600/90 text-white shadow-md shadow-blue-500/20" 
                : "text-slate-400 hover:bg-white/5 hover:text-slate-100"
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

      {/* Footer Section */}
      <div className="p-4 border-t border-white/10 space-y-2 bg-slate-900">
        <div 
          onClick={toggleTheme}
          className="flex items-center gap-3 px-4 py-3 cursor-pointer text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors border border-transparent hover:border-slate-700"
        >
          <span className="text-lg">{isDarkMode ? "☀️" : "🌙"}</span>
          {isDarkMode ? "Light Theme" : "Dark Theme"}
        </div>
        
        <div 
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 cursor-pointer text-sm font-medium text-red-400 hover:text-red-100 hover:bg-red-500/20 rounded-lg transition-colors"
        >
          <span className="text-lg">🚪</span> Logout
        </div>
      </div>
    </div>
  );
};

export default StudentSidebar;