"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation"; // ✅ Import here

export default function LoginPage() {
  const router = useRouter(); // ✅ Initialize router
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }), // ✅ Update key from 'username' to 'email'
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Login failed");
        return;
      }

      localStorage.setItem("token", data.token);
      setMessage("✅ Login successful!");

      // ✅ Redirect to dashboard
      router.push("/admin");

    } catch (error) {
      console.error(error);
      setMessage("❌ Something went wrong");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          <button
            type="submit"
            className="bg-black hover:bg-gray-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
          >
            Login
          </button>
        </form>

        {message && (
          <p className="text-center mt-4 text-sm text-gray-600">{message}</p>
        )}
      </div>
    </div>
  );
}
