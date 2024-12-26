import mysql from "mysql2/promise";

// Gunakan pool untuk efisiensi koneksi
const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "consep33t",
  database: "job_platform",
});

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const senderId = searchParams.get("sender_id");
  const receiverId = searchParams.get("receiver_id");

  // Validasi input
  if (!senderId || !receiverId || isNaN(senderId) || isNaN(receiverId)) {
    return new Response("Invalid sender or receiver ID", { status: 400 });
  }

  try {
    const query = `
      SELECT * FROM chat 
      WHERE (sender_id = ? AND receiver_id = ?) 
      OR (sender_id = ? AND receiver_id = ?) 
      ORDER BY sent_at ASC
    `;
    const [rows] = await db.execute(query, [
      senderId,
      receiverId,
      receiverId,
      senderId,
    ]);

    return new Response(JSON.stringify(rows), { status: 200 });
  } catch (err) {
    console.error("Error fetching chat history:", err.message);
    return new Response("Error fetching chat history", { status: 500 });
  }
}
