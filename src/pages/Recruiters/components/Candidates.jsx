import React, { useEffect, useState } from 'react';
import axiosInstance from "../../../config/AxiosConfig";
import { 
    User, FileText, CheckCircle, XCircle, Briefcase, Search, 
    ArrowLeft, Loader2, Send, Lock, Target, Download, HelpCircle,
    Calendar, Clock, Video, X, Users, CheckSquare, Square, Mail
} from 'lucide-react';

const Candidates = () => {
    // --- 1. CORE STATE ---
    const [jobs, setJobs] = useState([]);
    const [selectedJob, setSelectedJob] = useState(null); 
    const [applicants, setApplicants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [candidateSearch, setCandidateSearch] = useState("");
    const [selectedIds, setSelectedIds] = useState([]);
    
    // --- 2. MODAL & SCHEDULING STATE ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [schedulingData, setSchedulingData] = useState({ 
        participants: [], 
        date: new Date().toISOString().split('T')[0], 
        time: "10:00", 
        meetingLink: "" 
    });

    const recruiterData = JSON.parse(sessionStorage.getItem("careerVectorRecruiter") || "{}");
    const email = recruiterData?.email;

    // --- 3. DATA FETCHING ---
    const fetchMyJobs = async () => {
        try {
            const res = await axiosInstance.get(`/api/jobs/my-jobs?email=${email}`);
            setJobs(Array.isArray(res.data) ? res.data : []);
        } catch (err) { console.error("Fetch Jobs Error:", err); } finally { setLoading(false); }
    };

    const fetchCandidates = async (jobId) => {
        setLoading(true);
        try {
            const res = await axiosInstance.get(`/api/jobs/${jobId}/candidates?email=${email}`);
            setApplicants(Array.isArray(res.data) ? res.data : []);
        } catch (err) { console.error("Fetch Candidates Error:", err); } finally { setLoading(false); }
    };

    useEffect(() => { if (email) fetchMyJobs(); }, [email]);

    // --- 4. SELECTION & LOCK LOGIC ---
    const toggleSelect = (id) => setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);

    const isJobLocked = applicants.some(app => app.mailSent);
    const pendingReviewNotifications = applicants.filter(app => !app.mailSent && (app.status === 'SHORTLISTED' || app.status === 'REJECTED')).length;

    // --- 5. AI SHORTLIST LOGIC ---
    const handleShorlist = async () => {
        if (!window.confirm("Run AI Shortlist? This will analyze candidates using FastAPI and update statuses.")) return;
        setActionLoading(true);
        try {
            // This triggers your Spring Boot backend which calls FastAPI
            const res = await axiosInstance.post(`/api/jobs/${selectedJob.id}/shortlist?email=${email}`);
            const aiResults = res.data; 

            if (aiResults && Array.isArray(aiResults)) {
                // Manually update the local state with AI results for immediate feedback
                setApplicants(currentApps => currentApps.map(app => {
                    const aiMatch = aiResults.find(r => r.candidate_id.toLowerCase() === app.student.email.toLowerCase());
                    
                    if (aiMatch) {
                        let newStatus = app.status;
                        const aiStatus = aiMatch.status.toLowerCase();

                        // Mapping AI response to local UI constants
                        if (aiStatus === 'shortlist') newStatus = 'SHORTLISTED';
                        else if (aiStatus === 'reject') newStatus = 'REJECTED';
                        else if (aiStatus === 'review') newStatus = 'UNDER_REVIEW';

                        return {
                            ...app,
                            matchScore: aiMatch.final_score,
                            status: newStatus 
                        };
                    }
                    return app;
                }));
                alert("AI Shortlisting applied successfully! Results updated in view.");
            }
        } catch (err) {
            console.error("AI Error:", err);
            alert("Shortlisting failed. Ensure FastAPI service is running.");
        } finally {
            setActionLoading(false);
        }
    };

    // --- 6. INTERVIEW SCHEDULING LOGIC ---
    const openInterviewModal = (type, singleApp = null) => {
        let participants = [];
        let roomSuffix = "";

        if (type === 'one-on-one') {
            participants = [singleApp];
            roomSuffix = singleApp.student.rollNumber;
        } else {
            participants = applicants.filter(app => selectedIds.includes(app.id));
            roomSuffix = `Group-${Date.now()}`;
        }

        if (participants.length === 0) return alert("Select candidates first!");

        const roomName = `CV-${selectedJob.id}-${roomSuffix}`;
        const jitsiLink = `https://meet.jit.si/${roomName}`; // Jitsi Room Link
        
        setSchedulingData({ 
            participants, 
            date: new Date().toISOString().split('T')[0], 
            time: "10:00", 
            meetingLink: jitsiLink 
        });
        setIsModalOpen(true);
    };

    const handleConfirmSchedule = async () => {
        setActionLoading(true);
        try {
            const payload = {
                applicationIds: schedulingData.participants.map(p => p.id),
                interviewDate: schedulingData.date,
                interviewTime: schedulingData.time,
                meetingLink: schedulingData.meetingLink,
                jobTitle: selectedJob.jobTitle
            };
            
            await axiosInstance.post('/api/recruiter/schedule-bulk', payload);
            alert(`Interview Scheduled! Links sent to ${schedulingData.participants.length} candidates.`);
            setIsModalOpen(false);
            setSelectedIds([]);
        } catch (err) { alert("Error scheduling interview."); }
        finally { setActionLoading(false); }
    };

    // --- 7. OTHER ACTION HANDLERS ---
    const handleStatusUpdate = async (appId, newStatus) => {
        try {
            await axiosInstance.patch(`/api/jobs/applications/${appId}/status?status=${newStatus}`);
            setApplicants(prev => prev.map(app => app.id === appId ? { ...app, status: newStatus } : app));
        } catch (err) { alert(err.response?.data?.message || "Action blocked."); }
    };

    const handleFinalize = async () => {
        if (!window.confirm("Finalize Job: This will close the job and notify candidates. Continue?")) return;
        setActionLoading(true);
        try {
            await axiosInstance.post(`/api/jobs/${selectedJob.id}/finalize?email=${email}`);
            alert("Job Finalized Successfully!");
            fetchCandidates(selectedJob.id);
        } catch (err) { alert("Finalization failed."); }
        finally { setActionLoading(false); }
    };

    const filteredAndSorted = [...applicants]
        .filter(app => app.student?.fullName?.toLowerCase().includes(candidateSearch.toLowerCase()) || app.student?.rollNumber?.includes(candidateSearch))
        .sort((a, b) => (parseFloat(b.matchScore) || 0) - (parseFloat(a.matchScore) || 0));

    if (loading && !selectedJob) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-indigo-600" size={40} /></div>;

    return (
        <div className="animate-fade-in space-y-6">
            {!selectedJob ? (
                /* --- JOB LIST VIEW --- */
                <div className="space-y-6">
                    <h1 className="text-2xl font-bold flex items-center gap-2 dark:text-white">
                        <Briefcase className="text-indigo-600" /> My Postings
                    </h1>
                    <div className="grid gap-4">
                        {jobs.map(job => (
                            <div key={job.id} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex justify-between items-center hover:border-indigo-400 transition-all">
                                <div>
                                    <h2 className="text-xl font-bold dark:text-white">{job.jobTitle}</h2>
                                    <p className="text-sm text-slate-500">📍 {job.location}</p>
                                </div>
                                <button onClick={() => { setSelectedJob(job); fetchCandidates(job.id); }} className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-indigo-700">
                                    View Candidates
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                /* --- CANDIDATES DETAIL VIEW --- */
                <div className="space-y-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <button onClick={() => { setSelectedJob(null); setSelectedIds([]); }} className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold hover:underline">
                            <ArrowLeft size={20} /> Back to My Postings
                        </button>
                        <div className="relative w-full md:w-80">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input 
                                type="text" 
                                placeholder="Search by name or roll..." 
                                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500" 
                                value={candidateSearch} 
                                onChange={(e) => setCandidateSearch(e.target.value)} 
                            />
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
                        <h2 className="text-xl font-bold dark:text-white">Applied to <span className="text-indigo-600">{selectedJob.jobTitle}</span></h2>
                        <div className="flex gap-3">
                            {selectedIds.length > 0 && (
                                <button onClick={() => openInterviewModal('group')} className="bg-purple-600 text-white px-5 py-2 rounded-xl font-bold flex items-center gap-2 shadow-lg animate-in slide-in-from-right-2">
                                    <Users size={18} /> Group Interview ({selectedIds.length})
                                </button>
                            )}
                            <button onClick={handleShorlist} disabled={isJobLocked || actionLoading} className={`flex items-center gap-2 px-5 py-2 rounded-xl font-bold text-sm transition-all ${isJobLocked ? 'hidden' : 'bg-purple-600 text-white hover:bg-purple-700'}`}>
                                {actionLoading ? <Loader2 className="animate-spin" size={18} /> : <Target size={18} />}
                                Run AI Shortlist
                            </button>
                            <button onClick={handleFinalize} disabled={isJobLocked || actionLoading} className={`flex items-center gap-2 px-6 py-2 rounded-xl font-bold text-sm transition-all ${isJobLocked ? 'bg-green-100 text-green-700 border border-green-200 cursor-default' : 'bg-orange-600 text-white hover:bg-orange-700'}`}>
                                {isJobLocked ? <Lock size={18} /> : (actionLoading ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />)}
                                {isJobLocked ? "Job Finalized" : "Finalize & Notify All"}
                            </button>
                        </div>
                    </div>

                    <div className="grid gap-4">
                        {filteredAndSorted.map(app => (
                            <div key={app.id} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4 transition-all hover:border-indigo-200">
                                <div className="flex items-center gap-4 w-full">
                                    {app.status === 'SHORTLISTED' && app.mailSent && (
                                        <button onClick={() => toggleSelect(app.id)} className="text-indigo-600 transition-transform active:scale-90">
                                            {selectedIds.includes(app.id) ? <CheckSquare size={24} /> : <Square size={24} className="text-slate-300 dark:text-slate-700" />}
                                        </button>
                                    )}
                                    <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/30 rounded-full flex items-center justify-center text-indigo-600 shrink-0"><User size={24} /></div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <h4 className="font-bold dark:text-white">{app.student.fullName}</h4>
                                            {app.matchScore && (
                                                <span className="bg-purple-50 dark:bg-purple-900/20 text-purple-600 text-[10px] font-bold px-2 py-0.5 rounded-md border border-purple-100 dark:border-purple-800">
                                                    {(Number(app.matchScore) * 100).toFixed(0)}% Match
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">{app.student.email} | {app.student.rollNumber}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    {app.status === 'SHORTLISTED' && app.mailSent && (
                                        <button onClick={() => openInterviewModal('one-on-one', app)} className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl font-bold text-xs hover:bg-indigo-700 transition-all shadow-md">
                                            <Calendar size={16} /> Schedule
                                        </button>
                                    )}
                                    <span className={`text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-widest ${
                                        app.status === 'SHORTLISTED' ? 'bg-green-100 text-green-700 dark:bg-green-900/30' : 
                                        app.status === 'REJECTED' ? 'bg-red-100 text-red-700 dark:bg-red-900/30' : 
                                        app.status === 'UNDER_REVIEW' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30' : 
                                        'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30'
                                    }`}>
                                        {app.status.replace('_', ' ')}
                                    </span>
                                    <a href={app.student.resumeUrl} target="_blank" rel="noreferrer" className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700" title="Resume"><FileText size={18} /></a>
                                    
                                    {!app.mailSent && (
                                        <div className="flex gap-1">
                                            <button onClick={() => handleStatusUpdate(app.id, 'SHORTLISTED')} className="p-2 bg-green-500 text-white rounded-lg transition-colors hover:bg-green-600"><CheckCircle size={18} /></button>
                                            <button onClick={() => handleStatusUpdate(app.id, 'UNDER_REVIEW')} className="p-2 bg-purple-500 text-white rounded-lg transition-colors hover:bg-purple-600"><HelpCircle size={18} /></button>
                                            <button onClick={() => handleStatusUpdate(app.id, 'REJECTED')} className="p-2 bg-red-500 text-white rounded-lg transition-colors hover:bg-red-600"><XCircle size={18} /></button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* --- POLISHED INTERVIEW SETUP MODAL --- */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 animate-in zoom-in-95">
                        <div className="px-10 py-8 flex justify-between items-center border-b border-slate-100 dark:border-slate-800">
                            <h2 className="text-2xl font-black text-slate-800 dark:text-white">
                                {schedulingData.participants.length > 1 ? "Group Interview Setup" : "Individual Interview Setup"}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-400 transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="px-10 py-8 space-y-8">
                            {/* Selected Participants Box */}
                            <div className="p-8 bg-indigo-50/50 dark:bg-indigo-900/20 rounded-3xl border border-indigo-100/50 dark:border-indigo-800/30">
                                <p className="text-[10px] font-black text-indigo-500 dark:text-indigo-400 uppercase tracking-widest mb-4">Selected Participants</p>
                                <div className="flex flex-wrap gap-2">
                                    {schedulingData.participants.map(p => (
                                        <span key={p.id} className="bg-indigo-600 text-white px-5 py-2 rounded-2xl text-sm font-bold shadow-md">
                                            {p.student.fullName}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Date and Time Pickers */}
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                                        <Calendar size={14} className="text-indigo-400" /> Date
                                    </label>
                                    <input 
                                        type="date" 
                                        value={schedulingData.date} 
                                        onChange={e => setSchedulingData({...schedulingData, date: e.target.value})} 
                                        className="w-full p-4 rounded-2xl border-2 border-slate-800 dark:border-slate-700 bg-transparent text-slate-800 dark:text-white font-bold outline-none focus:border-indigo-500 transition-colors"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                                        <Clock size={14} className="text-indigo-400" /> Time
                                    </label>
                                    <input 
                                        type="time" 
                                        value={schedulingData.time} 
                                        onChange={e => setSchedulingData({...schedulingData, time: e.target.value})} 
                                        className="w-full p-4 rounded-2xl border-2 border-slate-800 dark:border-slate-700 bg-transparent text-slate-800 dark:text-white font-bold outline-none focus:border-indigo-500 transition-colors"
                                    />
                                </div>
                            </div>

                            {/* Meeting Link */}
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                                    <Video size={14} className="text-indigo-400" /> Jitsi Meeting Link
                                </label>
                                <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-xs text-slate-400 dark:text-slate-500 font-medium truncate">
                                    {schedulingData.meetingLink}
                                </div>
                            </div>

                            <button 
                                onClick={handleConfirmSchedule}
                                disabled={actionLoading}
                                className="w-full py-6 bg-indigo-600 text-white rounded-[2rem] font-black text-lg flex justify-center items-center gap-4 hover:bg-indigo-700 shadow-2xl shadow-indigo-500/30 dark:shadow-none transform active:scale-[0.98] transition-all"
                            >
                                {actionLoading ? <Loader2 size={24} className="animate-spin" /> : (
                                    <>
                                        <Send size={24} /> Send Invitations to {schedulingData.participants.length} Student(s)
                                    </>
                                )}
                            </button>

                            <p className="text-[10px] text-center text-slate-400 dark:text-slate-600 font-bold uppercase tracking-widest mt-4">
                                Meeting links are powered by Jitsi Meet Open Source.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Candidates;