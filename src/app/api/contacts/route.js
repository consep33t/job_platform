import promisePool from "../../../../lib/db";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("user_id");

  if (!userId) {
    return new Response(JSON.stringify({ error: "user_id is required" }), {
      status: 400,
    });
  }

  try {
    const [rows] = await promisePool.query(
      `
      SELECT DISTINCT
        CASE
          WHEN c.sender_id = ? THEN c.receiver_id
          ELSE c.sender_id
        END AS contact_id,
        u.nama,
        u.email,
        u.url_profile
      FROM chat c
      JOIN user u
        ON u.user_id = CASE
                        WHEN c.sender_id = ? THEN c.receiver_id
                        ELSE c.sender_id
                      END
      WHERE c.sender_id = ? OR c.receiver_id = ?
      `,
      [userId, userId, userId, userId]
    );

    return new Response(JSON.stringify(rows), { status: 200 });
  } catch (error) {
    console.error("Error fetching contacts:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
