import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../config/AxiosConfig";
import { Loader2, Briefcase, Users, CheckCircle, Clock, Sparkles, Edit, Calendar } from "lucide-react";

const RecruiterDashboard = () => {
    const navigate = useNavigate();
    const [dashboardData, setDashboardData] = useState({ stats: null, recent: [] });
    const [loading, setLoading] = useState(true);

    const recruiterData = JSON.parse(sessionStorage.getItem("careerVectorRecruiter") || "{}");
    const email = recruiterData?.email;

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const statsRes = await axiosInstance.get(`/api/jobs/stats?email=${email}`);
                const jobsRes = await axiosInstance.get(`/api/jobs/my-jobs?email=${email}`);
                
                let allApps = [];
                for (const job of jobsRes.data) {
                    const appRes = await axiosInstance.get(`/api/jobs/${job.id}/candidates?email=${email}`);
                    allApps = [...allApps, ...appRes.data];
                }
                const sortedRecent = allApps.sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt)).slice(0, 5);

                setDashboardData({ stats: statsRes.data, recent: sortedRecent });
            } catch (err) { console.error("Dashboard error:", err); }
            finally { setLoading(false); }
        };
        if (email) fetchDashboard();
    }, [email]);

    if (loading) return <div className="flex justify-center items-center h-screen dark:bg-slate-950"><Loader2 className="animate-spin text-indigo-600" size={40} /></div>;

    const stats = dashboardData.stats;
    const getWidth = (count) => stats?.totalCandidates > 0 ? `${(count / stats.totalCandidates) * 100}%` : "0%";

    return (
        <div className="animate-fade-in space-y-8 p-4 md:p-6 bg-slate-50 dark:bg-slate-950 min-h-screen">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard icon="💼" value={stats?.activeJobs || 0} label="Active Jobs" trend="Live postings" trendUp={true} />
                <StatCard icon="👥" value={stats?.totalCandidates || 0} label="Total Candidates" trend="All time" trendUp={true} />
                <StatCard icon="✅" value={stats?.shortlisted || 0} label="Shortlisted" trend="Verified talent" trendUp={true} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
                    <h3 className="text-lg font-bold mb-6 dark:text-white">Recruitment Funnel</h3>
                    <div className="space-y-6">
                        <FunnelBar label="Total Applied" count={stats?.totalCandidates || 0} color="bg-indigo-400" width="100%" />
                        <FunnelBar label="Pending Review" count={stats?.applied || 0} color="bg-amber-400" width={getWidth(stats?.applied)} />
                        <FunnelBar label="Shortlisted" count={stats?.shortlisted || 0} color="bg-green-500" width={getWidth(stats?.shortlisted)} />
                        <FunnelBar label="Rejected" count={stats?.rejected || 0} color="bg-red-500" width={getWidth(stats?.rejected)} />
                    </div>
                </div>

                <div className="flex flex-col gap-6">
                    <h3 className="text-lg font-bold dark:text-white">Quick Actions</h3>
                    <ActionCard icon={<Sparkles />} title="Post New Job" desc="Create requisition" colorClass="bg-indigo-50 text-indigo-600" onClick={() => navigate("/recruiter/post-jobs")} />
                    <ActionCard icon={<Edit />} title="Manage Jobs" desc="Edit active listings" colorClass="bg-amber-50 text-amber-600" onClick={() => navigate("/recruiter/edit-jobs")} />
                    <ActionCard icon={<Users />} title="Candidates" desc="Review applications" colorClass="bg-emerald-50 text-emerald-600" onClick={() => navigate("/recruiter/candidates")} />
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <h3 className="text-lg font-bold mb-4 dark:text-white flex items-center gap-2"><Clock size={20} className="text-indigo-500" /> Recent Applications</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-slate-500 border-b dark:border-slate-700 text-sm">
                                <th className="py-3 px-4 uppercase tracking-wider font-bold">Student</th>
                                <th className="py-3 px-4 uppercase tracking-wider font-bold">Role</th>
                                <th className="py-3 px-4 uppercase tracking-wider font-bold">Status</th>
                                <th className="py-3 px-4 text-right uppercase tracking-wider font-bold">Date</th>
                            </tr>
                        </thead>
                        <tbody className="text-slate-700 dark:text-slate-300">
                            {dashboardData.recent.length > 0 ? dashboardData.recent.map(app => (
                                <tr key={app.id} className="border-b dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                    <td className="py-4 px-4 font-semibold">{app.student.fullName}</td>
                                    <td className="py-4 px-4">{app.job.jobTitle}</td>
                                    <td className="py-4 px-4"><span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${app.status === 'SHORTLISTED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{app.status}</span></td>
                                    <td className="py-4 px-4 text-right text-xs text-slate-500">{new Date(app.appliedAt).toLocaleDateString()}</td>
                                </tr>
                            )) : <tr><td colSpan="4" className="text-center py-10 dark:text-slate-500">No recent applications found.</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

// Reusable Sub-components
const StatCard = ({ icon, value, label, trend, trendUp }) => (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col gap-4 transition-transform hover:-translate-y-1">
        <div className="flex justify-between items-start">
            <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-2xl">{icon}</div>
            <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${trendUp ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{trend}</span>
        </div>
        <div>
            <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white">{value}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{label}</p>
        </div>
    </div>
);

const FunnelBar = ({ label, count, color, width }) => (
    <div className="flex flex-col gap-1.5 group">
        <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-400">
            <span>{label}</span>
            <span className="text-slate-900 dark:text-white">{count}</span>
        </div>
        <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div className={`h-full rounded-full transition-all duration-1000 ease-out ${color}`} style={{ width }}></div>
        </div>
    </div>
);

const ActionCard = ({ icon, title, desc, colorClass, onClick }) => (
    <div onClick={onClick} className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-4 cursor-pointer hover:shadow-md transition-all">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${colorClass}`}>{icon}</div>
        <div>
            <h4 className="font-bold text-slate-800 dark:text-white">{title}</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">{desc}</p>
        </div>
    </div>
);

export default RecruiterDashboard;