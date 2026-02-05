import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from "../../../config/AxiosConfig";
import { useSelector } from 'react-redux';

const EditJobs = () => {
  const navigate = useNavigate();
  const { currentRecruiter } = useSelector((state) => state.recruiter || {});
  
  const [jobs, setJobs] = useState([]); 
  const [editingJob, setEditingJob] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- FETCH JOBS ---
  useEffect(() => {
    const fetchJobs = async () => {
      if (!currentRecruiter?.email) return;
      try {
        const response = await axiosInstance.get("/api/jobs/my-jobs", {
          params: { email: currentRecruiter.email }
        });
        setJobs(response.data);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, [currentRecruiter]);

  // --- FILTER: SHOW ONLY ACTIVE JOBS ---
  const activeJobs = jobs.filter(job => job.active === true);

  // --- HANDLER: CLOSE JOB ---
  const handleCloseJob = async (id) => {
    if (!window.confirm("Are you sure you want to close this job? It will be moved to the Closed Jobs archive.")) return;

    try {
      await axiosInstance.patch(`/api/jobs/${id}/toggle`, null, {
        params: { email: currentRecruiter.email }
      });
      
      setJobs(jobs.map(job => 
        job.id === id ? { ...job, active: false } : job // Optimistic update
      ));
    } catch (error) {
      console.error("Error closing job:", error);
      alert("Failed to close job.");
    }
  };

  // --- HANDLER: SAVE EDITS ---
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const payload = { recruiterEmail: currentRecruiter.email, ...editingJob };
      await axiosInstance.put(`/api/jobs/${editingJob.id}`, payload);
      
      setJobs(jobs.map(j => j.id === editingJob.id ? editingJob : j));
      setEditingJob(null);
      alert("Job updated successfully!");
    } catch (error) {
      console.error("Error updating job:", error);
      alert("Failed to update job.");
    }
  };

  // --- STYLES ---
  // Improved Input Styling for Dark Mode
  const inputClass = "w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder-slate-400 dark:placeholder-gray-500";
  const labelClass = "text-sm font-semibold text-slate-700 dark:text-gray-300";

  // --- RENDER: LOADING ---
  if (loading) return (
    <div className="flex justify-center items-center h-64 min-h-screen bg-slate-50 dark:bg-slate-900">
        <div className="text-slate-500 dark:text-gray-400 animate-pulse">Loading active jobs...</div>
    </div>
  );

  // --- RENDER: EDIT FORM ---
  if (editingJob) {
    return (
      <div className="p-6 min-h-screen bg-slate-50 dark:bg-slate-900 animate-fade-in">
        <div className="max-w-4xl mx-auto">
        {/* Navigation Header */}
        <div className="flex justify-between items-center mb-6">
            <button 
                onClick={() => setEditingJob(null)} 
                className="flex items-center px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-slate-600 dark:text-gray-300 transition-all text-sm font-medium"
            >
              <span className="mr-2">←</span> Cancel Editing
            </button>
        </div>

        {/* Form Card */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-slate-200 dark:border-gray-800 shadow-xl p-8">
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-1">Edit Job Details</h1>
          <p className="text-slate-500 dark:text-gray-400 text-sm mb-8">Update the job posting information below.</p>
          
          <form onSubmit={handleSave} className="flex flex-col gap-6">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className={labelClass}>Job Title</label>
                <input type="text" className={inputClass} value={editingJob.jobTitle} onChange={(e) => setEditingJob({...editingJob, jobTitle: e.target.value})} required />
              </div>
              <div className="flex flex-col gap-2">
                <label className={labelClass}>Job Type</label>
                <select className={inputClass} value={editingJob.jobType} onChange={(e) => setEditingJob({...editingJob, jobType: e.target.value})}>
                  <option value="FULL_TIME">Full-time</option>
                  <option value="PART_TIME">Part-time</option>
                  <option value="CONTRACT">Contract</option>
                  <option value="INTERNSHIP">Internship</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className={labelClass}>Location</label>
                <input type="text" className={inputClass} value={editingJob.location} onChange={(e) => setEditingJob({...editingJob, location: e.target.value})} />
              </div>
              <div className="flex flex-col gap-2">
                <label className={labelClass}>Salary Range</label>
                <input type="text" className={inputClass} value={editingJob.salaryRange} onChange={(e) => setEditingJob({...editingJob, salaryRange: e.target.value})} />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className={labelClass}>Description</label>
              <textarea rows="6" className={inputClass} value={editingJob.description} onChange={(e) => setEditingJob({...editingJob, description: e.target.value})} required></textarea>
            </div>
            
            <div className="flex justify-end gap-4 mt-4 pt-4 border-t border-slate-100 dark:border-gray-800">
              <button 
                type="button" 
                onClick={() => setEditingJob(null)} 
                className="px-6 py-2.5 rounded-xl font-medium text-slate-600 hover:bg-slate-100 dark:text-gray-300 dark:hover:bg-gray-800 transition-all"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="px-8 py-2.5 rounded-xl font-medium bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-500/30 transition-all transform active:scale-95"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
        </div>
      </div>
    );
  }

  // --- MAIN LIST VIEW ---
  return (
    <div className="p-6 min-h-screen bg-slate-50 dark:bg-slate-900 animate-fade-in">
      <div className="max-w-6xl mx-auto">
      {/* Top Navigation Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        
        {/* Left: Back Button */}
        <button 
            onClick={() => navigate('/recruiter/home', { state: { activeTab: 'Jobs' } })} 
            className="flex items-center px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 text-slate-600 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-gray-700 transition-all text-sm font-medium shadow-sm"
        >
            <span className="mr-2">←</span> Back to Dashboard
        </button>

        {/* Right: View Closed Jobs Button */}
        <button 
            onClick={() => navigate('/recruiter/home/close-jobs')} 
            className="flex items-center px-5 py-2 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-all text-sm font-medium"
        >
            View Closed Jobs <span className="ml-2">→</span>
        </button>
      </div>

      {/* Page Title */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Active Jobs</h1>
        <p className="text-slate-500 dark:text-gray-400 text-sm mt-1">Manage, edit, or close your currently open positions.</p>
      </div>

      {/* Empty State */}
      {activeJobs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-gray-900 rounded-2xl border border-slate-200 dark:border-gray-800 border-dashed">
          <div className="text-4xl mb-4">📭</div>
          <p className="text-slate-500 dark:text-gray-400 font-medium text-lg">No active jobs found.</p>
          <p className="text-slate-400 dark:text-gray-500 text-sm mt-1">Post a new job to get started.</p>
        </div>
      ) : (
        /* Job Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeJobs.map((job) => (
            <div key={job.id} className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-slate-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
                
                {/* Card Header */}
                <div className="mb-4">
                  <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-lg text-slate-800 dark:text-white line-clamp-1 pr-2" title={job.jobTitle}>
                          {job.jobTitle}
                      </h3>
                      <span className="text-[10px] px-2 py-1 rounded-full font-bold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-900">
                          ACTIVE
                      </span>
                  </div>
                  
                  <div className="flex gap-2 mb-3">
                    <span className="text-xs px-2 py-1 rounded-md bg-slate-100 dark:bg-gray-800 text-slate-600 dark:text-gray-400 font-medium border border-slate-200 dark:border-gray-700">
                        {job.jobType}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm text-slate-500 dark:text-gray-400 flex items-center">
                        <span className="mr-2 opacity-70">📍</span> {job.location}
                    </p>
                    <p className="text-sm text-slate-500 dark:text-gray-400 flex items-center">
                        <span className="mr-2 opacity-70">💰</span> {job.salaryRange}
                    </p>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100 dark:border-gray-800 mt-auto">
                  <button 
                      onClick={() => setEditingJob(job)}
                      className="py-2 rounded-lg bg-indigo-50 text-indigo-600 font-semibold text-sm hover:bg-indigo-100 dark:bg-indigo-900/20 dark:text-indigo-400 dark:hover:bg-indigo-900/40 transition-colors"
                  >
                      Edit
                  </button>

                  <button 
                      onClick={() => handleCloseJob(job.id)}
                      className="py-2 rounded-lg bg-amber-50 text-amber-600 font-semibold text-sm hover:bg-amber-100 dark:bg-amber-900/20 dark:text-amber-400 dark:hover:bg-amber-900/40 transition-colors"
                  >
                      Close Job
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

export default EditJobs;