import { useState } from "react";
import { motion } from "framer-motion";

const backgroundStyle = {
  background: "linear-gradient(135deg, #2563eb, #1e40af)",
};

const RecruiterVerify = () => {
  const [code, setCode] = useState("");

  const handleVerify = () => {
    if (code !== "123456") {
      alert("Invalid verification code");
      return;
    }

    localStorage.setItem("recruiterVerified", "true");
    alert("Verification successful!");
  };

  return (
    <div style={backgroundStyle} className="min-h-screen flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md"
      >
        <h2 className="text-xl font-semibold text-center mb-4">
          Verify Your Account
        </h2>

        <p className="text-sm text-center mb-4">
          Enter the verification code sent to your email/mobile
        </p>

        <input
          placeholder="Enter code (123456)"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full px-4 py-2 border rounded-md mb-4"
        />

        <button
          onClick={handleVerify}
          className="w-full bg-indigo-600 text-white py-2 rounded-md"
        >
          Verify
        </button>
      </motion.div>
    </div>
  );
};

export default RecruiterVerify;
