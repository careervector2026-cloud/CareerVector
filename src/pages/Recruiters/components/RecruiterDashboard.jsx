import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../config/AxiosConfig";
import { 
    Loader2, Briefcase, Users, CheckCircle, Clock, 
    Sparkles, Edit, Video, ExternalLink, Calendar, TrendingUp 
} from "lucide-react";

const RecruiterDashboard = () => {
    const navigate = useNavigate();
    const [dashboardData, setDashboardData] = useState({ stats: null, recent: [], interviews: [] });
    const [loading, setLoading] = useState(true);

    const recruiterData = JSON.parse(sessionStorage.getItem("careerVectorRecruiter") || "{}");
    const email = recruiterData?.email;

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                // 1. Fetch Stats from the linked Controller (Aggregates Active vs Closed logic)
                const statsRes = await axiosInstance.get(`/api/jobs/stats?email=${email}`);
                
                // 2. Fetch My Jobs to populate the Recent Activity Table
                const jobsRes = await axiosInstance.get(`/api/jobs/my-jobs?email=${email}`);
                
                let allApps = [];
                for (const job of jobsRes.data) {
                    const appRes = await axiosInstance.get(`/api/jobs/${job.id}/candidates?email=${email}`);
                    allApps = [...allApps, ...appRes.data];
                }
                
                // Sort by most recent application date
                const sortedRecent = allApps
                    .sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt))
                    .slice(0, 5);

                // 3. Fetch Interviews
                const interviewRes = await axiosInstance.get(`/api/recruiter/my-interviews?email=${email}`);
                const activeInterviews = (interviewRes.data || []).filter(item => {
                    const interviewDateTime = new Date(`${item.interviewDate}T${item.interviewTime}`);
                    const expiryTime = new Date(interviewDateTime.getTime() + 60 * 60000); 
                    return expiryTime > new Date();
                });

                setDashboardData({ 
                    stats: statsRes.data, 
                    recent: sortedRecent,
                    interviews: activeInterviews
                });
            } catch (err) { 
                console.error("Dashboard Sync Error:", err); 
            } finally { 
                setLoading(false); 
            }
        };
        if (email) fetchDashboard();
    }, [email]);

    if (loading) return (
        <div className="flex justify-center items-center h-screen dark:bg-slate-950">
            <Loader2 className="animate-spin text-indigo-600" size={40} />
        </div>
    );

    const { stats, recent, interviews } = dashboardData;
    
    // Width calculation for progress bars (relative to total lifetime applicants)
    const getWidth = (count) => stats?.totalCandidates > 0 ? `${(count / stats.totalCandidates) * 100}%` : "0%";

    return (
        <div className="animate-fade-in space-y-8 p-4 md:p-10 bg-slate-50 dark:bg-slate-950 min-h-screen font-sans">
            
            {/* 🚀 1. LIVE INTERVIEW ALERT */}
            {interviews.length > 0 && (
                <div className="bg-indigo-600 rounded-[2.5rem] p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl shadow-indigo-500/20 dark:shadow-none animate-in slide-in-from-top duration-500">
                    <div className="flex items-center gap-6">
                        <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-md shrink-0">
                            <Video size={32} />
                        </div>
                        <div>
                            <h3 className="text-xl font-black italic uppercase tracking-tighter">Active Session</h3>
                            <p className="text-indigo-100 font-bold">Upcoming: {interviews[0].jobTitle}</p>
                            <div className="flex gap-4 mt-2">
                                <p className="text-[10px] text-indigo-200 uppercase tracking-widest font-black flex items-center gap-1">
                                    <Calendar size={12} /> {interviews[0].interviewDate}
                                </p>
                                <p className="text-[10px] text-indigo-200 uppercase tracking-widest font-black flex items-center gap-1">
                                    <Clock size={12} /> {interviews[0].interviewTime}
                                </p>
                            </div>
                        </div>
                    </div>
                    <a href={interviews[0].meetingLink} target="_blank" rel="noreferrer" className="bg-white text-indigo-600 px-10 py-4 rounded-2xl font-black text-sm flex items-center gap-3 hover:bg-indigo-50 transition-all shadow-lg active:scale-95 whitespace-nowrap">
                        JOIN MEETING ROOM <ExternalLink size={18} />
                    </a>
                </div>
            )}

            {/* --- 2. TOP STATS ROW --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard icon="💼" value={stats?.activeJobs || 0} label="Active Jobs" trend="Live" color="indigo" />
                <StatCard icon="⏳" value={stats?.pending || 0} label="Pending Review" trend="Open Jobs" color="amber" />
                <StatCard icon="🎉" value={stats?.hired || 0} label="Hired Total" trend="Success" color="emerald" />
                <StatCard icon="👥" value={stats?.totalCandidates || 0} label="All Applicants" trend="Lifetime" color="slate" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* --- 3. THE RECRUITMENT FUNNEL (Logic Split) --- */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="flex justify-between items-center mb-10">
                        <h3 className="text-xl font-black dark:text-white uppercase italic tracking-tighter">Performance Funnel</h3>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pipeline Efficiency</span>
                    </div>
                    
                    <div className="space-y-8">
                        {/* LIVE PIPELINE SECTION */}
                        <div className="pb-6">
                            <p className="text-[10px] font-black text-amber-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                <Clock size={14}/> Live Pipeline (Active Jobs)
                            </p>
                            <FunnelBar label="Awaiting Review" count={stats?.pending || 0} color="bg-amber-400" width={getWidth(stats?.pending)} />
                        </div>

                        {/* FINALIZED OUTCOMES SECTION */}
                        <div className="pt-8 border-t border-slate-100 dark:border-slate-800 space-y-8">
                             <p className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                <CheckCircle size={14}/> Finalized Outcomes (Closed Jobs)
                             </p>
                             <div className="space-y-6">
                                <FunnelBar label="Shortlisted" count={stats?.shortlisted || 0} color="bg-indigo-600" width={getWidth(stats?.shortlisted)} />
                                <FunnelBar label="Hired / Selected" count={stats?.hired || 0} color="bg-emerald-500" width={getWidth(stats?.hired)} />
                                <FunnelBar label="Rejected" count={stats?.rejected || 0} color="bg-rose-500" width={getWidth(stats?.rejected)} />
                             </div>
                        </div>
                    </div>
                </div>

                {/* --- 4. QUICK ACTIONS --- */}
                <div className="flex flex-col gap-4">
                    <h3 className="text-lg font-black dark:text-white uppercase italic tracking-tighter ml-2">Quick Actions</h3>
                    <ActionCard icon={<Sparkles />} title="Post New Job" desc="Create requisition" colorClass="bg-indigo-50 text-indigo-600" onClick={() => navigate("/recruiter/home/post-jobs")} />
                    <ActionCard icon={<Edit />} title="Manage Jobs" desc="Edit active listings" colorClass="bg-amber-50 text-amber-600" onClick={() => navigate("/recruiter/home/edit-jobs")} />
                    <ActionCard icon={<Users />} title="Candidates" desc="Review applications" colorClass="bg-emerald-50 text-emerald-600" onClick={() => navigate("/recruiter/home", { state: { activeTab: "Candidates" } })} />
                </div>
            </div>

            {/* --- 5. RECENT ACTIVITY TABLE --- */}
            <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg text-indigo-600"><Clock size={20} /></div>
                    <h3 className="text-lg font-black dark:text-white uppercase italic tracking-tighter">Recent Candidate Activity</h3>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-slate-400 border-b dark:border-slate-800 text-[10px] uppercase font-black tracking-widest">
                                <th className="py-5 px-4">Student</th>
                                <th className="py-5 px-4">Job Role</th>
                                <th className="py-5 px-4">Status</th>
                                <th className="py-5 px-4 text-right">Applied On</th>
                            </tr>
                        </thead>
                        <tbody className="text-slate-700 dark:text-slate-200">
                            {recent.length > 0 ? recent.map(app => (
                                <tr key={app.id} className="border-b dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all group">
                                    <td className="py-6 px-4 font-bold">{app.student.fullName}</td>
                                    <td className="py-6 px-4 text-slate-500 dark:text-slate-400 text-sm font-medium">{app.job.jobTitle}</td>
                                    <td className="py-6 px-4">
                                        <span className={`text-[10px] px-4 py-1.5 rounded-full font-black uppercase tracking-tighter 
                                            ${app.status === 'SELECTED' || app.status === 'HIRED' ? 'bg-emerald-100 text-emerald-700' : 
                                              app.status === 'REJECTED' ? 'bg-rose-100 text-rose-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                            {app.status}
                                        </span>
                                    </td>
                                    <td className="py-6 px-4 text-right text-xs font-bold text-slate-400">{new Date(app.appliedAt).toLocaleDateString()}</td>
                                </tr>
                            )) : (
                                <tr><td colSpan="4" className="text-center py-12 text-slate-400 font-bold uppercase tracking-widest text-xs italic">No Recent Applications Found</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

// --- HELPER UI COMPONENTS ---

const StatCard = ({ icon, value, label, trend }) => (
    <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm hover:border-indigo-400 transition-all group">
        <div className="flex justify-between items-start mb-6">
            <div className="text-4xl group-hover:scale-110 transition-transform duration-300">{icon}</div>
            <span className="text-[10px] font-black uppercase bg-slate-50 dark:bg-slate-800 text-slate-400 px-3 py-1 rounded-full tracking-widest">{trend}</span>
        </div>
        <h3 className="text-5xl font-black dark:text-white tracking-tighter leading-none mb-2">{value}</h3>
        <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">{label}</p>
    </div>
);

const FunnelBar = ({ label, count, color, width }) => (
    <div className="space-y-3">
        <div className="flex justify-between text-[11px] font-black uppercase tracking-widest dark:text-slate-400">
            <span>{label}</span>
            <span className="dark:text-white font-black">{count}</span>
        </div>
        <div className="w-full h-4 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5">
            <div className={`h-full ${color} rounded-full transition-all duration-1000 ease-in-out shadow-sm`} style={{ width }}></div>
        </div>
    </div>
);

const ActionCard = ({ icon, title, desc, colorClass, onClick }) => (
    <div onClick={onClick} className="p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-6 cursor-pointer hover:border-indigo-400 transition-all group shadow-sm active:scale-[0.97]">
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl transition-all group-hover:rotate-12 ${colorClass}`}>{icon}</div>
        <div>
            <h4 className="font-black dark:text-white uppercase italic tracking-tighter text-lg">{title}</h4>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{desc}</p>
        </div>
    </div>
);

export default RecruiterDashboard;