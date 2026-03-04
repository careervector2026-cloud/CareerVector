import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axiosInstance from '../../../config/AxiosConfig';
import PlacementInsightsUI from './PlacementInsightsUI';

const PlacementInsightsDashboard = () => {
  const [activeJobs, setActiveJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pulling currentUser directly from your Redux state
  const { currentUser } = useSelector((state) => state.student || {});

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        setError(null);
        // Fetching all active jobs from your Spring Boot controller
        const response = await axiosInstance.get('/api/jobs/get-jobs');
        setActiveJobs(response.data);
      } catch (err) {
        setError("Unable to load active jobs.");
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  if (loading) return (
    <div className="p-20 text-center dark:bg-slate-950 min-h-screen flex flex-col items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
      <p className="text-slate-600 dark:text-slate-400">Fetching market listings...</p>
    </div>
  );

  return <PlacementInsightsUI activeJobs={activeJobs} currentUser={currentUser} />;
};

export default PlacementInsightsDashboard;