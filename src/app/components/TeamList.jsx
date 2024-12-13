import Image from "next/image";

const TeamList = ({ member }) => {
  return (
    <div className="space-y-4">
      {member.length === 0 ? (
        <p>Tidak ada pekerjaan yang tersedia.</p>
      ) : (
        <div
          key={member.id}
          className="card bg-base-100 image-full w-[400px] h-96 shadow-xl"
        >
          <figure>
            <Image
              width={400}
              height={400}
              src={member.image}
              alt={member.name}
              className="w-full h-full object-cover"
            />
          </figure>
          <div className="card-body">
            <h2 className="card-title">{member.name}</h2>
            <p>{member.role}</p>
            <p>{member.hobby}</p>
            <div className="card-actions justify-end"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamList;
