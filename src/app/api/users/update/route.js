import { NextResponse } from "next/server";
import promisePool from "../../../../../lib/db";

export async function POST(req) {
  try {
    const formData = await req.formData();

    const userId = formData.get("user_id");
    const nama = formData.get("nama");
    const semboyan = formData.get("semboyan");
    const pekerjaan = formData.get("pekerjaan");
    const phone = formData.get("phone");
    const skils = formData.get("skils");

    // Validasi input wajib
    if (!userId) {
      return NextResponse.json(
        { error: "ID pengguna wajib diisi." },
        { status: 400 }
      );
    }

    // Ambil data pengguna saat ini
    const [currentData] = await promisePool.query(
      "SELECT nama, semboyan, pekerjaan, phone, skils FROM user WHERE user_id = ?",
      [userId]
    );

    if (!currentData || currentData.length === 0) {
      return NextResponse.json(
        { error: "Pengguna tidak ditemukan." },
        { status: 404 }
      );
    }

    const existingData = currentData[0];

    // Query update data pengguna
    const query = `
      UPDATE user 
      SET nama = ?, 
          semboyan = ?, 
          pekerjaan = ?, 
          phone = ?,
          skils = ?, 
          updated_at = NOW() 
      WHERE user_id = ?
    `;

    const params = [
      nama || existingData.nama,
      semboyan || existingData.semboyan,
      pekerjaan || existingData.pekerjaan,
      phone || existingData.phone,
      skils ? JSON.stringify(JSON.parse(skils)) : existingData.skils,
      userId,
    ];

    await promisePool.execute(query, params);

    return NextResponse.json(
      { message: "Profil berhasil diperbarui." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error [UPDATE PROFILE]:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan pada server." },
      { status: 500 }
    );
  }
}
