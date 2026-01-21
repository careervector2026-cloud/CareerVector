import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

/* Background color – easy to change anytime */
const backgroundStyle = {
  background: "linear-gradient(135deg, #87a6e9, #1e40af)",
};

const RecruiterSignup = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.fullName ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("Please fill all required fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setError("");

    // Store data in localStorage
    localStorage.setItem(
      "recruiterSignupData",
      JSON.stringify(formData)
    );

    alert("Signup successful!");
  };

  return (
    <div
      style={backgroundStyle}
      className="min-h-screen flex items-center justify-center"
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative bg-white p-8 rounded-2xl shadow-xl w-full max-w-md"
      >
        {/* Soft glow behind card */}
        <div className="absolute inset-0 rounded-2xl bg-blue-400 opacity-20 blur-2xl -z-10"></div>

        <h2 className="text-2xl font-semibold text-gray-800 text-center">
          Recruiter Signup
        </h2>

        {/* Section divider */}
        <div className="h-1 w-12 bg-blue-600 rounded-full mx-auto my-4"></div>

        <p className="text-sm text-gray-500 text-center mb-6">
          Create your recruiter account to start hiring smarter
        </p>

        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md
            focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            outline-none transition-all duration-200"
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md
            focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            outline-none transition-all duration-200"
          />

          <input
            type="text"
            name="username"
            placeholder="Username (Optional)"
            value={formData.username}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md
            focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            outline-none transition-all duration-200"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md
            focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            outline-none transition-all duration-200"
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md
            focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            outline-none transition-all duration-200"
          />

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600
            text-white py-2 rounded-lg font-medium
            hover:from-blue-700 hover:to-indigo-700
            transition-all duration-300 shadow-md"
            type="submit"
          >
            Sign Up
          </motion.button>
        </form>

        <p className="text-sm text-center text-gray-600 mt-6">
          Already have an account?{" "}
          <Link
            to="/recruiter/login"
            className="text-blue-600 font-medium hover:underline"
          >
            Log in
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default RecruiterSignup;
