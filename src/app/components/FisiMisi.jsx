import Image from "next/image";

const FisiMisi = () => {
  return (
    <div className="my-24 flex flex-col gap-10">
      <div className="hero max-h-xl">
        <div className="hero-content flex-col lg:flex-row">
          <Image
            width={400}
            height={400}
            alt="image"
            src="/visi.webp"
            className="max-w-sm rounded-lg shadow-2xl"
          />
          <div className="-text-tertiary">
            <h1 className="text-5xl font-bold -text-quaternary">Visi Kami</h1>
            <p className="py-6">
              Menjadi platform layanan berbasis jasa terkemuka yang memberikan
              dampak positif bagi komunitas dan meningkatkan produktivitas
              masyarakat. Di Lastron, kami berkomitmen untuk:
            </p>
            <li>
              Menyediakan pengalaman pencarian dan pemesanan jasa yang cepat dan
              efisien.
            </li>
            <li>
              Memberikan kemudahan bagi pelaku jasa dan pelanggan dalam
              berinteraksi dan menyelesaikan permasalahan.
            </li>
            <li>
              Membangun kepercayaan dan kesenjangan antara pelaku jasa dan
              pelanggan.
            </li>
          </div>
        </div>
      </div>
      <div className="hero min-h-xl">
        <div className="hero-content flex-col lg:flex-row-reverse">
          <Image
            width={400}
            height={400}
            alt="image"
            src="/misi.webp"
            className="max-w-sm rounded-lg shadow-2xl"
          />
          <div>
            <h1 className="text-5xl font-bold -text-quaternary">Misi Kami</h1>
            <p className="py-6 -text-tertiary">
              Menyediakan pengalaman pencarian dan pemesanan jasa yang cepat dan
              efisien. Memberikan kemudahan bagi pelaku jasa dan pelanggan dalam
              berinteraksi dan menyelesaikan permasalahan. Membangun kepercayaan
              dan kesenjangan antara pelaku jasa dan pelanggan.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FisiMisi;
