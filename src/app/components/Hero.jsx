import Link from "next/link";

const Hero = ({ title, subtitle, type }) => {
  return (
    <div
      className="hero h-[80vh] rounded-3xl"
      style={{
        backgroundImage: "url(/bgimg.jpg)",
        width: "100%",
        height: "80vh",
      }}
    >
      <div className="hero-overlay bg-opacity-60 rounded-3xl w-full"></div>
      <div className="hero-content text-neutral-content text-center w-full">
        <div className="-text-background w-full">
          <h1 className="mb-5 text-5xl font-bold w-full">{title}</h1>
          <p className="mb-5">{subtitle}</p>
          {type === "beranda" ? (
            <Link
              href="#job"
              className="btn bg-transparent -border-tertiary -text-quaternary hover:-border-tertiary hover:-bg-tertiary hover:-text-primary"
            >
              Lets, Go
            </Link>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
};

export default Hero;
