"use client";

import { useState } from "react";

export default function RegisterPage() {
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const handleRegister = async () => {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nama, email, password, phone }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Gagal registrasi");
      }

      setMessage("Registrasi berhasil!");
    } catch (error) {
      console.error("Error:", error.message);
      setMessage(error.message);
    }
  };

  return (
    <div className="w-full h-screen flex flex-col justify-center items-center">
      <h1 className="text-4xl font-bold -text-quaternary mb-24">
        Silahkan Masukkan Data Diri Anda Untuk Register
      </h1>
      <div className="flex flex-col p-24 border rounded-lg">
        {message && <p className="my-4 -text-tertiary">{message}</p>}
        <input
          className="input input-bordered -bg-background mb-2"
          type="text"
          placeholder="Nama"
          value={nama}
          onChange={(e) => setNama(e.target.value)}
        />
        <input
          className="input input-bordered -bg-background mb-2"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="input input-bordered -bg-background mb-4"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          className="input input-bordered -bg-background mb-4"
          type="phone"
          placeholder="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <button
          className="btn -bg-tertiary -text-primary -border-tertiary hover:-bg-background hover:-text-tertiary hover:-border-background"
          onClick={handleRegister}
        >
          Register
        </button>
      </div>
    </div>
  );
}
