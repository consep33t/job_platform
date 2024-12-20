"use client";
import { useState } from "react";
import { jwtDecode } from "jwt-decode";

const DropDown = () => {
  const [formData, setFormData] = useState({
    nama_pekerjaan: "",
    keterangan: "",
    kategori_pekerjaan: "",
    lama_waktu: "",
    creator_id: 1,
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");
  const decode = jwtDecode(token);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    try {
      const data = new FormData();
      data.append("nama_pekerjaan", formData.nama_pekerjaan);
      data.append("keterangan", formData.keterangan);
      data.append("kategori_pekerjaan", formData.kategori_pekerjaan);
      data.append("lama_waktu", formData.lama_waktu);
      data.append("creator_id", decode.userId);
      if (selectedFile) data.append("url_gambar", selectedFile);

      const response = await fetch("/api/jobs", {
        method: "POST",
        body: data,
      });

      if (response.ok) {
        setMessage("Pekerjaan berhasil diposting!");
        setFormData({
          nama_pekerjaan: "",
          keterangan: "",
          kategori_pekerjaan: "",
          lama_waktu: "",
          creator_id: "",
        });
        setSelectedFile(null);
        window.location.reload();
      } else {
        const errorData = await response.json();
        setMessage(`Gagal memposting pekerjaan: ${errorData.error}`);
      }
    } catch (error) {
      setMessage(`Terjadi kesalahan: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="collapse -bg-primary -text-secondary">
      <input type="checkbox" />
      <div className="collapse-title text-xl font-medium">
        Posting Pekerjaan.?
      </div>
      <div className="collapse-content">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-5 p-4 rounded-md"
        >
          <input
            type="text"
            name="nama_pekerjaan"
            value={formData.nama_pekerjaan}
            onChange={handleChange}
            placeholder="Judul Pekerjaan"
            className="input input-bordered -bg-background w-full"
            required
          />
          <textarea
            name="keterangan"
            maxLength={250}
            value={formData.keterangan}
            onChange={handleChange}
            placeholder="Deskripsi Pekerjaan max-200-karakter"
            className="textarea textarea-bordered -bg-background w-full"
            required
          />
          <select
            name="kategori_pekerjaan"
            value={formData.kategori_pekerjaan}
            onChange={handleChange}
            className="input input-bordered -bg-background w-full"
            required
          >
            <option value="" disabled>
              Pilih Kategori Pekerjaan
            </option>
            <option value="Teknologi">Teknologi</option>
            <option value="Design">Design</option>
            <option value="Pemasaran">Pemasaran</option>
            <option value="Manajemen">Manajemen</option>
            <option value="Keuangan">Keuangan</option>
          </select>
          <select
            name="lama_waktu"
            value={formData.lama_waktu}
            onChange={handleChange}
            className="input input-bordered -bg-background w-full"
            required
          >
            <option value="" disabled>
              Pilih Lama Waktu
            </option>
            <option value={5}>5 Hari</option>
            <option value={10}>10 Hari</option>
            <option value={15}>15 Hari</option>
            <option value={20}>20 Hari</option>
            <option value={25}>25 Hari</option>
            <option value={30}>30 Hari</option>
          </select>
          <input
            type="file"
            name="url_gambar"
            onChange={handleFileChange}
            className="file-input file-input-bordered -bg-background w-full"
            required
          />
          <button
            type="submit"
            className={`btn -bg-secondary bg-opacity-85 hover:bg-opacity-100 hover:-bg-secondary -border-secondary w-full text-white ${
              isSubmitting ? "loading" : ""
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Memposting..." : "Posting Pekerjaan"}
          </button>
          {message && <p className="text-accent mt-2">{message}</p>}
        </form>
      </div>
    </div>
  );
};

export default DropDown;
