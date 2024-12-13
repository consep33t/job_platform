import { NextResponse } from "next/server";
import promisePool from "../../../../lib/db";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const pelamarId = searchParams.get("id_pelamar");
  const status = searchParams.get("status");

  try {
    // Dasar query
    let query = `
      SELECT 
        p.perjanjian_id, 
        j.nama_pekerjaan, 
        u1.nama AS nama_pembuat, 
        u2.nama AS nama_pelamar, 
        p.status
      FROM PERJANJIAN p
      JOIN JOB j ON p.job_id = j.job_id
      JOIN USER u1 ON p.pembuat_id = u1.user_id
      JOIN USER u2 ON p.pelamar_id = u2.user_id
    `;

    // Menambah kondisi filter secara dinamis
    const filters = [];
    const values = [];

    if (pelamarId) {
      filters.push("p.pelamar_id = ?");
      values.push(pelamarId);
    }

    if (status) {
      filters.push("p.status = ?");
      values.push(status);
    }

    if (filters.length > 0) {
      query += ` WHERE ${filters.join(" AND ")}`;
    }

    // Eksekusi query dengan filter
    const [rows] = await promisePool.execute(query, values);
    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
