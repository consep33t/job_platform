import { NextResponse } from "next/server";
import promisePool from "../../../../../lib/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET;

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email dan password wajib diisi!" },
        { status: 400 }
      );
    }

    const [users] = await promisePool.execute(
      `SELECT * FROM user WHERE email = ?`,
      [email]
    );

    if (users.length === 0) {
      return NextResponse.json(
        { message: "Email atau password salah" },
        { status: 401 }
      );
    }

    const user = users[0];

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Email atau password salah" },
        { status: 401 }
      );
    }

    const token = jwt.sign(
      {
        userId: user.user_id,
        email: user.email,
        nama: user.nama,
        semboyan: user.semboyan,
        pekerjaan: user.pekerjaan,
        phone: user.phone,
        skils: user.skils,
      },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    return NextResponse.json(
      {
        message:
          "Selamat Datan Di Lastron Di Mana Kamu Bisa Menemukan Pekerjaan Sesuai Keinginan Kamu!",
        token,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error [LOGIN]:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan pada server" },
      { status: 500 }
    );
  }
}
