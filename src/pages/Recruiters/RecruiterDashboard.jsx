import React, { useState } from "react";
import { useSelector } from "react-redux";
import Sidebar from "./RecruiterSidebar";

const RecruiterDashboard = () => {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const { currentRecruiter } = useSelector((state) => state.recruiter);

  const getInitials = (name) => {
    if (!name) return "RC";
    const parts = name.split(" ");
    return parts.length >= 2 ? (parts[0][0] + parts[1][0]).toUpperCase() : name.substring(0, 2).toUpperCase();
  };

  const renderContent = () => {
    switch (activeTab) {
      case "Dashboard": return <DashboardWidgets recruiter={currentRecruiter} />;
      case "Jobs": return <JobsOptions />;
      default: return (
        <div style={styles.placeholder}>
          <h2>{activeTab} Module</h2>
          <p>Coming soon...</p>
        </div>
      );
    }
  };

  return (
    <div style={styles.container}>
      <Sidebar active={activeTab} setActive={setActiveTab} />
      <main style={styles.mainContent}>
        <header style={styles.header}>
          <div>
            <h1 style={styles.title}>Hello, {currentRecruiter?.fullName?.split(" ")[0] || "Recruiter"} 👋</h1>
            <p style={styles.date}>{currentRecruiter?.companyName ? `Recruiting for ${currentRecruiter.companyName}` : "Manage your recruitment pipeline."}</p>
          </div>
          <div style={styles.profileSection}>
            <div style={styles.searchBar}>🔍 Search...</div>
            {currentRecruiter?.profileImg ? (
              <img src={currentRecruiter.profileImg} alt="Profile" style={{...styles.avatar, objectFit: 'cover'}} />
            ) : (
              <div style={styles.avatar}>{getInitials(currentRecruiter?.fullName)}</div>
            )}
          </div>
        </header>
        {renderContent()}
      </main>
    </div>
  );
};

const DashboardWidgets = ({ recruiter }) => (
  <div style={styles.grid}>
    <div style={styles.cardSmall}><div style={styles.iconBox}>💼</div><h3 style={styles.statNumber}>12</h3><p style={styles.statLabel}>Active Jobs</p></div>
    <div style={styles.cardSmall}><div style={styles.iconBox}>👥</div><h3 style={styles.statNumber}>84</h3><p style={styles.statLabel}>Candidates</p></div>
    <div style={styles.cardSmall}><div style={styles.iconBox}>⚡</div><h3 style={styles.statNumber}>18d</h3><p style={styles.statLabel}>Time to Hire</p></div>
    <div style={{ ...styles.card, gridColumn: "span 2" }}>
      <div style={styles.cardHeader}><h3>Recruitment Funnel</h3></div>
      <div>
        <FunnelBar label="Applied" count={120} color="#87a6e9" width="100%" />
        <FunnelBar label="Screening" count={65} color="#60a5fa" width="60%" />
        <FunnelBar label="Interview" count={24} color="#3b82f6" width="30%" />
      </div>
    </div>
  </div>
);

const JobsOptions = () => (
  <div style={styles.jobsGrid}>
    <div style={{...styles.actionCard, borderTop: "4px solid #3b82f6"}}><div style={{...styles.actionIcon, background: "#eff6ff", color: "#3b82f6"}}>✨</div><h3>Post Job</h3><p style={styles.actionDesc}>Create new requisition.</p></div>
    <div style={{...styles.actionCard, borderTop: "4px solid #f59e0b"}}><div style={{...styles.actionIcon, background: "#fffbeb", color: "#f59e0b"}}>✏️</div><h3>Edit Job</h3><p style={styles.actionDesc}>Update active listings.</p></div>
  </div>
);

const FunnelBar = ({ label, count, color, width }) => (
  <div style={{ marginBottom: "12px" }}>
    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px" }}><span>{label}</span><strong>{count}</strong></div>
    <div style={{ height: "8px", background: "#f1f5f9", borderRadius: "4px" }}><div style={{ height: "100%", width, background: color, borderRadius: "4px" }} /></div>
  </div>
);

const styles = {
  container: { display: "flex", backgroundColor: "#f8fafc", minHeight: "100vh", fontFamily: "'Inter', sans-serif" },
  mainContent: { flexGrow: 1, padding: "32px 40px", overflowY: "auto" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" },
  title: { fontSize: "28px", fontWeight: "800", color: "#1e293b" },
  date: { color: "#64748b", fontSize: "14px" },
  profileSection: { display: "flex", alignItems: "center", gap: "16px" },
  searchBar: { background: "#ffffff", padding: "10px", borderRadius: "12px", width: "200px" },
  avatar: { width: "40px", height: "40px", borderRadius: "50%", background: "#3b82f6", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold" },
  grid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px" },
  jobsGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "32px", marginTop: "20px" },
  card: { backgroundColor: "#ffffff", borderRadius: "20px", padding: "24px", boxShadow: "0 10px 30px rgba(0,0,0,0.04)" },
  cardSmall: { backgroundColor: "#ffffff", borderRadius: "20px", padding: "20px", boxShadow: "0 10px 30px rgba(0,0,0,0.04)" },
  actionCard: { backgroundColor: "#ffffff", borderRadius: "20px", padding: "32px", boxShadow: "0 10px 30px rgba(0,0,0,0.04)", cursor: "pointer", height: "200px" },
  actionIcon: { fontSize: "24px", marginBottom: "12px", width: "48px", height: "48px", borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center" },
  actionDesc: { fontSize: "14px", color: "#64748b" },
  iconBox: { fontSize: "24px", marginBottom: "12px", background: "#f1f5f9", width: "48px", height: "48px", borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center" },
  statNumber: { fontSize: "32px", fontWeight: "700", color: "#0f172a", margin: 0 },
  statLabel: { color: "#64748b", fontSize: "13px" },
  cardHeader: { marginBottom: "20px" },
  placeholder: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "60vh", color: "#94a3b8", background: "#ffffff", borderRadius: "24px", border: "2px dashed #e2e8f0" },
};

export default RecruiterDashboard;