import React, { useState } from 'react';
import { 
  MapPin, Building2, Calendar, User, Target, AlertCircle, 
  Loader2, BarChart3, X, CheckCircle2, Github, Code2, FileText, 
  AlertTriangle, TrendingUp, PartyPopper, Terminal, PencilLine 
} from 'lucide-react';
import axiosInstance from '../../../config/AxiosConfig';

const PlacementInsightsUI = ({ activeJobs, currentUser }) => {
  const [activeSubTab, setActiveSubTab] = useState("Readiness");
  const [analyzingId, setAnalyzingId] = useState(null);
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);
  const [diagnosisData, setDiagnosisData] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // --- MANUAL INPUT STATE ---
  const [manualJD, setManualJD] = useState("");
  const [isManualMode, setIsManualMode] = useState(false);

  // --- UNIVERSAL HANDLER ---
  const handleViewAnalysis = async (jobOrManualText, isManual = false) => {
    try {
      const id = isManual ? "manual" : jobOrManualText.id;
      setAnalyzingId(id);
      setSelectedAnalysis(null);
      setDiagnosisData(null);

      const payload = {
        resume_url: currentUser?.resumeUrl,
        job_description: isManual ? jobOrManualText : jobOrManualText.description,
        github_url: currentUser?.githubUrl,
        leetcode_username: extractUsername(currentUser?.leetcodeUrl)
      };

      // Toggle between Readiness and Diagnosis endpoints
      const endpoint = activeSubTab === "Readiness" ? '/api/jobs/job-readiness' : '/api/jobs/failure-diagnosis';
      const response = await axiosInstance.post(endpoint, payload);

      const metadata = isManual 
        ? { jobTitle: "Custom Analysis", company: "Manual Entry" } 
        : { jobTitle: jobOrManualText.jobTitle, company: jobOrManualText.recruiter?.companyName };

      if (activeSubTab === "Readiness") {
        setSelectedAnalysis({ ...metadata, ...response.data });
      } else {
        setDiagnosisData({ ...metadata, ...response.data });
      }
      setShowModal(true);
    } catch (err) {
      console.error("AI Analysis Error:", err);
      alert("Analysis failed. Please check your profile links and job text.");
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
          <h1 className="text-3xl font-black text-indigo-900 dark:text-indigo-400 tracking-tight">Placement Insights</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">Welcome back, {currentUser?.fullName}</p>
        </div>
        
        {/* Manual Mode Toggle */}
        <button 
            onClick={() => setIsManualMode(!isManualMode)}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-xs transition-all border shadow-sm ${isManualMode ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-indigo-400'}`}
        >
            {isManualMode ? <Terminal size={14}/> : <PencilLine size={14}/>}
            {isManualMode ? "MARKET LISTINGS" : "CUSTOM JOB ANALYSIS"}
        </button>
      </header>

      {/* 2. Tab Selectors */}
      <div className="flex gap-2 mb-0 ml-4">
        <TabButton label="Job Readiness" active={activeSubTab === "Readiness"} onClick={() => setActiveSubTab("Readiness")} icon={<Target size={16}/>} activeColor="indigo" />
        <TabButton label="Failure Diagnosis" active={activeSubTab === "Diagnosis"} onClick={() => setActiveSubTab("Diagnosis")} icon={<AlertCircle size={16}/>} activeColor="amber" />
      </div>

      {/* 3. Main Bento Container */}
      <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl rounded-tl-none border border-slate-200 dark:border-slate-800 shadow-sm min-h-[500px]">
        
        {isManualMode ? (
            /* --- MANUAL TEXT INPUT --- */
            <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="mb-6">
                    <h3 className="text-2xl font-black dark:text-white flex items-center gap-2 italic">
                        <PencilLine className="text-indigo-500" size={24}/> Manual Entry
                    </h3>
                    <p className="text-slate-400 text-sm mt-1 font-bold">Paste any external job description to run AI diagnostics.</p>
                </div>
                <textarea 
                    value={manualJD}
                    onChange={(e) => setManualJD(e.target.value)}
                    placeholder="Example: Required Skills include Java, Spring Boot, and PostgreSQL. 2+ years of experience required..."
                    className="w-full h-80 p-8 rounded-[2.5rem] bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 focus:border-indigo-500 outline-none text-sm font-bold transition-all dark:text-slate-200 resize-none shadow-inner"
                />
                <button 
                    disabled={!manualJD.trim() || analyzingId === "manual"}
                    onClick={() => handleViewAnalysis(manualJD, true)}
                    className={`mt-8 w-full py-6 rounded-3xl font-black text-white flex items-center justify-center gap-3 transition-all shadow-2xl active:scale-[0.98] ${activeSubTab === "Readiness" ? "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/30" : "bg-amber-500 hover:bg-amber-600 shadow-amber-500/30"}`}
                >
                    {analyzingId === "manual" ? <Loader2 size={24} className="animate-spin" /> : <BarChart3 size={24} />}
                    {analyzingId === "manual" ? "ANALYZING..." : `RUN ${activeSubTab.toUpperCase()} AI`}
                </button>
            </div>
        ) : (
            /* --- AUTOMATIC MARKET GRID --- */
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 animate-in fade-in">
                {activeJobs.map((job) => (
                    <JobCard 
                        key={job.id} 
                        job={job} 
                        activeSubTab={activeSubTab} 
                        analyzingId={analyzingId} 
                        onAnalyze={() => handleViewAnalysis(job)} 
                    />
                ))}
            </div>
        )}
      </div>

      {/* --- ANALYSIS MODAL --- */}
      {showModal && (
        <AnalysisModal 
            show={showModal} 
            onClose={() => setShowModal(false)} 
            activeSubTab={activeSubTab} 
            selectedAnalysis={selectedAnalysis} 
            diagnosisData={diagnosisData} 
        />
      )}
    </div>
  );
};

// --- HELPER COMPONENTS ---

const TabButton = ({ label, active, onClick, icon, activeColor }) => {
    const activeStyles = activeColor === 'indigo' 
        ? "bg-white dark:bg-slate-900 text-indigo-600 border-slate-200 dark:border-slate-800" 
        : "bg-white dark:bg-slate-900 text-amber-600 border-slate-200 dark:border-slate-800";
        
    return (
        <button onClick={onClick} className={`px-10 py-4 rounded-t-3xl font-black text-xs uppercase tracking-widest transition-all border-x border-t ${active ? activeStyles : "bg-slate-100/50 dark:bg-slate-800/50 border-transparent text-slate-400"}`}>
            {React.cloneElement(icon, { className: "inline mr-2", size: 16 })}
            {label}
        </button>
    );
};

const JobCard = ({ job, activeSubTab, analyzingId, onAnalyze }) => (
    <div className={`p-8 rounded-[3rem] border-2 transition-all flex flex-col group ${activeSubTab === "Readiness" ? "bg-slate-50 dark:bg-slate-800/30 border-slate-100 hover:border-indigo-400 dark:border-slate-800" : "bg-amber-50/30 dark:bg-amber-950/10 border-amber-50 hover:border-amber-400 dark:hover:border-amber-800"}`}>
        <div className="flex justify-between items-start mb-6">
            <div className="p-4 rounded-3xl bg-white dark:bg-slate-800 text-slate-300 group-hover:text-indigo-500 transition-colors shadow-sm">
                <Building2 size={24} />
            </div>
            <span className={`text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full ${activeSubTab === "Readiness" ? "bg-indigo-100 text-indigo-700" : "bg-amber-100 text-amber-700"}`}>
                {job.jobType?.replace('_', ' ')}
            </span>
        </div>
        <h3 className="font-black text-xl text-slate-900 dark:text-slate-100 mb-1 leading-tight">{job.jobTitle}</h3>
        <p className={`font-black text-sm mb-6 ${activeSubTab === "Readiness" ? "text-indigo-600 dark:text-indigo-400" : "text-amber-600 dark:text-amber-400"}`}>
            {job.recruiter?.companyName}
        </p>
        <div className="space-y-3 mb-8 text-slate-400 text-xs font-black uppercase tracking-tighter">
            <div className="flex items-center gap-3"><MapPin size={16} /> {job.location}</div>
            <div className="flex items-center gap-3"><Calendar size={16} /> {new Date(job.postedAt).toLocaleDateString()}</div>
        </div>
        <button onClick={onAnalyze} disabled={analyzingId === job.id} className={`mt-auto w-full py-5 rounded-2xl font-black text-xs uppercase tracking-widest text-white transition-all flex items-center justify-center gap-3 shadow-xl ${analyzingId === job.id ? "bg-slate-400" : activeSubTab === "Readiness" ? "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/20" : "bg-amber-500 hover:bg-amber-600 shadow-amber-200"}`}>
            {analyzingId === job.id ? <Loader2 size={18} className="animate-spin" /> : <BarChart3 size={18} />}
            {analyzingId === job.id ? "Analyzing..." : "Analyze Now"}
        </button>
    </div>
);

const AnalysisModal = ({ show, onClose, activeSubTab, selectedAnalysis, diagnosisData }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
        <div className="bg-white dark:bg-slate-900 w-full max-w-3xl rounded-[3rem] shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
            <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
                <h2 className="text-2xl font-black dark:text-white uppercase tracking-tighter italic">
                    {activeSubTab === "Readiness" ? "Job Readiness Report" : "Critical Failure Diagnosis"}
                </h2>
                <button onClick={onClose} className="p-3 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors"><X size={24} className="dark:text-white"/></button>
            </div>
            
            <div className="p-10 max-h-[75vh] overflow-y-auto custom-scrollbar space-y-8">
                {activeSubTab === "Readiness" && selectedAnalysis ? (
                    <div className="space-y-10">
                        <div className="flex flex-col items-center">
                            <div className="text-6xl font-black text-indigo-600 tracking-tighter">{selectedAnalysis.job_readiness.job_readiness_score}%</div>
                            <p className="font-black text-slate-500 uppercase tracking-[0.3em] mt-2">{selectedAnalysis.job_readiness.readiness_level} MATCH</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <ScoreCard icon={<FileText size={18}/>} label="Resume Optimization" score={selectedAnalysis.job_readiness.breakdown.resume_jd} />
                            <ScoreCard icon={<CheckCircle2 size={18}/>} label="Core Skill Coverage" score={selectedAnalysis.job_readiness.breakdown.skill_coverage} />
                            <ScoreCard icon={<Github size={18}/>} label="Open Source Impact" score={selectedAnalysis.job_readiness.breakdown.github} />
                            <ScoreCard icon={<Code2 size={18}/>} label="Algorithmic Prowess" score={selectedAnalysis.job_readiness.breakdown.leetcode} />
                        </div>
                    </div>
                ) : diagnosisData && (
                    <div className="space-y-8">
                        {diagnosisData.message ? (
                            <div className="p-12 bg-green-50 dark:bg-green-900/10 rounded-[2.5rem] border-2 border-green-100 dark:border-green-800/30 text-center animate-in zoom-in-95">
                                <PartyPopper className="mx-auto text-green-500 mb-6" size={64} />
                                <h3 className="text-3xl font-black text-green-700 dark:text-green-400 mb-2 italic">Optimal Profile!</h3>
                                <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-xs">You satisfy all mandatory selection criteria.</p>
                            </div>
                        ) : (
                            <div className="space-y-8">
                                <div className="p-10 bg-rose-50 dark:bg-rose-950/20 rounded-[2.5rem] border-2 border-rose-100 dark:border-rose-900/30 text-center">
                                    <AlertTriangle className="mx-auto text-rose-500 mb-4" size={48} />
                                    <h3 className="text-3xl font-black text-rose-600 mb-1 italic uppercase tracking-tighter">Status: {diagnosisData.status}</h3>
                                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Current Score: {Math.round(diagnosisData.final_score * 100)}% | Threshold: {Math.round(diagnosisData.threshold * 100)}%</p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <ReasonBlock title="Critical Blockers" list={diagnosisData.failure_diagnosis.primary_reasons} color="rose" />
                                    <ReasonBlock title="Secondary Gaps" list={diagnosisData.failure_diagnosis.secondary_reasons} color="amber" />
                                </div>
                                <div className="p-10 bg-indigo-50 dark:bg-indigo-900/10 rounded-[2.5rem] border-2 border-indigo-100 dark:border-indigo-800/30">
                                    <h4 className="flex items-center gap-3 text-indigo-700 dark:text-indigo-400 font-black mb-6 uppercase tracking-widest"><TrendingUp size={20} /> Improvement Roadmap</h4>
                                    <ul className="space-y-4">
                                        {diagnosisData.failure_diagnosis.actionable_recommendations.map((rec, i) => (
                                            <li key={i} className="flex items-start gap-3 text-sm font-bold text-slate-600 dark:text-slate-300 leading-relaxed">
                                                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-500 flex-shrink-0" /> {rec}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    </div>
);

const ScoreCard = ({ icon, label, score }) => (
  <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 transition-all hover:border-indigo-300">
    <div className="flex items-center gap-3 text-slate-400 mb-4">
        {icon} 
        <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
    </div>
    <div className="flex justify-between items-end">
        <span className="text-2xl font-black dark:text-white italic tracking-tighter">{score}%</span>
        <div className="w-16 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-500" style={{ width: `${score}%` }} />
        </div>
    </div>
  </div>
);

const ReasonBlock = ({ title, list, color }) => (
  <div className="space-y-4">
    <h4 className="text-xs font-black text-slate-400 uppercase ml-4 tracking-[0.2em]">{title}</h4>
    {list?.map((r, i) => (
      <div key={i} className={`p-6 bg-white dark:bg-slate-800/50 border-l-8 ${color === 'rose' ? 'border-rose-500' : 'border-amber-500'} rounded-3xl shadow-sm`}>
          <p className="text-sm font-bold dark:text-slate-200 leading-relaxed italic">"{r.reason}"</p>
      </div>
    ))}
  </div>
);

export default PlacementInsightsUI;