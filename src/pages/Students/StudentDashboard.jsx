import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutStudent } from "../../redux/studentRedux/studentSlice"; 
import StudentSidebar from "./StudentSidebar"; 

const StudentDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.student || {});

  const [activeTab, setActiveTab] = useState("Home");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: `Hi ${currentUser?.fullName?.split(" ")[0] || 'there'}! I'm your CareerVector AI assistant.`, sender: "bot" }
  ]);
  const [inputValue, setInputValue] = useState("");
  const chatEndRef = useRef(null);

  const calculateCGPA = () => {
    if (!currentUser) return "0.0";
    let total = 0; let count = 0;
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
    return parts.length >= 2 ? (parts[0][0] + parts[1][0]).toUpperCase() : name.substring(0, 2).toUpperCase();
  };

  const handleLogout = () => {
    dispatch(logoutStudent());
    navigate("/login"); 
  };

  const handleSendMessage = () => {
    if (inputValue.trim() === "") return;
    setMessages([...messages, { id: Date.now(), text: inputValue, sender: "user" }]);
    setInputValue("");
    setTimeout(() => {
      setMessages(prev => [...prev, { id: Date.now()+1, text: "I'm analyzing your profile...", sender: "bot" }]);
    }, 1000);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, showChat]);

  const styles = getStyles(isDarkMode);

  const menuItems = [
    { name: "Home", icon: "🏠" },
    { name: "Resume Analyzer", icon: "📄" },
    { name: "Skill Gap Detector", icon: "📊" },
    { name: "Interview Simulator", icon: "🎤" },
    { name: "Placement Insights", icon: "📈" },
    { name: "Learning Path", icon: "🎓" },
    { name: "Profile", icon: "👤" },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "Home":
        return (
          <>
            {/* PROFILE SUMMARY */}
            <div style={styles.cardRow}>
              {currentUser?.profileImageUrl ? (
                <img src={currentUser.profileImageUrl} alt="Profile" style={{...styles.profileCircle, objectFit: 'cover', border: '2px solid #3b82f6'}} />
              ) : (
                <div style={styles.profileCircle}>{getInitials(currentUser?.fullName)}</div>
              )}
              <div>
                <h2 style={styles.headingName}>{currentUser?.fullName || "Guest Student"}</h2>
                <p style={styles.metaText}><b>ID:</b> {currentUser?.rollNumber || "N/A"}</p>
                <p style={styles.metaText}><b>Branch:</b> {currentUser?.branch} ({currentUser?.dept})</p>
                <p style={styles.metaText}><b>CGPA:</b> {calculateCGPA()}</p>
                <span style={styles.statusBadge}>🟢 Open to Work</span>
              </div>
            </div>

            <div style={styles.dashboardGrid}>
              {/* LEFT COLUMN */}
              <div style={styles.col}>
                <div style={styles.card}>
                  <h3 style={styles.cardTitle}>Contact & Links</h3>
                  <p style={styles.rowItem}>📞 {currentUser?.mobileNumber || "N/A"}</p>
                  <p style={styles.rowItem}>✉️ {currentUser?.email || "N/A"}</p>
                  {currentUser?.githubUrl && <p style={styles.rowItem}>💻 <a href={currentUser.githubUrl} target="_blank" rel="noopener noreferrer" style={styles.link}>GitHub Profile</a></p>}
                  {currentUser?.leetcodeurl && <p style={styles.rowItem}>⚡ <a href={currentUser.leetcodeurl} target="_blank" rel="noopener noreferrer" style={styles.link}>LeetCode Profile</a></p>}
                </div>

                <div style={styles.card}>
                  <div style={styles.cardHeaderBorder}>
                    <h3 style={styles.cardTitleNoMargin}>Semester Grades</h3>
                    <span style={styles.subText}>Avg: {calculateCGPA()}</span>
                  </div>
                  <div style={styles.semesterGrid}>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                      <div key={sem} style={styles.semesterInputGroup}>
                        <label style={styles.semLabel}>Sem {sem}</label>
                        <input style={styles.semInput} defaultValue={currentUser?.[`gpa_sem_${sem}`] || ""} readOnly />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN */}
              <div style={styles.col}>
                <div style={styles.card}>
                  <h3 style={styles.cardTitle}>Skills</h3>
                  <div style={styles.tagContainer}>
                    <span style={styles.tag}>{currentUser?.branch || "Computer Science"}</span>
                    <span style={styles.tag}>Python</span>
                    <span style={styles.tag}>SQL</span>
                    <span style={styles.tag}>React.js</span>
                  </div>
                </div>

                {/* PROJECTS SECTION */}
                <div style={styles.card}>
                  <h3 style={styles.cardTitle}>Projects</h3>
                  <button style={{...styles.btn, width:'100%', marginBottom:'15px'}}>+ Add Project</button>
                  
                  <div style={styles.projectItem}>
                    <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                      <b>Final Year Project</b>
                      <button style={styles.viewBtn}>View</button>
                    </div>
                    <p style={{fontSize:'12px', color: isDarkMode ? '#94a3b8' : '#64748b', marginTop: '5px'}}>
                      AI-Powered Resume Analyzer | Python & ML
                    </p>
                  </div>

                  <div style={styles.projectItem}>
                    <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                      <b>Portfolio Website</b>
                      <button style={styles.viewBtn}>View</button>
                    </div>
                    <p style={{fontSize:'12px', color: isDarkMode ? '#94a3b8' : '#64748b', marginTop: '5px'}}>
                      Personal Branding | React & Tailwind
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </>
        );
      default:
        return <div style={styles.plainContent}><h3>{activeTab}</h3><p>Content for {activeTab} is being prepared.</p></div>;
    }
  };

  return (
    <div style={styles.appContainer}>
      <StudentSidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isDarkMode={isDarkMode} 
        toggleTheme={() => setIsDarkMode(!isDarkMode)} 
        handleLogout={handleLogout}
        menuItems={menuItems}
      />

      <div style={styles.mainArea}>
        <div style={styles.topHeader}>
          <div style={{color:'#94a3b8', fontSize:'14px'}}>Dashboard / {activeTab}</div>
          <div style={styles.userProfileIcon}>{getInitials(currentUser?.fullName)}</div>
        </div>
        <div style={styles.scrollableContent}>{renderContent()}</div>
      </div>

      {showChat && (
        <div style={styles.widgetOverlay}>
          <div style={styles.chatContainer}>
            <div style={styles.chatHeader}>
              <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
                <div style={{width:'8px', height:'8px', borderRadius:'50%', background:'#22c55e'}}></div>
                <h3 style={styles.widgetTitle}>Career Assistant</h3>
              </div>
              <button style={styles.closeBtn} onClick={() => setShowChat(false)}>✖</button>
            </div>
            <div style={styles.chatBody}>
              {messages.map((msg) => (
                <div key={msg.id} style={{...styles.messageBubble, alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start', background: msg.sender === 'user' ? '#3b82f6' : (isDarkMode ? '#334155' : '#e2e8f0'), color: msg.sender === 'user' ? '#fff' : (isDarkMode ? '#fff' : '#000')}}>
                  {msg.text}
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
            <div style={styles.chatFooter}>
              <input style={styles.chatInput} placeholder="Type a message..." value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()} />
              <button style={styles.sendBtn} onClick={handleSendMessage}>➤</button>
            </div>
          </div>
        </div>
      )}
      <button style={styles.floatingBtn} onClick={() => setShowChat(!showChat)}>💬</button>
    </div>
  );
};

const getStyles = (isDark) => {
  const colors = {
    bg: isDark ? "#020617" : "#f1f5f9",
    cardBg: isDark ? "#1e293b" : "#fff",
    textPrimary: isDark ? "#f8fafc" : "#1e293b",
    textSecondary: isDark ? "#94a3b8" : "#64748b",
    border: isDark ? "#334155" : "#e2e8f0",
    inputBg: isDark ? "#0f172a" : "#fff",
    inputBorder: isDark ? "#475569" : "#cbd5e1",
    accentBoxBg: isDark ? "#0f172a" : "#f8fafc",
  };

  return {
    appContainer: { display: "flex", height: "100vh", width: "100vw", backgroundColor: colors.bg, overflow: "hidden", color: colors.textPrimary },
    mainArea: { flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" },
    topHeader: { height: "60px", backgroundColor: "#0f172a", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 30px" },
    userProfileIcon: { width: "40px", height: "40px", borderRadius: "50%", backgroundColor: "#3b82f6", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold" },
    scrollableContent: { flex: 1, overflowY: "auto", padding: "30px", paddingBottom: "100px" },
    cardRow: { display: "flex", gap: "25px", background: colors.cardBg, padding: "25px", borderRadius: "16px", marginBottom: "25px", alignItems: "center", boxShadow: "0 2px 5px rgba(0,0,0,0.05)" },
    profileCircle: { width: "80px", height: "80px", borderRadius: "50%", backgroundColor: "#cbd5e1", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "30px", color: "#64748b" },
    headingName: { margin:0, color: colors.textPrimary },
    metaText: { margin: "5px 0", color: colors.textSecondary, fontSize: "14px" },
    statusBadge: { display: "inline-block", padding: "4px 12px", borderRadius: "20px", backgroundColor: "#dcfce7", color: "#166534", fontSize: "12px", fontWeight: "600" },
    dashboardGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "25px" },
    col: { display: "flex", flexDirection: "column", gap: "25px" },
    card: { background: colors.cardBg, padding: "25px", borderRadius: "16px", border: `1px solid ${colors.border}`, boxShadow: "0 2px 5px rgba(0,0,0,0.05)" },
    cardTitle: { margin: "0 0 20px 0", fontSize: "16px", borderBottom: `2px solid ${colors.border}`, paddingBottom: "10px", color: colors.textPrimary },
    cardHeaderBorder: { display:'flex', justifyContent:'space-between', alignItems: 'center', marginBottom:'15px', borderBottom:`2px solid ${colors.border}`, paddingBottom: '10px' },
    cardTitleNoMargin: { margin:0, fontSize:'16px' },
    subText: { fontSize:'12px', color: colors.textSecondary },
    rowItem: { margin: "10px 0", fontSize: "14px", color: colors.textSecondary },
    link: { color: "#3b82f6", textDecoration: "none" },
    tagContainer: { display: "flex", flexWrap: "wrap", gap: "8px" },
    tag: { background: "#eff6ff", color: "#2563eb", padding: "5px 10px", borderRadius: "6px", fontSize: "12px", fontWeight: "600" },
    projectItem: { background: colors.accentBoxBg, padding: "15px", borderRadius: "10px", marginTop: "10px", border: `1px solid ${colors.border}` },
    viewBtn: { background: colors.cardBg, color: colors.textPrimary, border: `1px solid ${colors.border}`, padding: "4px 10px", borderRadius: "6px", cursor: "pointer", fontSize: "11px" },
    btn: { background: "#3b82f6", color: "#fff", border: "none", padding: "10px", borderRadius: "8px", cursor: "pointer", fontWeight: "600" },
    semesterGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" },
    semesterInputGroup: { display: "flex", background: colors.accentBoxBg, padding: "8px", borderRadius: "8px", border: `1px solid ${colors.border}` },
    semLabel: { fontSize: "12px", color: colors.textSecondary, marginRight: "5px" },
    semInput: { width: "100%", border: "none", background: "transparent", color: colors.textPrimary, textAlign: "right", fontWeight: "600" },
    floatingBtn: { position: 'fixed', bottom: '30px', right: '30px', width: '60px', height: '60px', borderRadius: '50%', background: '#3b82f6', color: '#fff', fontSize: '24px', border: 'none', cursor: 'pointer', boxShadow: '0 4px 15px rgba(59,130,246,0.4)' },
    widgetOverlay: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center' },
    chatContainer: { width: '400px', height: '550px', background: colors.cardBg, borderRadius: '16px', display: 'flex', flexDirection: 'column', overflow: 'hidden' },
    chatHeader: { display: 'flex', justifyContent: 'space-between', padding: '15px 20px', borderBottom: `1px solid ${colors.border}`, background: isDark ? '#1e293b' : '#fff' },
    widgetTitle: { margin: 0, fontSize: '15px' },
    closeBtn: { background: 'transparent', border: 'none', color: colors.textSecondary, cursor: 'pointer' },
    chatBody: { flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' },
    messageBubble: { padding: '10px 14px', borderRadius: '12px', maxWidth: '80%', fontSize: '13px' },
    chatFooter: { padding: '15px', display: 'flex', gap: '10px', borderTop: `1px solid ${colors.border}` },
    chatInput: { flex: 1, padding: '10px', borderRadius: '8px', border: `1px solid ${colors.inputBorder}`, background: colors.inputBg, color: colors.textPrimary },
    sendBtn: { background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '8px', padding: '0 15px', cursor:'pointer' },
    plainContent: { padding: '20px' }
  };
};

export default StudentDashboard;