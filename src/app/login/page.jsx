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
    <div className="w-full h-[90vh] flex items-center">
      <div className="-bg-tertiary w-1/2 h-4/5 rounded-lg p-24 flex flex-col justify-between">
        <div>
          <h1 className="text-6xl">Hello,</h1>
          <h1 className="text-6xl">Workers Lastron</h1>
        </div>
        <p className="capitalize text-2xl">
          Di lastron kamu bisa mencari berbagai macam pekerjaan yang beragam dan
          sesuia dengan kemampuan dan minat kamu, ayo bergabung bersama kami
          untuk mencari pekerjaan yang mudah dan menyenangkan
        </p>
        <p>© 2024 Lastron, All Rights Reserved</p>
      </div>
      <div className="flex flex-col p-20 border-2 rounded-lg gap-3 w-1/2 h-4/5 justify-center">
        <h1 className="text-4xl mb-24 font-semibold text-center -text-secondary">
          Silahkan Masukkan Akun Anda Untuk Login
        </h1>
        {message && <p className="my-4 -text-tertiary">{message}</p>}
        <input
          className="input input-bordered mb-2 -bg-background -text-secondary"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="input input-bordered mb-2 -bg-background -text-secondary"
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
          {isLoading ? <p>Loading</p> : <p>Login</p>}
        </button>
      </div>
    </div>
  );
}
