import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from "../../../config/AxiosConfig"; 
import { useSelector } from 'react-redux';

const ClosedJobs = () => {
  const navigate = useNavigate();
  const { currentRecruiter } = useSelector((state) => state.recruiter || {});
  
  const [closedJobs, setClosedJobs] = useState([]); 
  const [loading, setLoading] = useState(true);

  // --- FETCH ONLY CLOSED JOBS ---
  useEffect(() => {
    const fetchClosedJobs = async () => {
      if (!currentRecruiter?.email) return;
      
      try {
        const response = await axiosInstance.get("/api/jobs/my-jobs", {
          params: { email: currentRecruiter.email }
        });
        
        // Filter: Keep only inactive (closed) jobs
        const inactiveJobs = response.data.filter(job => job.active === false);
        setClosedJobs(inactiveJobs);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClosedJobs();
  }, [currentRecruiter]);

  // --- HANDLER: RE-OPEN JOB ---
  const handleReopen = async (id) => {
    try {
      await axiosInstance.patch(`/api/jobs/${id}/toggle`, null, {
        params: { email: currentRecruiter.email }
      });

      setClosedJobs(closedJobs.filter(job => job.id !== id));
      alert("Job re-opened successfully! It is now in your Active Jobs list.");
    } catch (error) {
      console.error("Error re-opening job:", error);
      alert("Failed to re-open job.");
    }
  };

  // --- HANDLER: DELETE PERMANENTLY ---
  const handleDelete = async (id) => {
    if(window.confirm("Are you sure you want to delete this job? This cannot be undone.")) {
      try {
        await axiosInstance.delete(`/api/jobs/${id}`, {
          params: { email: currentRecruiter.email }
        });
        
        setClosedJobs(closedJobs.filter(j => j.id !== id));
      } catch (error) {
        console.error("Error deleting job:", error);
        alert("Failed to delete job.");
      }
    }
  };

  // --- LOADING STATE ---
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 min-h-screen bg-slate-50 dark:bg-slate-900">
        <div className="text-slate-500 dark:text-gray-400 animate-pulse">Loading archived jobs...</div>
      </div>
    );
  }

  // --- MAIN RENDER ---
  return (
    <div className="p-6 min-h-screen bg-slate-50 dark:bg-slate-900 animate-fade-in">
      <div className="max-w-6xl mx-auto">
        
        {/* Navigation Header */}
        <div className="flex justify-between items-center mb-8">
            <button 
                onClick={() => navigate('/recruiter/home', { state: { activeTab: 'Jobs' } })} 
                className="flex items-center px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 text-slate-600 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-gray-700 transition-all text-sm font-medium shadow-sm"
            >
                <span className="mr-2">←</span> Back to Dashboard
            </button>
        </div>

        {/* Page Title */}
        <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Closed Jobs Archive</h1>
            <p className="text-slate-500 dark:text-gray-400 text-sm mt-1">
            History of your filled or inactive positions.
            </p>
        </div>

        {/* Empty State */}
        {closedJobs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-gray-900 rounded-2xl border border-slate-200 dark:border-gray-800 border-dashed">
            <div className="text-4xl mb-4 opacity-50">📂</div>
            <p className="text-slate-500 dark:text-gray-400 font-medium text-lg">No closed jobs found.</p>
            <p className="text-slate-400 dark:text-gray-500 text-sm mt-1">Jobs you close will appear here.</p>
            </div>
        ) : (
            /* Job Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {closedJobs.map((job) => (
                <div key={job.id} className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-slate-200 dark:border-gray-700 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between group">
                    
                    {/* Content */}
                    <div className="mb-4">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="font-bold text-lg text-slate-800 dark:text-white line-clamp-1 pr-2" title={job.jobTitle}>
                                {job.jobTitle}
                            </h3>
                            <span className="text-[10px] px-2 py-1 rounded-full font-bold bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600">
                                CLOSED
                            </span>
                        </div>
                        
                        <div className="flex gap-2 mb-4">
                            <span className="text-xs px-2 py-1 rounded-md bg-slate-50 dark:bg-gray-900 border border-slate-200 dark:border-gray-700 text-slate-500 dark:text-gray-400 font-medium">
                                {job.jobType}
                            </span>
                        </div>

                        <div className="space-y-2">
                            <p className="text-sm text-slate-500 dark:text-gray-400 flex items-center">
                                <span className="mr-2 opacity-70">📍</span> {job.location}
                            </p>
                            <p className="text-sm text-slate-500 dark:text-gray-400 flex items-center">
                                <span className="mr-2 opacity-70">💰</span> {job.salaryRange}
                            </p>
                        </div>
                        
                        {/* Description Preview */}
                        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-gray-700">
                            <p className="text-xs text-slate-400 dark:text-gray-500 line-clamp-2">
                                {job.description}
                            </p>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="grid grid-cols-2 gap-3 mt-auto">
                        <button 
                            onClick={() => handleReopen(job.id)}
                            className="py-2.5 rounded-xl bg-green-50 text-green-700 font-semibold text-sm hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50 transition-colors border border-transparent dark:border-green-900/50"
                        >
                            Re-open Job
                        </button>
                        <button 
                            onClick={() => handleDelete(job.id)}
                            className="py-2.5 rounded-xl bg-red-50 text-red-700 font-semibold text-sm hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40 transition-colors border border-transparent dark:border-red-900/50"
                        >
                            Delete
                        </button>
                    </div>
                </div>
                ))}
            </div>
        )}
      </div>
    </div>
  );
};

export default ClosedJobs;