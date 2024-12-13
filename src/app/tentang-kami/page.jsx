import FisiMisi from "../components/FisiMisi";
import Hero from "../components/Hero";
import TeamList from "../components/TeamList";

const AboutPage = () => {
  const team = [
    {
      id: 1,
      name: "Asep Saipul Rahman",
      role: "Admin",
      hobby: "Catur dan Komik",
      image: "/a1.jpg",
    },
    {
      id: 2,
      name: "Silviana Syah Fitri",
      role: "Costumer Service",
      hobby: "Badminton",
      image: "/c1.jpg",
    },
    {
      id: 3,
      name: "Sintya Puspita",
      role: "Promosi",
      hobby: "Bernyanyi",
      image: "/c2.jpg",
    },
    {
      id: 4,
      name: "Yanti",
      role: "Content Writer",
      hobby: "Fishing",
      image: "/profile4.jpg",
    },
  ];

  return (
    <div className="flex flex-col w-full">
      <Hero
        title="Selamat datang di Lastron, platform terpercaya untuk menghubungkan penyedia jasa dengan pencari layanan di seluruh Indonesia!"
        subtitle="Di Lastron, kami percaya bahwa setiap keahlian memiliki nilai dan setiap kebutuhan memiliki solusi. Kami hadir untuk memudahkan Anda dalam mencari pekerjaan berbasis jasa atau memposting pekerjaan yang membutuhkan keahlian khusus. Dengan antarmuka yang ramah pengguna dan sistem yang transparan, kami menjembatani kesenjangan antara pelaku jasa dan pelanggan."
        type="about"
      />

      <FisiMisi />
      <p className="w-full text-center text-2xl font-extralight -text-secondary">
        Mari bersama kami, wujudkan peluang dan solusi tanpa batas.
      </p>
      <div className="flex my-20">
        <h2 className="text-4xl font-bold -text-quaternary">Team</h2>
        <h2 className="text-4xl font-bold -text-tertiary">Lasrton</h2>
      </div>
      <div className="flex w-full gap-5 flex-wrap mb-20">
        {team.map((member) => (
          <TeamList key={member.id} member={member} />
        ))}
      </div>
    </div>
  );
};

export default AboutPage;
