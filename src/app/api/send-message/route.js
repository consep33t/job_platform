// src/app/api/send-message/route.js
import promisePool from "@/lib/db";

export async function POST(req) {
  const body = await req.json();
  const { sender_id, receiver_id, pesan } = body;

  try {
    const [result] = await promisePool.query(
      `
      INSERT INTO chat (sender_id, receiver_id, pesan, sent_at, status_dibaca)
      VALUES (?, ?, ?, NOW(), 0)
      `,
      [sender_id, receiver_id, pesan]
    );

    return new Response(
      JSON.stringify({
        chat_id: result.insertId,
        sender_id,
        receiver_id,
        pesan,
        sent_at: new Date().toISOString(),
        status_dibaca: 0,
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Error sending message:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
