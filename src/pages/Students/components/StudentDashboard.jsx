import React from "react";

const DashboardHome = ({ currentUser }) => {
  
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

  return (
    <div className="animate-fade-in space-y-6">
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
        {/* LEFT COLUMN */}
        <div className="flex flex-col gap-6">
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
                {currentUser?.leetcodeurl && (
                    <a href={currentUser.leetcodeurl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm text-yellow-600 dark:text-yellow-400 hover:underline group">
                        <span className="p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg group-hover:bg-yellow-100 transition-colors">⚡</span>
                        LeetCode Profile
                    </a>
                )}
            </div>
          </div>

          {/* Grades Card */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 transition-colors duration-300">
            <div className="flex justify-between items-center mb-5 border-b border-slate-100 dark:border-slate-700 pb-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Semester Grades</h3>
              <span className="text-xs font-semibold px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded text-slate-600 dark:text-slate-300">
                Avg: {calculateCGPA()}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                <div key={sem} className="flex justify-between items-center bg-slate-50 dark:bg-slate-900 px-3 py-2 rounded-lg border border-slate-100 dark:border-slate-700">
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Sem {sem}</span>
                  <span className={`text-sm font-bold ${currentUser?.[`gpa_sem_${sem}`] ? 'text-slate-800 dark:text-slate-200' : 'text-slate-400'}`}>
                    {currentUser?.[`gpa_sem_${sem}`] || "-"}
                  </span>
                </div>
              ))}
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
            
            <button className="w-full group border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-3 mb-4 flex items-center justify-center gap-2 text-slate-500 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50/50 transition-all">
              <span className="text-xl">+</span> <span className="text-sm font-semibold">Add New Project</span>
            </button>

            <div className="space-y-3">
                {[
                    { title: "Final Year Project", desc: "AI-Powered Resume Analyzer", tech: "Python & ML" },
                    { title: "Portfolio Website", desc: "Personal Branding", tech: "React & Tailwind" }
                ].map((proj, idx) => (
                    <div key={idx} className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-700 hover:border-blue-200 dark:hover:border-blue-800 transition-all">
                        <div className="flex justify-between items-start">
                            <div>
                                <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">{proj.title}</h4>
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