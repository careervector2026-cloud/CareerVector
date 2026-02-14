import React, { useEffect, useState } from 'react';
import axiosInstance from "../../../config/AxiosConfig";
import { 
    User, Mail, Phone, FileText, CheckCircle, 
    XCircle, Briefcase, Search, ArrowLeft, Loader2, Send, Lock, Target, Sparkles, TrendingUp, HelpCircle
} from 'lucide-react';

const Candidates = () => {
    const [jobs, setJobs] = useState([]);
    const [selectedJob, setSelectedJob] = useState(null); 
    const [applicants, setApplicants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [notifyingId, setNotifyingId] = useState(null);
    const [bulkLoading, setBulkLoading] = useState(false); 
    const [candidateSearch, setCandidateSearch] = useState("");

    const recruiterData = JSON.parse(sessionStorage.getItem("careerVectorRecruiter") || "{}");
    const email = recruiterData?.email;

    const fetchMyJobs = async () => {
        if (!email) { setLoading(false); return; }
        try {
            const res = await axiosInstance.get(`/api/jobs/my-jobs?email=${email}`);
            setJobs(Array.isArray(res.data) ? res.data : []);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching jobs:", err);
            setLoading(false);
        }
    };

    const fetchCandidates = async (jobId) => {
        setLoading(true);
        try {
            const res = await axiosInstance.get(`/api/jobs/${jobId}/candidates?email=${email}`);
            setApplicants(Array.isArray(res.data) ? res.data : []);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching candidates:", err);
            setLoading(false);
        }
    };

    useEffect(() => { if (email) fetchMyJobs(); }, [email]);

    const handleStatusUpdate = async (appId, newStatus) => {
        try {
            await axiosInstance.patch(`/api/jobs/applications/${appId}/status?status=${newStatus}`);
            fetchCandidates(selectedJob.id); 
        } catch (err) { 
            alert(err.response?.data?.message || "Action blocked: Status is locked."); 
        }
    };

    const handleNotifyStudent = async (appId) => {
        if (!window.confirm("Once sent, you cannot change this student's status. Continue?")) return;
        setNotifyingId(appId);
        try {
            await axiosInstance.post(`/api/jobs/applications/${appId}/notify?email=${email}`);
            alert("Professional notification sent successfully!");
            fetchCandidates(selectedJob.id); 
        } catch (err) { 
            alert("Failed to send email notification."); 
        } finally { setNotifyingId(null); }
    };

    const handleBulkNotify = async () => {
        const processedCount = applicants.filter(app => !app.mailSent && (app.status === 'SHORTLISTED' || app.status === 'REJECTED')).length;
        if (processedCount === 0) return alert("No new Shortlisted or Rejected candidates to notify.");
        if (!window.confirm(`Send bulk emails to ${processedCount} candidates? This action locks status.`)) return;
        
        setBulkLoading(true);
        try {
            await axiosInstance.post(`/api/jobs/${selectedJob.id}/bulk-notify?email=${email}`);
            alert("Bulk notifications dispatched successfully!");
            fetchCandidates(selectedJob.id);
        } catch (err) {
            alert("Failed to send bulk notifications.");
        } finally {
            setBulkLoading(false);
        }
    };

    // --- REFINED LOGIC: SEARCH + STRICT STATUS SORTING + SCORE SORTING ---
    const filteredAndSortedApplicants = applicants
        .filter(app => 
            app.student?.fullName?.toLowerCase().includes(candidateSearch.toLowerCase()) ||
            app.student?.email?.toLowerCase().includes(candidateSearch.toLowerCase()) ||
            app.student?.rollNumber?.toLowerCase().includes(candidateSearch.toLowerCase())
        )
        .sort((a, b) => {
            // 1. Primary Sort: Status Order (Shortlisted > Under Review > Pending > Rejected)
            const statusOrder = { 'SHORTLISTED': 1, 'UNDER_REVIEW': 2, 'PENDING': 3, 'REJECTED': 4 };
            const orderA = statusOrder[a.status] || 5;
            const orderB = statusOrder[b.status] || 5;

            if (orderA !== orderB) return orderA - orderB;

            // 2. Secondary Sort: Match Score (Highest first within same status)
            const scoreA = a.matchScore !== null && a.matchScore !== undefined ? Number(a.matchScore) : -1;
            const scoreB = b.matchScore !== null && b.matchScore !== undefined ? Number(b.matchScore) : -1;
            return scoreB - scoreA;
        });

    if (loading && jobs.length === 0) return <div className="flex justify-center p-10"><Loader2 className="animate-spin text-indigo-600" size={40} /></div>;

    return (
        <div className="animate-fade-in space-y-6">
            {!selectedJob ? (
                <div className="space-y-6">
                    <h1 className="text-2xl font-bold dark:text-white flex items-center gap-2">
                        <Briefcase className="text-indigo-600" /> My Postings
                    </h1>
                    <div className="grid gap-4">
                        {jobs.map(job => (
                            <div key={job.id} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex justify-between items-center transition-all hover:-translate-y-1">
                                <div>
                                    <h2 className="text-xl font-bold dark:text-white">{job.jobTitle}</h2>
                                    <p className="text-sm text-slate-500">📍 {job.location}</p>
                                </div>
                                <button onClick={() => { setSelectedJob(job); fetchCandidates(job.id); }} className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-indigo-700 transition-colors">
                                    View Candidates
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                        <button onClick={() => setSelectedJob(null)} className="flex items-center gap-2 text-indigo-600 font-bold hover:underline">
                            <ArrowLeft size={20} /> Back
                        </button>

                        <div className="flex flex-1 justify-center gap-4 w-full md:w-auto">
                           <div className="relative w-full max-w-xs">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input 
                                    type="text" 
                                    placeholder="Search candidates..." 
                                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 dark:text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                                    value={candidateSearch}
                                    onChange={(e) => setCandidateSearch(e.target.value)}
                                />
                            </div>
                            <button onClick={handleBulkNotify} disabled={bulkLoading} className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl font-bold text-sm transition-all disabled:opacity-50">
                                {bulkLoading ? <Loader2 className="animate-spin" size={18}/> : <Send size={18} />}
                                Bulk Notify
                            </button>
                        </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold dark:text-white">
                            Applicants for: <span className="text-indigo-600">{selectedJob.jobTitle}</span>
                        </h2>
                        <div className="flex items-center gap-2 text-xs font-semibold text-purple-600 bg-purple-50 dark:bg-purple-900/20 px-3 py-1 rounded-full border border-purple-100 dark:border-purple-800">
                           <TrendingUp size={14} /> AI Ranking Active
                        </div>
                    </div>
                    
                    <div className="grid gap-4">
                        {filteredAndSortedApplicants.length > 0 ? filteredAndSortedApplicants.map(app => (
                            <div key={app.id} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4 hover:border-indigo-200 transition-all">
                                <div className="flex items-center gap-4 w-full">
                                    <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center text-indigo-600 shrink-0"><User size={24} /></div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <h4 className="font-bold dark:text-white">{app.student.fullName}</h4>
                                            {/* AI MATCH SCORE - Global Display */}
                                            {app.matchScore !== null && app.matchScore !== undefined && (
                                                <div className="flex items-center gap-1 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 px-2 py-0.5 rounded-lg text-[10px] font-bold border border-purple-100 dark:border-purple-800">
                                                    <Target size={12} /> {(Number(app.matchScore) * 100).toFixed(0)}% Match
                                                </div>
                                            )}
                                        </div>
                                        <p className="text-xs text-slate-500">{app.student.email} | {app.student.rollNumber}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                     <span className={`text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wider ${
                                         app.status === 'SHORTLISTED' ? 'bg-green-100 text-green-700' : 
                                         app.status === 'REJECTED' ? 'bg-red-100 text-red-700' : 
                                         app.status === 'UNDER_REVIEW' ? 'bg-purple-100 text-purple-700' : // Purple for Review
                                         'bg-yellow-100 text-yellow-700'
                                     }`}>
                                         {app.status.replace('_', ' ')}
                                     </span>
                                     
                                     {(app.status === 'SHORTLISTED' || app.status === 'REJECTED') && (
                                         <button 
                                            onClick={() => handleNotifyStudent(app.id)} 
                                            disabled={notifyingId === app.id || app.mailSent} 
                                            className={`p-2 rounded-lg transition-all ${app.mailSent ? 'bg-slate-100 text-green-600 border border-green-200' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                                            title={app.mailSent ? "Email sent" : "Send Mail"}
                                         >
                                            {notifyingId === app.id ? <Loader2 className="animate-spin" size={18} /> : (app.mailSent ? <CheckCircle size={18}/> : <Send size={18} />)}
                                         </button>
                                     )}

                                     <a href={app.student.resumeUrl} target="_blank" rel="noreferrer" className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-600 hover:bg-slate-200" title="View Resume">
                                        <FileText size={18} />
                                     </a>
                                     
                                     <button 
                                        onClick={() => handleStatusUpdate(app.id, 'SHORTLISTED')} 
                                        disabled={app.mailSent}
                                        className={`p-2 rounded-lg transition-all ${app.mailSent ? 'bg-slate-50 text-slate-300 cursor-not-allowed border border-slate-100' : 'bg-green-500 text-white hover:bg-green-600'}`}
                                     >
                                         {app.mailSent ? <Lock size={18} /> : <CheckCircle size={18} />}
                                     </button>
                                     
                                     {/* Under Review Button for Manual Trigger */}
                                     <button 
                                        onClick={() => handleStatusUpdate(app.id, 'UNDER_REVIEW')} 
                                        disabled={app.mailSent}
                                        className={`p-2 rounded-lg transition-all ${app.mailSent ? 'bg-slate-50 text-slate-300 cursor-not-allowed border border-slate-100' : 'bg-purple-500 text-white hover:bg-purple-600'}`}
                                        title="Move to Review"
                                     >
                                         {app.mailSent ? <Lock size={18} /> : <HelpCircle size={18} />}
                                     </button>

                                     <button 
                                        onClick={() => handleStatusUpdate(app.id, 'REJECTED')} 
                                        disabled={app.mailSent}
                                        className={`p-2 rounded-lg transition-all ${app.mailSent ? 'bg-slate-50 text-slate-300 cursor-not-allowed border border-slate-100' : 'bg-red-500 text-white hover:bg-red-600'}`}
                                     >
                                         {app.mailSent ? <Lock size={18} /> : <XCircle size={18} />}
                                     </button>
                                </div>
                            </div>
                        )) : <div className="text-center py-20 text-slate-500 dark:text-slate-400 font-medium">No candidates found.</div>}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Candidates;