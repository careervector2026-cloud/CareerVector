import React from 'react'
import { useNavigate } from 'react-router-dom' 

const ActionCard = ({ icon, title, desc, colorClass, onClick }) => (
    <div 
        onClick={onClick} 
        className={`p-5 rounded-2xl border-l-4 shadow-sm cursor-pointer hover:shadow-md transition-all bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 ${colorClass.split(' ').filter(c => c.startsWith('border-l')).join(' ') || 'border-l-indigo-500'}`}
    >
        <div className="flex items-center gap-4">
            <div className={`w-14 h-12 rounded-xl flex items-center justify-center text-xl ${colorClass}`}>
                {icon}
            </div>
            <div>
                <h4 className="font-bold text-slate-800 dark:text-white">{title}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">{desc}</p>
            </div>
        </div>
    </div>
);

const RecruiterJobs = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-6">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white">Quick Actions</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ActionCard 
                icon="✨" 
                title="Post New Job" 
                desc="Create a new requisition" 
                colorClass="text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800"
                // 1. THIS IS THE KEY CHANGE
                // Using 'post-jobs' (no slash) appends it to your current URL
                // Current: /recruiter/home  -> New: /recruiter/home/post-jobs
                onClick={() => navigate('post-jobs')} 
            />
            
            <ActionCard 
                icon="✏️" 
                title="Edit Job" 
                desc="Update active listings" 
                colorClass="text-amber-600 bg-amber-50 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800"
                onClick={() => navigate('edit-jobs')}
            />
            
            <ActionCard 
                icon="🚫" 
                title="Close Job" 
                desc="Close existing requisition" 
                colorClass="text-red-600 bg-red-50 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800"
                onClick={() => navigate('close-jobs')}
            />
        </div>
    </div>
  )
}

export default RecruiterJobs