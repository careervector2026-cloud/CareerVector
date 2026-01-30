import React from "react";

const StudentSidebar = ({ activeTab, setActiveTab, isDarkMode, toggleTheme, handleLogout, menuItems }) => {
  const styles = getSidebarStyles(isDarkMode);

  return (
    <div style={styles.sidebar}>
      <div style={styles.logoContainer}>
        <h1 style={styles.logo}>CareerVector</h1>
      </div>

      <nav style={styles.nav}>
        {menuItems.map((item) => (
          <div
            key={item.name}
            style={{
              ...styles.navItem,
              backgroundColor: activeTab === item.name ? "rgba(255,255,255,0.1)" : "transparent",
              borderLeft: activeTab === item.name ? "4px solid #3b82f6" : "4px solid transparent",
              color: activeTab === item.name ? "#fff" : "#94a3b8"
            }}
            onClick={() => setActiveTab(item.name)}
          >
            <span style={styles.navIcon}>{item.icon}</span>
            {item.name}
          </div>
        ))}
      </nav>

      <div style={styles.sidebarFooter}>
        <div style={styles.navItem} onClick={toggleTheme}>
          <span style={styles.navIcon}>{isDarkMode ? "☀️" : "🌙"}</span> 
          {isDarkMode ? "Light Theme" : "Dark Theme"}
        </div>
        <div style={{...styles.navItem, color: '#f87171', marginTop:'5px'}} onClick={handleLogout}>
          <span style={styles.navIcon}>🚪</span> Logout
        </div>
      </div>
    </div>
  );
};

const getSidebarStyles = (isDark) => ({
  sidebar: { 
    width: "260px", 
    minWidth: "260px", 
    backgroundColor: "#0f172a", 
    color: "#fff", 
    display: "flex", 
    flexDirection: "column", 
    flexShrink: 0, 
    boxShadow: "4px 0 10px rgba(0,0,0,0.1)",
    height: "100vh"
    },
    logoContainer: { padding: "25px", borderBottom: "1px solid rgba(255,255,255,0.1)" },
    logo: { 
    fontSize: "22px", 
    fontWeight: "800", 
    margin: 0, 
    background: "linear-gradient(90deg, #60a5fa, #a78bfa)", 
    WebkitBackgroundClip: "text", 
    WebkitTextFillColor: "transparent" 
    },
    nav: { padding: "20px 0", flex: 1, overflowY: "auto" },
    navItem: { 
    padding: "12px 25px", 
    cursor: "pointer", 
    display: "flex", 
    alignItems: "center", 
    gap: "12px", 
    fontSize: "14px", 
    fontWeight: "500", 
    transition: "all 0.2s", 
    marginBottom: "4px" 
    },
    navIcon: { fontSize: "18px" },
    sidebarFooter: { padding: "20px", borderTop: "1px solid rgba(255,255,255,0.1)" },
});

export default StudentSidebar;