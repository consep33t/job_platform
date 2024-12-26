"use client";
import DropDown from "../components/DropDown";
import { useState, useEffect } from "react";
import TableRow from "../components/TableRow";
import { jwtDecode } from "jwt-decode";
import Settings from "../components/Settings";
import Image from "next/image";

const ProfilePage = () => {
  const [buttonType, setButtonType] = useState("riwayat-pekerjaan");
  const [user, setUser] = useState({});
  const [users, setUsers] = useState({});
  const [jobs, setJobs] = useState([]);
  const [perjanjian, setPerjanjian] = useState([]);
  const [perjanjianId, setPerjanjianId] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [jobPerjanjian, setJobPerjanjian] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [backgroundImage, setBackgroundImage] = useState(null);

  const handleDetailClick = (jobId) => {
    setSelectedJobId(selectedJobId === jobId ? null : jobId);
  };

  const updateStatus = async (perjanjianId, status) => {
    try {
      const response = await fetch("/api/jobPerjanjian/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ perjanjianId, status }),
      });

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      const data = await response.json();
      alert(data.message);
      window.location.reload();

      setJobPerjanjian((prevJobs) =>
        prevJobs.map((job) =>
          job.perjanjian_id === perjanjianId ? { ...job, status } : job
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const initializeData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setLoading(false);
          return;
        }

        const decodedUser = jwtDecode(token);
        setUser(decodedUser);

        const [
          userData,
          jobData,
          perjanjianData,
          perjanjianAcceptedData,
          jobPerjanjian,
        ] = await Promise.all([
          fetchAPI("/api/auth/me", token),
          fetchAPI(`/api/jobs?creator_id=${decodedUser.userId}`),
          fetchAPI(`/api/perjanjian?id_pelamar=${decodedUser.userId}`),
          fetchAPI(
            `/api/perjanjian?id_pelamar=${decodedUser.userId}&status=Accepted`
          ),
          fetchAPI(`/api/jobPerjanjian?pembuat_id=${decodedUser.userId}`),
        ]);

        setUsers(userData?.user || {});
        setJobs(jobData || []);
        setPerjanjian(perjanjianData || []);
        setPerjanjianId(perjanjianAcceptedData || []);
        setJobPerjanjian(jobPerjanjian || []);
      } catch (err) {
        setError(err.message || "Error loading data");
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, []);

  const fetchAPI = async (url, token) => {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await fetch(url, { headers });
    if (!response.ok) throw new Error("Failed to fetch data");
    return await response.json();
  };

  const handleFileChange = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const token = localStorage.getItem("token");
    if (!token) {
      alert("User not authenticated");
      return;
    }

    const decodedUser = jwtDecode(token);
    const userId = decodedUser.userId;

    const formData = new FormData();
    formData.append("user_id", userId);
    if (type === "update-url-profile") {
      formData.append("url_profile", file);
    } else {
      formData.append("background_profile", file);
    }

    try {
      const response = await fetch(`/api/users/${type}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const data = await response.json();
      if (type === "update-url-profile") setProfileImage(data.url);
      if (type === "update-background-profile") setBackgroundImage(data.url);

      alert("Image uploaded successfully!");
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Failed to upload image");
    }
  };

  const handleButtonClick = (type) => setButtonType(type);

  if (loading)
    return (
      <div className="text-center w-full h-screen flex justify-center items-center">
        <h1 className="text-3xl font-bold -text-quaternary">Loading...</h1>
      </div>
    );
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="w-full">
      {/* Header Section */}
      <div className="relative">
        <Image
          src={backgroundImage || users.background_profile || "/profile1.jpg"}
          height={400}
          width={400}
          className="w-full h-[50vh] rounded-xl object-cover"
          alt="Profile Cover"
        />
        <div className="absolute top-5 right-5">
          <label className="btn btn-ghost">
            Change Background
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFileChange(e, "update-background-profile")}
            />
          </label>
        </div>
      </div>

      {/* Content Section */}
      <div className="w-full mt-10 flex gap-10 my-10">
        {/* Profile Info */}
        <div className="w-1/3 -bg-background rounded-xl flex flex-col items-center p-10 gap-5">
          <div className="relative">
            <div className="avatar">
              <div className="w-36 rounded-full">
                <Image
                  src={profileImage || users.url_profile || "/profile1.jpg"}
                  width={400}
                  height={400}
                  alt="Avatar"
                />
              </div>
            </div>
            <label className="btn btn-ghost absolute">
              Edit
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileChange(e, "update-url-profile")}
              />
            </label>
          </div>
          <div>
            <h1 className="text-3xl font-bold -text-quaternary">
              {users.nama || "Nama Tidak Tersedia"}
            </h1>
            <h2 className="text-xl font-bold -text-tertiary">
              {users.pekerjaan || "tidak tersedia"}
            </h2>
          </div>
          <div className="w-full mt-10">
            <ul className="text-xl -text-secondary flex flex-col gap-5">
              <li>Nama: {users.nama || "Tidak Tersedia"}</li>
              <li>Semboyan: {users.semboyan || "Tidak Tersedia"}</li>
              <li>Skils: {users.skils || "Tidak Tersedia"}</li>
              <li>No. Telepon: {users.phone || "Tidak Tersedia"}</li>
              <li>Email: {users.email || "Tidak Tersedia"}</li>
            </ul>
          </div>
        </div>

        {/* Main Content */}
        <div className="w-2/3 rounded-xl flex flex-col gap-10">
          {/* Navigation Buttons */}
          <div className="w-full flex justify-center">
            <ul className="flex gap-5">
              {[
                "riwayat-pekerjaan",
                "pekerjaan",
                "notifikasi-pekerjaan",
                "pengaturan",
              ].map((type) => (
                <li key={type}>
                  <button
                    onClick={() => handleButtonClick(type)}
                    className={`btn -border-tertiary hover:-bg-tertiary hover:-text-primary ${
                      buttonType === type
                        ? "-bg-tertiary -text-primary"
                        : "-text-secondary -bg-primary"
                    }`}
                  >
                    {type.replace("-", " ").toUpperCase()}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Content based on buttonType */}
          <div className="w-full -bg-background rounded-xl p-10 flex flex-col gap-10">
            {buttonType === "riwayat-pekerjaan" ? (
              <div className="overflow-x-auto">
                <table className="table">
                  <thead>
                    <tr className="-text-secondary">
                      <th>Id</th>
                      <th>Nama Pekerjan</th>
                      <th>Nama Pembuat Pekerjaan</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {perjanjianId.map((perjanjian) => (
                      <TableRow
                        key={perjanjian.perjanjian_id}
                        perjanjian={perjanjian}
                        type="riwayat-pekerjaan"
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            ) : buttonType === "pekerjaan" ? (
              <>
                <DropDown />
                <div className="overflow-x-auto">
                  <h1 className="text-xl -text-quaternary my-5">
                    Pekerjaan yang anda buat
                  </h1>
                  <table className="table">
                    <thead>
                      <tr className="-text-secondary">
                        <th></th>
                        <th>Nama Pekerjan</th>
                        <th>Status</th>
                        <th>Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {jobs.map((job) => (
                        <TableRow
                          key={job.job_id}
                          jobs={job}
                          type="pekerjaan"
                        />
                      ))}
                    </tbody>
                  </table>
                  <h1 className="text-xl -text-quaternary my-5">
                    Detail pekerjaan yang anda buat dan sudah ada pelamar
                  </h1>
                  <table className="table">
                    <thead>
                      <tr className="-text-secondary">
                        <th>Nama Pekerjan</th>
                        <th>Deskripsi</th>
                        <th>Kategori</th>
                        <th>Lama - waktu / hari</th>
                        <th>Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {jobPerjanjian.map((job) => (
                        <TableRow
                          key={job.perjanjian_id}
                          jobs={job}
                          type="pekerjaan2"
                          onDetailClick={handleDetailClick}
                          isSelected={selectedJobId === job.perjanjian_id}
                        />
                      ))}
                    </tbody>
                  </table>

                  {/* Render detail view if a job is selected */}
                  {selectedJobId && (
                    <div className="mt-5">
                      <div className="overflow-x-auto">
                        <h1 className="text-xl -text-quaternary my-3">
                          Detail pelamar untuk pekerjaan ID: {selectedJobId}
                        </h1>
                        <table className="table">
                          <thead>
                            <tr className="-text-secondary">
                              <th>Nama Pekerjan</th>
                              <th>Deskripsi</th>
                              <th>Kategori</th>
                              <th>Lama - waktu / hari</th>
                              <th>Aksi</th>
                            </tr>
                          </thead>
                          <tbody>
                            {jobPerjanjian
                              .filter(
                                (job) => job.perjanjian_id === selectedJobId
                              )
                              .map((job) => (
                                <tr
                                  key={job.perjanjian_id}
                                  className="-text-secondary"
                                >
                                  <th>{job.nama_pelamar}</th>
                                  <td>{job.email_pelamar}</td>
                                  <td>{job.telepon_pelamar}</td>
                                  <td>{job.pekerjaan_pelamar}</td>
                                  <th>
                                    <button
                                      onClick={() =>
                                        updateStatus(selectedJobId, "Accepted")
                                      }
                                      className="btn btn-ghost btn-xs bg-green-500 hover:bg-green-600"
                                    >
                                      Accepted
                                    </button>
                                    <button
                                      onClick={() =>
                                        updateStatus(selectedJobId, "Rejected")
                                      }
                                      className="btn btn-ghost btn-xs bg-red-500 hover:bg-red-600"
                                    >
                                      Rejected
                                    </button>
                                  </th>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : buttonType === "notifikasi-pekerjaan" ? (
              <div className="overflow-x-auto">
                <table className="table">
                  <thead>
                    <tr className="-text-secondary">
                      <th>Id</th>
                      <th>Nama Pekerjan</th>
                      <th>Nama Pembuat</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {perjanjian.map((perjanjian) => (
                      <TableRow
                        key={perjanjian.perjanjian_id}
                        perjanjian={perjanjian}
                        type="notifikasi-pekerjaan"
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            ) : buttonType === "pengaturan" ? (
              <div>
                <>
                  <Settings user={users} />
                </>
              </div>
            ) : (
              "Tidak ada data"
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
