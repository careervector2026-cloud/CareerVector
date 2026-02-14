import React, { useEffect, useState } from 'react';
import axiosInstance from "../../../config/AxiosConfig";
import { 
    Briefcase, MapPin, DollarSign, Building2, 
    Clock, Search, RefreshCcw, Target, X, CheckCircle, Trash2, Users 
} from 'lucide-react';

const StudentJobs = () => {
    const [jobData, setJobData] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedJob, setSelectedJob] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(new Date());

    const sessionData = JSON.parse(sessionStorage.getItem("careerVectorStudent")); 
    const rollNumber = sessionData?.rollNumber;

    const fetchJobs = async () => {
        if (!rollNumber) return;
        try {
            const response = await axiosInstance.get(`/api/student/${rollNumber}/get-scored-jobs`);
            setJobData(response.data);
            setLastUpdated(new Date());
            setLoading(false);
        } catch (error) {
            console.error("Error fetching jobs:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();
        const interval = setInterval(fetchJobs, 60000);
        return () => clearInterval(interval);
    }, [rollNumber]);

    const handleApply = async (jobId) => {
        try {
            await axiosInstance.post(`/api/student/apply/${jobId}?rollNumber=${rollNumber}`);
            alert("Application submitted successfully!");
            setSelectedJob(null);
            fetchJobs(); 
        } catch (error) {
            alert(error.response?.data || "Failed to apply.");
        }
    };

    // NEW: Handle Withdrawal Logic
    const handleWithdraw = async (jobId) => {
        if (!window.confirm("Are you sure you want to withdraw your application? This action cannot be undone.")) return;
        try {
            // Update this endpoint to match your backend withdrawal route
            await axiosInstance.delete(`/api/student/withdraw/${jobId}?rollNumber=${rollNumber}`);
            alert("Application withdrawn successfully.");
            fetchJobs();
        } catch (error) {
            alert(error.response?.data || "Failed to withdraw application.");
        }
    };

    const filteredData = jobData.filter(({ job }) => 
        job.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.recruiter?.companyName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 p-4 md:p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Opportunities</h1>
                        <p className="text-sm text-gray-500 italic">Updated: {lastUpdated.toLocaleTimeString()}</p>
                    </div>
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input 
                            type="text"
                            placeholder="Search roles or companies..."
                            className="w-full pl-10 pr-4 py-2 rounded-lg border dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20"><RefreshCcw className="animate-spin text-blue-500" size={40} /></div>
                ) : (
                    <div className="grid gap-6">
                        {filteredData.length > 0 ? filteredData.map(({ job, matchScore, hasApplied, applicationStatus }) => (
                            <div key={job.id} className="bg-white dark:bg-gray-800 border dark:border-gray-700 p-6 rounded-xl shadow-sm hover:shadow-md transition-all">
                                <div className="flex justify-between items-start">
                                    <div className="flex gap-4">
                                        <div className="p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-600 rounded-lg"><Briefcase size={24} /></div>
                                        <div>
                                            <h2 className="text-xl font-bold dark:text-white">{job.jobTitle}</h2>
                                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                                <Building2 size={16} /> <span>{job.recruiter?.companyName}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        {matchScore !== null && matchScore !== undefined && matchScore >= 0 && (
                                            <div className="flex items-center gap-1 bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 px-3 py-1 rounded-full text-sm font-bold border border-green-200 dark:border-green-800">
                                                <Target size={16} /> {matchScore}% Match
                                            </div>
                                        )}
                                        {/* NEW: Openings Badge */}
                                        {job.numberOfPostings > 0 && (
                                            <div className="flex items-center gap-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-3 py-1 rounded-full text-[12px] font-bold border border-indigo-100 dark:border-indigo-800">
                                                <Users size={14} /> {job.numberOfPostings} Openings
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-gray-500 dark:text-gray-400">
                                    <div className="flex items-center gap-1"><MapPin size={16}/> {job.location}</div>
                                    <div className="flex items-center gap-1 text-green-600 dark:text-green-400 font-bold"><DollarSign size={16}/> {job.salaryRange}</div>
                                    <div className="flex items-center gap-1"><Clock size={16}/> {new Date(job.postedAt).toLocaleDateString()}</div>
                                </div>

                                <div className="mt-6 flex justify-end gap-3 items-center">
                                    <button onClick={() => setSelectedJob(job)} className="px-4 py-2 text-blue-600 font-semibold hover:underline">Details</button>
                                    
                                    {hasApplied ? (
                                        <div className="flex gap-2">
                                            {/* Withdraw Button: Enabled only if status is PENDING */}
                                            <button 
                                                onClick={() => handleWithdraw(job.id)}
                                                disabled={applicationStatus !== 'PENDING'}
                                                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all border ${
                                                    applicationStatus === 'PENDING' 
                                                    ? "text-red-600 border-red-200 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:border-red-800" 
                                                    : "text-gray-400 border-gray-200 bg-gray-50 cursor-not-allowed dark:bg-gray-800 dark:border-gray-700"
                                                }`}
                                                title={applicationStatus !== 'PENDING' ? "Cannot withdraw once processed" : "Withdraw Application"}
                                            >
                                                <Trash2 size={18} /> Withdraw
                                            </button>

                                            <span className="px-6 py-2 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 font-bold rounded-lg flex items-center gap-2 border border-green-200 dark:border-green-800">
                                                <CheckCircle size={18} /> {applicationStatus === 'PENDING' ? 'Applied' : applicationStatus}
                                            </span>
                                        </div>
                                    ) : (
                                        <button 
                                            onClick={() => handleApply(job.id)} 
                                            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-transform active:scale-95 shadow-md shadow-blue-500/20"
                                        >
                                            Apply Now
                                        </button>
                                    )}
                                </div>
                            </div>
                        )) : (
                            <div className="text-center py-20 dark:text-gray-400 font-semibold text-lg">No active jobs found matching your criteria.</div>
                        )}
                    </div>
                )}
            </div>

            {/* Modal */}
            {selectedJob && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-800 w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[85vh]">
                        <div className="p-6 border-b dark:border-gray-700 flex justify-between items-center">
                            <div>
                                <h2 className="text-2xl font-bold dark:text-white">{selectedJob.jobTitle}</h2>
                                <p className="text-blue-600 font-bold">{selectedJob.recruiter?.companyName}</p>
                            </div>
                            <button onClick={() => setSelectedJob(null)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"><X size={24} className="dark:text-white"/></button>
                        </div>
                        <div className="p-6 overflow-y-auto">
                            <div className="mb-4 flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-50 dark:bg-indigo-900/20 w-fit px-3 py-1 rounded-lg">
                                <Users size={18}/> {selectedJob.numberOfPostings} Total Vacancies
                            </div>
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap italic">{selectedJob.description}</p>
                        </div>
                        <div className="p-6 border-t dark:border-gray-700 flex justify-end">
                            <button 
                                onClick={() => handleApply(selectedJob.id)} 
                                className="px-8 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700"
                            >
                                Confirm Apply
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentJobs;