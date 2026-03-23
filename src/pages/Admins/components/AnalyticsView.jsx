import React, { useState, useEffect } from 'react';
import { 
  Target, Users, AlertTriangle, TrendingUp, 
  BarChart3, CheckCircle2, Activity, Zap, User, Search, ArrowUpRight
} from 'lucide-react';
import axiosInstance from '../../../config/AxiosConfig';

const AnalyticsView = ({ admin }) => {
  const [loading, setLoading] = useState(true);
  const [progLoading, setProgLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('placement funnel');
  
  // Dynamic State
  const [students, setStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [analyticsData, setAnalyticsData] = useState({
    funnel: null, 
    topStudents: [], 
    atRisk: [], 
    progression: null, 
    skills: [] 
  });

  useEffect(() => {
    const fetchInitialData = async () => {
      if (!admin?.instituteName) return;
      setLoading(true);
      try {
        const college = admin.instituteName;
        const [funnel, top, risk, skills, studentList] = await Promise.all([
          axiosInstance.get(`/api/admin/placement-funnel?collegeName=${college}`),
          axiosInstance.get(`/api/admin/top-students?collegeName=${college}`),
          axiosInstance.get(`/api/admin/at-risk-students?collegeName=${college}`),
          axiosInstance.get(`/api/admin/skill-gap-trends?collegeName=${college}`),
          axiosInstance.get(`/api/admin/get-students/${college}`)
        ]);

        const fetchedStudents = Array.isArray(studentList.data) ? studentList.data : [];
        setStudents(fetchedStudents);
        
        if (fetchedStudents.length > 0) {
          setSelectedStudentId(fetchedStudents[0].rollNumber);
        }

        setAnalyticsData(prev => ({
          ...prev,
          funnel: funnel.data,
          topStudents: top.data,
          atRisk: risk.data,
          skills: skills.data
        }));
      } catch (err) {
        console.error("❌ Analytics Load Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, [admin]);

  useEffect(() => {
    const fetchProgression = async () => {
      if (!selectedStudentId) return;
      setProgLoading(true);
      try {
        const res = await axiosInstance.get(`/api/admin/student-progression/${selectedStudentId}`);
        setAnalyticsData(prev => ({ ...prev, progression: res.data }));
      } catch (err) {
        console.error("❌ Progression Sync Error:", err);
      } finally {
        setProgLoading(false);
      }
    };
    fetchProgression();
  }, [selectedStudentId]);

  const filteredStudents = students.filter(s => 
    s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.rollNumber.includes(searchTerm)
  );

  const tabs = [
    { id: 'placement funnel', label: 'Funnel', icon: <Target size={14} /> },
    { id: 'top students', label: 'Top Students', icon: <Zap size={14} /> },
    { id: 'at risk', label: 'At Risk', icon: <AlertTriangle size={14} /> },
    { id: 'progression', label: 'Student Tracker', icon: <TrendingUp size={14} /> },
    { id: 'skill gap', label: 'Skill Gaps', icon: <BarChart3 size={14} /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] text-slate-600 dark:text-slate-300 p-6 md:p-10 font-sans transition-colors duration-500">
      
      {/* --- HEADER --- */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-slate-900 dark:text-white text-3xl font-black italic uppercase tracking-tighter leading-none">
            Placement Insights
          </h1>
          <p className="text-slate-400 dark:text-slate-500 text-[10px] font-bold tracking-[0.2em] uppercase mt-3">
            Institutional Intelligence Engine • {admin?.instituteName}
          </p>
        </div>
        <div className="flex items-center gap-3 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 px-5 py-2.5 rounded-2xl shadow-sm dark:shadow-xl dark:shadow-indigo-500/5">
          <Activity size={14} className={loading ? "animate-spin text-indigo-500" : "text-emerald-500"} />
          <span className="text-[10px] font-black uppercase tracking-widest leading-none">
            {loading ? "Decrypting" : "System Live"}
          </span>
        </div>
      </header>

      {/* --- TABS --- */}
      <div className="flex flex-wrap gap-2 mb-10 border-b border-slate-200 dark:border-slate-800/50">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-4 text-[10px] font-black uppercase tracking-widest transition-all relative group ${
              activeTab === tab.id ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
            }`}
          >
            {tab.icon} {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.8)]" />
            )}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {loading ? (
          <div className="col-span-full py-32 text-center">
            <div className="inline-block w-8 h-8 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mb-4" />
            <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-[10px]">Processing Data Nodes...</p>
          </div>
        ) : (
          <>
            {/* --- PROGRESSION TAB --- */}
            {activeTab === 'progression' && (
              <>
                {/* List Sidebar */}
                <div className="lg:col-span-4 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-[2.5rem] overflow-hidden flex flex-col h-[650px] shadow-sm">
                  <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-[#1e293b]/20">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                      <input 
                        type="text" 
                        placeholder="SEARCH ROLL NUMBER..." 
                        className="w-full bg-white dark:bg-[#020617] border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-[10px] font-bold text-slate-800 dark:text-white focus:border-indigo-500 outline-none transition-colors"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex-1 overflow-y-auto no-scrollbar">
                    {filteredStudents.map((s) => (
                      <button
                        key={s.rollNumber}
                        onClick={() => setSelectedStudentId(s.rollNumber)}
                        className={`w-full text-left p-5 border-b border-slate-50 dark:border-slate-800/50 transition-all flex items-center gap-4 ${
                          selectedStudentId === s.rollNumber ? 'bg-indigo-50 dark:bg-indigo-500/10 border-r-4 border-r-indigo-500' : 'hover:bg-slate-50 dark:hover:bg-slate-800/30'
                        }`}
                      >
                        <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-700">
                          <User size={16} />
                        </div>
                        <div className="truncate">
                          <p className="text-slate-900 dark:text-white text-xs font-bold truncate uppercase">{s.fullName}</p>
                          <p className="text-slate-400 dark:text-slate-500 text-[9px] font-black tracking-widest mt-0.5">{s.rollNumber}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Detail View */}
                <div className="lg:col-span-8 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-10 relative overflow-hidden h-[650px] shadow-sm">
                  {progLoading ? (
                    <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur-sm">
                      <Activity className="animate-spin text-indigo-500" />
                    </div>
                  ) : analyticsData.progression ? (
                    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                      <div className="flex justify-between items-start mb-12">
                        <div>
                          <p className="text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-widest mb-1">Intelligence Report</p>
                          <h2 className="text-slate-900 dark:text-white text-3xl font-black italic tracking-tighter uppercase">{analyticsData.progression.student_id}</h2>
                        </div>
                        <div className={`px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest border ${
                          analyticsData.progression.trend === 'declining' ? 'bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20' : 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20'
                        }`}>
                          Trend: {analyticsData.progression.trend}
                        </div>
                      </div>

                      <div className="flex items-end gap-3 h-56 mb-12 px-2">
                        {analyticsData.progression.scores.map((score, idx) => (
                          <div key={idx} className="flex-1 bg-indigo-100 dark:bg-indigo-500/20 rounded-t-2xl hover:bg-indigo-200 dark:hover:bg-indigo-500/40 transition-all relative group" style={{ height: `${score * 100}%` }}>
                            <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl border border-slate-700">
                              Score: {score}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <MiniCard label="Latest Rank" value="Top 5%" />
                        <MiniCard label="Profile Status" value="Active" />
                        <MiniCard label="Data Node" value="Live" />
                      </div>
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-300 dark:text-slate-700 opacity-30">
                      <TrendingUp size={80} className="mb-6" />
                      <p className="font-black uppercase tracking-[0.4em]">Awaiting Selection</p>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* --- OTHER TABS --- */}
            {activeTab !== 'progression' && (
              <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeTab === 'placement funnel' && analyticsData.funnel && (
                  <>
                    <MetricCard title="Hiring Ratio" value={`${analyticsData.funnel.hired_percentage}%`} subtitle="Overall Success" icon={CheckCircle2} color="emerald" />
                    <MetricCard title="In Pipeline" value={analyticsData.funnel.shortlisted_pending} subtitle="Active Shortlists" icon={Target} color="indigo" />
                    <MetricCard title="Rejected" value={analyticsData.funnel.rejected} subtitle="Closed Profiles" icon={AlertTriangle} color="rose" />
                  </>
                )}

                {activeTab === 'top students' && analyticsData.topStudents.map((s, i) => (
                  <MetricCard key={i} title={s.student_id} value={(s.avg_score * 100).toFixed(1)} subtitle="Performance Score" icon={Zap} color="indigo" />
                ))}

                {activeTab === 'at risk' && analyticsData.atRisk.map((s, i) => (
                  <MetricCard key={i} title={s.student_id} value={`${(s.rejection_rate * 100).toFixed(0)}%`} subtitle="Rejection Risk" icon={AlertTriangle} color="rose" />
                ))}

                {activeTab === 'skill gap' && analyticsData.skills.map((skillObj, i) => (
                  <div key={i} className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 p-8 rounded-[2rem] flex justify-between items-center group hover:shadow-lg dark:hover:bg-[#1e293b]/50 transition-all shadow-sm">
                    <div>
                      <p className="text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">{skillObj.skill}</p>
                      <h4 className="text-slate-900 dark:text-white text-2xl font-black tracking-tighter uppercase">Count: {skillObj.count}</h4>
                    </div>
                    <ArrowUpRight className="text-slate-300 dark:text-slate-700 group-hover:text-indigo-500 transition-colors" size={24} />
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

// --- SUB-COMPONENTS ---

const MetricCard = ({ title, value, subtitle, icon: Icon, color }) => {
  const themes = {
    indigo: "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 border-indigo-100 dark:border-indigo-500/20",
    emerald: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-100 dark:border-emerald-500/20",
    rose: "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 border-rose-100 dark:border-rose-500/20",
  };
  return (
    <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-8 hover:bg-slate-50 dark:hover:bg-[#1e293b]/50 transition-all hover:-translate-y-1 shadow-sm hover:shadow-md">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 border ${themes[color]}`}>
        <Icon size={20} />
      </div>
      <p className="text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">{subtitle}</p>
      <h3 className="text-slate-900 dark:text-white font-bold text-lg mb-4 truncate uppercase tracking-tight">{title}</h3>
      <div className="text-5xl font-black text-indigo-600 dark:text-white tracking-tighter uppercase leading-none">{value}</div>
    </div>
  );
};

const MiniCard = ({ label, value }) => (
  <div className="bg-slate-50 dark:bg-[#1e293b]/30 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 transition-colors">
    <p className="text-slate-400 dark:text-slate-500 text-[9px] font-black uppercase tracking-widest mb-1">{label}</p>
    <p className="text-slate-900 dark:text-white font-bold text-xs uppercase">{value}</p>
  </div>
);

export default AnalyticsView;