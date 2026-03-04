import React, { useState } from 'react';
import { 
  MapPin, Building2, Calendar, User, Target, AlertCircle, 
  Loader2, BarChart3, X, CheckCircle2, Github, Code2, FileText, 
  AlertTriangle, TrendingUp, PartyPopper 
} from 'lucide-react';
import axiosInstance from '../../../config/AxiosConfig';

const PlacementInsightsUI = ({ activeJobs, currentUser }) => {
  const [activeSubTab, setActiveSubTab] = useState("Readiness");
  const [analyzingId, setAnalyzingId] = useState(null);
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);
  const [diagnosisData, setDiagnosisData] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // --- ANALYSIS HANDLER ---
  const handleViewAnalysis = async (job) => {
    try {
      setAnalyzingId(job.id);
      setSelectedAnalysis(null);
      setDiagnosisData(null);

      const payload = {
        resume_url: currentUser?.resumeUrl,
        job_description: job.description,
        github_url: currentUser?.githubUrl,
        leetcode_username: extractUsername(currentUser?.leetcodeUrl)
      };

      if (activeSubTab === "Readiness") {
        const response = await axiosInstance.post('/api/jobs/job-readiness', payload);
        setSelectedAnalysis({ jobTitle: job.jobTitle, company: job.recruiter?.companyName, ...response.data });
      } else {
        const response = await axiosInstance.post('/api/jobs/failure-diagnosis', payload);
        setDiagnosisData({ jobTitle: job.jobTitle, company: job.recruiter?.companyName, ...response.data });
      }
      setShowModal(true);
    } catch (err) {
      console.error("AI Analysis Error:", err);
      alert("Analysis failed. Please ensure your profile links are valid.");
    } finally {
      setAnalyzingId(null);
    }
  };

  const extractUsername = (url) => {
    if (!url) return "unknown";
    const cleanUrl = url.trim().replace(/\/$/, "");
    return cleanUrl.substring(cleanUrl.lastIndexOf("/") + 1);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 md:p-10 transition-colors duration-300 font-sans">
      
      {/* 1. Header Area */}
      <header className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-indigo-900 dark:text-indigo-400">Placement Market Insights</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">Welcome, {currentUser?.fullName}</p>
        </div>
        <div className="flex items-center gap-3 bg-white dark:bg-slate-900 p-3 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
          <div className="bg-indigo-50 dark:bg-indigo-900/30 p-2 rounded-full text-indigo-600 dark:text-indigo-400">
            <User size={20} />
          </div>
          <div className="text-sm">
            <p className="font-bold leading-none dark:text-slate-200">{currentUser?.rollNumber}</p>
            <p className="text-slate-400 text-[10px] uppercase font-black tracking-widest mt-1">{currentUser?.dept}</p>
          </div>
        </div>
      </header>

      {/* 2. Tab Selectors */}
      <div className="flex gap-2 mb-0 ml-4">
        <button onClick={() => setActiveSubTab("Readiness")} className={`px-6 py-2 rounded-t-xl font-bold text-sm transition-all ${activeSubTab === "Readiness" ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-[0_-4px_10px_-5px_rgba(0,0,0,0.1)]" : "bg-slate-200/50 dark:bg-slate-800/50 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800"}`}>
          <Target size={16} className="inline mr-2" /> Job Readiness
        </button>
        <button onClick={() => setActiveSubTab("Diagnosis")} className={`px-6 py-2 rounded-t-xl font-bold text-sm transition-all ${activeSubTab === "Diagnosis" ? "bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-[0_-4px_10px_-5px_rgba(0,0,0,0.1)]" : "bg-slate-200/50 dark:bg-slate-800/50 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800"}`}>
          <AlertCircle size={16} className="inline mr-2" /> Failure Diagnosis
        </button>
      </div>

      {/* 3. Main Bento Grid Content Area */}
      <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl rounded-tl-none border border-slate-200 dark:border-slate-800 shadow-sm min-h-[500px]">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {activeJobs.map((job) => (
            <div key={job.id} className={`p-6 rounded-3xl border transition-all flex flex-col group ${activeSubTab === "Readiness" ? "bg-slate-50 dark:bg-slate-800/30 border-slate-100 hover:border-indigo-300" : "bg-amber-50/40 dark:bg-amber-950/20 border-amber-100 hover:border-amber-400"}`}>
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 rounded-2xl bg-white dark:bg-slate-800 text-slate-400 group-hover:text-indigo-600">
                  <Building2 size={24} />
                </div>
                <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${activeSubTab === "Readiness" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                  {job.jobType?.replace('_', ' ')}
                </span>
              </div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100 mb-1">{job.jobTitle}</h3>
              <p className={`font-semibold text-sm mb-4 ${activeSubTab === "Readiness" ? "text-indigo-600 dark:text-indigo-400" : "text-amber-600 dark:text-amber-400"}`}>
                {job.recruiter?.companyName || "Employer"}
              </p>
              <div className="space-y-2 mb-6 text-slate-500 dark:text-slate-400 text-xs font-medium">
                <div className="flex items-center gap-2"><MapPin size={14} /> {job.location}</div>
                <div className="flex items-center gap-2"><Calendar size={14} /> Posted: {new Date(job.postedAt).toLocaleDateString()}</div>
              </div>
              <button onClick={() => handleViewAnalysis(job)} disabled={analyzingId === job.id} className={`mt-auto w-full py-3 rounded-2xl text-sm font-bold text-white transition-all flex items-center justify-center gap-2 ${analyzingId === job.id ? "bg-slate-400" : activeSubTab === "Readiness" ? "bg-indigo-600 hover:bg-indigo-700" : "bg-amber-500 hover:bg-amber-600"}`}>
                {analyzingId === job.id ? <Loader2 size={16} className="animate-spin" /> : <BarChart3 size={16} />}
                {analyzingId === job.id ? "Analyzing..." : "View Analysis"}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* --- ANALYSIS MODAL --- */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
              <h2 className="text-xl font-bold dark:text-white">{activeSubTab === "Readiness" ? "Readiness Report" : "Failure Diagnosis"}</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors"><X size={20} /></button>
            </div>

            <div className="p-8 max-h-[75vh] overflow-y-auto">
              {activeSubTab === "Readiness" && selectedAnalysis ? (
                /* 1. Readiness View */
                <div className="space-y-8">
                  <div className="flex flex-col items-center">
                      <div className="text-4xl font-black text-indigo-600">{selectedAnalysis.job_readiness.job_readiness_score}%</div>
                      <p className="font-bold text-slate-500 uppercase tracking-widest">{selectedAnalysis.job_readiness.readiness_level} MATCH</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                      <ScoreCard icon={<FileText size={16}/>} label="Resume Match" score={selectedAnalysis.job_readiness.breakdown.resume_jd} />
                      <ScoreCard icon={<CheckCircle2 size={16}/>} label="Skill Coverage" score={selectedAnalysis.job_readiness.breakdown.skill_coverage} />
                      <ScoreCard icon={<Github size={16}/>} label="GitHub Profile" score={selectedAnalysis.job_readiness.breakdown.github} />
                      <ScoreCard icon={<Code2 size={16}/>} label="LeetCode Stats" score={selectedAnalysis.job_readiness.breakdown.leetcode} />
                  </div>
                </div>
              ) : (
                /* 2. Failure Diagnosis View */
                <div className="space-y-6">
                  {diagnosisData?.message ? (
                    <div className="p-10 bg-green-50 dark:bg-green-900/20 rounded-3xl border border-green-100 dark:border-green-900/30 text-center animate-in zoom-in-95">
                      <PartyPopper className="mx-auto text-green-500 mb-4" size={48} />
                      <h3 className="text-2xl font-black text-green-700 dark:text-green-400 mb-2">Excellent Match!</h3>
                      <p className="text-slate-600 dark:text-slate-300 font-medium">You will be shortlisted for this role based on your current profile.</p>
                    </div>
                  ) : (
                    <>
                      <div className="p-6 bg-rose-50 dark:bg-rose-900/20 rounded-3xl border border-rose-100 dark:border-rose-900/30 text-center">
                        <AlertTriangle className="mx-auto text-rose-500 mb-2" size={32} />
                        <h3 className="text-2xl font-black text-rose-600 mb-1">Status: {diagnosisData?.status.toUpperCase()}</h3>
                        <p className="text-slate-500 font-bold">Score: {Math.round(diagnosisData?.final_score * 100)}% | Threshold: {Math.round(diagnosisData?.threshold * 100)}%</p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <ReasonBlock title="Primary Blockers" list={diagnosisData?.failure_diagnosis.primary_reasons} color="rose" />
                        <ReasonBlock title="Secondary Issues" list={diagnosisData?.failure_diagnosis.secondary_reasons} color="amber" />
                      </div>
                      <div className="p-6 bg-indigo-50 dark:bg-indigo-900/10 rounded-3xl border border-indigo-100 dark:border-indigo-900/30">
                        <h4 className="flex items-center gap-2 text-indigo-700 dark:text-indigo-400 font-bold mb-4"><TrendingUp size={18} /> Recommended Roadmap</h4>
                        <ul className="space-y-2">
                          {diagnosisData?.failure_diagnosis.actionable_recommendations.map((rec, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm font-medium text-slate-600 dark:text-slate-300">
                              <CheckCircle2 size={14} className="mt-1 text-indigo-500 flex-shrink-0" /> {rec}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- SUBCOMPONENTS ---
const ScoreCard = ({ icon, label, score }) => (
  <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 transition-colors hover:border-indigo-200">
    <div className="flex items-center gap-2 text-slate-400 mb-2">{icon} <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span></div>
    <div className="flex justify-between items-end"><span className="text-xl font-bold dark:text-white">{score}%</span><div className="w-12 h-1 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden"><div className="h-full bg-indigo-500" style={{ width: `${score}%` }} /></div></div>
  </div>
);

const ReasonBlock = ({ title, list, color }) => (
  <div className="space-y-3">
    <h4 className="text-xs font-black text-slate-400 uppercase ml-2 tracking-widest">{title}</h4>
    {list?.map((r, i) => (
      <div key={i} className={`p-4 bg-white dark:bg-slate-800 border-l-4 ${color === 'rose' ? 'border-rose-500' : 'border-amber-500'} rounded-xl shadow-sm`}><p className="text-sm font-bold dark:text-slate-200">{r.reason}</p></div>
    ))}
  </div>
);

export default PlacementInsightsUI;