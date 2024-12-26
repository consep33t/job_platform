"use client";

import { useState } from "react";
import { jwtDecode } from "jwt-decode";

const Settings = ({ user }) => {
  const [formData, setFormData] = useState({
    nama: user.nama || "",
    semboyan: user.semboyan || "",
    pekerjaan: user.pekerjaan || "",
    phone: user.phone || "",
    skils: Array.isArray(user.skils) ? user.skils.join(",") : user.skils || "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");
  const decode = jwtDecode(token);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    try {
      const data = new FormData();
      data.append("nama", formData.nama);
      data.append("semboyan", formData.semboyan);
      data.append("pekerjaan", formData.pekerjaan);
      data.append("phone", formData.phone);
      data.append("skils", JSON.stringify(formData.skils.split(",")));
      data.append("user_id", decode.userId);

      const response = await fetch("/api/users/update", {
        method: "POST",
        body: data,
      });

      if (response.ok) {
        setMessage("Profil berhasil diperbarui!");
        setFormData((prev) => ({ ...prev, skils: "" }));
        window.location.reload();
      } else {
        const errorData = await response.json();
        setMessage(`Gagal memperbarui profil: ${errorData.error}`);
      }
    } catch (error) {
      setMessage(`Terjadi kesalahan: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-5 -bg-primary p-5 rounded-md"
    >
      <input
        type="text"
        name="nama"
        value={formData.nama}
        onChange={handleChange}
        placeholder="Nama"
        className="input input-bordered w-full -bg-background"
      />
      <input
        type="text"
        name="semboyan"
        value={formData.semboyan}
        onChange={handleChange}
        placeholder="Semboyan"
        className="input input-bordered w-full -bg-background"
      />
      <input
        type="text"
        name="pekerjaan"
        value={formData.pekerjaan}
        onChange={handleChange}
        placeholder="Pekerjaan"
        className="input input-bordered w-full -bg-background"
      />
      <input
        type="phone"
        name="phone"
        value={formData.phone}
        onChange={handleChange}
        placeholder="Phone"
        className="input input-bordered w-full -bg-background"
      />
      <input
        type="text"
        name="skils"
        value={formData.skils}
        onChange={handleChange}
        placeholder="Skils"
        className="input input-bordered w-full -bg-background"
      />
      <button
        type="submit"
        className={`btn -bg-secondary bg-opacity-85 hover:bg-opacity-100 hover:-bg-secondary -border-secondary w-full text-white ${
          isSubmitting ? "loading" : ""
        }`}
        disabled={isSubmitting}
      >
        {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
      </button>
      {message && <p className="text-accent mt-2">{message}</p>}
    </form>
  );
};

export default Settings;
