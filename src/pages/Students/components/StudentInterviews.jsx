import React, { useEffect, useState, useRef } from "react";
import axiosInstance from "../../../config/AxiosConfig";
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { 
    Video, Calendar, Clock, CheckCircle, ExternalLink, 
    Loader2, History, PlayCircle, MonitorPlay, Sparkles,
    Timer, UserCircle2, ArrowRight, Send, Trophy, RotateCcw,
    ChevronLeft, Settings2, Hash, FileText, User, Mic, MicOff, 
    BrainCircuit, Download, Percent, MessageSquare
} from "lucide-react";

const StudentInterviews = ({ currentUser }) => {
    // --- APP STATES ---
    const [interviews, setInterviews] = useState([]);
    const [mockHistory, setMockHistory] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("sessions"); 

    // --- WORKFLOW STATES ---
    const [simStep, setSimStep] = useState("start"); 
    const [simMode, setSimMode] = useState(""); 
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // --- CONFIG & ANALYSIS ---
    const [simConfig, setSimConfig] = useState({ jdText: "", numQuestions: 4, timePerQuestion: 60 });
    const [skillAnalysis, setSkillAnalysis] = useState({ matched: [], missing: [] });

    // --- ACTIVE INTERVIEW STATES ---
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [currentQIndex, setCurrentQIndex] = useState(0);
    const [currentAnswer, setCurrentAnswer] = useState("");
    const [timeLeft, setTimeLeft] = useState(60); 
    const [sessionHistory, setSessionHistory] = useState([]); 
    const [finalScore, setFinalScore] = useState(0);

    // --- VOICE STATES ---
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef(null);

    // --- INITIAL FETCH ---
    useEffect(() => {
        const fetchData = async () => {
            if (!currentUser?.email) {
                const timeout = setTimeout(() => setLoading(false), 2000);
                return () => clearTimeout(timeout);
            }
            try {
                const res = await axiosInstance.get(`/api/student/my-interviews?email=${currentUser.email}`);
                setInterviews(Array.isArray(res.data) ? res.data : []);
                
                // Fetch Mock History from DB
                const histRes = await axiosInstance.get(`/api/student/simulation/history?email=${currentUser.email}`);
                setMockHistory(histRes.data);
            } catch (err) { console.error(err); } finally { setLoading(false); }
        };
        fetchData();
    }, [currentUser]);

    // --- SPEECH RECOGNITION SETUP ---
    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = true;
            recognitionRef.current.onresult = (event) => {
                const transcript = Array.from(event.results).map(result => result[0].transcript).join("");
                setCurrentAnswer(transcript);
            };
            recognitionRef.current.onend = () => setIsListening(false);
        }
    }, []);

    const toggleListening = () => {
        if (isListening) recognitionRef.current.stop();
        else { recognitionRef.current.start(); setIsListening(true); }
    };

    // --- TIMER LOGIC ---
    useEffect(() => {
        let timer;
        if (simStep === "ongoing" && simMode === "timed" && timeLeft > 0) {
            timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
        } else if (timeLeft === 0 && simStep === "ongoing" && simMode === "timed") {
            handleStep(); 
        }
        return () => clearInterval(timer);
    }, [timeLeft, simStep, simMode]);

    // --- INTERVIEW LOGIC HANDLERS ---
    const startInterview = async () => {
        if (!simConfig.jdText.trim()) return alert("Please provide a Job Description.");
        setIsSubmitting(true);
        setSessionHistory([]);
        try {
            const endpoint = simMode === "timed" ? "/api/student/simulation/generate-questions" : "/api/student/simulation/start-adaptive";
            const res = await axiosInstance.post(endpoint, {
                email: currentUser.email,
                jd_text: simConfig.jdText,
                n_questions: parseInt(simConfig.numQuestions)
            });

            setSkillAnalysis({
                matched: res.data.matched_skills || [],
                missing: res.data.missing_skills || []
            });

            if (simMode === "timed") {
                const qs = res.data.questions;
                setCurrentQuestion(qs[0]);
                window.allQuestions = qs; 
            } else {
                setCurrentQuestion(res.data.question);
            }

            setCurrentQIndex(0);
            setCurrentAnswer("");
            setTimeLeft(simConfig.timePerQuestion);
            setSimStep("ongoing");
        } catch (err) { alert("Generation error."); } finally { setIsSubmitting(false); }
    };

    const handleStep = async () => {
        if (isListening) recognitionRef.current.stop();
        setIsSubmitting(true);

        try {
            let scoreForThisQ = 0.8; 
            let nextQ = null;

            if (simMode === "adaptive") {
                const res = await axiosInstance.post("/api/student/simulation/adaptive-answer", {
                    candidate_id: currentUser.email,
                    answer: currentAnswer || "No answer provided."
                });
                scoreForThisQ = res.data.score;
                nextQ = res.data.next_question;
            } else {
                const nextIdx = currentQIndex + 1;
                nextQ = window.allQuestions[nextIdx] || null;
            }

            const historyItem = {
                question: currentQuestion.question,
                answer: currentAnswer || "No answer provided.",
                score: scoreForThisQ
            };
            const updatedSession = [...sessionHistory, historyItem];
            setSessionHistory(updatedSession);

            if (nextQ) {
                setCurrentQuestion(nextQ);
                setCurrentQIndex(prev => prev + 1);
                setCurrentAnswer("");
                setTimeLeft(simConfig.timePerQuestion);
            } else {
                const avgScore = updatedSession.reduce((acc, curr) => acc + curr.score, 0) / updatedSession.length;
                setFinalScore(avgScore);
                
                const savePayload = {
                    email: currentUser.email,
                    score: avgScore,
                    jd: simConfig.jdText.substring(0, 100),
                    details: updatedSession
                };

                try {
                    const saveRes = await axiosInstance.post("/api/student/simulation/save-history", savePayload);
                    setMockHistory(prev => [saveRes.data, ...prev]);
                } catch (err) { console.error("Database save failed."); }
                
                setSimStep("result");
            }
        } catch (err) { alert("Evaluation error."); } finally { setIsSubmitting(false); }
    };

    const downloadReport = (sessionData = sessionHistory, score = finalScore) => {
        const doc = new jsPDF();
        doc.setFont("helvetica", "bold");
        doc.text("INTERVIEW PERFORMANCE REPORT", 105, 20, { align: "center" });
        doc.setFontSize(10); doc.setFont("helvetica", "normal");
        doc.text(`Candidate: ${currentUser.fullName}`, 14, 35);
        doc.text(`Overall Performance: ${(score * 100).toFixed(2)}%`, 14, 45);

        const tableColumn = ["#", "Question", "Your Response", "Score"];
        const tableRows = (typeof sessionData === 'string' ? JSON.parse(sessionData) : sessionData).map((item, index) => [
            index + 1, item.question, item.answer, `${(item.score * 100).toFixed(0)}%`
        ]);

        doc.autoTable({
            startY: 60,
            head: [tableColumn],
            body: tableRows,
            theme: 'striped',
            headStyles: { fillColor: [79, 70, 229] }
        });
        doc.save(`Report_${currentUser.fullName}.pdf`);
    };

    // --- HELPERS FOR FILTERING ---
    const isPast = (date, time) => {
        if (!date || !time) return false;
        const interviewDateTime = new Date(`${date}T${time}`);
        const bufferTime = new Date(interviewDateTime.getTime() + 60 * 60000); 
        return bufferTime < new Date();
    };

    const upcomingSessions = interviews.filter(i => !isPast(i.interviewDate, i.interviewTime));
    const historySessions = interviews.filter(i => isPast(i.interviewDate, i.interviewTime));

    if (loading) return <div className="flex justify-center items-center h-[500px]"><Loader2 className="animate-spin text-indigo-600" size={48} /></div>;

    return (
        <div className="animate-fade-in space-y-6 p-4">
            {simStep !== "ongoing" && (
                <div className="flex gap-1 ml-4 overflow-x-auto no-scrollbar">
                    <button onClick={() => setActiveTab("sessions")} className={`px-10 py-4 rounded-t-[1.5rem] font-black text-sm flex items-center gap-2 ${activeTab === 'sessions' ? 'bg-white text-indigo-600 border-2 border-slate-100' : 'bg-slate-100 text-slate-500'}`}><PlayCircle size={18} /> Sessions</button>
                    <button onClick={() => { setActiveTab("simulate"); setSimStep("start"); }} className={`px-10 py-4 rounded-t-[1.5rem] font-black text-sm flex items-center gap-2 ${activeTab === 'simulate' ? 'bg-white text-rose-500 border-2 border-slate-100' : 'bg-slate-100 text-slate-500'}`}><MonitorPlay size={18} /> Simulate</button>
                    <button onClick={() => setActiveTab("history")} className={`px-10 py-4 rounded-t-[1.5rem] font-black text-sm flex items-center gap-2 ${activeTab === 'history' ? 'bg-white text-indigo-600 border-2 border-slate-100' : 'bg-slate-100 text-slate-500'}`}><History size={18} /> History</button>
                </div>
            )}

            <div className="bg-white dark:bg-slate-900 rounded-[3rem] border-2 border-slate-100 dark:border-slate-800 p-10 shadow-2xl min-h-[600px]">
                
                {activeTab === "simulate" && (
                    <div className="animate-in fade-in duration-500">
                        {simStep === "start" && (
                            <div className="text-center py-20 bg-rose-50/30 rounded-[3rem] border-2 border-dashed border-rose-200">
                                <Sparkles className="mx-auto text-rose-500 mb-4" size={56} />
                                <h2 className="text-5xl font-black italic mb-4">AI Interview Lab</h2>
                                <button onClick={() => setSimStep("select")} className="bg-rose-500 text-white px-16 py-6 rounded-[2.5rem] font-black text-2xl shadow-2xl hover:scale-105">START LAB</button>
                            </div>
                        )}

                        {simStep === "select" && (
                            <div className="max-w-4xl mx-auto space-y-10">
                                <button onClick={() => setSimStep("start")} className="flex items-center gap-2 text-slate-400 font-black text-xs uppercase"><ChevronLeft size={16}/> Back</button>
                                <div className="grid md:grid-cols-2 gap-8">
                                    <button onClick={() => { setSimMode("timed"); setSimStep("config"); }} className="bg-amber-50 p-10 rounded-[3rem] border-2 border-amber-100 text-left hover:border-amber-400 transition-all"><Timer size={40} className="text-amber-600 mb-4" /><h4 className="text-2xl font-black italic">Timed Challenge</h4></button>
                                    <button onClick={() => { setSimMode("adaptive"); setSimStep("config"); }} className="bg-violet-50 p-10 rounded-[3rem] border-2 border-violet-100 text-left hover:border-violet-400 transition-all"><BrainCircuit size={40} className="text-violet-600 mb-4" /><h4 className="text-2xl font-black italic">Adaptive 1-on-1</h4></button>
                                </div>
                            </div>
                        )}

                        {simStep === "config" && (
                            <div className="max-w-4xl mx-auto space-y-8 animate-in zoom-in-95">
                                <button onClick={() => setSimStep("select")} className="flex items-center gap-2 text-slate-400 font-black text-xs uppercase hover:text-rose-500 transition-colors"><ChevronLeft size={16}/> Back</button>
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className={`space-y-4 ${simMode === 'adaptive' ? 'opacity-30 grayscale pointer-events-none' : ''}`}>
                                        <label className="text-xs font-black uppercase text-slate-500">Time Per Question</label>
                                        <select value={simConfig.timePerQuestion} onChange={(e) => setSimConfig({...simConfig, timePerQuestion: parseInt(e.target.value)})} className="w-full bg-slate-50 border-2 rounded-2xl p-5 font-bold outline-none border-slate-100">
                                            <option value={30}>30s</option>
                                            <option value={60}>60s</option>
                                            <option value={90}>90s</option>
                                            <option value={120}>120s</option>
                                            <option value={150}>150s</option>
                                        </select>
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-xs font-black uppercase text-slate-500">Number of Questions</label>
                                        <input type="number" min="1" max="10" value={simConfig.numQuestions} onChange={(e) => setSimConfig({...simConfig, numQuestions: e.target.value})} className="w-full bg-slate-50 border-2 rounded-2xl p-5 font-bold outline-none border-slate-100" />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <label className="text-xs font-black uppercase text-slate-500">Job Description (JD)</label>
                                    <textarea placeholder="Paste requirements here..." value={simConfig.jdText} onChange={(e) => setSimConfig({...simConfig, jdText: e.target.value})} className="w-full h-44 bg-slate-50 border-2 rounded-[2.2rem] p-8 font-bold outline-none resize-none shadow-inner border-slate-100" />
                                </div>
                                <button onClick={startInterview} disabled={isSubmitting} className="w-full bg-indigo-600 text-white py-6 rounded-[2rem] font-black text-2xl flex items-center justify-center gap-4 hover:bg-indigo-700 shadow-xl transition-all">{isSubmitting ? <><Loader2 className="animate-spin" /> GENERATING...</> : "START NOW"}</button>
                            </div>
                        )}

                        {simStep === "ongoing" && currentQuestion && (
                            <div className="max-w-5xl mx-auto space-y-10 py-4 animate-in slide-in-from-bottom-6">
                                <div className="flex justify-between items-center">
                                    <div className="px-8 py-3 bg-slate-100 dark:bg-slate-800 rounded-full font-black text-slate-500 text-xs tracking-widest border">Q {currentQIndex + 1} / {simConfig.numQuestions}</div>
                                    {simMode === "timed" ? (
                                        <div className={`flex items-center gap-3 text-4xl font-black ${timeLeft < 10 ? 'text-rose-500 animate-pulse' : 'text-amber-500'}`}><Clock size={36} /> {timeLeft}s</div>
                                    ) : <div className="flex items-center gap-2 text-indigo-500 font-black uppercase text-sm"><MessageSquare size={20}/> Converse Mode</div>}
                                </div>
                                <div className="flex flex-col gap-8">
                                    <div className="flex items-start gap-4">
                                        <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white flex-shrink-0 shadow-lg font-black italic">AI</div>
                                        <div className="bg-slate-100 dark:bg-slate-800 p-8 rounded-t-3xl rounded-br-3xl max-w-3xl border">
                                            <p className="text-2xl font-black italic">"{currentQuestion.question}"</p>
                                        </div>
                                    </div>
                                    <div className="ml-16 relative">
                                        <textarea autoFocus value={currentAnswer} onChange={(e) => setCurrentAnswer(e.target.value)} className="w-full h-56 bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 font-bold text-2xl outline-none focus:border-indigo-500 border-2 border-slate-100 shadow-xl" placeholder="Speak or type your answer..." />
                                        <button onClick={toggleListening} className={`absolute bottom-8 right-8 p-6 rounded-full transition-all ${isListening ? 'bg-rose-500 text-white animate-pulse shadow-rose-200 shadow-2xl' : 'bg-slate-100 text-slate-400 hover:text-indigo-600 shadow-lg'}`}>{isListening ? <Mic size={30} /> : <MicOff size={30} />}</button>
                                    </div>
                                </div>
                                <button onClick={handleStep} disabled={isSubmitting} className="w-full bg-indigo-600 text-white py-7 rounded-[2.5rem] font-black text-3xl shadow-2xl hover:bg-indigo-700 transition-all">{isSubmitting ? <Loader2 className="animate-spin" /> : "SUBMIT ANSWER"}</button>
                            </div>
                        )}

                        {simStep === "result" && (
                            <div className="text-center space-y-12 py-10 animate-in zoom-in-95">
                                <div className="inline-flex p-12 bg-indigo-600 text-white rounded-full shadow-2xl"><Trophy size={80} /></div>
                                <div><h2 className="text-8xl font-black text-indigo-600 uppercase">{(finalScore * 100).toFixed(0)}%</h2><p className="font-black text-slate-400 uppercase mt-2 italic tracking-widest text-xs">Final Rating</p></div>
                                <div className="flex justify-center gap-4">
                                    <button onClick={() => downloadReport()} className="bg-white border-4 border-indigo-600 text-indigo-600 px-10 py-5 rounded-2xl font-black flex items-center gap-3"><Download /> DOWNLOAD PDF</button>
                                    <button onClick={() => setSimStep("start")} className="bg-slate-900 text-white px-10 py-5 rounded-2xl font-black flex items-center gap-4 mx-auto hover:scale-105 transition-all"><RotateCcw size={24} /> RETRY LAB</button>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* --- SESSIONS TAB --- */}
                {activeTab === "sessions" && (
                    <div className="space-y-8 animate-in fade-in duration-500">
                        <h2 className="text-3xl font-black italic dark:text-white">Active Panels</h2>
                        {upcomingSessions.length > 0 ? upcomingSessions.map((item, idx) => (
                            <div key={idx} className="bg-indigo-50/50 dark:bg-indigo-900/10 p-8 rounded-[2rem] border-2 border-indigo-100 dark:border-indigo-800/30 flex items-center justify-between gap-6 hover:scale-[1.01] transition-transform">
                                <div className="flex items-center gap-6"><div className="p-5 bg-indigo-600 text-white rounded-3xl"><Video size={32} /></div><div><h3 className="text-2xl font-black dark:text-white">{item.jobTitle}</h3><div className="flex gap-6 mt-2 text-slate-500 font-bold text-xs uppercase"><span>{item.interviewDate}</span><span>{item.interviewTime}</span></div></div></div>
                                <a href={item.meetingLink} target="_blank" rel="noreferrer" className="bg-indigo-600 text-white px-12 py-5 rounded-[1.5rem] font-black text-lg">JOIN ROOM</a>
                            </div>
                        )) : <EmptyState icon={<Video />} message="No active interview sessions." />}
                    </div>
                )}

                {/* --- HISTORY TAB --- */}
                {activeTab === "history" && (
                    <div className="space-y-8 animate-in fade-in duration-500">
                        <h2 className="text-3xl font-black italic dark:text-white">Past Records</h2>
                        <div className="grid grid-cols-1 gap-6">
                            {mockHistory.map((mock, idx) => (
                                <div key={idx} className="bg-slate-50 dark:bg-slate-800 p-8 rounded-[2rem] border-2 flex items-center justify-between group hover:border-indigo-300 transition-all">
                                    <div className="flex items-center gap-6">
                                        <div className="p-5 bg-white text-indigo-600 rounded-3xl shadow-sm"><FileText size={28} /></div>
                                        <div><h3 className="text-xl font-black italic uppercase">MOCK LAB SESSION</h3><p className="text-slate-400 font-bold text-xs uppercase tracking-tighter">{mock.createdAt?.split('T')[0] || mock.date} • {mock.jdSummary}</p></div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <span className="text-2xl font-black text-indigo-600">{(mock.overallScore * 100).toFixed(0)}%</span>
                                        <button onClick={() => downloadReport(mock.interviewDetailsJson, mock.overallScore)} className="p-4 bg-indigo-600 text-white rounded-2xl hover:scale-110 transition-transform"><Download size={20}/></button>
                                    </div>
                                </div>
                            ))}
                            {historySessions.map((item, idx) => (
                                <div key={idx} className="bg-slate-50 dark:bg-slate-800/50 p-8 rounded-[2rem] border flex items-center justify-between opacity-60">
                                    <div className="flex items-center gap-6"><div className="p-4 bg-slate-200 text-slate-500 rounded-2xl"><CheckCircle size={28} /></div><div><h3 className="text-xl font-black">{item.jobTitle}</h3><p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{item.interviewDate}</p></div></div>
                                    <span className="bg-green-100 text-green-700 px-8 py-3 rounded-2xl text-xs font-black uppercase">Successful</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const EmptyState = ({ icon, message }) => (
    <div className="text-center py-40 flex flex-col items-center justify-center grayscale opacity-30">
        <div className="w-28 h-28 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-8">{React.cloneElement(icon, { size: 56, className: "text-slate-400" })}</div>
        <p className="text-2xl font-black text-slate-400 italic tracking-tight">{message}</p>
    </div>
);

export default StudentInterviews;