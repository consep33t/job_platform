import Image from "next/image";

const KontakPage = () => {
  return (
    <div className="flex flex-col items-center w-full h-screen">
      <div className="flex justify-center items-center w-full">
        <div className="kontak-kami w-1/2 flex flex-col items-center">
          <div className="flex my-20 gap-5">
            <h2 className="text-4xl font-bold -text-quaternary">Kontak</h2>
            <h2 className="text-4xl font-bold -text-tertiary">Kami</h2>
          </div>
          <div className="kontak flex flex-col gap-5 -text-secondary">
            <div className="flex gap-5 items-center">
              <Image
                width={400}
                height={400}
                src="/phone-call.png"
                alt=""
                className="w-16 h-16"
              />
              <h2>+628 123 456 789</h2>
            </div>
            <div className="flex gap-5 items-center">
              <Image
                width={400}
                height={400}
                src="/whatsapp.png"
                alt=""
                className="w-16 h-16"
              />
              <h2>+628 123 456 789</h2>
            </div>
            <div className="flex gap-5 items-center">
              <Image
                width={400}
                height={400}
                src="/instagram.png"
                alt=""
                className="w-16 h-16"
              />
              <h2>Lastron_official</h2>
            </div>
            <div className="flex gap-5 items-center">
              <Image
                width={400}
                height={400}
                src="/mail.png"
                alt=""
                className="w-16 h-16"
              />
              <h2>lastron@gmail.com</h2>
            </div>
          </div>
        </div>
        <div className="saran-dan-masukan w-1/2 mb-28 flex flex-col items-center justify-center">
          <div className="flex my-20 gap-5">
            <h2 className="text-4xl font-bold -text-quaternary">Saran</h2>
            <h2 className="text-4xl font-bold -text-secondary">Dan</h2>
            <h2 className="text-4xl font-bold -text-tertiary">Masukan</h2>
          </div>
          <form className="flex flex-col gap-5 w-full px-40">
            <input
              type="text"
              placeholder="Nama"
              className="input w-full -bg-background"
            />
            <input
              type="text"
              placeholder="Email"
              className="input w-full -bg-background"
            />
            <textarea
              className="textarea w-full -bg-background"
              placeholder="Bio"
            ></textarea>
          </form>
        </div>
      </div>
      <h2 className="my-20 w-full text-center text-2xl font-extralight -text-secondary">
        Saran dan masukkan anda sangat berarti bagi kami untuk menuju lastron
        yang lebih baik
      </h2>
    </div>
  );
};

export default KontakPage;
