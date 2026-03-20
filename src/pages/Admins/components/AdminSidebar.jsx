import React from 'react';

const AdminSidebar = ({ activeTab, setActiveTab, isDarkMode, setIsDarkMode, handleLogout }) => {
  return (
    <aside className="w-64 bg-[#020617] text-slate-400 flex flex-col p-6 shrink-0 border-r border-slate-900 h-full">
      <div className="mb-10 text-white text-xl font-black italic tracking-tighter">Career Vector</div>
      
      <nav className="flex-1 space-y-2">
        <TabBtn id="Home" active={activeTab} set={setActiveTab} icon="🏠" label="Home" />
        <TabBtn id="Analytics" active={activeTab} set={setActiveTab} icon="📊" label="Analytics" />
        {/* <TabBtn id="Student Details" active={activeTab} set={setActiveTab} icon="👨‍🎓" label="Students" /> */}
        <TabBtn id="Profile" active={activeTab} set={setActiveTab} icon="👤" label="Settings" />
      </nav>

      <div className="border-t border-slate-900 pt-6 space-y-2">
        <button onClick={() => setIsDarkMode(!isDarkMode)} className="w-full text-left px-4 py-2 text-sm opacity-60 flex items-center gap-2 font-bold">
          {isDarkMode ? '☀️ Light' : '🌙 Dark'}
        </button>
        <button onClick={handleLogout} className="w-full text-left px-4 py-3 rounded-xl text-sm font-black text-red-400 hover:bg-red-500/10 transition-all flex items-center gap-2">
          🚪 Logout
        </button>
      </div>
    </aside>
  );
};

const TabBtn = ({ id, active, set, icon, label }) => (
  <button onClick={() => set(id)} className={`w-full text-left px-4 py-3 rounded-xl font-bold transition-all flex items-center gap-3 ${active === id ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'hover:bg-slate-900 hover:text-white'}`}>
    <span className="text-lg">{icon}</span> {label}
  </button>
);

export default AdminSidebar;