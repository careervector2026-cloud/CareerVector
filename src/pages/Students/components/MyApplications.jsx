import React, { useEffect, useState } from 'react';
import axiosInstance from "../../../config/AxiosConfig";
import { Briefcase, Clock, CheckCircle2, XCircle, Timer } from 'lucide-react';

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
            case 'SHORTLISTED': return 'bg-green-100 text-green-700 border-green-200';
            case 'REJECTED': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-yellow-100 text-yellow-700 border-yellow-200';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'SHORTLISTED': return <CheckCircle2 size={16} />;
            case 'REJECTED': return <XCircle size={16} />;
            default: return <Timer size={16} />;
        }
    };

    if (loading) return <div className="p-8 text-center dark:text-white">Loading your applications...</div>;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">My Applications</h1>
                
                <div className="space-y-4">
                    {applications.length > 0 ? applications.map((app) => (
                        <div key={app.id} className="bg-white dark:bg-gray-800 border dark:border-gray-700 p-6 rounded-xl shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
                            <div className="flex gap-4 items-center w-full">
                                <div className="p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-600 rounded-lg">
                                    <Briefcase size={24} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold dark:text-white">{app.job.jobTitle}</h2>
                                    <p className="text-gray-600 dark:text-gray-400 font-medium">{app.job.recruiter?.companyName}</p>
                                    <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                                        <Clock size={14} /> Applied on {new Date(app.appliedAt).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>

                            <div className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold border ${getStatusStyle(app.status)}`}>
                                {getStatusIcon(app.status)}
                                {app.status}
                            </div>
                        </div>
                    )) : (
                        <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-xl border-2 border-dashed dark:border-gray-700">
                            <p className="text-gray-500 dark:text-gray-400">You haven't applied to any jobs yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyApplications;