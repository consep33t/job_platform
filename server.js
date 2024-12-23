const { createServer } = require("http");
const next = require("next");
const { Server } = require("socket.io");
const mysql = require("mysql2/promise");

// Konfigurasi untuk Next.js
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

// Set up koneksi ke database
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

  // Inisialisasi Socket.IO
  const io = new Server(server, {
    path: "/api/socket",
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // Bergabung dengan room berdasarkan userId
    socket.on("join_room", (userId) => {
      if (userId) {
        socket.join(`user_${userId}`);
        console.log(`User ${userId} joined room user_${userId}`);
      }
    });

    // Menangani pengiriman pesan
    socket.on("send_message", async (data) => {
      const { sender_id, receiver_id, pesan } = data;
      try {
        const query = `
          INSERT INTO chat (sender_id, receiver_id, pesan, sent_at, status_dibaca)
          VALUES (?, ?, ?, NOW(), 0)
        `;
        await db.execute(query, [sender_id, receiver_id, pesan]);

        console.log(
          `Message sent from ${sender_id} to ${receiver_id}: ${pesan}`
        );

        // Emit pesan ke room penerima
        socket.to(`user_${receiver_id}`).emit("receive_message", data);

        // Emit konfirmasi ke pengirim
        socket.emit("message_sent", data);
      } catch (err) {
        console.error("Error inserting message:", err.message);
      }
    });

    // Menangani disconnect
    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  const PORT = process.env.PORT || 3000;
  server.listen(PORT, () => {
    console.log(`> Ready on http://localhost:${PORT}`);
  });
});
