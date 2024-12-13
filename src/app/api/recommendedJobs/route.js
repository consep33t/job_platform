import promisePool from "../../../../lib/db";

export async function GET() {
  try {
    const [rows] = await promisePool.execute(
      "SELECT * FROM job ORDER BY RAND() LIMIT 3"
    );
    return new Response(JSON.stringify(rows), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Database Error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
