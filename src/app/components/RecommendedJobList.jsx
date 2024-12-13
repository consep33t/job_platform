import Image from "next/image";

const RecommendedJobList = ({ jobs }) => {
  return (
    <div className="card -bg-background w-[550px] shadow-xl">
      <figure>
        <Image
          width={600}
          height={600}
          src={jobs.url_gambar}
          alt={jobs.nama_pekerjaan}
        />
      </figure>
      <div className="card-body -text-secondary">
        <h2 className="card-title">{jobs.nama_pekerjaan}</h2>
        <p>{jobs.keterangan}</p>
        <div className="card-actions justify-end">
          <button className="btn -bg-background -text-secondary -border-background hover:-bg-tertiary hover:-text-primary hover:-border-tertiary">
            Hubungi
          </button>
          <button className="btn -bg-tertiary -text-primary -border-tertiary hover:-bg-background hover:-text-tertiary hover:-border-background">
            Lihat
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecommendedJobList;
