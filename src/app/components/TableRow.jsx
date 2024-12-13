const TableRow = ({ jobs, type, perjanjian, onDetailClick, isSelected }) => {
  return (
    <>
      {type === "pekerjaan" ? (
        <tr className="-text-secondary">
          <th>{jobs.jobs_id}</th>
          <td>{jobs.nama_pekerjaan}</td>
          <td>{jobs.kategori_pekerjaan}</td>
          <th>
            <button className="btn btn-ghost btn-xs">Detail</button>
          </th>
        </tr>
      ) : type === "pekerjaan2" ? (
        <tr className="-text-secondary">
          <th>{jobs.nama_job}</th>
          <td>{jobs.deskripsi_job}</td>
          <td>{jobs.kategori_job}</td>
          <td>{jobs.lama_waktu_job}</td>
          <th>
            <button
              onClick={() => onDetailClick(jobs.perjanjian_id)}
              className="btn btn-ghost btn-xs"
            >
              Detail
            </button>
          </th>
        </tr>
      ) : (
        <tr className="-text-secondary">
          <th>{perjanjian.perjanjian_id}</th>
          <td>{perjanjian.nama_pekerjaan}</td>
          <td>{perjanjian.nama_pembuat}</td>
          <th>
            <button className="btn btn-ghost btn-xs">
              {perjanjian.status}
            </button>
          </th>
        </tr>
      )}
    </>
  );
};

export default TableRow;
