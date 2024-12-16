"use client";

import { useState } from "react";
import { jwtDecode } from "jwt-decode";

const Settings = () => {
  const [formData, setFormData] = useState({
    nama: "",
    semboyan: "",
    pekerjaan: "",
    phone: "",
    skils: "",
  });
  const [profileImage, setProfileImage] = useState(null);
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");
  const decode = jwtDecode(token);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e, type) => {
    if (type === "profile") {
      setProfileImage(e.target.files[0]);
    } else if (type === "background") {
      setBackgroundImage(e.target.files[0]);
    }
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

      if (profileImage) data.append("url_profile", profileImage);
      if (backgroundImage) data.append("background_profile", backgroundImage);

      const response = await fetch("/api/users/update", {
        method: "POST",
        body: data,
      });

      if (response.ok) {
        setMessage("Profil berhasil diperbarui!");
        setProfileImage(null);
        setBackgroundImage(null);
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
        required
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
        placeholder="Nomor Telepon"
        className="input input-bordered w-full -bg-background"
      />
      <input
        type="text"
        name="skils"
        value={formData.skils}
        onChange={handleChange}
        placeholder="Skils (pisahkan dengan koma, contoh: React,Node.js,MySQL)"
        className="input input-bordered w-full -bg-background"
      />
      <input
        type="file"
        onChange={(e) => handleFileChange(e, "profile")}
        className="file-input w-full -bg-background"
      />
      <input
        type="file"
        onChange={(e) => handleFileChange(e, "background")}
        className="file-input w-full -bg-background"
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
