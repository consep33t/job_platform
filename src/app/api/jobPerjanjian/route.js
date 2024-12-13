import { NextResponse } from "next/server";
import promisePool from "../../../../lib/db";

export async function GET(request) {
  // Extract query parameters if needed
  const { searchParams } = new URL(request.url);
  const pembuatId = searchParams.get("pembuat_id");

  if (!pembuatId) {
    return NextResponse.json(
      { error: "pembuat_id is required" },
      { status: 400 }
    );
  }

  try {
    // Query the database
    const [rows] = await promisePool.query(
      `SELECT 
        perjanjian.perjanjian_id,
        perjanjian.job_id,
        job.nama_pekerjaan AS nama_job,
        job.keterangan AS deskripsi_job,
        job.kategori_pekerjaan AS kategori_job,
        job.lama_waktu AS lama_waktu_job,
        job.url_gambar AS gambar_job,
        user.user_id AS id_pelamar,
        user.nama AS nama_pelamar,
        user.email AS email_pelamar,
        user.pekerjaan AS pekerjaan_pelamar,
        user.phone AS telepon_pelamar,
        user.skils AS skill_pelamar,
        perjanjian.status AS status_perjanjian,
        perjanjian.created_at AS tanggal_dibuat_perjanjian
      FROM 
        perjanjian
      JOIN 
        job ON perjanjian.job_id = job.job_id
      JOIN 
        user ON perjanjian.pelamar_id = user.user_id
      WHERE 
        perjanjian.pembuat_id = ?`,
      [pembuatId]
    );

    // Return the result
    return NextResponse.json(rows);
  } catch (error) {
    console.error("Database query error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
