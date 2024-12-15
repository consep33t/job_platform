import promisePool from "../../../../lib/db";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    const body = await req.json();
    const { jobId, token, creatorId } = body;

    if (!jobId || !token || !creatorId) {
      return new Response(
        JSON.stringify({ message: "Kamu Belom Login Silahkan Login Dulu" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return new Response(JSON.stringify({ message: "Token tidak valid" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const pelamarId = decoded.userId;

    if (!pelamarId) {
      return new Response(
        JSON.stringify({ message: "User ID tidak ditemukan dalam token" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const query = `INSERT INTO perjanjian (job_id, pembuat_id, pelamar_id, status, created_at) VALUES (?, ?, ?, ?, NOW())`;
    const values = [jobId, creatorId, pelamarId, "Pending"];

    await promisePool.query(query, values);

    return new Response(
      JSON.stringify({ message: "Lamaran berhasil dibuat" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error creating job application:", error);
    return new Response(
      JSON.stringify({ message: "Terjadi kesalahan pada server" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
