"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Cookies from "@/node_modules/@types/js-cookie";

export default function App() {
  
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    password2: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (
      !formData.email ||
      !formData.password ||
      (!isLogin && !formData.username)
    ) {
      setError("Tous les champs sont requis.");
      toast.error(error);
      return;
    }

    if (!isLogin && formData.password !== formData.password2) {
      setError("Les mots de passe ne correspondent pas.");
      toast.warn(error);
      return;
    }

    try {
      const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      Cookies.set("token", data.token, { expires: 24, secure: true });

      toast.success(data.message);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
        toast.error(err.message);
      }
    }
  };

  useEffect(() => {
    setFormData({ username: "", email: "", password: "", password2: "" });
  }, [isLogin]);

  return (
    <div className="flex items-center justify-center min-h-screen p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-gray-900 shadow-lg rounded-2xl p-8 w-full max-w-md text-center"
      >
        <h2 className="text-xl font-bold text-blue-400 uppercase">
          {isLogin ? "Welcome back" : "Create new account"}
        </h2>

        <motion.form
          key={isLogin ? "login" : "register"}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.5 }}
          className="mt-6 flex flex-col gap-4"
          onSubmit={handleSubmit}
        >
          {!isLogin && (
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              className="p-3 rounded-lg bg-gray-700 text-white w-full focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          )}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="p-3 rounded-lg bg-gray-700 text-white w-full focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="p-3 rounded-lg bg-gray-700 text-white w-full focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          {!isLogin && (
            <input
              type="password"
              name="password2"
              placeholder="Confirm Password"
              value={formData.password2}
              onChange={handleChange}
              className="p-3 rounded-lg bg-gray-700 text-white w-full focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          )}

          <button
            type="submit"
            className="bg-blue-500 text-gray-900 font-bold py-2 px-4 rounded-lg hover:bg-blue-300 transition"
          >
            {isLogin ? "Login" : "Register"}
          </button>
        </motion.form>

        <button
          onClick={() => setIsLogin(!isLogin)}
          className="mt-4 text-blue-300 hover:underline"
        >
          {isLogin ? "Create account" : "Already have an account?"}
        </button>
      </motion.div>
    </div>
  );
}
