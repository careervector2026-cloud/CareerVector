import React, { useState, useEffect } from 'react';
import { 
  Target, Users, AlertTriangle, BarChart3, 
  TrendingUp, Globe, ArrowUpRight, Activity 
} from 'lucide-react';
import axiosInstance from '../../../config/AxiosConfig'; 

const AnalyticsView = ({ admin }) => {
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState({
    funnel: null,
    topStudents: null,
    atRisk: null,
    progression: null
  });

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!admin) return;
      setLoading(true);
      try {
        const college = admin.instituteName || "SR University, Warangal";
        
        // Calling your Spring AdminController
        const [funnel, top, risk, prog] = await Promise.all([
          axiosInstance.get(`/api/admin/placement-funnel?collegeName=${college}`),
          axiosInstance.get(`/api/admin/top-students?collegeName=${college}`),
          axiosInstance.get(`/api/admin/at-risk-students?collegeName=${college}`),
          axiosInstance.get(`/api/admin/student-progression/2203A54049`)
        ]);

        setAnalyticsData({
          funnel: funnel.data,
          topStudents: top.data,
          atRisk: risk.data,
          progression: prog.data
        });
      } catch (err) {
        console.error("Dashboard Sync Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [admin]);

  const cards = [
    { 
      title: "Placement Funnel", 
      // From Console: funnel.conversion_rate (16.67)
      value: analyticsData.funnel ? `${analyticsData.funnel.conversion_rate}%` : "0%", 
      subtitle: `${analyticsData.funnel?.shortlisted || 0} SHORTLISTED`,
      color: "text-indigo-600", 
      bg: "bg-indigo-50/40", 
      border: "border-indigo-100",
      icon: <Target className="text-indigo-600" />,
      span: "md:col-span-2 md:row-span-2" 
    },
    { 
      title: "Top Students", 
      // From Console: topStudents is an Array of 6 objects
      value: Array.isArray(analyticsData.topStudents) ? analyticsData.topStudents.length : "0", 
      subtitle: "ELITE PERFORMERS",
      color: "text-emerald-600", 
      bg: "bg-emerald-50/40", 
      border: "border-emerald-100",
      icon: <Users className="text-emerald-600" />,
      span: "md:col-span-2 md:row-span-1" 
    },
    { 
      title: "Students at Risk", 
      // From Console: atRisk is an Array of 1 object
      value: Array.isArray(analyticsData.atRisk) ? analyticsData.atRisk.length : "0", 
      subtitle: "HIGH REJECTION RATE",
      color: "text-rose-600", 
      bg: "bg-rose-50/40", 
      border: "border-rose-100",
      icon: <AlertTriangle className="text-rose-600" />,
      span: "md:col-span-1 md:row-span-1" 
    },
    { 
      title: "Skill Gaps", 
      value: "PENDING", 
      subtitle: "ANALYZING TRENDS",
      color: "text-amber-600", 
      bg: "bg-amber-50/40", 
      border: "border-amber-100",
      icon: <BarChart3 className="text-amber-600" />,
      span: "md:col-span-1 md:row-span-1" 
    },
    { 
      title: "Progression", 
      // From Console: progression.trend ("declining")
      value: analyticsData.progression?.trend || "N/A", 
      subtitle: `ID: ${analyticsData.progression?.student_id || '2203A54049'}`,
      color: "text-sky-600", 
      bg: "bg-sky-50/40", 
      border: "border-sky-100",
      icon: <TrendingUp className="text-sky-600" />,
      span: "md:col-span-2 md:row-span-1" 
    },
    { 
      title: "Market Trends", 
      value: "HIGH", 
      subtitle: "AI/ML DOMINANCE",
      color: "text-violet-600", 
      bg: "bg-violet-50/40", 
      border: "border-violet-100",
      icon: <Globe className="text-violet-600" />,
      span: "md:col-span-4 md:row-span-1" 
    },
  ];

  return (
    <div className="p-6 md:p-10 bg-slate-50 min-h-screen">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-indigo-950 italic uppercase leading-none tracking-tighter">Intelligence Dashboard</h1>
          <p className="text-slate-400 text-[10px] font-bold tracking-[0.3em] uppercase mt-2">Institutional Analytics Engine</p>
        </div>
        <div className="flex items-center gap-2 px-5 py-2 bg-white rounded-full border border-slate-200 shadow-sm">
          <Activity size={12} className={`${loading ? 'animate-spin' : 'animate-pulse text-emerald-500'}`} />
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">
            {loading ? "Syncing..." : "Live"}
          </span>
        </div>
      </header>

      <div className="bg-white p-10 rounded-[3.5rem] border border-slate-200 shadow-sm min-h-[600px]">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-[160px]">
          {cards.map((card, index) => (
            <div
              key={index}
              className={`${card.span} ${card.bg} ${card.border} border-2 rounded-[2.5rem] p-8 flex flex-col justify-between relative overflow-hidden group hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
            >
              <div className="flex justify-between items-start relative z-10">
                <div className="p-3.5 rounded-2xl bg-white shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">
                  {React.cloneElement(card.icon, { size: 22 })}
                </div>
                <ArrowUpRight className="text-slate-200 group-hover:text-indigo-400" size={20} />
              </div>

              <div className="relative z-10">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 leading-none">{card.subtitle}</p>
                <h2 className="text-lg font-black text-slate-800 italic uppercase leading-none mb-3 tracking-tighter">{card.title}</h2>
                <div className={`text-5xl font-black tracking-tighter uppercase ${card.color}`}>
                   {loading && card.title !== "Market Trends" ? "..." : card.value}
                </div>
              </div>

              <div className="absolute -right-8 -bottom-8 opacity-[0.05] pointer-events-none group-hover:rotate-[-10deg] transition-all duration-500">
                {React.cloneElement(card.icon, { size: 220 })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsView;