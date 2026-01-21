import React, { useState } from "react";
import axios from "axios";

const StudentLogin = () => {
  const [step, setStep] = useState("login"); 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    localStorage.setItem("careerVectorUser", JSON.stringify({ email }));
    window.location.href = "/student/home";
  };

  const handleSignup = () => {
    // Navigate to your signup route here
    window.location.href = "/student/signup";
  };

  const handleCheckEmail = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/student/check-email", { email });
      setStep("reset"); 
    } catch {
      alert("Email not found in database");
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    try {
      await axios.post("http://localhost:5000/api/student/reset-password", {
        email,
        newPassword,
      });
      alert("Password reset successful. Please login.");
      setStep("login");
    } catch {
      alert("Failed to reset password");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.glowBlue}></div>
      <div style={styles.glowPurple}></div>

      <div style={styles.content}>
        <div style={styles.leftText}>
          <h1 style={styles.brand}>CareerVector</h1>
          <p style={styles.tagline}>Your smart placement companion</p>
        </div>

        {/* LOGIN */}
        {step === "login" && (
          <form onSubmit={handleLogin} style={styles.form}>
            <h2 style={styles.formTitle}>Student Login</h2>

            <input
              type="email"
              placeholder="Email"
              style={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Password"
              style={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button style={styles.button}>Login</button>

            <div style={styles.footerLinks}>
              <p style={styles.forgot} onClick={() => setStep("forgot")}>
                Forgot password?
              </p>
              
              {/* --- ADDED SIGN UP SECTION HERE --- */}
              <p style={styles.signupText}>
                Don't have an account?{" "}
                <span style={styles.signupLink} onClick={handleSignup}>
                  Sign Up
                </span>
              </p>
            </div>
          </form>
        )}

        {/* CHECK EMAIL */}
        {step === "forgot" && (
          <form onSubmit={handleCheckEmail} style={styles.form}>
            <h2 style={styles.formTitle}>Verify Email</h2>

            <input
              type="email"
              placeholder="Enter registered email"
              style={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <button style={styles.button}>Continue</button>

            <p style={styles.forgot} onClick={() => setStep("login")}>
              Back to login
            </p>
          </form>
        )}

        {/* RESET PASSWORD */}
        {step === "reset" && (
          <form onSubmit={handleResetPassword} style={styles.form}>
            <h2 style={styles.formTitle}>Reset Password</h2>

            <input
              type="password"
              placeholder="New Password"
              style={styles.input}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Confirm Password"
              style={styles.input}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            <button style={styles.button}>Update Password</button>
          </form>
        )}
      </div>
    </div>
  );
};

const styles = {
  page: {
    height: "100vh",
    width: "100vw",
    background: "linear-gradient(135deg, #0f172a, #1e3a8a)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    position: "relative",
    overflow: "hidden",
  },
  glowBlue: {
    position: "absolute",
    width: "500px",
    height: "500px",
    background: "rgba(59,130,246,0.35)",
    borderRadius: "50%",
    top: "-150px",
    left: "-150px",
    filter: "blur(120px)",
  },
  glowPurple: {
    position: "absolute",
    width: "500px",
    height: "500px",
    background: "rgba(168,85,247,0.35)",
    borderRadius: "50%",
    bottom: "-150px",
    right: "-150px",
    filter: "blur(120px)",
  },
  content: {
    position: "relative",
    zIndex: 2,
    width: "90%",
    maxWidth: "900px",
    display: "flex",
    justifyContent: "space-between",
    gap: "40px",
  },
  leftText: { flex: 1 },
  brand: { fontSize: "48px", fontWeight: "800" },
  tagline: { fontSize: "18px", color: "#c7d2fe" },
  form: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  formTitle: { fontSize: "26px", fontWeight: "700" },
  input: {
    padding: "14px",
    borderRadius: "12px",
    border: "1px solid rgba(255,255,255,0.25)",
    background: "rgba(255,255,255,0.12)",
    color: "#fff",
    outline: "none", // Added outline none for cleaner focus
  },
  button: {
    padding: "14px",
    borderRadius: "12px",
    background: "linear-gradient(90deg, #6366f1, #3b82f6)",
    border: "none",
    color: "#fff",
    fontWeight: "600",
    cursor: "pointer",
  },
  footerLinks: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    alignItems: "center",
  },
  forgot: {
    textAlign: "center",
    fontSize: "14px",
    color: "#93c5fd",
    cursor: "pointer",
    margin: 0,
  },
  // --- New Styles for Sign Up ---
  signupText: {
    fontSize: "14px",
    color: "#cbd5e1", // Light grey to distinguish from 'forgot password'
    margin: 0,
  },
  signupLink: {
    color: "#fff", // White to pop out
    fontWeight: "700",
    cursor: "pointer",
    marginLeft: "5px",
    textDecoration: "underline",
  }
};

export default StudentLogin;