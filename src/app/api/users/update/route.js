import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import promisePool from "../../../../../lib/db";
import path from "path";
import fs from "fs-extra";

const SECRET_KEY = "sangatrahasia123321";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const userId = formData.get("user_id");
    const nama = formData.get("nama");
    const semboyan = formData.get("semboyan");
    const pekerjaan = formData.get("pekerjaan");
    const skils = formData.get("skils");

    const urlProfileFile = formData.get("url_profile");
    const backgroundProfileFile = formData.get("background_profile");

    if (!userId || !nama) {
      return NextResponse.json(
        { error: "ID pengguna dan nama wajib diisi." },
        { status: 400 }
      );
    }

    const uploadsDir = path.resolve("./public/uploads");
    await fs.ensureDir(uploadsDir);

    let profilePath = null;
    let backgroundPath = null;

    if (urlProfileFile) {
      const profileFileName = `${Date.now()}-${urlProfileFile.name}`;
      const profileFilePath = path.join(uploadsDir, profileFileName);
      const profileBuffer = await urlProfileFile.arrayBuffer();
      await fs.writeFile(profileFilePath, Buffer.from(profileBuffer));
      profilePath = `/uploads/${profileFileName}`;
    }

    if (backgroundProfileFile) {
      const backgroundFileName = `${Date.now()}-${backgroundProfileFile.name}`;
      const backgroundFilePath = path.join(uploadsDir, backgroundFileName);
      const backgroundBuffer = await backgroundProfileFile.arrayBuffer();
      await fs.writeFile(backgroundFilePath, Buffer.from(backgroundBuffer));
      backgroundPath = `/uploads/${backgroundFileName}`;
    }

    const query = `
      UPDATE user 
      SET nama = ?, semboyan = ?, pekerjaan = ?, 
          skils = COALESCE(?, skils), 
          url_profile = COALESCE(?, url_profile), 
          background_profile = COALESCE(?, background_profile), 
          updated_at = NOW() 
      WHERE user_id = ?
    `;

    const params = [
      nama,
      semboyan,
      pekerjaan,
      skils ? JSON.stringify(JSON.parse(skils)) : null,
      profilePath,
      backgroundPath,
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
