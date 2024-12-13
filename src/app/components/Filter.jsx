const Filter = ({ setCategory, setDuration }) => {
  const categories = [
    "Teknologi",
    "Design",
    "Pemasaran",
    "Manajemen",
    "Keuangan",
  ];

  const durations = [
    { value: "5", label: "5 hari" },
    { value: "10", label: "10 hari" },
    { value: "15", label: "15 hari" },
    { value: "20", label: "20 hari" },
    { value: "25", label: "25 hari" },
    { value: "30", label: "30 hari" },
  ];

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  const handleDurationChange = (e) => {
    setDuration(e.target.value);
  };

  return (
    <div className="flex gap-10">
      <select
        id="category"
        onChange={handleCategoryChange}
        className="select w-2/3 -bg-background"
      >
        <option value="">Pilih Kategori</option>
        {categories.map((category, index) => (
          <option key={index} value={category}>
            {category}
          </option>
        ))}
      </select>

      <select
        id="duration"
        onChange={handleDurationChange}
        className="select -bg-background w-1/3"
      >
        <option value="">Pilih Durasi</option>
        {durations.map((duration) => (
          <option key={duration.value} value={duration.value}>
            {duration.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Filter;
