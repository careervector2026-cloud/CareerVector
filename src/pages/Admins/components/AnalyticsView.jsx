import React, { useState, useEffect } from 'react';
import { 
  Target, Users, AlertTriangle, TrendingUp, 
  BarChart3, CheckCircle2, Activity, Zap, User, Search, 
  ChevronRight, Globe, Filter, Briefcase, XCircle, Clock
} from 'lucide-react';
import axiosInstance from '../../../config/AxiosConfig';

// --- CORE UTILITIES (BULLETPROOF LOGIC) ---
const getStudentStatus = (stats) => {
  if (stats.hired > 0) return "hired";
  if (stats.shortlisted > 0 || stats.review > 0) return "pending";
  return "rejected";
};

const safePercent = (value, total) => {
  return total > 0 ? ((value / total) * 100).toFixed(0) : 0;
};

const AnalyticsView = ({ admin }) => {
  const [loading, setLoading] = useState(true);
  const [progLoading, setProgLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('funnel');
  const [funnelSubTab, setFunnelSubTab] = useState('level1');
  
  const [students, setStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [studentSearch, setStudentSearch] = useState("");
  const [studentStatusFilter, setStudentStatusFilter] = useState("all");

  const [analyticsData, setAnalyticsData] = useState({
    funnel: null, topStudents: [], atRisk: [], progression: null, skills: [], marketTrends: []
  });

  // Filtering States for Gaps and Market
  const [gapSearch, setGapSearch] = useState("");
  const [gapTierFilter, setGapTierFilter] = useState("all");
  const [marketSearch, setMarketSearch] = useState("");
  const [marketTierFilter, setMarketTierFilter] = useState("all");

  useEffect(() => {
    const fetchInitialData = async () => {
      if (!admin?.instituteName) return;
      setLoading(true);
      try {
        const college = admin.instituteName;
        const [top, risk, skills, studentList, allJobs] = await Promise.all([
          axiosInstance.get(`/api/admin/top-students?collegeName=${college}`),
          axiosInstance.get(`/api/admin/at-risk-students?collegeName=${college}`),
          axiosInstance.get(`/api/admin/skill-gap-trends?collegeName=${college}`),
          axiosInstance.get(`/api/admin/get-students/${college}`),
          axiosInstance.get(`/api/admin/get-all-jobs`)
        ]);

        const jobList = Array.isArray(allJobs.data) ? allJobs.data : [];
        const descriptions = jobList.map(job => job.description || "");

        const [funnelRes, demandRes] = await Promise.all([
          axiosInstance.post(`/api/admin/placement-funnel`, { college_name: college, jd_texts: descriptions }),
          axiosInstance.post(`/api/admin/market-demand`, { job_descriptions: descriptions })
        ]);

        const fetchedStudents = Array.isArray(studentList.data) ? studentList.data : [];
        setStudents(fetchedStudents);
        if (fetchedStudents.length > 0) setSelectedStudentId(fetchedStudents[0].rollNumber);

        setAnalyticsData({
          funnel: funnelRes.data,
          topStudents: Array.isArray(top.data) ? top.data : [],
          atRisk: Array.isArray(risk.data) ? risk.data : [],
          skills: Array.isArray(skills.data) ? skills.data : [],
          marketTrends: Array.isArray(demandRes.data) ? demandRes.data : []
        });
      } catch (err) { console.error("Sync Error:", err); } 
      finally { setLoading(false); }
    };
    fetchInitialData();
  }, [admin]);

  useEffect(() => {
    const fetchProgression = async () => {
      if (!selectedStudentId || activeTab !== 'student tracker') return;
      setProgLoading(true);
      try {
        const res = await axiosInstance.get(`/api/admin/student-progression/${selectedStudentId}`);
        setAnalyticsData(prev => ({ ...prev, progression: res.data }));
      } catch (err) { console.error("Prog Error:", err); } 
      finally { setProgLoading(false); }
    };
    fetchProgression();
  }, [selectedStudentId, activeTab]);

  // Filtering Calculations
  const filteredGaps = analyticsData.skills.filter(s => {
    const matchesSearch = s.skill.toLowerCase().includes(gapSearch.toLowerCase());
    const tier = s.count > 20 ? "critical" : s.count > 10 ? "moderate" : "low";
    return matchesSearch && (gapTierFilter === "all" || tier === gapTierFilter);
  });

  const filteredMarket = analyticsData.marketTrends.filter(m => {
    const matchesSearch = m.skill.toLowerCase().includes(marketSearch.toLowerCase());
    const tier = m.demand_score >= 0.07 ? "vhigh" : m.demand_score >= 0.05 ? "high" : m.demand_score >= 0.035 ? "medium" : "low";
    return matchesSearch && (marketTierFilter === "all" || tier === marketTierFilter);
  });

  const mainTabs = [
    { id: 'funnel', label: 'Funnel', icon: <Target size={16} /> },
    { id: 'top students', label: 'Elite', icon: <Zap size={16} /> },
    { id: 'at risk', label: 'Risk', icon: <AlertTriangle size={16} /> },
    { id: 'student tracker', label: 'Tracker', icon: <TrendingUp size={16} /> },
    { id: 'skill gaps', label: 'Gaps', icon: <BarChart3 size={16} /> },
    { id: 'market trends', label: 'Trends', icon: <Globe size={16} /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] transition-all duration-500 p-4 md:p-6 font-sans">
      
      {/* HEADER */}
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-slate-900 dark:text-white text-3xl font-black italic uppercase tracking-tighter leading-none mb-2">
            PLACEMENT <span className="text-indigo-600 dark:text-indigo-500">INSIGHTS</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-[10px] font-bold tracking-[0.2em] uppercase">{admin?.instituteName}</p>
        </div>
        <div className="flex items-center gap-3 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-lg">
          <div className={`h-2 w-2 rounded-full ${loading ? 'bg-amber-400 animate-pulse' : 'bg-emerald-500 shadow-[0_0_10px_#10b981]'}`} />
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-700 dark:text-slate-200">{loading ? "SYNC" : "LIVE NODE"}</span>
        </div>
      </div>

      {/* MAIN TABS */}
      <div className="flex flex-wrap gap-2 mb-8 p-1.5 bg-slate-200/50 dark:bg-slate-900/60 rounded-2xl w-fit backdrop-blur-xl border border-transparent dark:border-slate-800">
        {mainTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
              activeTab === tab.id ? 'bg-white dark:bg-indigo-600 text-indigo-600 dark:text-white shadow-md' : 'text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-white'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      <div className="animate-in fade-in duration-700">
        {loading ? (
          <div className="py-20 text-center"><Activity className="animate-spin inline text-indigo-500" /></div>
        ) : (
          <>
            {/* --- FUNNEL SECTION --- */}
            {activeTab === 'funnel' && analyticsData.funnel && (
              <div className="space-y-8 animate-in fade-in duration-500">
                <div className="flex gap-8 border-b border-slate-200 dark:border-slate-800 pb-4 overflow-x-auto no-scrollbar">
                  {[
                    { id: 'level1', label: '01. Application Level' },
                    { id: 'level2', label: '02. Student Success' },
                    { id: 'level3', label: '03. Individual Results' }
                  ].map(sub => (
                    <button
                      key={sub.id}
                      onClick={() => setFunnelSubTab(sub.id)}
                      className={`text-[10px] font-black uppercase tracking-[0.2em] pb-2 transition-all relative whitespace-nowrap ${
                        funnelSubTab === sub.id ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'
                      }`}
                    >
                      {sub.label}
                      {funnelSubTab === sub.id && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600" />}
                    </button>
                  ))}
                </div>

                {/* SUB-TAB 1: APPLICATION LEVEL */}
                {funnelSubTab === 'level1' && (
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4 animate-in slide-in-from-left-4">
                    <MetricCard title="Total Apps" value={analyticsData.funnel.application_level.total_applications} label="100% Volume" icon={Briefcase} color="indigo" />
                    <MetricCard 
                      title="Qualified" 
                      value={analyticsData.funnel.application_level.shortlisted + analyticsData.funnel.application_level.review} 
                      label={`${safePercent(analyticsData.funnel.application_level.shortlisted + analyticsData.funnel.application_level.review, analyticsData.funnel.application_level.total_applications)}% Selection`} 
                      icon={Target} color="emerald" 
                    />
                    <MetricCard 
                      title="Hired" 
                      value={analyticsData.funnel.application_level.hired} 
                      label={`${safePercent(analyticsData.funnel.application_level.hired, analyticsData.funnel.application_level.total_applications)}% Final`} 
                      icon={CheckCircle2} color="indigo" 
                    />
                    <MetricCard 
                      title="Active" 
                      value={analyticsData.funnel.application_level.total_applications - analyticsData.funnel.application_level.hired - analyticsData.funnel.application_level.rejected} 
                      label={`${safePercent(analyticsData.funnel.application_level.total_applications - analyticsData.funnel.application_level.hired - analyticsData.funnel.application_level.rejected, analyticsData.funnel.application_level.total_applications)}% In Pipeline`} 
                      icon={Clock} color="indigo" 
                    />
                    <MetricCard 
                      title="Rejected" 
                      value={analyticsData.funnel.application_level.rejected} 
                      label={`${safePercent(analyticsData.funnel.application_level.rejected, analyticsData.funnel.application_level.total_applications)}% Denied`} 
                      icon={XCircle} color="rose" 
                    />
                  </div>
                )}

                {/* SUB-TAB 2: STUDENT LEVEL OVERALL */}
                {funnelSubTab === 'level2' && (
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[3rem] p-10 shadow-xl animate-in slide-in-from-left-4">
                    <div className="grid grid-cols-2 lg:grid-cols-5 gap-12">
                      <DualMetric title="Total Students" count={analyticsData.funnel.student_level.total_students} percent="100%" color="slate" />
                      <DualMetric 
                        title="Placed" 
                        count={analyticsData.funnel.student_level.hired} 
                        percent={`${(analyticsData.funnel.student_level.overall_hire_rate * 100).toFixed(1)}%`} 
                        color="indigo" 
                      />
                      <DualMetric 
                        title="In Process" 
                        count={analyticsData.funnel.student_level.shortlisted} 
                        percent={`${safePercent(analyticsData.funnel.student_level.shortlisted, analyticsData.funnel.student_level.total_students)}%`} 
                        color="emerald" 
                      />
                      <DualMetric 
                        title="Reviewing" 
                        count={analyticsData.funnel.student_level.review} 
                        percent={`${safePercent(analyticsData.funnel.student_level.review, analyticsData.funnel.student_level.total_students)}%`} 
                        color="amber" 
                      />
                      <DualMetric 
                        title="Net Loss" 
                        count={analyticsData.funnel.student_level.shortlisted - analyticsData.funnel.student_level.hired - analyticsData.funnel.student_level.review} 
                        percent={`${(analyticsData.funnel.student_level.shortlist_dropoff_rate * 100).toFixed(0)}%`} 
                        color="rose" 
                      />
                    </div>
                  </div>
                )}

                {/* SUB-TAB 3: INDIVIDUAL RESULTS */}
                {funnelSubTab === 'level3' && (
                  <div className="space-y-6 animate-in slide-in-from-left-4">
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input 
                          className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl py-3 pl-12 text-[10px] font-black uppercase outline-none focus:ring-2 focus:ring-indigo-500 transition-all dark:text-white"
                          placeholder="SEARCH STUDENT ID..." 
                          value={studentSearch}
                          onChange={(e) => setStudentSearch(e.target.value)}
                        />
                      </div>
                      <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-2">
                        <Filter size={14} className="text-slate-400" />
                        <select 
                          className="bg-transparent text-[10px] font-black uppercase text-slate-600 dark:text-slate-300 outline-none cursor-pointer"
                          value={studentStatusFilter}
                          onChange={(e) => setStudentStatusFilter(e.target.value)}
                        >
                          <option value="all">ALL STATUS</option>
                          <option value="hired">HIRED</option>
                          <option value="pending">PENDING</option>
                          <option value="rejected">REJECTED</option>
                        </select>
                      </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] shadow-2xl overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                          <thead className="bg-slate-50 dark:bg-slate-800/50">
                            <tr>
                              <th className="p-6 text-[10px] font-black uppercase text-slate-500">Student ID</th>
                              <th className="p-6 text-[10px] font-black uppercase text-slate-500 text-center">Attempts</th>
                              <th className="p-6 text-[10px] font-black uppercase text-slate-500 text-center">Qualified</th>
                              <th className="p-6 text-[10px] font-black uppercase text-slate-500 text-center">Final Result</th>
                              <th className="p-6 text-[10px] font-black uppercase text-slate-500 text-center">Conversion</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {Object.entries(analyticsData.funnel.students)
                              .filter(([id]) => id.includes(studentSearch))
                              .filter(([, stats]) => {
                                const status = getStudentStatus(stats);
                                return studentStatusFilter === "all" || status === studentStatusFilter;
                              })
                              .map(([id, stats]) => (
                                <tr key={id} className="hover:bg-indigo-500/5 transition-colors group">
                                  <td className="p-6 font-mono font-black text-slate-900 dark:text-white">#{id}</td>
                                  <td className="p-6 text-center font-bold text-slate-600 dark:text-slate-400">{stats.total_applications}</td>
                                  <td className="p-6 text-center">
                                    <span className={`px-3 py-1 rounded-lg text-[9px] font-black ${stats.shortlisted + stats.review > 0 ? 'bg-emerald-100 text-emerald-600 border border-emerald-500/10' : 'bg-slate-100 text-slate-400'}`}>
                                      {stats.shortlisted + stats.review} QS
                                    </span>
                                  </td>
                                  <td className="p-6 text-center">
                                    {getStudentStatus(stats) === "hired" ? (
                                      <span className="bg-indigo-600 text-white px-3 py-1 rounded-lg text-[9px] font-black shadow-lg shadow-indigo-500/30">HIRED</span>
                                    ) : getStudentStatus(stats) === "pending" ? (
                                      <span className="bg-amber-100 text-amber-600 px-3 py-1 rounded-lg text-[9px] font-black italic">PENDING</span>
                                    ) : (
                                      <span className="bg-rose-100 text-rose-600 px-3 py-1 rounded-lg text-[9px] font-black uppercase">REJECTED</span>
                                    )}
                                  </td>
                                  <td className="p-6 text-center">
                                    <div className="flex flex-col items-center gap-1">
                                      <div className="w-16 bg-slate-100 dark:bg-slate-800 h-1 rounded-full overflow-hidden border border-slate-200 dark:border-slate-800">
                                        <div className={`h-full ${stats.hired > 0 ? 'bg-indigo-500' : 'bg-slate-400'}`} style={{width: `${stats.hired > 0 ? 100 : stats.overall_hire_rate * 100}%`}} />
                                      </div>
                                      <p className="text-[10px] font-black text-indigo-500">{(stats.overall_hire_rate * 100).toFixed(0)}%</p>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* --- OTHER TABS (Elite, Risk, Tracker, Gaps, Trends) --- */}
            {(activeTab === 'top students' || activeTab === 'at risk') && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {(activeTab === 'top students' ? analyticsData.topStudents : analyticsData.atRisk).map((s, i) => (
                  <ProfileCard key={i} id={s.student_id} score={activeTab === 'top students' ? s.avg_score : s.rejection_rate} isElite={activeTab === 'top students'} />
                ))}
              </div>
            )}

            {activeTab === 'student tracker' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[550px]">
                <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden flex flex-col shadow-xl">
                  <div className="p-4 border-b border-slate-100 dark:border-slate-800">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                      <input className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 pl-9 text-[10px] font-bold text-slate-900 dark:text-white outline-none focus:border-indigo-500" placeholder="SEARCH ROLL NUMBER..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                    </div>
                  </div>
                  <div className="flex-1 overflow-y-auto no-scrollbar">
                    {students.filter(s => s.rollNumber.includes(searchTerm)).map(s => (
                      <button key={s.rollNumber} onClick={() => setSelectedStudentId(s.rollNumber)} className={`w-full p-5 flex items-center justify-between border-b border-slate-50 dark:border-slate-800/30 transition-all ${selectedStudentId === s.rollNumber ? 'bg-indigo-600 text-white shadow-inner' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}>
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${selectedStudentId === s.rollNumber ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500'}`}><User size={16} /></div>
                          <div className="text-left leading-tight">
                            <p className={`text-[10px] font-black uppercase ${selectedStudentId === s.rollNumber ? 'text-white' : 'text-slate-900 dark:text-white'}`}>{s.fullName}</p>
                            <p className={`text-[13px] font-mono mt-0.5 ${selectedStudentId === s.rollNumber ? 'text-indigo-100 font-bold' : 'text-slate-500 dark:text-slate-400'}`}>#{s.rollNumber}</p>
                          </div>
                        </div>
                        <ChevronRight size={14} className={selectedStudentId === s.rollNumber ? 'text-white' : 'text-slate-300'} />
                      </button>
                    ))}
                  </div>
                </div>
                <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 relative shadow-xl overflow-hidden">
                    {progLoading ? <Activity className="animate-spin absolute top-1/2 left-1/2 -translate-x-1/2 text-indigo-500 w-8 h-8" /> : analyticsData.progression && (
                      <div className="animate-in fade-in duration-500">
                        <div className="flex justify-between items-center mb-10">
                          <div>
                            <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.2em] block mb-1">Analytical Node</span>
                            <h2 className="text-3xl font-mono font-black text-slate-900 dark:text-white uppercase italic tracking-tight">{analyticsData.progression.student_id}</h2>
                          </div>
                          <div className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-white ${analyticsData.progression.trend === 'improving' ? 'bg-emerald-500' : 'bg-rose-500'}`}>{analyticsData.progression.trend}</div>
                        </div>
                        <div className="flex items-end gap-3 h-48 mb-10 px-4 relative border-b border-slate-100 dark:border-slate-800">
                          {analyticsData.progression.scores.map((score, i) => (
                            <div key={i} className="flex-1 group relative transition-all duration-500" style={{height: `${score*100}%`}}>
                               <div className="absolute inset-0 bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-t-xl opacity-90 group-hover:opacity-100 shadow-indigo-500/20" />
                               <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[10px] font-bold px-3 py-1.5 rounded-lg z-20 whitespace-nowrap shadow-xl border dark:border-slate-700"> {score} </div>
                            </div>
                          ))}
                        </div>
                        <div className="grid grid-cols-2 gap-4"><div className="p-5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800 text-slate-900 dark:text-white font-black uppercase">High Confidence Node</div></div>
                      </div>
                    )}
                </div>
              </div>
            )}

            {activeTab === 'skill gaps' && (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row gap-4 mb-8">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl py-3.5 pl-12 text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-indigo-500" placeholder="SEARCH INTERNAL SKILLS..." value={gapSearch} onChange={(e) => setGapSearch(e.target.value)} />
                  </div>
                  <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-2">
                    <Filter size={14} className="text-slate-400" />
                    <select className="bg-transparent text-[10px] font-black uppercase text-slate-600 dark:text-slate-300 outline-none cursor-pointer" value={gapTierFilter} onChange={(e) => setGapTierFilter(e.target.value)}>
                        <option value="all">ALL IMPACTS</option>
                        <option value="critical">CRITICAL ONLY</option>
                        <option value="moderate">MODERATE ONLY</option>
                        <option value="low">LOW IMPACT</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {filteredGaps.map((skill, i) => {
                    let tier = { label: "LOW IMPACT", color: "slate" };
                    if (skill.count > 20) tier = { label: "CRITICAL GAP", color: "rose" };
                    else if (skill.count > 10) tier = { label: "MODERATE", color: "amber" };
                    const theme = { rose: "border-rose-500/30 text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/10", amber: "border-amber-500/30 text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/10", slate: "border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/30" };
                    return (
                      <div key={i} className={`group p-8 bg-white dark:bg-slate-900 border-2 rounded-[2.5rem] shadow-xl relative overflow-hidden ${tier.color === 'slate' ? 'border-slate-200 dark:border-slate-800' : 'border-' + tier.color + '-500/30'}`}>
                        <div className={`absolute top-6 right-6 h-2 w-2 rounded-full ${tier.color === 'rose' ? 'bg-rose-500 animate-pulse' : tier.color === 'amber' ? 'bg-amber-500' : 'bg-slate-400'}`} />
                        <p className="text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-4">RECRUITMENT TREND</p>
                        <h4 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-8 leading-tight">{skill.skill}</h4>
                        <div className={`inline-block px-4 py-2 rounded-xl text-[10px] font-black tracking-widest border ${theme[tier.color]}`}>{tier.label}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === 'market trends' && (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row gap-4 mb-8">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl py-3.5 pl-12 text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-indigo-500" placeholder="SEARCH MARKET DEMAND..." value={marketSearch} onChange={(e) => setMarketSearch(e.target.value)} />
                  </div>
                  <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-2">
                    <Filter size={14} className="text-slate-400" />
                    <select className="bg-transparent text-[10px] font-black uppercase text-slate-600 dark:text-slate-300 outline-none cursor-pointer" value={marketTierFilter} onChange={(e) => setMarketTierFilter(e.target.value)}>
                        <option value="all">ALL DEMANDS</option>
                        <option value="vhigh">VERY HIGH</option>
                        <option value="high">HIGH</option>
                        <option value="medium">MEDIUM</option>
                        <option value="low">LOW IMPACT</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {filteredMarket.map((item, i) => {
                    let tier = { label: "LOW", color: "slate" };
                    if (item.demand_score >= 0.07) tier = { label: "VERY HIGH", color: "indigo" };
                    else if (item.demand_score >= 0.05) tier = { label: "HIGH", color: "emerald" };
                    else if (item.demand_score >= 0.035) tier = { label: "MEDIUM", color: "amber" };
                    const theme = { indigo: "border-indigo-500/30 text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10", emerald: "border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10", amber: "border-amber-500/30 text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/10", slate: "border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/30" };
                    return (
                        <div key={i} className={`group p-8 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-[2.5rem] shadow-xl transition-all relative overflow-hidden ${tier.color === 'slate' ? '' : 'border-' + tier.color + '-500/30'}`}>
                          <div className="flex justify-between items-start mb-6">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${theme[tier.color]}`}><Globe size={18} /></div>
                            <div className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${theme[tier.color]}`}>{tier.label} DEMAND</div>
                          </div>
                          <p className="text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Market Requirement</p>
                          <h4 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-tight mb-4">{item.skill}</h4>
                          <div className="w-full h-1 rounded-full bg-slate-100 dark:bg-slate-800 mt-4 overflow-hidden">
                             <div className={`h-full transition-all duration-1000 ${tier.color === 'indigo' ? 'bg-indigo-500' : tier.color === 'emerald' ? 'bg-emerald-500' : tier.color === 'amber' ? 'bg-amber-500' : 'bg-slate-500'}`} style={{ width: `${item.demand_score * 100}%` }} />
                          </div>
                        </div>
                    )
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

// --- HELPER COMPONENTS ---

const MetricCard = ({ title, value, label, icon: Icon, color }) => {
  const colors = { indigo: "text-indigo-500", emerald: "text-emerald-500", rose: "text-rose-500" };
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-[2.5rem] shadow-md relative overflow-hidden">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 bg-slate-50 dark:bg-slate-800 ${colors[color]} border border-slate-100 dark:border-slate-800`}><Icon size={20} /></div>
      <p className="text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-widest mb-2">{label}</p>
      <h3 className="text-slate-900 dark:text-white font-black text-md mb-4 uppercase">{title}</h3>
      <div className="text-5xl font-black tracking-tighter bg-gradient-to-br from-indigo-600 to-indigo-400 bg-clip-text text-transparent">{value}</div>
    </div>
  );
};

const DualMetric = ({ title, count, percent, color }) => {
  const colorMap = {
    indigo: "text-indigo-600 bg-indigo-50 dark:bg-indigo-500/10",
    emerald: "text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10",
    rose: "text-rose-600 bg-rose-50 dark:bg-rose-500/10",
    slate: "text-slate-600 bg-slate-50 dark:bg-slate-800",
    amber: "text-amber-600 bg-amber-50 dark:bg-amber-500/10"
  };
  return (
    <div className="space-y-3">
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{title}</p>
      <div className="flex items-baseline gap-3">
        <span className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter">{count}</span>
        <span className={`px-3 py-1 rounded-full text-[10px] font-black ${colorMap[color]}`}>{percent}</span>
      </div>
    </div>
  );
};

const ProfileCard = ({ id, score, isElite }) => (
  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-[2rem] shadow-md transition-transform hover:scale-[1.02]">
    <div className="flex flex-col items-center text-center">
      <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500 mb-4 border border-slate-200 dark:border-slate-800"><User size={24} /></div>
      <p className="text-[14px] font-mono font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-1 truncate w-full">#{id}</p>
      <p className="text-[8px] text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-6">{isElite ? 'ELITE PERFORMER' : 'RISK NODE'}</p>
      <div className={`w-full py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest ${isElite ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'}`}>{isElite ? 'SCORE: ' : 'RISK: '}{(score*100).toFixed(0)}%</div>
    </div>
  </div>
);

export default AnalyticsView;