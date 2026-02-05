import React, { useEffect, useState } from 'react';
import axiosInstance from "../../../config/AxiosConfig";
import { 
    Briefcase, MapPin, DollarSign, Building2, 
    Clock, Search, RefreshCcw, Target, X, CheckCircle 
} from 'lucide-react';

const StudentJobs = () => {
    const [jobData, setJobData] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedJob, setSelectedJob] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(new Date());

    // Use correct session key from your storage
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
            fetchJobs(); // Refresh list to update button to "Applied"
        } catch (error) {
            alert(error.response?.data || "Failed to apply.");
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
                        {filteredData.length > 0 ? filteredData.map(({ job, matchScore, hasApplied }) => (
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
                                    {matchScore !== null && matchScore !== undefined && matchScore >= 0 && (
                                        <div className="flex items-center gap-1 bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 px-3 py-1 rounded-full text-sm font-bold border border-green-200 dark:border-green-800">
                                            <Target size={16} /> {matchScore}% Match
                                        </div>
                                    )}
                                </div>

                                <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-gray-500 dark:text-gray-400">
                                    <div className="flex items-center gap-1"><MapPin size={16}/> {job.location}</div>
                                    <div className="flex items-center gap-1 text-green-600 dark:text-green-400 font-bold"><DollarSign size={16}/> {job.salaryRange}</div>
                                    <div className="flex items-center gap-1"><Clock size={16}/> {new Date(job.postedAt).toLocaleDateString()}</div>
                                </div>

                                <div className="mt-6 flex justify-end gap-3 items-center">
                                    <button onClick={() => setSelectedJob(job)} className="px-4 py-2 text-blue-600 font-semibold hover:underline">Details</button>
                                    
                                    {/* Conditional Button/Badge */}
                                    {hasApplied ? (
                                        <span className="px-6 py-2 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 font-bold rounded-lg cursor-default flex items-center gap-2 border border-gray-200 dark:border-gray-600">
                                            <CheckCircle size={18} /> Applied
                                        </span>
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
                            <h2 className="text-2xl font-bold dark:text-white">{selectedJob.jobTitle}</h2>
                            <button onClick={() => setSelectedJob(null)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"><X size={24} className="dark:text-white"/></button>
                        </div>
                        <div className="p-6 overflow-y-auto">
                            <p className="text-blue-600 font-bold mb-4">{selectedJob.recruiter?.companyName}</p>
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap italic">{selectedJob.description}</p>
                        </div>
                        <div className="p-6 border-t dark:border-gray-700 flex justify-end">
                            <button onClick={() => handleApply(selectedJob.id)} className="px-8 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700">Confirm Apply</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentJobs;