import React, { useState, useEffect } from "react";
import axiosInstance from "../../../config/AxiosConfig"; 
import { Calendar, Video, ExternalLink, Clock, Loader2, Github, Cpu, Code2 } from "lucide-react";

const DashboardHome = ({ currentUser }) => {
  const [interviews, setInterviews] = useState([]);
  const [extractedSkills, setExtractedSkills] = useState([]);
  const [githubProjects, setGithubProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [skillsLoading, setSkillsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser?.email) return;
      
      try {
        // 1. Fetch Interviews
        const intRes = await axiosInstance.get(`/api/student/my-interviews?email=${currentUser.email}`);
        const activeInterviews = (intRes.data || []).filter(item => {
          const interviewDateTime = new Date(`${item.interviewDate}T${item.interviewTime}`);
          const expiryTime = new Date(interviewDateTime.getTime() + 60 * 60000); 
          return expiryTime > new Date();
        });
        setInterviews(activeInterviews);

        // 2. Extract Skills if Resume exists
        if (currentUser.resumeUrl) {
          fetchSkills(currentUser.resumeUrl);
        }

        // 3. Fetch GitHub Projects if GitHub URL exists
        if (currentUser.githubUrl) {
          fetchGithubRepos(currentUser.githubUrl);
        }

      } catch (err) {
        console.error("Dashboard data fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser]);

  const fetchSkills = async (url) => {
    setSkillsLoading(true);
    try {
      const res = await axiosInstance.post("/api/student/extract-skills", { resume_url: url });
      setExtractedSkills(res.data.skills || []);
    } catch (err) {
      console.error("Skill extraction failed", err);
    } finally {
      setSkillsLoading(false);
    }
  };

  const fetchGithubRepos = async (url) => {
    try {
      // Extract username from URL (handles https://github.com/username/)
      const username = url.replace(/\/$/, "").split("/").pop();
      const res = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=10`);
      const data = await res.json();
      
      // Filter: Only repos with descriptions
      if (Array.isArray(data)) {
        const filtered = data
          .filter(repo => repo.description)
          .slice(0, 4); // Take top 4
        setGithubProjects(filtered);
      }
    } catch (err) {
      console.error("GitHub fetch failed", err);
    }
  };

  const calculateCGPA = () => {
    if (!currentUser) return "0.0";
    let total = 0, count = 0;
    for (let i = 1; i <= 8; i++) {
      const gpa = currentUser[`gpaSem${i}`] || currentUser[`gpa_sem_${i}`];
      if (gpa && Number(gpa) > 0) {
        total += Number(gpa);
        count++;
      }
    }
    return count === 0 ? "0.0" : (total / count).toFixed(2);
  };

  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.split(" ");
    return parts.length >= 2 ? (parts[0][0] + parts[1][0]).toUpperCase() : name.substring(0, 2).toUpperCase();
  };

  if (loading && !currentUser) return (
    <div className="flex justify-center p-20"><Loader2 className="animate-spin text-indigo-600" size={40} /></div>
  );

  return (
    <div className="animate-fade-in space-y-6 pb-10">
      
      {/* INTERVIEW ALERT */}
      {interviews.length > 0 && (
        <div className="bg-indigo-600 rounded-[2rem] p-8 text-white shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-md shrink-0"><Video size={32} /></div>
            <div>
              <h3 className="text-xl font-black italic">Upcoming Interview!</h3>
              <p className="text-indigo-100 font-bold">{interviews[0].jobTitle}</p>
              <div className="flex gap-4 mt-2">
                <p className="text-[10px] uppercase font-black flex items-center gap-1"><Calendar size={12} /> {interviews[0].interviewDate}</p>
                <p className="text-[10px] uppercase font-black flex items-center gap-1"><Clock size={12} /> {interviews[0].interviewTime}</p>
              </div>
            </div>
          </div>
          <a href={interviews[0].meetingLink} target="_blank" rel="noreferrer" className="bg-white text-indigo-600 px-10 py-4 rounded-2xl font-black text-sm hover:bg-indigo-50 shadow-lg active:scale-95 transition-all">JOIN NOW <ExternalLink size={18} className="inline ml-2" /></a>
        </div>
      )}

      {/* PROFILE HEADER */}
      <div className="flex flex-col md:flex-row gap-6 bg-white dark:bg-slate-800 p-8 rounded-2xl items-center shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="relative">
          {currentUser?.profileImageUrl ? (
            <img src={currentUser.profileImageUrl} alt="Profile" className="w-24 h-24 rounded-full object-cover border-4 border-indigo-500 shadow-lg" />
          ) : (
            <div className="w-24 h-24 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-3xl font-bold border-4 border-slate-300">{getInitials(currentUser?.fullName)}</div>
          )}
          <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 rounded-full border-4 border-white dark:border-slate-800"></div>
        </div>
        <div className="text-center md:text-left flex-1">
          <h2 className="text-3xl font-black text-slate-900 dark:text-slate-100 italic uppercase tracking-tighter">{currentUser?.fullName || "Guest Student"}</h2>
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 justify-center md:justify-start text-sm text-slate-500 font-bold">
             <span>ID: {currentUser?.rollNumber}</span>
             <span className="hidden md:inline">•</span>
             <span>{currentUser?.branch}</span>
             <span className="hidden md:inline">•</span>
             <span>CGPA: {calculateCGPA()}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          {/* 🛠️ AI EXTRACTED SKILLS */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-black dark:text-white mb-5 border-b pb-3 flex items-center gap-2 italic uppercase tracking-tighter">
              <Cpu size={20} className="text-indigo-600" /> AI Skill Profile
            </h3>
            {skillsLoading ? (
              <div className="flex items-center gap-2 text-slate-400 text-sm animate-pulse"><Loader2 className="animate-spin" size={14} /> Analyzing Resume...</div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {(extractedSkills.length > 0 ? extractedSkills : ["No skills found"]).map((skill, idx) => (
                  <span key={idx} className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border border-indigo-100 dark:border-indigo-800/50">
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-black dark:text-white mb-5 border-b pb-3 flex items-center gap-2 italic uppercase tracking-tighter">🗓️ Upcoming Schedule</h3>
            <div className="space-y-3">
              {interviews.length === 0 ? <p className="text-xs text-slate-400 italic text-center">No active interviews.</p> : interviews.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-xl">
                  <div>
                    <p className="text-sm font-bold dark:text-white">{item.jobTitle}</p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{item.interviewDate} @ {item.interviewTime}</p>
                  </div>
                  <a href={item.meetingLink} target="_blank" rel="noreferrer" className="text-[10px] font-black text-indigo-600 hover:underline uppercase">Link</a>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 🚀 GITHUB PROJECTS SECTION */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col">
            <div className="flex justify-between items-center mb-5 border-b pb-3">
                <h3 className="text-lg font-black dark:text-white flex items-center gap-2 italic uppercase tracking-tighter">
                  <Github size={20} className="text-slate-900 dark:text-white" /> Active Repositories
                </h3>
                {currentUser?.githubUrl && (
                  <a href={currentUser.githubUrl} target="_blank" rel="noreferrer" className="text-indigo-600 text-[10px] font-black uppercase tracking-widest hover:underline">View GitHub</a>
                )}
            </div>
            <div className="space-y-4">
                {githubProjects.length > 0 ? githubProjects.map((repo, idx) => (
                    <div key={idx} className="bg-slate-50 dark:bg-slate-900 p-5 rounded-xl border border-slate-100 dark:border-slate-700 hover:border-indigo-400 transition-all group">
                        <div className="flex justify-between items-start">
                            <div className="flex-1">
                                <h4 className="font-black text-slate-800 dark:text-white text-sm uppercase tracking-tight group-hover:text-indigo-600">{repo.name}</h4>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed line-clamp-2">{repo.description}</p>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              {repo.language && (
                                <span className="px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 rounded text-[9px] font-black uppercase">
                                  {repo.language}
                                </span>
                              )}
                              <a href={repo.html_url} target="_blank" rel="noreferrer" className="p-1.5 bg-white dark:bg-slate-800 rounded-lg shadow-sm hover:shadow-md transition-all">
                                <ExternalLink size={12} className="text-slate-400" />
                              </a>
                            </div>
                        </div>
                    </div>
                )) : (
                  <div className="flex flex-col items-center justify-center py-10 opacity-50">
                    <Code2 size={40} className="mb-2" />
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400 text-center">
                      {currentUser?.githubUrl ? "No public repos with descriptions found" : "Connect GitHub to see projects"}
                    </p>
                  </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;