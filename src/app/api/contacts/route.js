import promisePool from "../../../../lib/db";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("user_id");

  try {
    const [rows] = await promisePool.query(
      `
      SELECT DISTINCT
        CASE
          WHEN sender_id = ? THEN receiver_id
          ELSE sender_id
        END AS contact_id
      FROM chat
      WHERE sender_id = ? OR receiver_id = ?
      `,
      [userId, userId, userId]
    );

    return new Response(JSON.stringify(rows), { status: 200 });
  } catch (error) {
    console.error("Error fetching contacts:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
