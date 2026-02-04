import React from "react";

const RecruiterDashboard = () => {
  return (
    <div className="animate-fade-in space-y-8">
      
      {/* --- STATS GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          icon="💼" 
          value="12" 
          label="Active Jobs" 
          trend="+2 this week" 
          trendUp={true} 
        />
        <StatCard 
          icon="👥" 
          value="84" 
          label="Total Candidates" 
          trend="+12% vs last month" 
          trendUp={true} 
        />
        <StatCard 
          icon="⚡" 
          value="18d" 
          label="Avg. Time to Hire" 
          trend="-2 days (improved)" 
          trendUp={true} 
        />
      </div>

      {/* --- MAIN CONTENT GRID --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* RECRUITMENT FUNNEL */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">Recruitment Funnel</h3>
            <button className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">View Report</button>
          </div>
          
          <div className="space-y-6">
            <FunnelBar label="Applied" count={120} color="bg-indigo-300 dark:bg-indigo-900" width="100%" />
            <FunnelBar label="Screening" count={65} color="bg-indigo-400 dark:bg-indigo-700" width="60%" />
            <FunnelBar label="Interview" count={24} color="bg-indigo-500 dark:bg-indigo-600" width="30%" />
            <FunnelBar label="Offer Sent" count={8} color="bg-indigo-600 dark:bg-indigo-500" width="10%" />
            <FunnelBar label="Hired" count={5} color="bg-green-500" width="6%" />
          </div>
        </div>

        {/* QUICK ACTIONS */}
        <div className="flex flex-col gap-6">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">Quick Actions</h3>
            <ActionCard 
                icon="✨" 
                title="Post New Job" 
                desc="Create a new requisition" 
                colorClass="text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800"
            />
            <ActionCard 
                icon="✏️" 
                title="Edit Job" 
                desc="Update active listings" 
                colorClass="text-amber-600 bg-amber-50 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800"
            />
            <ActionCard 
                icon="📅" 
                title="Schedule Interview" 
                desc="Sync with calendar" 
                colorClass="text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800"
            />
        </div>
      </div>
    </div>
  );
};

// --- SUB COMPONENTS ---
const StatCard = ({ icon, value, label, trend, trendUp }) => (
  <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col gap-4 transition-transform hover:-translate-y-1">
    <div className="flex justify-between items-start">
        <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-2xl">
            {icon}
        </div>
        <span className={`text-xs font-bold px-2 py-1 rounded-full ${trendUp ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700'}`}>
            {trend}
        </span>
    </div>
    <div>
        <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white">{value}</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{label}</p>
    </div>
  </div>
);

const FunnelBar = ({ label, count, color, width }) => (
    <div className="flex flex-col gap-1.5 group">
        <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-400">
            <span>{label}</span>
            <span className="text-slate-900 dark:text-white">{count}</span>
        </div>
        <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div className={`h-full rounded-full transition-all duration-1000 ease-out group-hover:opacity-80 ${color}`} style={{ width: width }}></div>
        </div>
    </div>
);

const ActionCard = ({ icon, title, desc, colorClass }) => (
    <div className={`p-5 rounded-2xl border-l-4 shadow-sm cursor-pointer hover:shadow-md transition-all bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 ${colorClass.split(' ').filter(c => c.startsWith('border-l')).join(' ') || 'border-l-indigo-500'}`}>
        <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${colorClass}`}>
                {icon}
            </div>
            <div>
                <h4 className="font-bold text-slate-800 dark:text-white">{title}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">{desc}</p>
            </div>
        </div>
    </div>
);

export default RecruiterDashboard;