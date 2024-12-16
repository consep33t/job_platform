import path from "path";
import fs from "fs/promises";

// Folder penyimpanan file (pastikan sesuai dengan lokasi file yang di-upload)
const uploadsDir = path.resolve("./uploads");

export async function GET(req, { params }) {
  try {
    // Tunggu `params` untuk di-*resolve*
    const { fileName } = await params;

    // Buat path lengkap ke file
    const filePath = path.join(uploadsDir, fileName);

    // Periksa apakah file ada
    try {
      await fs.access(filePath);
    } catch (err) {
      return new Response("File tidak ditemukan", { status: 404 });
    }

    // Kirim file sebagai respons
    const fileBuffer = await fs.readFile(filePath);
    return new Response(fileBuffer, {
      headers: {
        "Content-Type": "image/jpeg",
        "Cache-Control": "public, max-age=31536000",
      },
    });
  } catch (error) {
    console.error("Error in GET /api/files/[fileName]:", error);
    return new Response("Terjadi kesalahan pada server", { status: 500 });
  }
}
