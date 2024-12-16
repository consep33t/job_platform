import { NextResponse } from "next/server";
import promisePool from "../../../../../lib/db";
import path from "path";
import fs from "fs-extra";

export async function POST(req) {
  try {
    const formData = await req.formData();

    const userId = formData.get("user_id");
    const nama = formData.get("nama");
    const semboyan = formData.get("semboyan");
    const pekerjaan = formData.get("pekerjaan");
    const phone = formData.get("phone");
    const skils = formData.get("skils");

    const urlProfileFile = formData.get("url_profile");
    const backgroundProfileFile = formData.get("background_profile");

    // Validasi input wajib
    if (!userId) {
      return NextResponse.json(
        { error: "ID pengguna wajib diisi." },
        { status: 400 }
      );
    }

    // Direktori upload
    const uploadsDir = path.resolve("./uploads");
    await fs.ensureDir(uploadsDir);

    let profilePath = null;
    let backgroundPath = null;

    // Proses file profil
    if (urlProfileFile && urlProfileFile.name) {
      const profileFileName = `${Date.now()}-${urlProfileFile.name}`;
      const profileFilePath = path.join(uploadsDir, profileFileName);
      const profileBuffer = await urlProfileFile.arrayBuffer();
      await fs.writeFile(profileFilePath, Buffer.from(profileBuffer));
      profilePath = `/api/files/${profileFileName}`;
    }

    // Proses file background profil
    if (backgroundProfileFile && backgroundProfileFile.name) {
      const backgroundFileName = `${Date.now()}-${backgroundProfileFile.name}`;
      const backgroundFilePath = path.join(uploadsDir, backgroundFileName);
      const backgroundBuffer = await backgroundProfileFile.arrayBuffer();
      await fs.writeFile(backgroundFilePath, Buffer.from(backgroundBuffer));
      backgroundPath = `/api/files/${backgroundFileName}`;
    }

    // Ambil data pengguna saat ini
    const [currentData] = await promisePool.query(
      "SELECT nama, semboyan, pekerjaan, phone, skils, url_profile, background_profile FROM user WHERE user_id = ?",
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
          url_profile = ?, 
          background_profile = ?, 
          updated_at = NOW() 
      WHERE user_id = ?
    `;

    const params = [
      nama || existingData.nama,
      semboyan || existingData.semboyan,
      pekerjaan || existingData.pekerjaan,
      phone || existingData.phone,
      skils ? JSON.stringify(JSON.parse(skils)) : existingData.skils,
      profilePath || existingData.url_profile,
      backgroundPath || existingData.background_profile,
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
