import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function AdminLogin() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

const handleLogin = async (e) => {
  e.preventDefault();
  setError("");
  setLoading(true);

  try {
    const res = await axios.post(
      "https://yummy-cafe-menu-backend.onrender.com/admin/login",
      form,
      {
        headers: { "Content-Type": "application/json" }
      }
    );

    if (res.data.token) {
      localStorage.setItem("adminToken", res.data.token);
      navigate("/admin");
    }
  } catch (err) {
    setError(err.response?.data?.message || "Login failed");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0B1628] to-[#1e3358] p-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl p-8 border border-white/20"
      >
        <h2 className="text-2xl font-semibold text-white text-center mb-6">
          Admin Login
        </h2>

        {error && (
          <p className="text-red-400 text-sm mb-3 text-center">{error}</p>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label className="text-white text-sm">Username</label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 rounded-lg bg-white/20 text-white outline-none placeholder-white/60"
              placeholder="Enter username"
              required
            />
          </div>

          <div>
            <label className="text-white text-sm">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 rounded-lg bg-white/20 text-white outline-none placeholder-white/60"
              placeholder="Enter password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-4 w-full py-2 rounded-lg bg-[#A7744A] hover:bg-[#8e6340] text-white font-medium shadow-lg transition"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

export default AdminLogin;
