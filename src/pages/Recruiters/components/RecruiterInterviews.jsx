import React, { useEffect, useState } from "react";
import axiosInstance from "../../../config/AxiosConfig";
import { Video, Calendar, Clock, CheckCircle, ExternalLink, Loader2, Search } from "lucide-react";

const RecruiterInterviews = () => {
    const [interviews, setInterviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const recruiterData = JSON.parse(sessionStorage.getItem("careerVectorRecruiter") || "{}");
    const email = recruiterData?.email;

    useEffect(() => {
        const fetchInterviews = async () => {
            try {
                const res = await axiosInstance.get(`/api/recruiter/my-interviews?email=${email}`);
                setInterviews(Array.isArray(res.data) ? res.data : []);
            } catch (err) {
                console.error("Error fetching interviews:", err);
            } finally {
                setLoading(false);
            }
        };
        if (email) fetchInterviews();
    }, [email]);

    // Helper to check if interview time is in the past
    const isCompleted = (date, time) => {
        const interviewDateTime = new Date(`${date}T${time}`);
        return interviewDateTime < new Date();
    };

    if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-indigo-600" size={40} /></div>;

    const filteredInterviews = interviews.filter(i => 
        i.jobTitle.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="animate-fade-in space-y-8 p-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <h1 className="text-3xl font-black dark:text-white flex items-center gap-3">
                    <Video className="text-indigo-600" size={32} /> Scheduled Interviews
                </h1>
                <div className="relative w-full md:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search by job or student..." 
                        className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid gap-6">
                {filteredInterviews.length > 0 ? filteredInterviews.map((item, idx) => {
                    const done = isCompleted(item.interviewDate, item.interviewTime);
                    return (
                        <div key={idx} className={`bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border-2 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 transition-all ${done ? 'opacity-60 border-slate-100 dark:border-slate-800' : 'border-indigo-50 dark:border-indigo-900/30 shadow-indigo-100/20'}`}>
                            <div className="flex items-center gap-6 w-full">
                                <div className={`p-5 rounded-3xl shrink-0 ${done ? 'bg-slate-100 text-slate-400' : 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'}`}>
                                    {done ? <CheckCircle size={32} /> : <Video size={32} />}
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-black dark:text-white">{item.jobTitle}</h3>
                                    <div className="flex flex-wrap gap-4 mt-2">
                                        <span className="flex items-center gap-1.5 text-sm font-bold text-slate-500 uppercase tracking-tighter"><Calendar size={14}/> {item.interviewDate}</span>
                                        <span className="flex items-center gap-1.5 text-sm font-bold text-slate-500 uppercase tracking-tighter"><Clock size={14}/> {item.interviewTime}</span>
                                        {done && <span className="bg-green-100 text-green-700 px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest">Completed</span>}
                                    </div>
                                </div>
                            </div>
                            
                            {!done ? (
                                <a 
                                    href={item.meetingLink} 
                                    target="_blank" 
                                    rel="noreferrer" 
                                    className="w-full md:w-auto bg-indigo-600 text-white px-10 py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:bg-indigo-700 shadow-xl shadow-indigo-200 dark:shadow-none transition-all active:scale-95"
                                >
                                    START SESSION <ExternalLink size={18} />
                                </a>
                            ) : (
                                <button disabled className="w-full md:w-auto bg-slate-100 dark:bg-slate-800 text-slate-400 px-10 py-4 rounded-2xl font-black text-sm">
                                    SESSION CLOSED
                                </button>
                            )}
                        </div>
                    );
                }) : (
                    <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800">
                        <p className="text-slate-400 font-bold italic">No interviews found for this search.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RecruiterInterviews;