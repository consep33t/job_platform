import { NextResponse } from "next/server";
import db from "../../../../../lib/db1";

export async function GET(req, { userId }) {
  const chats = await db.query(
    `
        SELECT chat_id, sender_id, receiver_id, pesan, sent_at, status_dibaca
        FROM chat
        WHERE sender_id = ? OR receiver_id = ?
        ORDER BY sent_at ASC
    `,
    [userId, userId]
  );

  return NextResponse.json(chats);
}
