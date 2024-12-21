import { NextResponse } from "next/server";
import db from "../../../../../lib/db1";

export async function POST(req) {
  const { sender_id, receiver_id, pesan } = await req.json();

  // Validasi input
  if (!sender_id || !receiver_id || !pesan) {
    return NextResponse.json(
      {
        error: "Invalid data: sender_id, receiver_id, and pesan are required.",
      },
      { status: 400 }
    );
  }

  try {
    await db.query(
      "INSERT INTO chat (sender_id, receiver_id, pesan, sent_at, status_dibaca) VALUES (?, ?, ?, NOW(), 0)",
      [sender_id, receiver_id, pesan]
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
