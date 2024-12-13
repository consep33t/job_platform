"use client";

import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Gagal login");
      }

      localStorage.setItem("token", result.token);

      setMessage("Login berhasil!");
      window.location.href = "/";
    } catch (error) {
      console.error("Error:", error.message);
      setMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl mb-24 font-bold -text-quaternary">
        Silahkan Masukkan Akun Anda Untuk Login
      </h1>
      <div className="flex flex-col p-20 border rounded-lg gap-3">
        {message && <p className="my-4 -text-tertiary">{message}</p>}
        <input
          className="input input-bordered mb-2 -bg-background"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="input input-bordered mb-2 -bg-background"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className="btn -bg-tertiary -text-primary -border-tertiary hover:-bg-background hover:-text-tertiary hover:-border-background"
          onClick={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Login"}
        </button>
      </div>
    </div>
  );
}
