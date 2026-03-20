import React, { useState } from 'react';
import { 
  MapPin, Building2, Calendar, Target, AlertCircle, 
  Loader2, BarChart3, X, CheckCircle2, Github, Code2, FileText, 
  AlertTriangle, TrendingUp, PartyPopper, Terminal, PencilLine, 
  ScanSearch, Fingerprint, LayoutList, SearchCode
} from 'lucide-react';
import axiosInstance from '../../../config/AxiosConfig';

const PlacementInsightsUI = ({ activeJobs, currentUser }) => {
  const [activeSubTab, setActiveSubTab] = useState("Readiness"); // Readiness, Diagnosis, ATS
  const [analyzingId, setAnalyzingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  
  // Data States
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);
  const [diagnosisData, setDiagnosisData] = useState(null);
  const [atsData, setAtsData] = useState(null);

  // Manual Input State
  const [manualJD, setManualJD] = useState("");
  const [isManualMode, setIsManualMode] = useState(false);

  const handleViewAnalysis = async (jobOrManualText, isManual = false) => {
    try {
      const id = isManual ? "manual" : jobOrManualText.id;
      setAnalyzingId(id);
      
      setSelectedAnalysis(null);
      setDiagnosisData(null);
      setAtsData(null);

      const jobDescription = isManual ? jobOrManualText : jobOrManualText.description;
      
      const payload = {
        resume_url: currentUser?.resumeUrl,
        job_description: jobDescription
      };

      let endpoint = "";
      if (activeSubTab === "Readiness") {
        endpoint = '/api/jobs/job-readiness';
        payload.github_url = currentUser?.githubUrl;
        payload.leetcode_username = extractUsername(currentUser?.leetcodeUrl);
        payload.student_id=currentUser?.rollNumber;
        payload.college_name=currentUser?.clgName;
      } else if (activeSubTab === "Diagnosis") {
        endpoint = '/api/jobs/failure-diagnosis';
        payload.github_url = currentUser?.githubUrl;
        payload.leetcode_username = extractUsername(currentUser?.leetcodeUrl);
        payload.student_id=currentUser?.rollNumber;
        payload.college_name=currentUser?.clgName;
      } else {
        endpoint = '/api/jobs/ats-score';
      }

      const response = await axiosInstance.post(endpoint, payload);

      const metadata = isManual 
        ? { jobTitle: "Custom Analysis", company: "User Provided Text" } 
        : { jobTitle: jobOrManualText.jobTitle, company: jobOrManualText.recruiter?.companyName };

      if (activeSubTab === "Readiness") setSelectedAnalysis({ ...metadata, ...response.data });
      else if (activeSubTab === "Diagnosis") setDiagnosisData({ ...metadata, ...response.data });
      else if (activeSubTab === "ATS") setAtsData({ ...metadata, ...response.data });

      setShowModal(true);
    } catch (err) {
      console.error("AI Error:", err);
      alert("Analysis failed. Ensure Spring Boot and FastAPI are running.");
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 md:p-10 font-sans transition-colors duration-300">
      
      <header className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-indigo-900 dark:text-indigo-400 tracking-tighter uppercase italic">Placement Insights</h1>
          <p className="text-slate-500 dark:text-slate-400 font-bold text-sm">Targeting Opportunities for {currentUser?.fullName}</p>
        </div>
        
        <button 
            onClick={() => setIsManualMode(!isManualMode)}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-xs transition-all border shadow-sm ${isManualMode ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-slate-900 text-slate-600 dark:border-slate-800'}`}
        >
            {isManualMode ? <Terminal size={14}/> : <PencilLine size={14}/>}
            {isManualMode ? "MARKET LISTINGS" : "CUSTOM JOB ANALYSIS"}
        </button>
      </header>

      <div className="flex gap-2 mb-0 ml-4 overflow-x-auto no-scrollbar">
        <TabButton label="Job Readiness" active={activeSubTab === "Readiness"} onClick={() => setActiveSubTab("Readiness")} icon={<Target size={16}/>} color="indigo" />
        <TabButton label="Failure Diagnosis" active={activeSubTab === "Diagnosis"} onClick={() => setActiveSubTab("Diagnosis")} icon={<AlertCircle size={16}/>} color="amber" />
        <TabButton label="ATS Optimizer" active={activeSubTab === "ATS"} onClick={() => setActiveSubTab("ATS")} icon={<ScanSearch size={16}/>} color="emerald" />
      </div>

      <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl rounded-tl-none border border-slate-200 dark:border-slate-800 shadow-sm min-h-[500px]">
        {isManualMode ? (
            <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                <textarea 
                    value={manualJD}
                    onChange={(e) => setManualJD(e.target.value)}
                    placeholder="Paste the external job description here..."
                    className="w-full h-80 p-8 rounded-[2.5rem] bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 focus:border-indigo-500 outline-none text-sm font-bold transition-all dark:text-slate-200 resize-none shadow-inner"
                />
                <button 
                    disabled={!manualJD.trim() || analyzingId === "manual"}
                    onClick={() => handleViewAnalysis(manualJD, true)}
                    className={`mt-8 w-full py-6 rounded-3xl font-black text-white flex items-center justify-center gap-3 transition-all shadow-2xl active:scale-95
                        ${activeSubTab === "Readiness" ? "bg-indigo-600 shadow-indigo-500/30" : 
                          activeSubTab === "Diagnosis" ? "bg-amber-500 shadow-amber-500/30" : 
                          "bg-emerald-600 shadow-emerald-500/30"}`}
                >
                    {analyzingId === "manual" ? <Loader2 size={24} className="animate-spin" /> : <BarChart3 size={24} />}
                    {analyzingId === "manual" ? "AI ANALYZING..." : `RUN ${activeSubTab.toUpperCase()} CHECK`}
                </button>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
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

      {showModal && (
        <AnalysisModal 
            show={showModal} 
            onClose={() => setShowModal(false)} 
            activeSubTab={activeSubTab} 
            selectedAnalysis={selectedAnalysis} 
            diagnosisData={diagnosisData} 
            atsData={atsData}
        />
      )}
    </div>
  );
};

// --- SUB-COMPONENTS ---

const TabButton = ({ label, active, onClick, icon, color }) => {
    const activeStyles = {
        indigo: "text-indigo-600 border-slate-200 dark:border-slate-800",
        amber: "text-amber-600 border-slate-200 dark:border-slate-800",
        emerald: "text-emerald-600 border-slate-200 dark:border-slate-800"
    };
    return (
        <button onClick={onClick} className={`px-10 py-4 rounded-t-3xl font-black text-xs uppercase tracking-widest transition-all border-x border-t ${active ? `bg-white dark:bg-slate-900 ${activeStyles[color]}` : "bg-slate-100/50 dark:bg-slate-800/50 border-transparent text-slate-400"}`}>
            {React.cloneElement(icon, { className: "inline mr-2", size: 16 })}
            {label}
        </button>
    );
};

const JobCard = ({ job, activeSubTab, analyzingId, onAnalyze }) => {
    // Lookup object to fix dynamic Tailwind class generation issue
    const themeMap = {
        Readiness: {
            text: "text-indigo-600",
            bg: "bg-indigo-600 hover:bg-indigo-700",
            border: "hover:border-indigo-400"
        },
        Diagnosis: {
            text: "text-amber-600",
            bg: "bg-amber-600 hover:bg-amber-700",
            border: "hover:border-amber-400"
        },
        ATS: {
            text: "text-emerald-600",
            bg: "bg-emerald-600 hover:bg-emerald-700",
            border: "hover:border-emerald-400"
        }
    };

    const currentTheme = themeMap[activeSubTab] || themeMap.Readiness;

    return (
        <div className={`p-8 rounded-[3rem] border-2 transition-all flex flex-col group bg-slate-50 dark:bg-slate-800/30 border-slate-100 dark:border-slate-800 ${currentTheme.border}`}>
            <div className="flex justify-between items-start mb-6">
                <div className="p-4 rounded-3xl bg-white dark:bg-slate-800 text-slate-300 group-hover:text-indigo-500 transition-colors shadow-sm">
                    <Building2 size={24} />
                </div>
            </div>
            <h3 className="font-black text-xl text-slate-900 dark:text-slate-100 mb-1 leading-tight">{job.jobTitle}</h3>
            <p className={`font-black text-sm mb-6 ${currentTheme.text}`}>{job.recruiter?.companyName}</p>
            <div className="space-y-3 mb-8 text-slate-400 text-xs font-black uppercase">
                <div className="flex items-center gap-3"><MapPin size={16} /> {job.location}</div>
                <div className="flex items-center gap-3"><Calendar size={16} /> {new Date(job.postedAt).toLocaleDateString()}</div>
            </div>
            <button 
                onClick={onAnalyze} 
                disabled={analyzingId === job.id} 
                className={`mt-auto w-full py-5 rounded-2xl font-black text-xs uppercase text-white transition-all flex items-center justify-center gap-3 shadow-xl ${analyzingId === job.id ? "bg-slate-400" : currentTheme.bg}`}
            >
                {analyzingId === job.id ? <Loader2 size={18} className="animate-spin" /> : <BarChart3 size={18} />}
                <span>{analyzingId === job.id ? "Processing..." : "Analyze Profile"}</span>
            </button>
        </div>
    );
};

const AnalysisModal = ({ show, onClose, activeSubTab, selectedAnalysis, diagnosisData, atsData }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
        <div className="bg-white dark:bg-slate-900 w-full max-w-3xl rounded-[3rem] shadow-2xl overflow-hidden border dark:border-slate-800">
            <div className="p-8 border-b dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
                <h2 className="text-2xl font-black dark:text-white uppercase tracking-tighter italic">
                    {activeSubTab === "Readiness" ? "Job Readiness Report" : activeSubTab === "Diagnosis" ? "Critical Diagnosis" : "ATS Screening Result"}
                </h2>
                <button onClick={onClose} className="p-3 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors"><X size={24} className="dark:text-white"/></button>
            </div>
            
            <div className="p-10 max-h-[75vh] overflow-y-auto custom-scrollbar">
                {activeSubTab === "Readiness" && selectedAnalysis && (
                    <div className="space-y-10">
                        <div className="flex flex-col items-center">
                            <div className="text-6xl font-black text-indigo-600 tracking-tighter">{selectedAnalysis.job_readiness.job_readiness_score}%</div>
                            <p className="font-black text-slate-500 uppercase tracking-widest mt-2">{selectedAnalysis.job_readiness.readiness_level} MATCH</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <ScoreCard icon={<FileText size={18}/>} label="Resume Optimization" score={selectedAnalysis.job_readiness.breakdown.resume_jd} color="indigo" />
                            <ScoreCard icon={<CheckCircle2 size={18}/>} label="Skill Coverage" score={selectedAnalysis.job_readiness.breakdown.skill_coverage} color="indigo" />
                            <ScoreCard icon={<Github size={18}/>} label="Open Source" score={selectedAnalysis.job_readiness.breakdown.github} color="indigo" />
                            <ScoreCard icon={<Code2 size={18}/>} label="Algorithmic" score={selectedAnalysis.job_readiness.breakdown.leetcode} color="indigo" />
                        </div>
                    </div>
                )}

                {activeSubTab === "Diagnosis" && diagnosisData && (
                    <div className="space-y-8">
                        {diagnosisData.message ? (
                            <div className="p-12 bg-green-50 dark:bg-green-900/10 rounded-[2.5rem] text-center border-2 border-green-100">
                                <PartyPopper className="mx-auto text-green-500 mb-6" size={64} />
                                <h3 className="text-3xl font-black text-green-700 italic">Optimal Profile!</h3>
                            </div>
                        ) : (
                            <div className="space-y-8">
                                <div className="p-10 bg-rose-50 dark:bg-rose-950/20 rounded-[2.5rem] text-center border-2 border-rose-100">
                                    <AlertTriangle className="mx-auto text-rose-500 mb-4" size={48} />
                                    <h3 className="text-3xl font-black text-rose-600 italic">Status: {diagnosisData.status}</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <ReasonBlock title="Primary Reasons" list={diagnosisData.failure_diagnosis.primary_reasons} color="rose" />
                                    <ReasonBlock title="Secondary Gaps" list={diagnosisData.failure_diagnosis.secondary_reasons} color="amber" />
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {activeSubTab === "ATS" && atsData && (
                    <div className="space-y-10">
                        <div className="flex flex-col items-center">
                            <div className="relative">
                                <Fingerprint size={80} className="text-emerald-500 opacity-20 absolute -top-4 -left-4" />
                                <div className="text-7xl font-black text-emerald-600 tracking-tighter relative z-10">{atsData.ats_screening.ats_score}%</div>
                            </div>
                            <p className="font-black text-slate-500 uppercase tracking-widest mt-2 italic">Decision: {atsData.ats_screening.decision}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <ScoreCard label="Keywords" score={atsData.ats_screening.keyword_coverage} icon={<SearchCode size={18}/>} color="emerald" />
                            <ScoreCard label="Structure" score={atsData.ats_screening.resume_completeness} icon={<LayoutList size={18}/>} color="emerald" />
                            <ScoreCard label="Format" score={atsData.ats_screening.format_score} icon={<CheckCircle2 size={18}/>} color="emerald" />
                        </div>

                        <div className="p-8 bg-rose-50 dark:bg-rose-950/20 rounded-[2.5rem] border-2 border-rose-100 dark:border-rose-900/30">
                            <h4 className="text-xs font-black text-rose-700 uppercase tracking-widest mb-4 flex items-center gap-2"><AlertCircle size={16}/> Mandatory Skills Missing</h4>
                            <div className="flex flex-wrap gap-2">
                                {atsData.ats_screening.missing_mandatory_skills.map((s, i) => (
                                    <span key={i} className="px-4 py-2 bg-white dark:bg-slate-800 rounded-xl text-xs font-black text-rose-600 border border-rose-100 shadow-sm uppercase tracking-tighter">{s}</span>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h4 className="text-xs font-black text-slate-400 uppercase ml-4 tracking-[0.2em]">Improvement Roadmap</h4>
                            {atsData.fix_suggestions.map((fix, i) => (
                                <div key={i} className="p-6 bg-slate-50 dark:bg-slate-800/50 border-l-8 border-emerald-500 rounded-3xl shadow-sm">
                                    <span className="text-[10px] font-black text-emerald-600 uppercase mb-1 block">{fix.type.replace('_', ' ')}</span>
                                    <p className="text-sm font-bold dark:text-slate-200 leading-relaxed italic">"{fix.suggestion}"</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    </div>
);

const ScoreCard = ({ icon, label, score, color }) => (
    <div className={`bg-slate-50 dark:bg-slate-800/50 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800`}>
        <div className="flex items-center gap-3 text-slate-400 mb-4">{icon} <span className="text-[10px] font-black uppercase tracking-widest">{label}</span></div>
        <div className="flex justify-between items-end">
            <span className="text-2xl font-black dark:text-white italic">{score}%</span>
            <div className="w-16 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div className={`h-full ${color === 'emerald' ? 'bg-emerald-500' : 'bg-indigo-500'}`} style={{ width: `${score}%` }} />
            </div>
        </div>
    </div>
);

const ReasonBlock = ({ title, list, color }) => (
    <div className="space-y-4">
        <h4 className="text-xs font-black text-slate-400 uppercase ml-4 tracking-[0.2em]">{title}</h4>
        {list?.map((r, i) => (
            <div key={i} className={`p-6 bg-white dark:bg-slate-800/50 border-l-8 ${color === 'rose' ? 'border-rose-500' : 'border-amber-500'} rounded-3xl`}>
                <p className="text-sm font-bold dark:text-slate-200 italic leading-relaxed">"{r.reason}"</p>
            </div>
        ))}
    </div>
);

export default PlacementInsightsUI;