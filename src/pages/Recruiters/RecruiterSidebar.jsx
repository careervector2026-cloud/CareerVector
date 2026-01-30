import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutRecruiter } from "../../redux/recruiterRedux/recruiterSlice"; 

const Sidebar = ({ active, setActive }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutRecruiter());
    navigate("/recruiter/login");
  };

  const menuItems = [
    { name: "Dashboard", icon: "📊" },
    { name: "Jobs", icon: "💼" },
    { name: "Candidates", icon: "👥" },
    { name: "Analytics", icon: "📈" },
    { name: "Settings", icon: "⚙️" },
  ];

  return (
    <aside style={styles.sidebar}>
      <div style={styles.brandSection}>
        <div style={styles.logoIcon}>CV</div>
        <div>
          <h2 style={styles.logoText}>CareerVector</h2>
          <p style={styles.subtitle}>Recruiter Panel</p>
        </div>
      </div>

      <nav style={styles.menu}>
        {menuItems.map((item) => (
          <div key={item.name} onClick={() => setActive(item.name)} style={{
              ...styles.menuItem,
              backgroundColor: active === item.name ? "#1e40af" : "transparent",
              color: active === item.name ? "#ffffff" : "#64748b",
            }}>
            <span style={{ marginRight: "12px", fontSize: "18px" }}>{item.icon}</span>
            {item.name}
          </div>
        ))}
      </nav>

      <div style={styles.logoutSection}>
        <div style={styles.divider}></div>
        <div style={styles.logoutBtn} onClick={handleLogout}>
          <span style={{ marginRight: "12px", fontSize: "18px" }}>🚪</span>
          Logout
        </div>
      </div>
    </aside>
  );
};

const styles = {
  sidebar: { width: "260px", height: "100vh", backgroundColor: "#ffffff", padding: "24px", display: "flex", flexDirection: "column", borderRight: "1px solid #e2e8f0", position: "sticky", top: 0, flexShrink: 0, fontFamily: "'Inter', sans-serif" },
  brandSection: { display: "flex", alignItems: "center", gap: "12px", marginBottom: "40px" },
  logoIcon: { width: "40px", height: "40px", backgroundColor: "#1e40af", color: "#fff", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: "18px" },
  logoText: { color: "#1e293b", fontWeight: "800", fontSize: "18px", margin: 0 },
  subtitle: { fontSize: "12px", color: "#94a3b8", margin: 0 },
  menu: { display: "flex", flexDirection: "column", gap: "8px", flexGrow: 1 },
  menuItem: { padding: "12px 16px", borderRadius: "12px", cursor: "pointer", transition: "all 0.2s ease", display: "flex", alignItems: "center", fontSize: "14px" },
  logoutSection: { marginTop: "auto" },
  divider: { height: "1px", backgroundColor: "#f1f5f9", marginBottom: "16px" },
  logoutBtn: { padding: "12px 16px", borderRadius: "12px", cursor: "pointer", display: "flex", alignItems: "center", fontSize: "14px", color: "#ef4444", fontWeight: "600", backgroundColor: "#fef2f2" },
};

export default Sidebar;