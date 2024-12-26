import { NextResponse } from "next/server";
import promisePool from "../../../../../lib/db";
import { handleFileUpload } from "../helpers/fileUpload";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const userId = formData.get("user_id");
    const urlProfileFile = formData.get("url_profile");

    if (!userId) {
      return NextResponse.json(
        { error: "ID pengguna wajib diisi." },
        { status: 400 }
      );
    }

    const profilePath = await handleFileUpload(urlProfileFile);

    if (!profilePath) {
      return NextResponse.json(
        { error: "File profil tidak valid." },
        { status: 400 }
      );
    }

    await promisePool.execute(
      `UPDATE user SET url_profile = ?, updated_at = NOW() WHERE user_id = ?`,
      [profilePath, userId]
    );

    return NextResponse.json(
      { message: "Foto profil berhasil diperbarui." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error [UPDATE URL PROFILE]:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan pada server." },
      { status: 500 }
    );
  }
}
