const { createServer } = require("http");
const next = require("next");
const { Server } = require("socket.io");
const mysql = require("mysql2/promise");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "consep33t",
  database: "job_platform",
});

app.prepare().then(() => {
  const server = createServer((req, res) => {
    handle(req, res);
  });

  const io = new Server(server, {
    path: "/api/socket",
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("send_message", async (data) => {
      const { sender_id, receiver_id, pesan } = data;

      try {
        const query = `INSERT INTO chat (sender_id, receiver_id, pesan) VALUES (?, ?, ?)`;
        await db.execute(query, [sender_id, receiver_id, pesan]);

        console.log(
          `Message sent from ${sender_id} to ${receiver_id}: ${pesan}`
        );

        // Emit to the receiver
        io.emit(`receive_message_${receiver_id}`, data);
      } catch (err) {
        console.error("Error inserting message:", err.message);
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  const PORT = process.env.PORT || 3000;
  server.listen(PORT, () => {
    console.log(`> Ready on http://localhost:${PORT}`);
  });
});
