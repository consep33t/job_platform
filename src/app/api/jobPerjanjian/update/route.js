import promisePool from "../../../../../lib/db";

export async function POST(req) {
  try {
    const { perjanjianId, status } = await req.json();

    if (!perjanjianId || !status) {
      return new Response(JSON.stringify({ error: "Invalid input" }), {
        status: 400,
      });
    }

    const [result] = await promisePool.query(
      "UPDATE perjanjian SET status = ? WHERE perjanjian_id = ?",
      [status, perjanjianId]
    );

    if (result.affectedRows === 0) {
      return new Response(
        JSON.stringify({ error: "Failed to update or record not found" }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: "Status updated successfully" }),
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
