import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axiosInstance from "../../../config/AxiosConfig";

const PostJobs = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    jobTitle: '',
    jobType: 'Full-time',
    location: '',
    salaryRange: '',
    description: '',
    numberOfPostings: 1 // NEW: Initialized to 1
  });
  
  const { currentRecruiter } = useSelector((state) => state.recruiter || {});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatePayload = {
      recruiterEmail: currentRecruiter?.email,
      ...formData
    };
    
    try {
      const response = await axiosInstance.post("/api/jobs/post-job", updatePayload);
      if (response.status === 200) {
        navigate('/recruiter/home', { state: { activeTab: 'Jobs' } }); 
      }
    } catch (error) {
      console.log(error);
      alert("Failed to post job. Please try again.");
    }
  };

  const inputClass = "w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder-slate-400 dark:placeholder-gray-500";
  const labelClass = "text-sm font-semibold text-slate-700 dark:text-gray-300";

  return (
    <div className="p-6 min-h-screen bg-slate-50 dark:bg-slate-900 animate-fade-in">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <button 
            type="button"
            onClick={() => navigate('/recruiter/home', { state: { activeTab: 'Jobs' } })} 
            className="flex items-center px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 text-slate-600 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-gray-700 transition-all text-sm font-medium shadow-sm"
          >
            <span className="mr-2">←</span> Back to Dashboard
          </button>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-slate-200 dark:border-gray-800 shadow-xl p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Post a New Job</h1>
            <p className="text-slate-500 dark:text-gray-400 text-sm mt-1">
              Fill in the details below to create a new job requisition.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className={labelClass}>Job Title</label>
                <input 
                  type="text" 
                  name="jobTitle"
                  placeholder="e.g. Senior React Developer"
                  className={inputClass}
                  value={formData.jobTitle}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="flex flex-col gap-2">
                <label className={labelClass}>Job Type</label>
                <select 
                  name="jobType"
                  className={inputClass}
                  value={formData.jobType}
                  onChange={handleChange}
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className={labelClass}>Location</label>
                <input 
                  type="text" 
                  name="location"
                  placeholder="e.g. Remote / New York, USA"
                  className={inputClass}
                  value={formData.location}
                  onChange={handleChange}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className={labelClass}>Salary Range</label>
                <input 
                  type="text" 
                  name="salaryRange"
                  placeholder="e.g. $80k - $120k"
                  className={inputClass}
                  value={formData.salaryRange}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* NEW ROW: Number of Postings */}
            <div className="flex flex-col gap-2">
              <label className={labelClass}>Number of Postings (Vacancies)</label>
              <input 
                type="number" 
                name="numberOfPostings"
                min="1"
                placeholder="e.g. 5"
                className={inputClass}
                value={formData.numberOfPostings}
                onChange={handleChange}
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className={labelClass}>Job Description</label>
              <textarea 
                name="description"
                rows="6"
                placeholder="Describe the role, responsibilities, and requirements..."
                className={`${inputClass} resize-none`}
                value={formData.description}
                onChange={handleChange}
                required
              ></textarea>
            </div>

            <div className="flex justify-end gap-4 mt-4 pt-4 border-t border-slate-100 dark:border-gray-800">
              <button 
                type="button" 
                onClick={() => navigate('/recruiter/home', { state: { activeTab: 'Jobs' } })}
                className="px-6 py-2.5 rounded-xl font-medium text-slate-600 hover:bg-slate-100 dark:text-gray-300 dark:hover:bg-gray-800 transition-all"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="px-8 py-2.5 rounded-xl font-medium bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-500/30 transition-all transform active:scale-95"
              >
                Publish Job
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostJobs;