// api/socket/route.js
export async function GET(req, res) {
  // Cukup mengembalikan respons bahwa WebSocket diatur di custom server
  res
    .status(404)
    .send("WebSocket server should be initialized in custom server.");
}
