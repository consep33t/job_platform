import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import promisePool from "../../../../../lib/db";

const SECRET_KEY = "sangatrahasia123321";

export async function GET(req) {
  try {
    const token = req.headers.get("Authorization")?.split(" ")[1];

    if (!token) {
      return NextResponse.json(
        { error: "Token tidak ditemukan" },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, SECRET_KEY);
    const userId = decoded.userId;

    const [users] = await promisePool.execute(
      "SELECT * FROM user WHERE user_id = ?",
      [userId]
    );

    if (users.length === 0) {
      return NextResponse.json(
        { error: "Pengguna tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({ user: users[0] }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Token tidak valid" }, { status: 401 });
  }
}
