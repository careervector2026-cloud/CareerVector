import React, { useState, useEffect } from "react";
import { 
  Users, Search, Mail, Phone, Calendar, 
  ExternalLink, Download, ArrowLeft, PartyPopper, Briefcase, CheckCircle, X 
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../config/AxiosConfig";

const HiredCandidates = () => {
  const navigate = useNavigate();
  const [hiredList, setHiredList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // State for the Contact Popup
  const [selectedContact, setSelectedContact] = useState(null);

  const recruiterData = JSON.parse(sessionStorage.getItem("careerVectorRecruiter") || "{}");
  const email = recruiterData?.email;

  useEffect(() => {
    const fetchHired = async () => {
      try {
        const response = await axiosInstance.get(`/api/jobs/my-jobs?email=${email}`);
        let allHired = [];

        for (const job of response.data) {
          const appRes = await axiosInstance.get(`/api/jobs/${job.id}/candidates?email=${email}`);
          const filtered = appRes.data.filter(app => 
            app.status === 'HIRED' || app.status === 'SELECTED'
          );
          allHired = [...allHired, ...filtered];
        }

        setHiredList(allHired);

        // // --- PRINT TO CONSOLE ---
        // console.log("%c 🏆 PLACEMENT HALL OF FAME DATA ", "color: white; background: #4f46e5; font-weight: bold; padding: 4px; border-radius: 4px;");
        // if (allHired.length > 0) {
        //     const consoleData = allHired.map(app => ({
        //         Student: app.student.fullName,
        //         Role: app.job.jobTitle,
        //         Email: app.student.email,
        //         Phone: app.student.mobileNumber || "N/A", 
        //         Date: new Date(app.appliedAt).toLocaleDateString()
        //     }));
        //     console.table(consoleData);
        // }
      } catch (err) {
        console.error("Error fetching hired list:", err);
      } finally {
        setLoading(false);
      }
    }; // Fixed missing closing brace here

    if (email) fetchHired();
  }, [email]);
  
  const filteredHired = hiredList.filter(app => 
    app.student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.job.jobTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="flex justify-center items-center h-screen dark:bg-slate-950">
        <div className="animate-bounce text-indigo-600 font-black italic uppercase tracking-widest">Loading Winners...</div>
    </div>
  );

  return (
    <div className="p-6 md:p-10 bg-slate-50 dark:bg-slate-950 min-h-screen animate-in fade-in duration-500">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-xs font-black text-indigo-600 uppercase tracking-widest mb-4 hover:gap-3 transition-all"
          >
            <ArrowLeft size={14} /> Back to Dashboard
          </button>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter flex items-center gap-3">
            Placement Hall of Fame <PartyPopper className="text-indigo-600" size={32} />
          </h1>
          <p className="text-slate-500 font-bold text-sm mt-1">Total Placements: {hiredList.length}</p>
        </div>

        <div className="flex items-center gap-3">
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                    type="text"
                    placeholder="Search winners..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 pr-6 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none focus:border-indigo-500 transition-all text-sm font-bold w-full md:w-80 shadow-sm"
                />
            </div>
            {/* <button className="p-4 bg-indigo-600 text-white rounded-2xl shadow-lg hover:bg-indigo-700 active:scale-95 transition-all">
                <Download size={20} />
            </button> */}
        </div>
      </div>

      {/* CANDIDATES GRID */}
      {filteredHired.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredHired.map((app) => (
            <div key={app.id} className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all group overflow-hidden relative">
              
              <Briefcase size={120} className="absolute -right-8 -bottom-8 text-slate-50 dark:text-slate-800/50 -rotate-12 pointer-events-none" />

              <div className="flex items-start justify-between relative z-10">
                <div className="flex gap-6">
                  <div className="w-20 h-20 rounded-3xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-3xl font-black text-indigo-600 shrink-0 border-2 border-indigo-100 dark:border-indigo-900/30">
                    {app.student.fullName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white italic tracking-tighter uppercase">{app.student.fullName}</h3>
                    <div className="flex items-center gap-2 text-indigo-600 font-black text-xs uppercase tracking-widest mt-1">
                      <CheckCircle size={14} /> {app.job.jobTitle}
                    </div>
                    <div className="mt-4 space-y-2">
                        <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-tight">
                            <Mail size={14} /> {app.student.email}
                        </div>
                        <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-tight">
                            <Calendar size={14} /> Hired on: {new Date(app.appliedAt).toLocaleDateString()}
                        </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex gap-3 relative z-10">
                <a 
                  href={app.student.resumeUrl} 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex-1 py-3 bg-slate-900 dark:bg-slate-800 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all flex items-center justify-center"
                >
                    View Resume
                </a>
                <button 
                  onClick={() => setSelectedContact(app.student)}
                  className="flex-1 py-3 border-2 border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                >
                    Contact <ExternalLink size={12}/>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800">
            <Users size={48} className="mx-auto text-slate-300 mb-4" />
            <h2 className="text-xl font-black text-slate-400 uppercase italic">No placements found in this search.</h2>
        </div>
      )}

      {/* --- CONTACT MODAL POPUP --- */}
      {selectedContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-300">
                <div className="p-8 border-b dark:border-slate-800 flex justify-between items-center bg-indigo-600 text-white">
                    <h2 className="text-xl font-black uppercase italic tracking-tighter">Candidate Info</h2>
                    <button onClick={() => setSelectedContact(null)} className="p-2 hover:bg-white/20 rounded-full transition-colors">
                        <X size={24} />
                    </button>
                </div>
                
                <div className="p-10 space-y-8">
                    <div className="flex flex-col items-center text-center">
                        <div className="w-20 h-20 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-3xl font-black text-indigo-600 mb-4 border-4 border-indigo-100 dark:border-indigo-900/50">
                            {selectedContact.fullName.charAt(0)}
                        </div>
                        <h3 className="text-2xl font-black dark:text-white uppercase tracking-tighter">{selectedContact.fullName}</h3>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Successfully Placed</p>
                    </div>

                    <div className="space-y-4">
                        <div className="group p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-transparent hover:border-indigo-200 transition-all">
                            <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-1">Email Address</p>
                            <div className="flex items-center justify-between">
                                <span className="font-bold text-slate-700 dark:text-slate-200">{selectedContact.email}</span>
                                <a href={`mailto:${selectedContact.email}`} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg"><Mail size={16}/></a>
                            </div>
                        </div>

                        <div className="group p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-transparent hover:border-indigo-200 transition-all">
                            <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-1">Phone Number</p>
                            <div className="flex items-center justify-between">
                                <span className="font-bold text-slate-700 dark:text-slate-200">{selectedContact.mobileNumber || "N/A"}</span>
                                <a href={`tel:${selectedContact.mobileNumber}`} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg"><Phone size={16}/></a>
                            </div>
                        </div>
                    </div>

                    <button 
                        onClick={() => setSelectedContact(null)}
                        className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-lg hover:bg-indigo-700 active:scale-95 transition-all"
                    >
                        Close Details
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default HiredCandidates;