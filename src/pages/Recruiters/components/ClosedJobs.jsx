import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from "../../../config/AxiosConfig"; 
import { useSelector } from 'react-redux';
import { Sparkles, Loader2, RefreshCw, Trash2, ArrowLeft, Eye } from 'lucide-react';

const ClosedJobs = () => {
  const navigate = useNavigate();
  const { currentRecruiter } = useSelector((state) => state.recruiter || {});
  
  const [closedJobs, setClosedJobs] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null); // Track AI processing status

  const fetchClosedJobs = async () => {
    if (!currentRecruiter?.email) return;
    try {
      const response = await axiosInstance.get("/api/jobs/my-jobs", {
        params: { email: currentRecruiter.email }
      });
      const inactiveJobs = response.data.filter(job => job.active === false);
      setClosedJobs(inactiveJobs);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchClosedJobs(); }, [currentRecruiter]);

  const handleAutoShortlist = async (jobId) => {
    setProcessingId(jobId);
    try {
      await axiosInstance.post(`/api/jobs/${jobId}/auto-shortlist`, null, {
        params: { email: currentRecruiter.email }
      });
      alert("AI Shortlisting completed successfully!");
      navigate('/recruiter/home', { state: { activeTab: 'Candidates' } }); // Redirect to see results
    } catch (error) {
      alert("AI processing failed. Please ensure the AI server is running.");
    } finally {
      setProcessingId(null);
    }
  };

  const handleReopen = async (id) => {
    try {
      await axiosInstance.patch(`/api/jobs/${id}/toggle`, null, {
        params: { email: currentRecruiter.email }
      });
      setClosedJobs(closedJobs.filter(job => job.id !== id));
      alert("Job re-opened successfully!");
    } catch (error) {
      alert("Failed to re-open job.");
    }
  };

  const handleDelete = async (id) => {
    if(window.confirm("Are you sure? This cannot be undone.")) {
      try {
        await axiosInstance.delete(`/api/jobs/${id}`, {
          params: { email: currentRecruiter.email }
        });
        setClosedJobs(closedJobs.filter(j => j.id !== id));
      } catch (error) {
        alert("Failed to delete job.");
      }
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen dark:bg-slate-950"><Loader2 className="animate-spin text-indigo-600" size={40} /></div>;

  return (
    <div className="p-6 min-h-screen bg-slate-50 dark:bg-slate-950 animate-fade-in">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
            <button 
                onClick={() => navigate('/recruiter/home', { state: { activeTab: 'Jobs' } })} 
                className="flex items-center px-4 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 transition-all text-sm font-medium shadow-sm"
            >
              <ArrowLeft className="mr-2" size={16} /> Back to Dashboard
            </button>
        </div>

        <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Closed Jobs Archive</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage fills or run AI Shortlisting on inactive roles.</p>
        </div>

        {closedJobs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 border-dashed">
                <p className="text-slate-500 dark:text-gray-400 font-medium text-lg">No closed jobs found.</p>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {closedJobs.map((job) => (
                <div key={job.id} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between group">
                    <div className="mb-4">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="font-bold text-lg text-slate-800 dark:text-white line-clamp-1">{job.jobTitle}</h3>
                            <span className="text-[10px] px-2 py-1 rounded-full font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">CLOSED</span>
                        </div>
                        <div className="space-y-1 text-sm text-slate-500 dark:text-slate-400">
                            <p>📍 {job.location}</p>
                            <p>💰 {job.salaryRange}</p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        {/* NEW: AI SHORTLIST BUTTON */}
                        <button 
                            onClick={() => handleAutoShortlist(job.id)}
                            disabled={processingId === job.id}
                            className="w-full py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 disabled:opacity-50"
                        >
                            {processingId === job.id ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
                            Auto Shortlist (AI)
                        </button>

                        <div className="grid grid-cols-2 gap-3">
                            <button onClick={() => handleReopen(job.id)} className="py-2.5 rounded-xl bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 font-semibold text-xs border dark:border-green-900 flex items-center justify-center gap-1"><RefreshCw size={14} /> Re-open</button>
                            <button onClick={() => handleDelete(job.id)} className="py-2.5 rounded-xl bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400 font-semibold text-xs border dark:border-red-900 flex items-center justify-center gap-1"><Trash2 size={14} /> Delete</button>
                        </div>
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