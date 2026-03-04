import React from "react";
import AdminSidebar from "./AdminSidebar";

const AdminLayout = ({ children, activeTab, setActiveTab, isDarkMode, setIsDarkMode, handleLogout, admin }) => {
  return (
    <div className={`flex h-screen ${isDarkMode ? "bg-slate-950 text-white" : "bg-slate-50 text-slate-900"}`}>
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        handleLogout={handleLogout}
      />

      <main className="flex-1 p-10 overflow-y-auto">
        <header className="flex justify-between items-center mb-12">
          <h1 className="text-3xl font-black tracking-tight">{activeTab}</h1>
          <div className="flex items-center gap-3 bg-white dark:bg-slate-900 p-2 px-5 rounded-full shadow-sm border dark:border-slate-800">
            <div className="text-right">
              <p className="text-sm font-black leading-none">{admin.userName}</p>
              <p className="text-[10px] font-bold text-blue-500 uppercase mt-1 tracking-tighter">Administrator</p>
            </div>
            <img 
              src={admin.imageUrl || `https://ui-avatars.com/api/?name=${admin.userName}&background=2563eb&color=fff`} 
              className="w-10 h-10 rounded-full border-2 border-blue-500 object-cover" 
              alt="admin" 
            />
          </div>
        </header>
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;