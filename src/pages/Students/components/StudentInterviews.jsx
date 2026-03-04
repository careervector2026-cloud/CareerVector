import React, { useEffect, useState } from "react";
import axiosInstance from "../../../config/AxiosConfig";
import { Video, Calendar, Clock, CheckCircle, ExternalLink, Loader2, History, PlayCircle } from "lucide-react";

const StudentInterviews = ({ currentUser }) => {
    const [interviews, setInterviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("sessions"); 

    useEffect(() => {
        const fetchInterviews = async () => {
            // Safety check: If portal hasn't loaded user yet, don't fetch
            if (!currentUser?.email) {
                // If we wait too long without a user, stop loading to show empty state
                const timeout = setTimeout(() => setLoading(false), 2000);
                return () => clearTimeout(timeout);
            }

            try {
                const res = await axiosInstance.get(`/api/student/my-interviews?email=${currentUser.email}`);
                setInterviews(Array.isArray(res.data) ? res.data : []);
            } catch (err) {
                console.error("Error fetching interviews:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchInterviews();
    }, [currentUser]);

    const isPast = (date, time) => {
        const interviewDateTime = new Date(`${date}T${time}`);
        const bufferTime = new Date(interviewDateTime.getTime() + 60 * 60000); 
        return bufferTime < new Date();
    };

    const upcomingSessions = interviews.filter(i => !isPast(i.interviewDate, i.interviewTime));
    const historySessions = interviews.filter(i => isPast(i.interviewDate, i.interviewTime));

    if (loading) {
        return (
            <div className="flex flex-col justify-center items-center h-[500px] gap-4">
                <Loader2 className="animate-spin text-indigo-600" size={48} />
                <p className="text-slate-400 font-bold animate-pulse">Syncing your schedule...</p>
            </div>
        );
    }

    return (
        <div className="animate-fade-in space-y-6 p-4">
            {/* Header Tabs following image_e60cb9 sketch */}
            <div className="flex gap-1 ml-4">
                <button 
                    onClick={() => setActiveTab("sessions")}
                    className={`px-10 py-4 rounded-t-[1.5rem] font-black text-sm transition-all flex items-center gap-2 border-b-0 ${activeTab === 'sessions' ? 'bg-white dark:bg-slate-900 text-indigo-600 border-2 border-slate-100 dark:border-slate-800' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200'}`}
                >
                    <PlayCircle size={18} /> Sessions
                </button>
                <button 
                    onClick={() => setActiveTab("history")}
                    className={`px-10 py-4 rounded-t-[1.5rem] font-black text-sm transition-all flex items-center gap-2 border-b-0 ${activeTab === 'history' ? 'bg-white dark:bg-slate-900 text-indigo-600 border-2 border-slate-100 dark:border-slate-800' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200'}`}
                >
                    <History size={18} /> History
                </button>
            </div>

            {/* Main Container following image_e60cb9 sketch */}
            <div className="bg-white dark:bg-slate-900 rounded-[3rem] border-2 border-slate-100 dark:border-slate-800 p-10 shadow-2xl min-h-[600px]">
                
                {activeTab === "sessions" ? (
                    <div className="space-y-8">
                        <div>
                            <h2 className="text-3xl font-black dark:text-white">Active Sessions</h2>
                            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mt-2">Join your scheduled Jitsi meetings here</p>
                        </div>

                        {upcomingSessions.length > 0 ? upcomingSessions.map((item, idx) => (
                            <div key={idx} className="bg-indigo-50/50 dark:bg-indigo-900/10 p-8 rounded-[2rem] border-2 border-indigo-100 dark:border-indigo-800/30 flex flex-col lg:flex-row items-center justify-between gap-6 hover:scale-[1.01] transition-transform">
                                <div className="flex items-center gap-6 w-full">
                                    <div className="p-5 bg-indigo-600 text-white rounded-3xl shadow-xl shadow-indigo-200 dark:shadow-none">
                                        <Video size={32} />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-black dark:text-white">{item.jobTitle}</h3>
                                        <div className="flex gap-6 mt-2">
                                            <span className="flex items-center gap-2 text-sm font-bold text-slate-500 uppercase tracking-tighter"><Calendar size={16}/> {item.interviewDate}</span>
                                            <span className="flex items-center gap-2 text-sm font-bold text-slate-500 uppercase tracking-tighter"><Clock size={16}/> {item.interviewTime}</span>
                                        </div>
                                    </div>
                                </div>
                                <a 
                                    href={item.meetingLink} 
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="w-full lg:w-auto bg-indigo-600 text-white px-12 py-5 rounded-[1.5rem] font-black text-lg flex items-center justify-center gap-3 hover:bg-indigo-700 shadow-2xl shadow-indigo-500/30 transition-all active:scale-95 whitespace-nowrap"
                                >
                                    ENTER ROOM <ExternalLink size={20} />
                                </a>
                            </div>
                        )) : <EmptyState icon={<Video />} message="No active interview sessions found." />}
                    </div>
                ) : (
                    <div className="space-y-6">
                        <h2 className="text-3xl font-black dark:text-white mb-8">Completed Interviews</h2>
                        {historySessions.length > 0 ? historySessions.map((item, idx) => (
                            <div key={idx} className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 flex items-center justify-between opacity-75">
                                <div className="flex items-center gap-6">
                                    <div className="p-4 bg-slate-200 dark:bg-slate-700 text-slate-500 rounded-2xl">
                                        <CheckCircle size={28} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold dark:text-white">{item.jobTitle}</h3>
                                        <p className="text-sm font-bold text-slate-400 uppercase mt-1">{item.interviewDate} • Session Closed</p>
                                    </div>
                                </div>
                                <span className="bg-green-100 text-green-700 px-6 py-2 rounded-2xl text-xs font-black uppercase tracking-widest">
                                    Success
                                </span>
                            </div>
                        )) : <EmptyState icon={<History />} message="Your interview history is empty." />}
                    </div>
                )}
            </div>
        </div>
    );
};

const EmptyState = ({ icon, message }) => (
    <div className="text-center py-32 flex flex-col items-center justify-center grayscale opacity-40">
        <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
            {React.cloneElement(icon, { size: 48, className: "text-slate-400" })}
        </div>
        <p className="text-xl font-black text-slate-400 italic tracking-tight">{message}</p>
    </div>
);

export default StudentInterviews;