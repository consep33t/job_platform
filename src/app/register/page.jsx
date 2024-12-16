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
    <div className="w-full h-[90vh] flex items-center">
      <div className="flex flex-col p-24 border-2 w-1/2 h-4/5 rounded-lg">
        <h1 className="text-4xl mb-24 font-semibold text-center -text-secondary">
          Silahkan Masukkan Data Diri Anda Untuk Mendaftar
        </h1>
        {message && <p className="my-4 -text-tertiary">{message}</p>}
        <input
          className="input input-bordered -bg-background -text-secondary mb-2"
          type="text"
          placeholder="Nama"
          value={nama}
          onChange={(e) => setNama(e.target.value)}
        />
        <input
          className="input input-bordered -bg-background -text-secondary mb-2"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="input input-bordered -bg-background -text-secondary mb-2"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          className="input input-bordered -bg-background -text-secondary mb-4"
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
    </div>
  );
}
