import React, { useEffect, useState } from 'react';
import axiosInstance from "../../../config/AxiosConfig";
import { 
    User, Mail, Phone, FileText, CheckCircle, 
    XCircle, Briefcase, Search, ArrowLeft, Loader2, Send, Lock, Target, Download, HelpCircle
} from 'lucide-react';

const Candidates = () => {
    const [jobs, setJobs] = useState([]);
    const [selectedJob, setSelectedJob] = useState(null); 
    const [applicants, setApplicants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [candidateSearch, setCandidateSearch] = useState("");

    const recruiterData = JSON.parse(sessionStorage.getItem("careerVectorRecruiter") || "{}");
    const email = recruiterData?.email;

    const fetchMyJobs = async () => {
        try {
            const res = await axiosInstance.get(`/api/jobs/my-jobs?email=${email}`);
            setJobs(Array.isArray(res.data) ? res.data : []);
            setLoading(false);
        } catch (err) { setLoading(false); }
    };

    const fetchCandidates = async (jobId) => {
        setLoading(true);
        try {
            const res = await axiosInstance.get(`/api/jobs/${jobId}/candidates?email=${email}`);
            setApplicants(Array.isArray(res.data) ? res.data : []);
            setLoading(false);
        } catch (err) { setLoading(false); }
    };

    useEffect(() => { if (email) fetchMyJobs(); }, [email]);

    // --- LOGIC HELPERS ---
    const isJobLocked = applicants.some(app => app.mailSent);
    const pendingReviewNotifications = applicants.filter(app => !app.mailSent && (app.status === 'SHORTLISTED' || app.status === 'REJECTED')).length;

    const handleStatusUpdate = async (appId, newStatus) => {
        try {
            await axiosInstance.patch(`/api/jobs/applications/${appId}/status?status=${newStatus}`);
            fetchCandidates(selectedJob.id); 
        } catch (err) { alert(err.response?.data?.message || "Action blocked."); }
    };

    const handleFinalize = async () => {
        if (!window.confirm("Finalize Job: This will close the job, run AI ranking, and notify candidates. Continue?")) return;
        setActionLoading(true);
        try {
            await axiosInstance.post(`/api/jobs/${selectedJob.id}/finalize?email=${email}`);
            alert("Job Finalized Successfully!");
            fetchCandidates(selectedJob.id);
        } catch (err) { alert("Finalization failed."); }
        finally { setActionLoading(false); }
    };

    const handleShorlist = async() =>{
        alert(`Ai ShortListing is Initiated for ${selectedJob.jobTitle}`);
        setActionLoading(true);
        try{
            await axiosInstance.post(`/api/jobs/${selectedJob.id}/shortlist?email=${email}`);
            alert("ShortListing Completed Sucessfully")
            fetchCandidates(selectedJob.id);
        }
        catch(err){alert("shortlisting failed");}
        finally{setActionLoading(false);}
    }

    const handleNotifyReviewed = async () => {
        if (!window.confirm(`Notify ${pendingReviewNotifications} updated candidates?`)) return;
        setActionLoading(true);
        try {
            await axiosInstance.post(`/api/jobs/${selectedJob.id}/notify-reviewed?email=${email}`);
            fetchCandidates(selectedJob.id);
        } catch (err) { alert("Failed to notify."); }
        finally { setActionLoading(false); }
    };

    const exportToCSV = () => {
        const headers = ["Name", "Email", "Roll Number", "Status", "Match Score"];
        const rows = filteredAndSorted.map(app => [
            `"${app.student.fullName}"`, app.student.email, app.student.rollNumber, app.status, 
            app.matchScore ? `${(app.matchScore * 100).toFixed(0)}%` : "0%"
        ]);
        const csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\n" + rows.map(e => e.join(",")).join("\n");
        const link = document.createElement("a");
        link.setAttribute("href", encodeURI(csvContent));
        link.setAttribute("download", `${selectedJob.jobTitle}_Candidates.csv`);
        link.click();
    };

    // --- SORTING & FILTERING ---
    const filteredAndSorted = applicants
        .filter(app => app.student?.fullName?.toLowerCase().includes(candidateSearch.toLowerCase()) || app.student?.rollNumber?.includes(candidateSearch))
        .sort((a, b) => {
            const statusOrder = { 'SHORTLISTED': 1, 'UNDER_REVIEW': 2, 'PENDING': 3, 'REJECTED': 4 };
            const orderA = statusOrder[a.status] || 5;
            const orderB = statusOrder[b.status] || 5;
            if (orderA !== orderB) return orderA - orderB;
            return (Number(b.matchScore) || 0) - (Number(a.matchScore) || 0);
        });

    if (loading && jobs.length === 0) return <div className="flex justify-center p-10"><Loader2 className="animate-spin text-indigo-600" size={40} /></div>;

    return (
        <div className="animate-fade-in space-y-6">
            {!selectedJob ? (
                <div className="space-y-6">
                    <h1 className="text-2xl font-bold flex items-center gap-2 dark:text-white">
                        <Briefcase className="text-indigo-600" /> My Postings
                    </h1>
                    <div className="grid gap-4">
                        {jobs.map(job => (
                            <div key={job.id} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex justify-between items-center transition-all hover:-translate-y-1">
                                <div>
                                    <h2 className="text-xl font-bold dark:text-white">{job.jobTitle}</h2>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">📍 {job.location}</p>
                                </div>
                                <button onClick={() => { setSelectedJob(job); fetchCandidates(job.id); }} className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-indigo-700">
                                    View Candidates
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="space-y-6">
                    {/* Simplified Header */}
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <button onClick={() => setSelectedJob(null)} className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold hover:underline self-start">
                            <ArrowLeft size={20} /> Back to Postings
                        </button>
                        <div className="flex gap-2 w-full md:w-auto">
                            <div className="relative flex-1 md:w-80">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input 
                                    type="text" 
                                    placeholder="Search by name or roll..." 
                                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 text-sm" 
                                    value={candidateSearch} 
                                    onChange={(e) => setCandidateSearch(e.target.value)} 
                                />
                            </div>
                            <button onClick={exportToCSV} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 dark:text-white" title="Download CSV">
                                <Download size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Finalize Action Bar */}
                    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
                        <h2 className="text-xl font-bold dark:text-white">Applicants for: <span className="text-indigo-600 dark:text-indigo-400">{selectedJob.jobTitle}</span></h2>
                        <div className="flex gap-3">
                            {pendingReviewNotifications > 0 && isJobLocked && (
                                <button onClick={handleNotifyReviewed} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-blue-700">
                                    <Send size={18} /> Notify Updated ({pendingReviewNotifications})
                                </button>
                            )}
                            <button 
                                onClick = {handleShorlist}
                                disabled={isJobLocked || actionLoading}
                                className={`flex items-center gap-2 px-6 py-2 rounded-xl font-bold text-sm transition-all ${isJobLocked ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800' : 'bg-orange-600 text-white hover:bg-orange-700'}`}
                            >ShortList
                            </button>
                            <button 
                                onClick={handleFinalize} 
                                disabled={isJobLocked || actionLoading}
                                className={`flex items-center gap-2 px-6 py-2 rounded-xl font-bold text-sm transition-all ${isJobLocked ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800' : 'bg-orange-600 text-white hover:bg-orange-700'}`}
                            >
                                {isJobLocked ? <Lock size={18} /> : (actionLoading ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />)}
                                {isJobLocked ? "Job Finalized" : "Finalize & Notify All"}
                            </button>
                        </div>
                    </div>

                    {/* Applicant List */}
                    <div className="grid gap-4">
                        {filteredAndSorted.map(app => (
                            <div key={app.id} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4 transition-all">
                                <div className="flex items-center gap-4 w-full">
                                    <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
                                        <User size={24} />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <h4 className="font-bold dark:text-white">{app.student.fullName}</h4>
                                            {app.matchScore !== null && (
                                                <div className="flex items-center gap-1 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 px-2 py-0.5 rounded-lg text-[10px] font-bold border border-purple-100 dark:border-purple-800">
                                                    <Target size={12} /> {(Number(app.matchScore) * 100).toFixed(0)}% Match
                                                </div>
                                            )}
                                        </div>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">{app.student.email} | {app.student.rollNumber}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <span className={`text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wider ${
                                        app.status === 'SHORTLISTED' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 
                                        app.status === 'REJECTED' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 
                                        app.status === 'UNDER_REVIEW' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' : 
                                        'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                                    }`}>
                                        {app.status.replace('_', ' ')}
                                    </span>
                                    
                                    <a href={app.student.resumeUrl} target="_blank" rel="noreferrer" className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700" title="View Resume">
                                        <FileText size={18} />
                                    </a>
                                    
                                    <button onClick={() => handleStatusUpdate(app.id, 'SHORTLISTED')} disabled={app.mailSent} className={`p-2 rounded-lg transition-all ${app.mailSent ? 'text-slate-300 dark:text-slate-600' : 'bg-green-500 text-white hover:bg-green-600'}`}>
                                        {app.mailSent ? <Lock size={18} /> : <CheckCircle size={18} />}
                                    </button>
                                    <button onClick={() => handleStatusUpdate(app.id, 'UNDER_REVIEW')} disabled={app.mailSent} className={`p-2 rounded-lg transition-all ${app.mailSent ? 'text-slate-300 dark:text-slate-600' : 'bg-purple-500 text-white hover:bg-purple-600'}`}>
                                        {app.mailSent ? <Lock size={18} /> : <HelpCircle size={18} />}
                                    </button>
                                    <button onClick={() => handleStatusUpdate(app.id, 'REJECTED')} disabled={app.mailSent} className={`p-2 rounded-lg transition-all ${app.mailSent ? 'text-slate-300 dark:text-slate-600' : 'bg-red-500 text-white hover:bg-red-600'}`}>
                                        {app.mailSent ? <Lock size={18} /> : <XCircle size={18} />}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Candidates;