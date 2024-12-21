import { NextResponse } from "next/server";
import db from "../../../../../lib/db1";

export async function POST(req) {
  const { chatId } = await req.json();

  await db.query("UPDATE chat SET status_dibaca = 1 WHERE chat_id = ?", [
    chatId,
  ]);

  return NextResponse.json({ success: true });
}
