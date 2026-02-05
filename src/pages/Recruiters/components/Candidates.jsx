import React, { useEffect, useState } from 'react';
import axiosInstance from "../../../config/AxiosConfig";
import { 
    User, Mail, Phone, FileText, CheckCircle, 
    XCircle, Briefcase, Users, ArrowLeft, Loader2, Download, Send, Search 
} from 'lucide-react';

const Candidates = () => {
    const [jobs, setJobs] = useState([]);
    const [selectedJob, setSelectedJob] = useState(null); 
    const [applicants, setApplicants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [notifyingId, setNotifyingId] = useState(null);
    const [candidateSearch, setCandidateSearch] = useState(""); 

    const recruiterData = JSON.parse(sessionStorage.getItem("careerVectorRecruiter") || "{}");
    const email = recruiterData?.email;

    const fetchMyJobs = async () => {
        if (!email) { setLoading(false); return; }
        try {
            const res = await axiosInstance.get(`/api/jobs/my-jobs?email=${email}`);
            setJobs(Array.isArray(res.data) ? res.data : []);
            setLoading(false);
        } catch (err) { console.error(err); setLoading(false); }
    };

    const fetchCandidates = async (jobId) => {
        setLoading(true);
        try {
            const res = await axiosInstance.get(`/api/jobs/${jobId}/candidates?email=${email}`);
            setApplicants(Array.isArray(res.data) ? res.data : []);
            setLoading(false);
        } catch (err) { console.error(err); setLoading(false); }
    };

    useEffect(() => { if (email) fetchMyJobs(); }, [email]);

    const handleStatusUpdate = async (appId, newStatus) => {
        try {
            await axiosInstance.patch(`/api/jobs/applications/${appId}/status?status=${newStatus}`);
            fetchCandidates(selectedJob.id); 
        } catch (err) { alert("Failed to update status"); }
    };

    const handleNotifyStudent = async (appId) => {
        setNotifyingId(appId);
        try {
            await axiosInstance.post(`/api/jobs/applications/${appId}/notify`);
            alert("Professional notification sent successfully via Brevo!");
        } catch (err) { alert("Failed to send email notification."); }
        finally { setNotifyingId(null); }
    };

    const exportToCSV = () => {
        const shortlisted = applicants.filter(app => app.status === 'SHORTLISTED');
        if (shortlisted.length === 0) return alert("No shortlisted candidates to export!");
        const headers = ["Full Name", "Email", "Phone", "Roll Number", "Branch"];
        const rows = shortlisted.map(app => [`"${app.student.fullName}"`, `"${app.student.email}"`, `"${app.student.mobileNumber}"`, `"${app.student.rollNumber}"`, `"${app.student.branch}"`].join(","));
        const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
        const link = document.createElement("a");
        link.setAttribute("href", encodeURI(csvContent));
        link.setAttribute("download", `Shortlisted_${selectedJob.jobTitle.replace(/\s+/g, '_')}.csv`);
        link.click();
    };

    // Candidate Search Logic
    const filteredApplicants = applicants.filter(app => 
        app.student?.fullName?.toLowerCase().includes(candidateSearch.toLowerCase()) ||
        app.student?.email?.toLowerCase().includes(candidateSearch.toLowerCase()) ||
        app.student?.rollNumber?.toLowerCase().includes(candidateSearch.toLowerCase())
    );

    if (loading && jobs.length === 0) return <div className="flex justify-center p-20 dark:bg-gray-900"><Loader2 className="animate-spin text-blue-500" size={40} /></div>;

    return (
        <div className="p-4 md:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
            {!selectedJob ? (
                <div className="max-w-5xl mx-auto">
                    <h1 className="text-3xl font-bold mb-8 dark:text-white flex items-center gap-2"><Briefcase className="text-blue-500" /> My Postings</h1>
                    <div className="grid gap-4">
                        {jobs.map(job => (
                            <div key={job.id} className="bg-white dark:bg-gray-800 p-6 rounded-xl border dark:border-gray-700 flex justify-between items-center shadow-sm hover:shadow-md transition-all">
                                <div><h2 className="text-xl font-bold dark:text-white">{job.jobTitle}</h2><p className="text-sm text-gray-500">📍 {job.location}</p></div>
                                <button onClick={() => { setSelectedJob(job); fetchCandidates(job.id); }} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold">View Candidates</button>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="max-w-5xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                        <button onClick={() => setSelectedJob(null)} className="flex items-center gap-2 text-blue-600 font-bold self-start"><ArrowLeft size={20} /> Back</button>
                        <div className="flex gap-2 w-full md:w-auto">
                            <div className="relative flex-grow">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input 
                                    type="text"
                                    placeholder="Search candidates..."
                                    value={candidateSearch}
                                    onChange={(e) => setCandidateSearch(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 rounded-lg border dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <button onClick={exportToCSV} className="bg-green-600 text-white p-2 rounded-lg"><Download size={20} /></button>
                        </div>
                    </div>

                    <h1 className="text-2xl font-black dark:text-white mb-8 border-b dark:border-gray-700 pb-4">Candidates for: <span className="text-blue-600">{selectedJob.jobTitle}</span></h1>

                    <div className="grid gap-4">
                        {filteredApplicants.length > 0 ? filteredApplicants.map(app => (
                            <div key={app.id} className="bg-white dark:bg-gray-800 p-6 rounded-xl border dark:border-gray-700 flex flex-col lg:flex-row justify-between gap-6 shadow-sm">
                                <div className="flex gap-4">
                                    <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 shrink-0"><User size={32} /></div>
                                    <div>
                                        <h3 className="text-xl font-bold dark:text-white">{app.student.fullName}</h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{app.student.email} | {app.student.rollNumber}</p>
                                    </div>
                                </div>
                                <div className="flex flex-col items-center lg:items-end gap-3">
                                    <span className={`px-4 py-1 rounded-full text-xs font-black uppercase ${app.status === 'SHORTLISTED' ? 'bg-green-100 text-green-700' : app.status === 'REJECTED' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>{app.status}</span>
                                    <div className="flex gap-2">
                                        {(app.status === 'SHORTLISTED' || app.status === 'REJECTED') && (
                                            <button onClick={() => handleNotifyStudent(app.id)} disabled={notifyingId === app.id} className={`p-3 rounded-xl text-white transition-all ${app.status === 'SHORTLISTED' ? 'bg-blue-600' : 'bg-gray-600'}`}>{notifyingId === app.id ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}</button>
                                        )}
                                        <a href={app.student.resumeUrl} target="_blank" rel="noreferrer" className="p-3 bg-gray-100 dark:bg-gray-700 rounded-xl"><FileText size={20} className="dark:text-white"/></a>
                                        <button onClick={() => handleStatusUpdate(app.id, 'SHORTLISTED')} className="p-3 bg-green-500 text-white rounded-xl"><CheckCircle size={20} /></button>
                                        <button onClick={() => handleStatusUpdate(app.id, 'REJECTED')} className="p-3 bg-red-500 text-white rounded-xl"><XCircle size={20} /></button>
                                    </div>
                                </div>
                            </div>
                        )) : <div className="text-center py-20 dark:text-gray-400">No candidates found matching your search.</div>}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Candidates;