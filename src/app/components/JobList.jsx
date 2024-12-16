import Image from "next/image";
import React, { useState } from "react";

const JobList = ({ jobs }) => {
  const [detailJob, setDetailJob] = useState([]);

  const handleApply = async (jobId, creatorId) => {
    try {
      const response = await fetch("/api/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jobId,
          token: localStorage.getItem("token"),
          creatorId,
        }),
      });

      if (response.ok) {
        alert("Lamaran berhasil dibuat!");
      } else {
        const error = await response.json();
        alert(`Gagal melamar: ${error.message}`);
      }
    } catch (error) {
      console.error("Error applying for the job:", error);
      alert("Terjadi kesalahan saat melamar pekerjaan.");
    }
  };

  const handleView = (job) => {
    setDetailJob(job);
    const modal = document.getElementById("my_modal_1");
    if (modal) modal.showModal();
  };

  const handleClose = () => {
    const modal = document.getElementById("my_modal_1");
    if (modal) modal.close();
  };

  return (
    <>
      {jobs.length === 0 ? (
        <p>Tidak ada pekerjaan yang tersedia.</p>
      ) : (
        jobs.map((job) => (
          <div
            key={job.job_id}
            className="card bg-base-100 image-full w-[550px] h-96 shadow-xl"
          >
            <figure>
              <Image
                width={400}
                height={400}
                src={`/api/files/${job.url_gambar}`}
                alt={job.nama_pekerjaan}
                className="w-full h-full object-cover"
              />
            </figure>
            <div className="card-body">
              <h2 className="card-title">{job.nama_pekerjaan}</h2>
              <p>{job.keterangan}</p>
              <div className="card-actions justify-end">
                <button
                  className="btn -bg-tertiary -text-primary -border-tertiary hover:-bg-background hover:-text-tertiary hover:-border-background"
                  onClick={() => handleApply(job.job_id, job.creator_id)}
                >
                  Buat Lamaran
                </button>
                <button
                  className="btn -bg-background -text-secondary -border-background hover:-bg-tertiary hover:-text-primary hover:-border-tertiary"
                  onClick={() => handleView(job)}
                >
                  Lihat
                </button>
              </div>
            </div>
          </div>
        ))
      )}

      {/* Modal */}
      <dialog id="my_modal_1" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">{detailJob.nama_pekerjaan}</h3>
          <p className="py-4">{detailJob.keterangan}</p>
          <div className="modal-action">
            <form method="dialog">
              <button
                onClick={handleClose}
                className="btn -bg-tertiary -text-primary -border-tertiary hover:-bg-background hover:-text-tertiary hover:-border-background"
              >
                Close
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default JobList;
