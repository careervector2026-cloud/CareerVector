import React, { useState, useEffect } from "react";
import axiosInstance from "../../../config/AxiosConfig"; 
import { Calendar, Video, ExternalLink, Clock, Loader2 } from "lucide-react";

const DashboardHome = ({ currentUser }) => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- FETCH & FILTER INTERVIEWS ---
  useEffect(() => {
    const fetchInterviews = async () => {
      if (!currentUser?.email) return;
      try {
        const res = await axiosInstance.get(`/api/student/my-interviews?email=${currentUser.email}`);
        
        // FILTER: Only show interviews that haven't ended yet (Scheduled Time + 1 hour buffer)
        const activeInterviews = (res.data || []).filter(item => {
          const interviewDateTime = new Date(`${item.interviewDate}T${item.interviewTime}`);
          const expiryTime = new Date(interviewDateTime.getTime() + 60 * 60000); 
          return expiryTime > new Date();
        });

        setInterviews(activeInterviews);
      } catch (err) {
        console.error("Error fetching interviews:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchInterviews();
  }, [currentUser]);

  const calculateCGPA = () => {
    if (!currentUser) return "0.0";
    let total = 0;
    let count = 0;
    for (let i = 1; i <= 8; i++) {
      const gpa = currentUser[`gpa_sem_${i}`];
      if (gpa !== undefined && gpa !== null && Number(gpa) > 0) {
        total += Number(gpa);
        count++;
      }
    }
    return count === 0 ? "0.0" : (total / count).toFixed(2);
  };

  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.split(" ");
    return parts.length >= 2
      ? (parts[0][0] + parts[1][0]).toUpperCase()
      : name.substring(0, 2).toUpperCase();
  };

  if (loading && !currentUser) return (
    <div className="flex justify-center p-20">
      <Loader2 className="animate-spin text-indigo-600" size={40} />
    </div>
  );

  return (
    <div className="animate-fade-in space-y-6 pb-10">
      
      {/* 🚀 INTERVIEW ALERT SECTION (Only active/upcoming sessions) */}
      {interviews.length > 0 && (
        <div className="bg-indigo-600 rounded-[2rem] p-8 text-white shadow-2xl shadow-indigo-500/20 dark:shadow-none flex flex-col md:flex-row items-center justify-between gap-6 animate-in slide-in-from-top duration-500">
          <div className="flex items-center gap-6">
            <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-md shrink-0">
              <Video size={32} />
            </div>
            <div>
              <h3 className="text-xl font-black italic">Upcoming Interview Scheduled!</h3>
              <p className="text-indigo-100 font-bold">
                {interviews[0].jobTitle}
              </p>
              <div className="flex gap-4 mt-2">
                <p className="text-[10px] text-indigo-200 uppercase tracking-widest font-black flex items-center gap-1">
                  <Calendar size={12} /> {interviews[0].interviewDate}
                </p>
                <p className="text-[10px] text-indigo-200 uppercase tracking-widest font-black flex items-center gap-1">
                  <Clock size={12} /> {interviews[0].interviewTime}
                </p>
              </div>
            </div>
          </div>
          <a 
            href={interviews[0].meetingLink} 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-white text-indigo-600 px-10 py-4 rounded-2xl font-black text-sm flex items-center gap-3 hover:bg-indigo-50 transition-all shadow-lg active:scale-95 whitespace-nowrap"
          >
            JOIN INTERVIEW NOW <ExternalLink size={18} />
          </a>
        </div>
      )}

      {/* PROFILE HEADER CARD */}
      <div className="flex flex-col md:flex-row gap-6 bg-white dark:bg-slate-800 p-8 rounded-2xl items-center shadow-sm border border-slate-200 dark:border-slate-700 transition-colors duration-300">
        <div className="relative">
          {currentUser?.profileImageUrl ? (
            <img
              src={currentUser.profileImageUrl}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-4 border-blue-500 shadow-lg"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-3xl text-slate-500 dark:text-slate-300 font-bold border-4 border-slate-300 dark:border-slate-600">
              {getInitials(currentUser?.fullName)}
            </div>
          )}
          <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 rounded-full border-4 border-white dark:border-slate-800"></div>
        </div>
        
        <div className="text-center md:text-left flex-1">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 m-0 tracking-tight">
            {currentUser?.fullName || "Guest Student"}
          </h2>
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 justify-center md:justify-start text-sm text-slate-500 dark:text-slate-400">
             <span><b>ID:</b> {currentUser?.rollNumber || "N/A"}</span>
             <span className="hidden md:inline">•</span>
             <span><b>Branch:</b> {currentUser?.branch} ({currentUser?.dept})</span>
             <span className="hidden md:inline">•</span>
             <span><b>CGPA:</b> {calculateCGPA()}</span>
          </div>
          <div className="mt-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold border border-green-200 dark:border-green-800">
                🟢 Open to Work
            </span>
          </div>
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="flex flex-col gap-6">
          
          {/* 📅 Detailed Interviews List */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-5 border-b border-slate-100 dark:border-slate-700 pb-3 flex items-center gap-2">
                🗓️ Upcoming Schedule
            </h3>
            <div className="space-y-4">
              {interviews.length === 0 ? (
                <p className="text-sm text-slate-400 italic py-4 text-center">No active interviews scheduled.</p>
              ) : (
                interviews.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-700">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 rounded-lg">
                        <Calendar size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-bold dark:text-white">{item.jobTitle}</p>
                        <p className="text-[10px] text-slate-500 flex items-center gap-1 uppercase tracking-wider font-bold">
                          <Clock size={10}/> {item.interviewDate} @ {item.interviewTime}
                        </p>
                      </div>
                    </div>
                    <a href={item.meetingLink} target="_blank" rel="noreferrer" className="text-xs font-black text-indigo-600 hover:underline">Link</a>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Contact Card */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 transition-colors duration-300 hover:shadow-md">
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-5 border-b border-slate-100 dark:border-slate-700 pb-3 flex items-center gap-2">
                📇 Contact & Socials
            </h3>
            <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                    <span className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg">📞</span>
                    {currentUser?.mobileNumber || "N/A"}
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                    <span className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg">✉️</span>
                    {currentUser?.email || "N/A"}
                </div>
                {currentUser?.githubUrl && (
                    <a href={currentUser.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm text-blue-600 dark:text-blue-400 hover:underline group">
                        <span className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg group-hover:bg-blue-100 transition-colors">💻</span>
                        GitHub Profile
                    </a>
                )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="flex flex-col gap-6">
          {/* Skills Card */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 transition-colors duration-300">
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-5 border-b border-slate-100 dark:border-slate-700 pb-3">
                🛠️ Skills
            </h3>
            <div className="flex flex-wrap gap-2">
                {[currentUser?.branch || "Computer Science", "Python", "SQL", "React.js", "Data Structures", "Problem Solving"].map((skill, idx) => (
                    <span key={idx} className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-3 py-1.5 rounded-lg text-xs font-bold border border-blue-100 dark:border-blue-800/50 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors cursor-default">
                        {skill}
                    </span>
                ))}
            </div>
          </div>

          {/* Projects Section */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 transition-colors duration-300 flex-1">
            <div className="flex justify-between items-center mb-5 border-b border-slate-100 dark:border-slate-700 pb-3">
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">🚀 Projects</h3>
                <button className="text-blue-600 hover:text-blue-700 dark:text-blue-400 text-xs font-bold hover:underline">See All</button>
            </div>
            <div className="space-y-3">
                {[
                    { title: "Final Year Project", desc: "AI-Powered Resume Analyzer", tech: "Python & ML" },
                    { title: "Portfolio Website", desc: "Personal Branding", tech: "React & Tailwind" }
                ].map((proj, idx) => (
                    <div key={idx} className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-700 hover:border-blue-200 dark:hover:border-blue-800 transition-all">
                        <div className="flex justify-between items-start">
                            <div>
                                <h4 className="font-bold text-slate-800 dark:text-white text-sm">{proj.title}</h4>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{proj.desc}</p>
                            </div>
                            <span className="px-2 py-1 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 text-[10px] font-mono text-slate-500">
                                {proj.tech}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;