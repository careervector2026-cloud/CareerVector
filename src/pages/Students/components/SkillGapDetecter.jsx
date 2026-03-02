import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axiosInstance from "../../../config/AxiosConfig";
import { 
    Briefcase, FileText, Loader2, BrainCircuit, Target, Code, Sparkles, 
    ChevronRight, CheckCircle, AlertCircle, Github, Info, Map, Clock, 
    ExternalLink, ChevronDown, Zap, Building2 
} from 'lucide-react';

const SkillGapDetector = () => {
    const { currentUser } = useSelector((state) => state.student || {});
    
    const [jobs, setJobs] = useState([]);
    const [customJD, setCustomJD] = useState("");
    const [loading, setLoading] = useState(false);
    const [pathLoading, setPathLoading] = useState(false);
    const [analysisResult, setAnalysisResult] = useState(null);
    const [learningPath, setLearningPath] = useState(null);
    const [jobsLoading, setJobsLoading] = useState(true);
    const [expandedStep, setExpandedStep] = useState(null);

    // NEW STATE: To track which job is being reported
    const [selectedJobInfo, setSelectedJobInfo] = useState({ title: "", company: "" });

    const extractLeetCodeUser = (url) => {
        if (!url) return "unknown";
        const cleanUrl = url.trim().replace(/\/$/, "");
        return cleanUrl.substring(cleanUrl.lastIndexOf("/") + 1);
    };

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const res = await axiosInstance.get("/api/jobs/get-jobs");
                setJobs(Array.isArray(res.data) ? res.data : []);
            } catch (err) { 
                console.error("Error fetching jobs:", err); 
            } finally { 
                setJobsLoading(false); 
            }
        };
        fetchJobs();
    }, []);

    const runAnalysis = async (jdText, title = "Custom Analysis", company = "External Source") => {
        if (!jdText || jdText.trim().length < 50) {
            alert("Please provide a more detailed Job Description.");
            return;
        }

        setLoading(true); 
        setAnalysisResult(null); 
        setLearningPath(null);
        // Store info for display in the report
        setSelectedJobInfo({ title, company });

        try {
            const payload = {
                resume_url: currentUser?.resumeUrl,
                github_url: currentUser?.githubUrl,
                leetcode_username: extractLeetCodeUser(currentUser?.leetcodeUrl),
                job_description: jdText
            };
            
            const res = await axiosInstance.post("/api/jobs/skill-gap-report", payload);
            setAnalysisResult({ ...res.data, original_jd: jdText });
            
            setTimeout(() => {
                document.getElementById('analysis-results')?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        } catch (err) { 
            alert("Analysis failed. Please ensure your profile is complete."); 
        } finally { 
            setLoading(false); 
        }
    };

    const generatePath = async () => {
        setPathLoading(true);
        try {
            const payload = {
                resume_url: currentUser?.resumeUrl,
                github_url: currentUser?.githubUrl,
                leetcode_username: extractLeetCodeUser(currentUser?.leetcodeUrl),
                job_description: analysisResult?.original_jd
            };
            
            const res = await axiosInstance.post("/api/jobs/learning-path", payload);
            setLearningPath(res.data);
            
            setTimeout(() => {
                document.getElementById('learning-path-section')?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        } catch (err) { 
            alert("Failed to generate learning path."); 
        } finally { 
            setPathLoading(false); 
        }
    };

    return (
        <div className="space-y-10 animate-in fade-in duration-700 pb-20">
            
            {/* --- HEADER SECTION --- */}
            <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-indigo-500/20 relative overflow-hidden">
                <BrainCircuit className="absolute -right-10 -top-10 opacity-10" size={240} />
                <div className="relative z-10 space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-black tracking-widest uppercase">
                        <Zap size={14} className="fill-current text-yellow-300" /> AI Insights Engine
                    </div>
                    <h2 className="text-4xl font-black tracking-tighter">Skill Gap Detector</h2>
                    <p className="text-indigo-100 max-w-lg font-medium">
                        Hello, {currentUser?.fullName || "Student"}! Benchmark your profile against market requirements and generate a personalized learning roadmap.
                    </p>
                </div>
            </div>

            {/* --- INPUT SELECTION GRID --- */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                
                {/* 1. Posted Jobs Selection */}
                <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col h-[550px]">
                    <h3 className="text-lg font-black mb-6 flex items-center gap-3 dark:text-white">
                        <Briefcase className="text-indigo-600" /> Live Postings
                    </h3>
                    <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
                        {jobsLoading ? (
                            <div className="flex flex-col items-center justify-center h-full gap-3 text-slate-400">
                                <Loader2 className="animate-spin text-indigo-600" size={32} />
                                <span>Scanning Market...</span>
                            </div>
                        ) : jobs.map(job => (
                            <button key={job.id} onClick={() => runAnalysis(job.description, job.jobTitle, job.recruiter?.companyName)}
                                className="w-full text-left p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border-2 border-transparent hover:border-indigo-500 hover:bg-white dark:hover:bg-slate-800 transition-all group shadow-sm hover:shadow-md">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="font-bold text-slate-800 dark:text-white group-hover:text-indigo-600 transition-colors">{job.jobTitle}</span>
                                    <ChevronRight size={18} className="text-slate-300 group-hover:text-indigo-500 group-hover:translate-x-1" />
                                </div>
                                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase">
                                    <Building2 size={12} className="text-indigo-500" /> {job.recruiter?.companyName || "CareerVector Partner"}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* 2. Manual JD Input */}
                <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col h-[550px]">
                    <h3 className="text-lg font-black mb-6 flex items-center gap-3 dark:text-white">
                        <FileText className="text-indigo-600" /> Manual Input
                    </h3>
                    <textarea 
                        className="flex-1 w-full p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/40 dark:text-white border-2 border-slate-200 dark:border-slate-700 outline-none focus:border-indigo-500 resize-none text-sm transition-all shadow-inner placeholder:text-slate-400"
                        placeholder="Paste a full job description from LinkedIn..." 
                        value={customJD} 
                        onChange={(e) => setCustomJD(e.target.value)} 
                    />
                    <button onClick={() => runAnalysis(customJD)} disabled={loading || !customJD}
                        className="mt-6 w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black shadow-lg shadow-indigo-600/20 active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-3">
                        {loading ? <Loader2 className="animate-spin" size={24} /> : <Sparkles size={24} />} 
                        ANALYZE PROFILE
                    </button>
                </div>
            </div>

            {/* --- PHASE 1: ANALYSIS RESULTS CARD --- */}
            {analysisResult && (
                <div id="analysis-results" className="bg-white dark:bg-slate-900 rounded-[3rem] p-10 md:p-14 border border-slate-200 dark:border-slate-800 shadow-2xl animate-in slide-in-from-bottom-10 duration-700 relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10 mb-16">
                            <div className="space-y-3 text-center lg:text-left">
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg text-[10px] font-black tracking-widest uppercase border border-indigo-100 dark:border-indigo-800">
                                    <Building2 size={12} /> {selectedJobInfo.company}
                                </div>
                                <h3 className="text-3xl font-black dark:text-white uppercase italic tracking-tighter">
                                    {selectedJobInfo.title}
                                </h3>
                                <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Data Verified: Resume + GitHub + LeetCode Indicators</p>
                            </div>
                            <div className="flex items-center gap-6 bg-slate-900 px-10 py-8 rounded-[2.5rem] text-white shadow-xl min-w-[280px]">
                                <Target size={40} className="text-indigo-400" />
                                <div>
                                    <div className="text-4xl font-black tabular-nums">{(analysisResult.overall_match_score * 100).toFixed(0)}%</div>
                                    <div className="text-[10px] uppercase font-black tracking-widest opacity-70">Job Compatibility</div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                            {/* Verified Skills */}
                            <div className="space-y-6">
                                <h4 className="font-black text-xs uppercase tracking-widest flex items-center gap-2 text-emerald-500">
                                    <CheckCircle size={18} /> Core Strengths
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {analysisResult.matched_skills?.map((s, idx) => (
                                        <span key={idx} className="px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 text-[10px] font-black rounded-xl border border-emerald-100 uppercase shadow-sm">{s}</span>
                                    ))}
                                </div>
                            </div>

                            {/* Critical Gaps */}
                            <div className="space-y-6">
                                <h4 className="font-black text-xs uppercase tracking-widest flex items-center gap-2 text-red-500">
                                    <AlertCircle size={18} /> Critical Gaps
                                </h4>
                                <div className="space-y-3">
                                    {analysisResult.missing_skills?.map((item, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm group hover:border-red-400 transition-colors">
                                            <span className="text-xs font-bold dark:text-slate-200 uppercase">{item.skill}</span>
                                            <span className={`text-[8px] px-2 py-1 rounded-lg font-black uppercase text-white shadow-md ${item.priority === 'high' ? 'bg-red-500' : 'bg-amber-500'}`}>
                                                {item.priority}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* AI Verification/Insights */}
                            <div className="space-y-6">
                                <h4 className="font-black text-xs uppercase tracking-widest flex items-center gap-2 text-indigo-500">
                                    <Info size={18} /> AI Logic
                                </h4>
                                <div className="p-8 bg-indigo-50/50 dark:bg-indigo-900/10 rounded-[2rem] border-2 border-indigo-100 dark:border-indigo-800/50 relative overflow-hidden group">
                                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-bold italic mb-8 relative z-10">
                                        "{analysisResult.external_validation?.confidence_notes[0] || 'Analyze your profile indicators to see verification notes.'}"
                                    </p>
                                    {/* <button 
                                        onClick={generatePath} 
                                        disabled={pathLoading} 
                                        className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs font-black shadow-lg transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {pathLoading ? <Loader2 className="animate-spin" size={16} /> : <Map size={16} />}
                                        GENERATE LEARNING PATH
                                    </button> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* --- PHASE 2: LEARNING PATH TIMELINE --- */}
            {learningPath && (
                <div id="learning-path-section" className="space-y-10 animate-in slide-in-from-bottom-20 duration-1000">
                    <div className="bg-slate-900 text-white p-10 rounded-[3rem] flex flex-col md:flex-row justify-between items-center gap-8 shadow-3xl ring-8 ring-slate-100 dark:ring-slate-900/50">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-emerald-500 rounded-lg text-slate-900"><Zap size={18} className="fill-current" /></div>
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400">Optimization Roadmap</span>
                            </div>
                            <h3 className="text-3xl font-black tracking-tighter flex items-center gap-4 italic uppercase leading-tight">
                                Target: {learningPath.target_role}
                            </h3>
                        </div>
                        <div className="bg-white/10 px-8 py-5 rounded-[2rem] border border-white/10 flex items-center gap-6 backdrop-blur-xl">
                            <div className="p-3 bg-white/10 rounded-2xl"><Clock size={28} className="text-emerald-400" /></div>
                            <div>
                                <div className="text-2xl font-black tabular-nums">{learningPath.estimated_readiness_weeks} WEEKS</div>
                                <div className="text-[10px] uppercase font-black opacity-50 tracking-widest">Preparation Time</div>
                            </div>
                        </div>
                    </div>

                    <div className="relative space-y-12 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-indigo-500 before:via-purple-500 before:to-indigo-500">
                        {learningPath.learning_path.map((step, index) => (
                            <div key={index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                                <div className="flex items-center justify-center w-12 h-12 rounded-full border-4 border-white bg-indigo-600 text-white shadow-xl shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-[360deg]">
                                    <span className="font-black text-sm">{step.step}</span>
                                </div>
                                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3.5rem)] bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl hover:shadow-2xl transition-all duration-500 group-hover:border-indigo-500">
                                    <div className="flex justify-between items-center mb-4">
                                        <h4 className="font-black text-xl text-indigo-600 dark:text-indigo-400 uppercase tracking-tighter">{step.skill}</h4>
                                        <span className="text-[10px] font-black px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm uppercase">{step.estimated_time_weeks} WEEKS</span>
                                    </div>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-6 italic">"{step.outcome}"</p>
                                    {step.resources?.length > 0 && (
                                        <div className="flex flex-wrap gap-3 mb-6">
                                            {step.resources.map((link, i) => (
                                                <a key={i} href={link} target="_blank" rel="noreferrer" className="w-10 h-10 flex items-center justify-center bg-slate-50 dark:bg-slate-800 rounded-2xl text-slate-400 hover:text-indigo-600 border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all"><ExternalLink size={18} /></a>
                                            ))}
                                        </div>
                                    )}
                                    {step.detailed_roadmap && (
                                        <div className="border-t border-slate-100 dark:border-slate-800 pt-6">
                                            <button onClick={() => setExpandedStep(expandedStep === index ? null : index)} className="flex items-center gap-3 text-xs font-black text-indigo-500 uppercase tracking-[0.2em] group/btn">
                                                <div className="p-1 bg-indigo-50 dark:bg-indigo-900/30 rounded-md group-hover/btn:bg-indigo-500 group-hover/btn:text-white transition-colors">
                                                    <ChevronDown size={14} className={expandedStep === index ? 'rotate-180 transition-transform' : 'transition-transform'} />
                                                </div>
                                                {expandedStep === index ? 'Hide Roadmap' : 'View Detailed Roadmap'}
                                            </button>
                                            {expandedStep === index && (
                                                <div className="mt-6 space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
                                                    {step.detailed_roadmap.levels.map((lv, idx) => (
                                                        <div key={idx} className="bg-slate-50 dark:bg-slate-800/60 p-5 rounded-[1.5rem] border border-slate-100 dark:border-slate-700 shadow-sm relative overflow-hidden">
                                                            <div className="flex justify-between items-center text-[10px] font-black uppercase text-indigo-500 mb-3 tracking-[0.1em]">
                                                                <span className="flex items-center gap-2"><Zap size={12} /> Level {lv.level}: {lv.name}</span>
                                                                <span className="bg-white dark:bg-slate-700 px-2 py-0.5 rounded-md border border-slate-100 dark:border-slate-600">{lv.duration_weeks}W</span>
                                                            </div>
                                                            <div className="flex flex-wrap gap-2 relative z-10">
                                                                {lv.topics.map((t, ti) => (
                                                                    <span key={ti} className="text-[9px] px-3 py-1.5 bg-white dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600 font-bold text-slate-600 dark:text-slate-300 shadow-sm">{t}</span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SkillGapDetector;