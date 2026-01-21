import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";

const backgroundStyle = {
  background: "linear-gradient(135deg, #87a6e9, #1e40af)",
};

const RecruiterLogin = () => {
  const [loginData, setLoginData] = useState({
    emailOrUsername: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!loginData.emailOrUsername || !loginData.password) {
      alert("All fields are required");
      return;
    }

    localStorage.setItem(
      "recruiterLoginData",
      JSON.stringify(loginData)
    );

    navigate("/recruiter/verify");
  };

  return (
    <div style={backgroundStyle} className="min-h-screen flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md"
      >
        <h2 className="text-2xl text-center font-semibold mb-6">
          Recruiter Login
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            name="emailOrUsername"
            placeholder="Email or Username"
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md"
          />

          <button className="w-full bg-indigo-600 text-white py-2 rounded-md">
            Continue
          </button>
        </form>

        <p className="text-center mt-4 text-sm">
          New user?{" "}
          <Link to="/recruiter/signup" className="text-indigo-600">
            Sign up
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default RecruiterLogin;
