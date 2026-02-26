import React, { useEffect, useState } from 'react';
import axiosInstance from "../../../config/AxiosConfig";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { 
    Briefcase, MapPin, DollarSign, Building2, 
    Clock, Search, RefreshCcw, Target, X, CheckCircle, Trash2, Users, AlertCircle, Clock3,
    Sparkles, BrainCircuit, ShieldCheck, Zap, TrendingUp, TrendingDown, Loader2
} from 'lucide-react';

const StudentJobs = () => {
    const [jobData, setJobData] = useState([]); 
    const [loading, setLoading] = useState(true);
    // Tracks specific job ID and the type of action ('apply' or 'withdraw')
    const [processingAction, setProcessingAction] = useState({ id: null, type: null }); 
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedJob, setSelectedJob] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(new Date());

    const sessionData = JSON.parse(sessionStorage.getItem("careerVectorStudent")); 
    const rollNumber = sessionData?.rollNumber;

    const fetchJobs = async () => {
        if (!rollNumber) return;
        try {
            const response = await axiosInstance.get(`/api/student/${rollNumber}/get-scored-jobs`);
            setJobData(response.data);
            setLastUpdated(new Date());
            setLoading(false);
        } catch (error) {
            console.error("Error fetching jobs:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();
        const interval = setInterval(fetchJobs, 60000);
        return () => clearInterval(interval);
    }, [rollNumber]);

    const handleApply = async (jobId) => {
        setProcessingAction({ id: jobId, type: 'apply' });
        try {
            await axiosInstance.post(`/api/student/apply/${jobId}?rollNumber=${rollNumber}`);
            
            // Optimistic Update
            setJobData(prev => prev.map(item => 
                item.job.id === jobId ? { ...item, hasApplied: true, applicationStatus: 'PENDING' } : item
            ));

            toast.success("Application submitted successfully!");
            setSelectedJob(null);
            // Clear loading immediately after UI update to prevent animation bleed
            setProcessingAction({ id: null, type: null }); 
            await fetchJobs(); 
        } catch (error) {
            toast.error(error.response?.data || "Failed to apply.");
            setProcessingAction({ id: null, type: null });
        }
    };

    const handleWithdraw = async (jobId) => {
        if (!window.confirm("Are you sure you want to withdraw? This action cannot be undone.")) return;
        
        setProcessingAction({ id: jobId, type: 'withdraw' });
        try {
            await axiosInstance.delete(`/api/student/withdraw/${jobId}?rollNumber=${rollNumber}`);
            
            // Optimistic Update
            setJobData(prev => prev.map(item => 
                item.job.id === jobId ? { ...item, hasApplied: false, applicationStatus: null } : item
            ));

            toast.info("Application withdrawn successfully.");
            if (selectedJob?.id === jobId) setSelectedJob(null);
            setProcessingAction({ id: null, type: null });
            await fetchJobs(); 
        } catch (error) {
            toast.error(error.response?.data || "Failed to withdraw.");
            setProcessingAction({ id: null, type: null });
            fetchJobs(); 
        }
    };

    const filteredData = jobData.filter(({ job }) => 
        job.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.recruiter?.companyName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusStyles = (status) => {
        const s = status?.toLowerCase();
        if (s === 'rejected' || s === 'reject') return "bg-red-50 text-red-600 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800";
        if (s === 'under_review' || s === 'reviewing' || s === 'review') return "bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800";
        if (s === 'shortlisted' || s === 'shortlist' || s === 'accepted') return "bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800";
        return "bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800";
    };

    const renderAiStatusLabel = (status) => {
        const s = status?.toLowerCase();
        if (s === 'shortlist') return <span className="flex items-center gap-1 font-bold"><TrendingUp size={14}/> Can be Shortlisted</span>;
        if (s === 'reject') return <span className="flex items-center gap-1 font-bold"><TrendingDown size={14}/> Can be Rejected</span>;
        if (s === 'review' || s === 'under_review') return <span className="flex items-center gap-1 font-bold"><Clock3 size={14}/> Under Review Potential</span>;
        return status;
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 p-4 md:p-8">
            <ToastContainer theme="colored" position="top-right" autoClose={3000} />

            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Job Intelligence</h1>
                            <BrainCircuit className="text-blue-600 dark:text-blue-400" size={28} />
                        </div>
                        <p className="text-sm text-gray-500 italic uppercase tracking-tighter">AI-Ranked for you • {lastUpdated.toLocaleTimeString()}</p>
                    </div>
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input 
                            type="text"
                            placeholder="Search roles or companies..."
                            className="w-full pl-10 pr-4 py-2 rounded-lg border dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20"><RefreshCcw className="animate-spin text-blue-500" size={40} /></div>
                ) : (
                    <div className="grid gap-6">
                        {filteredData.length > 0 ? filteredData.map(({ job, aiStats, hasApplied, applicationStatus }) => (
                            <div key={job.id} className="bg-white dark:bg-gray-800 border dark:border-gray-700 p-6 rounded-xl shadow-sm hover:shadow-md transition-all relative overflow-hidden">
                                {aiStats && (
                                    <div className="absolute top-0 right-0">
                                        <div className="bg-slate-900 text-white px-4 py-1 rounded-bl-xl text-[10px] font-black tracking-widest flex items-center gap-1 uppercase">
                                            <Zap size={10} fill="currentColor"/> AI Rank {aiStats.rank}
                                        </div>
                                    </div>
                                )}

                                <div className="flex justify-between items-start">
                                    <div className="flex gap-4">
                                        <div className="p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-600 rounded-lg h-fit"><Briefcase size={24} /></div>
                                        <div>
                                            <h2 className="text-xl font-bold dark:text-white leading-tight">{job.jobTitle}</h2>
                                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mt-1">
                                                <Building2 size={16} /> <span className="font-medium">{job.recruiter?.companyName}</span>
                                            </div>
                                            {aiStats && (
                                                <div className={`mt-3 px-3 py-1 rounded-full text-[11px] border w-fit uppercase tracking-tighter shadow-sm font-bold ${getStatusStyles(aiStats.status)}`}>
                                                    {renderAiStatusLabel(aiStats.status)}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-end gap-2">
                                        {aiStats && (
                                            <div className="flex items-center gap-1 bg-emerald-50 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 px-3 py-1.5 rounded-lg text-sm font-black border border-emerald-200 dark:border-emerald-800">
                                                <Target size={16} /> {Math.round(aiStats.final_score * 100)}% Match
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-500 dark:text-gray-400">
                                    <div className="flex items-center gap-1"><MapPin size={16}/> {job.location}</div>
                                    <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold"><DollarSign size={16}/> {job.salaryRange}</div>
                                    <div className="flex items-center gap-1"><Users size={16}/> {job.numberOfPostings} Roles</div>
                                    <div className="flex items-center gap-1"><Clock size={16}/> {new Date(job.postedAt).toLocaleDateString()}</div>
                                </div>

                                <div className="mt-6 flex justify-between items-center border-t dark:border-gray-700 pt-4">
                                    <div className="text-[11px] text-gray-400 max-w-[50%] italic truncate">
                                        AI Insight: {aiStats?.reason || "Compatibility verified."}
                                    </div>
                                    <div className="flex gap-2 items-center">
                                        <button 
                                            onClick={() => setSelectedJob({ ...job, aiStats, hasApplied, applicationStatus })} 
                                            className="px-4 py-2 text-blue-600 dark:text-blue-400 font-bold hover:underline"
                                        >
                                            Details
                                        </button>
                                        
                                        {hasApplied ? (
                                            <div className="flex gap-2">
                                                <button 
                                                    onClick={() => handleWithdraw(job.id)}
                                                    disabled={(applicationStatus !== 'PENDING' && applicationStatus !== 'applied') || (processingAction.id === job.id)}
                                                    className={`flex items-center gap-1 px-3 py-2 rounded-lg font-bold text-xs border transition-all ${
                                                        (applicationStatus === 'PENDING' || applicationStatus === 'applied') 
                                                        ? "text-red-600 border-red-200 bg-red-50 hover:bg-red-100" 
                                                        : "text-gray-400 border-gray-200 bg-gray-50 cursor-not-allowed"
                                                    }`}
                                                >
                                                    {processingAction.id === job.id && processingAction.type === 'withdraw' ? (
                                                        <Loader2 size={14} className="animate-spin" />
                                                    ) : (
                                                        <Trash2 size={14} />
                                                    )} 
                                                    Withdraw
                                                </button>
                                                <span className={`px-4 py-2 font-bold rounded-lg flex items-center gap-2 border text-xs shadow-sm ${getStatusStyles(applicationStatus)}`}>
                                                    {applicationStatus === 'PENDING' ? 'Applied' : applicationStatus}
                                                </span>
                                            </div>
                                        ) : (
                                            <button 
                                                onClick={() => handleApply(job.id)} 
                                                disabled={processingAction.id === job.id}
                                                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-lg disabled:opacity-50"
                                            >
                                                {processingAction.id === job.id && processingAction.type === 'apply' ? (
                                                    <Loader2 size={18} className="animate-spin" />
                                                ) : (
                                                    "Apply"
                                                )}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <div className="text-center py-20 dark:text-gray-400 font-semibold text-lg">No job matches found.</div>
                        )}
                    </div>
                )}
            </div>

            {/* Modal */}
            {selectedJob && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-800 w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
                        <div className="p-6 border-b dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-900/50">
                            <div>
                                <h2 className="text-2xl font-bold dark:text-white">{selectedJob.jobTitle}</h2>
                                <p className="text-blue-600 font-bold flex items-center gap-1"><Building2 size={18}/> {selectedJob.recruiter?.companyName}</p>
                            </div>
                            <button onClick={() => setSelectedJob(null)} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors">
                                <X size={24} className="dark:text-white"/>
                            </button>
                        </div>
                        
                        <div className="p-6 overflow-y-auto space-y-6">
                            {selectedJob.aiStats && (
                                <div className={`p-5 rounded-xl border-2 border-dashed ${getStatusStyles(selectedJob.aiStats.status)}`}>
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-2 font-black text-lg uppercase tracking-wider">
                                            <Sparkles size={20}/> {renderAiStatusLabel(selectedJob.aiStats.status)}
                                        </div>
                                        <div className="text-right">
                                            <span className="text-[10px] uppercase opacity-70 block font-bold">Match Score</span>
                                            <span className="font-black text-2xl">{Math.round(selectedJob.aiStats.final_score * 100)}%</span>
                                        </div>
                                    </div>
                                    <p className="text-sm font-medium leading-relaxed italic">"{selectedJob.aiStats.reason}"</p>
                                </div>
                            )}
                            <div>
                                <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                    <ShieldCheck size={18}/> Job Overview
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap">{selectedJob.description}</p>
                            </div>
                        </div>

                        <div className="p-6 border-t dark:border-gray-700 flex justify-end">
                            {selectedJob.hasApplied ? (
                                <span className={`px-8 py-3 font-black rounded-xl border-2 shadow-sm ${getStatusStyles(selectedJob.applicationStatus)}`}>
                                    {selectedJob.applicationStatus === 'PENDING' ? 'APPLIED' : selectedJob.applicationStatus}
                                </span>
                            ) : (
                                <button 
                                    onClick={() => handleApply(selectedJob.id)} 
                                    disabled={processingAction.id === selectedJob.id}
                                    className="px-10 py-3 bg-blue-600 text-white font-black rounded-xl hover:bg-blue-700 shadow-xl shadow-blue-500/30 transition-all"
                                >
                                    {processingAction.id === selectedJob.id && processingAction.type === 'apply' ? (
                                        <Loader2 className="animate-spin" />
                                    ) : (
                                        "CONFIRM & APPLY"
                                    )}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentJobs;