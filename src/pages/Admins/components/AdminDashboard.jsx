import React from "react";

export const HomeView = ({ admin }) => (
  <div className="max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-500">
    <div className="bg-white dark:bg-slate-800 p-10 rounded-[2.5rem] shadow-sm border dark:border-slate-700">
      <div className="flex items-center gap-8 mb-10">
        <img 
          src={admin.imageUrl || `https://ui-avatars.com/api/?name=${admin.userName}&background=2563eb&color=fff`} 
          className="w-36 h-36 rounded-3xl object-cover border-4 border-blue-500/20 shadow-xl" 
          alt="profile" 
        />
        <div>
          <h2 className="text-4xl font-black">{admin.name}</h2>
          <p className="text-blue-500 font-bold uppercase tracking-widest text-xs mt-1">
            {admin.instituteName}
          </p>
          <div className="mt-3 flex gap-2">
            {admin.verified && (
              <span className="bg-green-500/10 text-green-500 text-[10px] font-black px-3 py-1 rounded-full border border-green-500/20">
                VERIFIED ADMIN
              </span>
            )}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DetailRow label="Login ID" value={`#CV-ADMIN-${admin.id}`} />
        <DetailRow label="Username" value={admin.userName} />
        <DetailRow label="Email Address" value={admin.email} />
        <DetailRow label="Organization" value={admin.instituteName} />
      </div>
    </div>
  </div>
);

const DetailRow = ({ label, value }) => (
  <div className="flex items-center justify-between border-b dark:border-slate-700 pb-4">
    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
    <span className="text-sm font-bold">{value}</span>
  </div>
);

export const AnalyticsView = () => (
    <div className="p-10 text-center text-slate-400 italic font-bold">Analytics Charts Loading...</div>
);

export const StudentsView = () => (
    <div className="p-10 text-center text-slate-400 italic font-bold">Student Records Loading...</div>
);