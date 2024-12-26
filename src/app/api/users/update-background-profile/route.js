import { NextResponse } from "next/server";
import promisePool from "../../../../../lib/db";
import { handleFileUpload } from "../helpers/fileUpload";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const userId = formData.get("user_id");
    const backgroundProfileFile = formData.get("background_profile");

    if (!userId) {
      return NextResponse.json(
        { error: "ID pengguna wajib diisi." },
        { status: 400 }
      );
    }

    const backgroundPath = await handleFileUpload(backgroundProfileFile);

    if (!backgroundPath) {
      return NextResponse.json(
        { error: "File background tidak valid." },
        { status: 400 }
      );
    }

    await promisePool.execute(
      `UPDATE user SET background_profile = ?, updated_at = NOW() WHERE user_id = ?`,
      [backgroundPath, userId]
    );

    return NextResponse.json(
      { message: "Background profil berhasil diperbarui." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error [UPDATE BACKGROUND PROFILE]:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan pada server." },
      { status: 500 }
    );
  }
}
