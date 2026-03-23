import React, { useEffect, useState } from 'react';
import axiosInstance from "../../../config/AxiosConfig";
import confetti from 'canvas-confetti';
import { 
    User, FileText, CheckCircle, XCircle, Briefcase, Search, 
    ArrowLeft, Loader2, Send, Lock, Target, HelpCircle,
    Calendar, Clock, Video, X, Users, CheckSquare, Square, Mail, BriefcaseBusiness, VideoIcon
} from 'lucide-react';

const Candidates = () => {
    // --- 1. STATE MANAGEMENT ---
    const [jobs, setJobs] = useState([]);
    const [selectedJob, setSelectedJob] = useState(null); 
    const [applicants, setApplicants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [candidateSearch, setCandidateSearch] = useState("");
    const [selectedIds, setSelectedIds] = useState([]);
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [schedulingData, setSchedulingData] = useState({ 
        participants: [], 
        date: new Date().toISOString().split('T')[0], 
        time: "10:00", 
        meetingLink: "" 
    });

    const recruiterData = JSON.parse(sessionStorage.getItem("careerVectorRecruiter") || "{}");
    const email = recruiterData?.email;

    // --- 2. DATA FETCHING ---
    const fetchMyJobs = async () => {
        try {
            const res = await axiosInstance.get(`/api/jobs/my-jobs?email=${email}`);
            setJobs(Array.isArray(res.data) ? res.data : []);
        } catch (err) { console.error(err); } finally { setLoading(false); }
    };

    const fetchCandidates = async (jobId) => {
        setLoading(true);
        try {
            const res = await axiosInstance.get(`/api/jobs/${jobId}/candidates?email=${email}`);
            setApplicants(Array.isArray(res.data) ? res.data : []);
        } catch (err) { console.error(err); } finally { setLoading(false); }
    };

    useEffect(() => { if (email) fetchMyJobs(); }, [email]);

    // --- 3. LOGIC HELPERS ---
    const toggleSelect = (id) => setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    
    const isMeetingToday = (dateStr) => dateStr === new Date().toISOString().split('T')[0];

    // UPDATED: Robust check for interview completion using HH:mm:ss
    const isInterviewCompleted = (dateStr, timeStr) => {
        if (!dateStr || !timeStr) return false;
        // Construct ISO string (YYYY-MM-DDTHH:mm:ss)
        const interviewDateTime = new Date(`${dateStr}T${timeStr}`);
        const now = new Date();
        return now > interviewDateTime;
    };

    const isJobLocked = selectedJob?.active === false;
    const pendingReviewNotifications = applicants.filter(app => !app.mailSent && (app.status === 'SHORTLISTED' || app.status === 'REJECTED' || app.status === 'UNDER_REVIEW')).length;
    
    // Check if AI Shortlisting was already performed (Match scores exist)
    const isAiShortlistDone = applicants.some(app => app.matchScore !== null && app.matchScore !== undefined);

    // --- 4. ACTION HANDLERS ---
    const handleHireConfetti = () => {
        confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, zIndex: 9999 });
    };

    const handleFinalStatusUpdate = async (appId, finalStatus) => {
        if (!window.confirm(`Confirm ${finalStatus === 'SELECTED' ? 'Hire' : 'Pass'}? This will notify the student.`)) return;
        setActionLoading(true);
        try {
            await axiosInstance.patch(`/api/jobs/applications/${appId}/status?status=${finalStatus}`);
            await axiosInstance.post(`/api/jobs/applications/${appId}/notify?email=${email}`);
            if (finalStatus === 'SELECTED') handleHireConfetti();
            fetchCandidates(selectedJob.id);
        } catch (err) { alert("Action failed."); } finally { setActionLoading(false); }
    };

    const handleShorlist = async () => {
        if (!window.confirm("Run AI Shortlisting?")) return;
        setActionLoading(true);
        try {
            await axiosInstance.post(`/api/jobs/${selectedJob.id}/shortlist?email=${email}`);
            fetchCandidates(selectedJob.id);
            alert("AI Ranking Applied.");
        } catch (err) { alert("AI Service Error"); } finally { setActionLoading(false); }
    };

    const handleNotifyReviewed = async () => {
        if (!window.confirm(`Send updates to ${pendingReviewNotifications} candidates?`)) return;
        setActionLoading(true);
        try {
            await axiosInstance.post(`/api/jobs/${selectedJob.id}/notify-reviewed?email=${email}`);
            fetchCandidates(selectedJob.id); 
            alert("Success!");
        } catch (err) { alert("Error"); } finally { setActionLoading(false); }
    };

    const openInterviewModal = (type, singleApp = null) => {
        let participants = type === 'one-on-one' ? [singleApp] : applicants.filter(app => selectedIds.includes(app.id));
        if (participants.length === 0) return alert("Select candidates first!");
        const roomSuffix = type === 'one-on-one' ? singleApp.student.rollNumber : `Group-${Date.now()}`;
        setSchedulingData({ 
            participants, 
            date: new Date().toISOString().split('T')[0], 
            time: "10:00", 
            meetingLink: `https://meet.jit.si/CV-${selectedJob.id}-${roomSuffix}` 
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
            setIsModalOpen(false);
            fetchCandidates(selectedJob.id);
            setSelectedIds([]);
        } catch (err) { alert("Error"); } finally { setActionLoading(false); }
    };

    const filteredAndSorted = [...applicants]
        .filter(app => app.student?.fullName?.toLowerCase().includes(candidateSearch.toLowerCase()) || app.student?.rollNumber?.includes(candidateSearch))
        .sort((a, b) => (parseFloat(b.matchScore) || 0) - (parseFloat(a.matchScore) || 0));

    if (loading && !selectedJob) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-indigo-600" size={40} /></div>;

    return (
        <div className="animate-fade-in space-y-6 p-4">
            {!selectedJob ? (
                /* --- JOB LIST --- */
                <div className="space-y-6">
                    <h1 className="text-2xl font-bold flex items-center gap-2 dark:text-white"><Briefcase className="text-indigo-600" /> My Postings</h1>
                    <div className="grid gap-4">
                        {jobs.map(job => (
                            <div key={job.id} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 flex justify-between items-center shadow-sm">
                                <div><h2 className="text-xl font-bold dark:text-white">{job.jobTitle}</h2><p className="text-sm text-slate-500">📍 {job.location}</p></div>
                                <button onClick={() => { setSelectedJob(job); fetchCandidates(job.id); }} className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold">View Candidates</button>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                /* --- CANDIDATE DETAIL --- */
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <button onClick={() => { setSelectedJob(null); setSelectedIds([]); }} className="flex items-center gap-2 text-indigo-600 font-bold hover:underline"><ArrowLeft size={20} /> Back</button>
                        <div className="relative w-80">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input type="text" placeholder="Search..." className="w-full pl-10 pr-4 py-2 rounded-xl border dark:bg-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500" value={candidateSearch} onChange={(e) => setCandidateSearch(e.target.value)} />
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 flex flex-wrap justify-between items-center gap-4 shadow-sm">
                        <h2 className="text-xl font-bold dark:text-white">Applied to <span className="text-indigo-600">{selectedJob.jobTitle}</span></h2>
                        <div className="flex flex-wrap gap-3">
                            {selectedIds.length > 0 && (
                                <button onClick={() => openInterviewModal('group')} className="bg-purple-600 text-white px-5 py-2 rounded-xl font-bold flex items-center gap-2 shadow-lg"><Users size={18} /> Group ({selectedIds.length})</button>
                            )}
                            
                            {!isAiShortlistDone && (
                                <button onClick={handleShorlist} disabled={actionLoading} className="flex items-center gap-2 px-5 py-2 rounded-xl font-bold text-sm bg-purple-600 text-white">
                                    {actionLoading ? <Loader2 className="animate-spin" size={18} /> : <Target size={18} />} AI Shortlist
                                </button>
                            )}

                            {pendingReviewNotifications > 0 && (
                                <button onClick={handleNotifyReviewed} className="flex items-center gap-2 px-5 py-2 rounded-xl font-bold text-sm bg-blue-600 text-white shadow-lg"><Mail size={18} /> Notify ({pendingReviewNotifications})</button>
                            )}
                            
                            <button disabled={isJobLocked} className={`flex items-center gap-2 px-6 py-2 rounded-xl font-bold text-sm ${isJobLocked ? 'bg-green-100 text-green-700' : 'bg-orange-600 text-white'}`}>
                                {isJobLocked ? <Lock size={18} /> : <Send size={18} />} {isJobLocked ? "Finalized" : "Finalize Job"}
                            </button>
                        </div>
                    </div>

                    <div className="grid gap-4">
                        {filteredAndSorted.map(app => (
                            <div key={app.id} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4 shadow-sm">
                                <div className="flex items-center gap-4 w-full">
                                    {app.status === 'SHORTLISTED' && app.mailSent && !app.interview && (
                                        <button onClick={() => toggleSelect(app.id)} className="text-indigo-600">
                                            {selectedIds.includes(app.id) ? <CheckSquare size={24} /> : <Square size={24} className="text-slate-300" />}
                                        </button>
                                    )}
                                    <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/30 rounded-full flex items-center justify-center text-indigo-600 shrink-0"><User size={24} /></div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <h4 className="font-bold dark:text-white">{app.student.fullName}</h4>
                                            {app.matchScore && <span className="bg-purple-50 text-purple-600 text-[10px] font-bold px-2 py-0.5 rounded-md border border-purple-100">{(Number(app.matchScore) * 100).toFixed(0)}% Match</span>}
                                        </div>
                                        <p className="text-xs text-slate-500">{app.student.email} | {app.student.rollNumber}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    {app.status === 'SHORTLISTED' && app.mailSent && (
                                        app.interview ? (
                                            <div className="flex items-center gap-2">
                                                <div className="bg-slate-100 dark:bg-slate-800 text-slate-600 px-3 py-2 rounded-xl text-[10px] font-bold border border-slate-200 uppercase">
                                                    <Clock size={14} className="text-indigo-500 inline mr-1" /> {app.interview.interviewDate} @ {app.interview.interviewTime}
                                                </div>
                                                {isMeetingToday(app.interview.interviewDate) && (
                                                    <a href={app.interview.meetingLink} target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-rose-600 text-white px-4 py-2 rounded-xl font-bold text-xs hover:bg-rose-700 shadow-md"><VideoIcon size={16} /> Join</a>
                                                )}
                                            </div>
                                        ) : (
                                            <button onClick={() => openInterviewModal('one-on-one', app)} className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl font-bold text-xs shadow-md"><Calendar size={16} /> Schedule</button>
                                        )
                                    )}

                                    <span className={`text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-widest ${
                                        app.status === 'SELECTED' ? 'bg-emerald-100 text-emerald-700' : 
                                        app.status === 'SHORTLISTED' ? 'bg-green-100 text-green-700' : 
                                        app.status === 'REJECTED' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                                    }`}>{app.status.replace('_', ' ')}</span>
                                    
                                    <a href={app.student.resumeUrl} target="_blank" rel="noreferrer" className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-500"><FileText size={18} /></a>
                                    
                                    <div className="flex gap-1">
                                        {!app.mailSent ? (
                                            <>
                                                <button onClick={() => axiosInstance.patch(`/api/jobs/applications/${app.id}/status?status=SHORTLISTED`).then(() => fetchCandidates(selectedJob.id))} className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600"><CheckCircle size={18} /></button>
                                                <button onClick={() => axiosInstance.patch(`/api/jobs/applications/${app.id}/status?status=UNDER_REVIEW`).then(() => fetchCandidates(selectedJob.id))} className="p-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"><HelpCircle size={18} /></button>
                                                <button onClick={() => axiosInstance.patch(`/api/jobs/applications/${app.id}/status?status=REJECTED`).then(() => fetchCandidates(selectedJob.id))} className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"><XCircle size={18} /></button>
                                            </>
                                        ) : (
                                            /* Hire/Pass only if Interview is Completed */
                                            app.status === 'SHORTLISTED' && app.interview && isInterviewCompleted(app.interview.interviewDate, app.interview.interviewTime) && (
                                                <div className="flex gap-2 items-center ml-2 border-l pl-3 border-slate-200">
                                                    <button onClick={() => handleFinalStatusUpdate(app.id, 'SELECTED')} className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 shadow-sm active:scale-95">
                                                        <BriefcaseBusiness size={14} /> Hire
                                                    </button>
                                                    <button onClick={() => handleFinalStatusUpdate(app.id, 'REJECTED')} className="flex items-center gap-1 px-3 py-1.5 bg-rose-600 text-white rounded-lg text-xs font-bold hover:bg-rose-700 shadow-sm active:scale-95">
                                                        <XCircle size={14} /> Pass
                                                    </button>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* --- SCHEDULING MODAL --- */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-[2.5rem] shadow-2xl border overflow-hidden">
                        <div className="px-10 py-8 flex justify-between items-center border-b">
                            <h2 className="text-2xl font-black dark:text-white">Setup Interview</h2>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400"><X size={24} /></button>
                        </div>
                        <div className="px-10 py-8 space-y-8">
                            <div className="p-8 bg-indigo-50/50 dark:bg-indigo-900/20 rounded-3xl border border-indigo-100">
                                <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-4">Participants</p>
                                <div className="flex flex-wrap gap-2">{schedulingData.participants.map(p => <span key={p.id} className="bg-indigo-600 text-white px-5 py-2 rounded-2xl text-sm font-bold shadow-md">{p.student.fullName}</span>)}</div>
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <input type="date" value={schedulingData.date} onChange={e => setSchedulingData({...schedulingData, date: e.target.value})} className="w-full p-4 rounded-2xl border-2 border-slate-800 bg-transparent font-bold dark:text-white" />
                                <input type="time" value={schedulingData.time} onChange={e => setSchedulingData({...schedulingData, time: e.target.value})} className="w-full p-4 rounded-2xl border-2 border-slate-800 bg-transparent font-bold dark:text-white" />
                            </div>
                            <button onClick={handleConfirmSchedule} disabled={actionLoading} className="w-full py-6 bg-indigo-600 text-white rounded-[2rem] font-black text-lg flex justify-center items-center gap-4 hover:bg-indigo-700 transition-all active:scale-[0.98]">
                                {actionLoading ? <Loader2 size={24} className="animate-spin" /> : <><Send size={24} /> Send Invitations</>}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Candidates;