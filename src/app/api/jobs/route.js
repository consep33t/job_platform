import promisePool from "../../../../lib/db";
import fs from "fs-extra";
import path from "path";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const creator_id = searchParams.get("creator_id");

    let query = "SELECT * FROM job";
    const params = [];

    if (creator_id) {
      query += " WHERE creator_id = ?";
      params.push(creator_id);
    }

    query += " ORDER BY created_at DESC";

    const [rows] = await promisePool.execute(query, params);

    return new Response(JSON.stringify(rows), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Database Error [GET]:", error.message);
    return new Response(
      JSON.stringify({ error: "Failed to fetch jobs", details: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export async function POST(req) {
  try {
    const formData = await req.formData();
    const nama_pekerjaan = formData.get("nama_pekerjaan");
    const keterangan = formData.get("keterangan");
    const kategori_pekerjaan = formData.get("kategori_pekerjaan");
    const lama_waktu = formData.get("lama_waktu");
    const creator_id = formData.get("creator_id");
    const file = formData.get("url_gambar");

    if (
      !nama_pekerjaan ||
      !keterangan ||
      !kategori_pekerjaan ||
      !lama_waktu ||
      !file
    ) {
      return new Response(
        JSON.stringify({ error: "Semua field wajib diisi!" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const uploadsDir = path.resolve("./public/uploads");
    await fs.ensureDir(uploadsDir);

    const fileName = `${Date.now()}-${file.name}`;
    const filePath = path.join(uploadsDir, fileName);

    const fileBuffer = await file.arrayBuffer();
    await fs.writeFile(filePath, Buffer.from(fileBuffer));

    const [result] = await promisePool.execute(
      `INSERT INTO job (nama_pekerjaan, keterangan, kategori_pekerjaan, lama_waktu, url_gambar, creator_id) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        nama_pekerjaan,
        keterangan,
        kategori_pekerjaan,
        parseInt(lama_waktu),
        `/uploads/${fileName}`,
        creator_id,
      ]
    );

    return new Response(
      JSON.stringify({ message: "Pekerjaan berhasil diposting!" }),
      {
        status: 201,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: "Terjadi kesalahan pada server" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
