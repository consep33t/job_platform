"use client";

import { useState, useEffect } from "react";
import JobList from "./components/JobList";
import Filter from "./components/Filter";
import Hero from "./components/Hero";
import RecommendedJobList from "./components/RecommendedJobList";

const Home = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedDuration, setSelectedDuration] = useState("");
  const [recomendedJobs, setRecommendedJobs] = useState([]);

  useEffect(() => {
    const fetchRecommendedJobs = async () => {
      const response = await fetch("/api/recommendedJobs");
      const dataRecommendedJobs = await response.json();
      setRecommendedJobs(dataRecommendedJobs);
    };

    fetchRecommendedJobs();
  }, []);

  // Ambil data pekerjaan dari API
  useEffect(() => {
    const fetchJobs = async () => {
      const response = await fetch("/api/jobs");
      const data = await response.json();
      setJobs(data);
    };

    fetchJobs();
  }, []);

  useEffect(() => {
    let filtered = jobs;

    // Filter berdasarkan kategori
    if (selectedCategory) {
      filtered = filtered.filter(
        (job) => job.kategori_pekerjaan === selectedCategory
      );
    }

    // Filter berdasarkan durasi
    if (selectedDuration) {
      filtered = filtered.filter(
        (job) => job.lama_waktu === parseInt(selectedDuration)
      );
    }

    // Filter berdasarkan nama pekerjaan (search bar)
    if (searchQuery) {
      filtered = filtered.filter((job) =>
        job.nama_pekerjaan.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredJobs(filtered);
  }, [jobs, selectedCategory, selectedDuration, searchQuery]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="mb-40">
      <Hero
        title="Hello, Freelancer"
        subtitle="Temukan berbagai macam pekerjaan yang sesuia dengan minat dan
            kemampuan anda, Kami hadir untuk mempermudah anda dalam mecari
            pekerjaan paruh waktu berbasis jasa, ..!!"
        type="beranda"
      />
      <div className="mt-[10vh] w-full flex justify-between gap-10">
        <div className="w-2/5">
          <Filter
            setCategory={setSelectedCategory}
            setDuration={setSelectedDuration}
          />
        </div>

        <label className="w-full">
          <input
            type="text"
            placeholder="Cari pekerjaan..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="input input-bordered w-full -bg-background"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="h-4 w-4 opacity-70"
          ></svg>
        </label>
      </div>

      <div className="mt-10">
        <div
          id="job"
          className="flex -text-secondary flex-col gap-3 font-semibold mb-20"
        >
          <div className="flex gap-3">
            <h2 className="text-4xl">Temukan</h2>
            <h2 className="text-4xl -text-quaternary">Berbagai pekerjaan</h2>
          </div>
          <h2 className="text-4xl">
            Sesuai Dengan Keinginan Dan Kemampuan Kamu
          </h2>
        </div>
        <div className="flex w-full gap-5 flex-wrap">
          <JobList jobs={filteredJobs} />
        </div>
      </div>
      <div className="mt-20">
        <div className="flex -text-quaternary flex-col gap-3 font-semibold mb-20">
          <div className="flex gap-3">
            <h2 className="text-4xl">Masih Bingun.?</h2>
            <h2 className="text-4xl -text-secondary ">
              Kami Punya 3 Rekomendasi
            </h2>
          </div>
          <h2 className="text-4xl -text-tertiary">Pekerjanan Untuk Kamu</h2>
        </div>
        <div className="flex w-full gap-5 flex-wrap">
          <RecommendedJobList jobs={recomendedJobs} />
        </div>
      </div>
    </div>
  );
};

export default Home;
