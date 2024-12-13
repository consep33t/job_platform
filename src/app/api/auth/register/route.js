import { NextResponse } from "next/server";
import promisePool from "../../../../../lib/db";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const body = await req.json();
    const { nama, email, password, phone } = body;

    // Validasi input
    if (!nama || !email || !password || !phone) {
      return NextResponse.json(
        { error: "Semua field wajib diisi!" },
        { status: 400 }
      );
    }

    // Hash password sebelum disimpan
    const hashedPassword = await bcrypt.hash(password, 10);

    // Simpan ke database
    const [result] = await promisePool.execute(
      `INSERT INTO user (nama, email, password, phone) VALUES (?, ?, ?, ?)`,
      [nama, email, hashedPassword, phone]
    );

    return NextResponse.json(
      { message: "Registrasi berhasil!", userId: result.insertId },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error [REGISTER]:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan pada server" },
      { status: 500 }
    );
  }
}
