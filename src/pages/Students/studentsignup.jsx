import React, { useState } from "react";

const StudentSignup = () => {
  const [step, setStep] = useState(1);

  const [data, setData] = useState({
    fullName: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    mobile: "",
    roll: "",
    dept: "",
    branch: "",
    year: "",
    sem: "",
    gpa: "",
    profilePic: null,
    resume: null,
    leetcode: "",
    github: "",
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setData({ ...data, [name]: files ? files[0] : value });
  };

  const validPassword = (pwd) =>
    /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(pwd);

  const next = () => {
    if (step === 1) {
      if (data.password !== data.confirmPassword) {
        alert("Passwords do not match");
        return;
      }
      if (!validPassword(data.password)) {
        alert("Password must have 1 capital, 1 number, 1 special character");
        return;
      }
    }
    setStep(step + 1);
  };

  const submitSignup = () => {
    const userData = {
      fullName: data.fullName,
      email: data.email,
      username: data.username,
      mobile: data.mobile,
      roll: data.roll,
      dept: data.dept,
      branch: data.branch,
      year: data.year,
      sem: data.sem,
      gpa: data.gpa,
      leetcode: data.leetcode,
      github: data.github,
    };

    // Save to localStorage
    localStorage.setItem("careerVectorUser", JSON.stringify(userData));

    console.log("Saved:", localStorage.getItem("careerVectorUser"));

    alert("Signup successful! Data saved.");

    // Redirect to login
    window.location.href = "/student/login";
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.brand}>CareerVector</h1>

        <div style={styles.progress}>
          <span style={step >= 1 ? styles.activeStep : styles.step}>1</span>
          <span style={styles.line}></span>
          <span style={step >= 2 ? styles.activeStep : styles.step}>2</span>
          <span style={styles.line}></span>
          <span style={step >= 3 ? styles.activeStep : styles.step}>3</span>
        </div>

        {step === 1 && (
          <div style={styles.form}>
            <h2>Account Setup</h2>

            <input style={styles.input} name="fullName" placeholder="Full Name" onChange={handleChange} />
            <input style={styles.input} name="email" placeholder="Email" onChange={handleChange} />
            <input style={styles.input} name="username" placeholder="Username (optional)" onChange={handleChange} />
            <input style={styles.input} type="password" name="password" placeholder="Password" onChange={handleChange} />
            <input style={styles.input} type="password" name="confirmPassword" placeholder="Confirm Password" onChange={handleChange} />

            <button style={styles.button} onClick={next}>Next</button>
          </div>
        )}

        {step === 2 && (
          <div style={styles.form}>
            <h2>Academic Info</h2>

            <input style={styles.input} name="mobile" placeholder="Mobile Number" onChange={handleChange} />
            <input style={styles.input} name="roll" placeholder="Roll Number" onChange={handleChange} />
            <input style={styles.input} name="dept" placeholder="Department" onChange={handleChange} />
            <input style={styles.input} name="branch" placeholder="Branch" onChange={handleChange} />
            <input style={styles.input} name="year" placeholder="Year" onChange={handleChange} />
            <input style={styles.input} name="sem" placeholder="Current Semester" onChange={handleChange} />
            <input style={styles.input} name="gpa" placeholder="GPA (All previous semesters)" onChange={handleChange} />

            <label style={styles.fileLabel}>Profile Picture</label>
            <input type="file" name="profilePic" onChange={handleChange} />

            <label style={styles.fileLabel}>Resume (PDF)</label>
            <input type="file" name="resume" onChange={handleChange} />

            <input style={styles.input} name="leetcode" placeholder="LeetCode URL" onChange={handleChange} />
            <input style={styles.input} name="github" placeholder="GitHub URL" onChange={handleChange} />

            <button style={styles.button} onClick={next}>Next</button>
          </div>
        )}

        {step === 3 && (
          <div style={styles.form}>
            <h2>Verify & Finish</h2>
            <p>Click below to create your account.</p>

            <button style={styles.button} onClick={submitSignup}>
              Create Account
            </button>

            <p style={styles.loginLink} onClick={() => window.location.href = "/student/login"}>
              Already have an account? Login
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(160deg, #020617, #1e3a8a)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    width: "100%",
    maxWidth: "520px",
    background: "rgba(15, 23, 42, 0.9)",
    padding: "30px",
    borderRadius: "16px",
    boxShadow: "0 10px 40px rgba(0,0,0,0.4)",
    color: "#fff",
  },
  brand: {
    textAlign: "center",
    fontSize: "32px",
    fontWeight: "800",
    marginBottom: "20px",
  },
  progress: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "25px",
  },
  step: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    border: "2px solid #64748b",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#64748b",
  },
  activeStep: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    background: "#3b82f6",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "700",
  },
  line: {
    width: "40px",
    height: "2px",
    background: "#64748b",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  input: {
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid #334155",
    background: "#020617",
    color: "#fff",
    outline: "none",
  },
  fileLabel: {
    fontSize: "14px",
    color: "#c7d2fe",
    marginTop: "10px",
  },
  button: {
    padding: "12px",
    borderRadius: "10px",
    background: "linear-gradient(90deg, #6366f1, #3b82f6)",
    border: "none",
    color: "#fff",
    fontWeight: "600",
    cursor: "pointer",
    marginTop: "10px",
  },
  loginLink: {
    textAlign: "center",
    marginTop: "10px",
    color: "#93c5fd",
    cursor: "pointer",
  },
};

export default StudentSignup;
