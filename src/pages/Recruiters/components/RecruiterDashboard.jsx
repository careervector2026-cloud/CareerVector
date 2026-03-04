import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../config/AxiosConfig";
import { 
    Loader2, Briefcase, Users, CheckCircle, Clock, 
    Sparkles, Edit, Video, ExternalLink, Calendar 
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
                // 1. Fetch Core Stats
                const statsRes = await axiosInstance.get(`/api/jobs/stats?email=${email}`);
                
                // 2. Fetch My Jobs
                const jobsRes = await axiosInstance.get(`/api/jobs/my-jobs?email=${email}`);
                
                // 3. Fetch Recent Applications
                let allApps = [];
                for (const job of jobsRes.data) {
                    const appRes = await axiosInstance.get(`/api/jobs/${job.id}/candidates?email=${email}`);
                    allApps = [...allApps, ...appRes.data];
                }
                const sortedRecent = allApps.sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt)).slice(0, 5);

                // 4. Fetch and Filter Upcoming Interviews
                const interviewRes = await axiosInstance.get(`/api/recruiter/my-interviews?email=${email}`);
                
                // Only keep interviews that haven't ended yet (Scheduled Time + 1 hour buffer)
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
                console.error("Dashboard error:", err); 
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
    const getWidth = (count) => stats?.totalCandidates > 0 ? `${(count / stats.totalCandidates) * 100}%` : "0%";

    return (
        <div className="animate-fade-in space-y-8 p-4 md:p-6 bg-slate-50 dark:bg-slate-950 min-h-screen">
            
            {/* 🚀 1. LIVE INTERVIEW ALERT (Only shows if sessions are active/upcoming) */}
            {interviews.length > 0 && (
                <div className="bg-indigo-600 rounded-[2rem] p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl shadow-indigo-500/20 dark:shadow-none animate-in slide-in-from-top duration-500">
                    <div className="flex items-center gap-6">
                        <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-md shrink-0">
                            <Video size={32} />
                        </div>
                        <div>
                            <h3 className="text-xl font-black italic">Active Interview Session</h3>
                            <p className="text-indigo-100 font-bold">
                                Upcoming: {interviews[0].jobTitle}
                            </p>
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
                    <a 
                        href={interviews[0].meetingLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="bg-white text-indigo-600 px-10 py-4 rounded-2xl font-black text-sm flex items-center gap-3 hover:bg-indigo-50 transition-all shadow-lg active:scale-95 whitespace-nowrap"
                    >
                        JOIN MEETING ROOM <ExternalLink size={18} />
                    </a>
                </div>
            )}

            {/* 2. STATS ROW */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard icon="💼" value={stats?.activeJobs || 0} label="Active Jobs" trend="Live postings" trendUp={true} />
                <StatCard icon="👥" value={stats?.totalCandidates || 0} label="Total Candidates" trend="All time" trendUp={true} />
                <StatCard icon="🗓️" value={interviews.length} label="Live Interviews" trend="Active sessions" trendUp={true} />
            </div>

            {/* 3. FUNNEL & QUICK ACTIONS */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800">
                    <h3 className="text-lg font-bold mb-6 dark:text-white">Recruitment Funnel</h3>
                    <div className="space-y-6">
                        <FunnelBar label="Total Applied" count={stats?.totalCandidates || 0} color="bg-indigo-400" width="100%" />
                        <FunnelBar label="Pending Review" count={stats?.applied || 0} color="bg-amber-400" width={getWidth(stats?.applied)} />
                        <FunnelBar label="Shortlisted" count={stats?.shortlisted || 0} color="bg-green-500" width={getWidth(stats?.shortlisted)} />
                        <FunnelBar label="Rejected" count={stats?.rejected || 0} color="bg-red-500" width={getWidth(stats?.rejected)} />
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    <h3 className="text-lg font-bold dark:text-white">Quick Actions</h3>
                    <ActionCard icon={<Sparkles />} title="Post New Job" desc="Create requisition" colorClass="bg-indigo-50 text-indigo-600" onClick={() => navigate("/recruiter/home/post-jobs")} />
                    <ActionCard icon={<Edit />} title="Manage Jobs" desc="Edit active listings" colorClass="bg-amber-50 text-amber-600" onClick={() => navigate("/recruiter/home/edit-jobs")} />
                    <ActionCard icon={<Users />} title="Candidates" desc="Review applications" colorClass="bg-emerald-50 text-emerald-600" onClick={() => navigate("/recruiter/home", { state: { activeTab: "Candidates" } })} />
                </div>
            </div>

            {/* 4. RECENT APPLICATIONS TABLE */}
            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <h3 className="text-lg font-bold mb-6 dark:text-white flex items-center gap-2">
                    <Clock size={20} className="text-indigo-500" /> Recent Applications
                </h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-slate-400 border-b dark:border-slate-800 text-[10px] uppercase font-black tracking-widest">
                                <th className="py-4 px-4">Student</th>
                                <th className="py-4 px-4">Role</th>
                                <th className="py-4 px-4">Status</th>
                                <th className="py-4 px-4 text-right">Date</th>
                            </tr>
                        </thead>
                        <tbody className="text-slate-700 dark:text-slate-300">
                            {recent.length > 0 ? recent.map(app => (
                                <tr key={app.id} className="border-b dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                                    <td className="py-5 px-4 font-bold">{app.student.fullName}</td>
                                    <td className="py-5 px-4 font-medium text-slate-500">{app.job.jobTitle}</td>
                                    <td className="py-5 px-4">
                                        <span className={`text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-tighter ${app.status === 'SHORTLISTED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                            {app.status}
                                        </span>
                                    </td>
                                    <td className="py-5 px-4 text-right text-xs font-bold text-slate-400">{new Date(app.appliedAt).toLocaleDateString()}</td>
                                </tr>
                            )) : (
                                <tr><td colSpan="4" className="text-center py-10 dark:text-slate-500 italic">No recent applications found.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

// Sub-components with updated typography
const StatCard = ({ icon, value, label, trend, trendUp }) => (
    <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col gap-4 transition-all hover:shadow-md">
        <div className="flex justify-between items-start">
            <div className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-3xl">{icon}</div>
            <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full ${trendUp ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{trend}</span>
        </div>
        <div>
            <h3 className="text-4xl font-black text-slate-900 dark:text-white">{value}</h3>
            <p className="text-sm text-slate-400 font-bold uppercase tracking-tight">{label}</p>
        </div>
    </div>
);

const FunnelBar = ({ label, count, color, width }) => (
    <div className="flex flex-col gap-2 group">
        <div className="flex justify-between text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-tighter">
            <span>{label}</span>
            <span className="text-slate-900 dark:text-white">{count}</span>
        </div>
        <div className="w-full h-4 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div className={`h-full rounded-full transition-all duration-1000 ease-out ${color}`} style={{ width }}></div>
        </div>
    </div>
);

const ActionCard = ({ icon, title, desc, colorClass, onClick }) => (
    <div onClick={onClick} className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-5 cursor-pointer hover:border-indigo-400 transition-all group">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0 ${colorClass}`}>{icon}</div>
        <div>
            <h4 className="font-black text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">{title}</h4>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-tighter">{desc}</p>
        </div>
    </div>
);

export default RecruiterDashboard;