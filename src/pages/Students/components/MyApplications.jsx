import React, { useEffect, useState } from 'react';
import axiosInstance from "../../../config/AxiosConfig";
import { Briefcase, Clock, CheckCircle2, XCircle, Timer, Loader2 } from 'lucide-react';

const MyApplications = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    const sessionData = JSON.parse(sessionStorage.getItem("careerVectorStudent")); 
    const rollNumber = sessionData?.rollNumber;

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const response = await axiosInstance.get(`/api/student/${rollNumber}/applications`);
                setApplications(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching applications:", error);
                setLoading(false);
            }
        };
        if (rollNumber) fetchApplications();
    }, [rollNumber]);

    const getStatusStyle = (status) => {
        switch (status) {
            case 'SELECTED':
            case 'SHORTLISTED': 
                return 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800';
            case 'REJECTED': 
                return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800';
            case 'PENDING':
            case 'UNDER_REVIEW':
                return 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800';
            default: 
                return 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'SELECTED':
            case 'SHORTLISTED': return <CheckCircle2 size={16} />;
            case 'REJECTED': return <XCircle size={16} />;
            default: return <Timer size={16} />;
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 dark:text-white">
            <Loader2 className="animate-spin text-indigo-600" size={40} />
            <p className="font-bold italic uppercase tracking-widest text-sm text-slate-500">Syncing Applications...</p>
        </div>
    );

    return (
        <div className="animate-fade-in space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter">
                        My Applications
                    </h1>
                    <p className="text-slate-500 font-bold text-sm mt-1 uppercase tracking-wider">
                        Track your recruitment journey
                    </p>
                </div>
                <div className="bg-white dark:bg-slate-800 px-6 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest block">Total Applied</span>
                    <span className="text-2xl font-black dark:text-white">{applications.length}</span>
                </div>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
                {applications.length > 0 ? (
                    applications.map((app) => (
                        <div 
                            key={app.id} 
                            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-[2rem] shadow-sm flex flex-col md:flex-row justify-between items-center gap-6 hover:border-indigo-400 transition-all group"
                        >
                            <div className="flex gap-6 items-center w-full">
                                <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                                    <Briefcase size={28} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase italic tracking-tight">
                                        {app.job.jobTitle}
                                    </h2>
                                    <p className="text-indigo-600 dark:text-indigo-400 font-black text-xs uppercase tracking-widest">
                                        {app.job.recruiter?.companyName || "Company Confidential"}
                                    </p>
                                    <div className="flex items-center gap-2 mt-3 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                        <Clock size={12} /> Applied {new Date(app.appliedAt).toLocaleDateString(undefined, { dateStyle: 'long' })}
                                    </div>
                                </div>
                            </div>

                            <div className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-black text-[10px] uppercase tracking-widest border shrink-0 shadow-sm ${getStatusStyle(app.status)}`}>
                                {getStatusIcon(app.status)}
                                {app.status}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-24 bg-white dark:bg-slate-900 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800">
                        <Briefcase size={48} className="mx-auto text-slate-300 mb-4" />
                        <h2 className="text-xl font-black text-slate-400 uppercase italic">You haven't applied to any jobs yet.</h2>
                        <p className="text-slate-400 text-sm font-bold mt-2 uppercase tracking-tighter">Explore the jobs section to get started!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyApplications;