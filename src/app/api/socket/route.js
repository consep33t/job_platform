import { Server } from "socket.io";
import promisePool from "../../../../lib/db";

let io; // Simpan instance Socket.IO

const initializeSocket = (server) => {
  if (!io) {
    io = new Server(server, {
      path: "/api/socket",
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });

    io.on("connection", (socket) => {
      console.log("User connected:", socket.id);

      // User join ke room berdasarkan userId
      socket.on("join_room", (userId) => {
        if (userId) {
          socket.join(`user_${userId}`);
          console.log(`User ${userId} joined room user_${userId}`);
        }
      });

      // Mengirim pesan
      socket.on("send_message", async (data) => {
        const { sender_id, receiver_id, pesan } = data;

        try {
          const query = `
            INSERT INTO chat (sender_id, receiver_id, pesan, sent_at, status_dibaca) 
            VALUES (?, ?, ?, NOW(), 0)
          `;
          await promisePool.query(query, [sender_id, receiver_id, pesan]);

          // Kirim pesan ke penerima melalui room
          io.to(`user_${receiver_id}`).emit("receive_message", data);

          // Konfirmasi pengirim
          socket.emit("message_sent", data);
        } catch (err) {
          console.error("Error sending message:", err.message);
        }
      });

      socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
      });
    });
  }
  return io;
};

// Inisialisasi hanya sekali
export async function GET(req, res) {
  if (!res.socket.server.io) {
    console.log("Initializing Socket.IO...");
    initializeSocket(res.socket.server);
    res.socket.server.io = io;
  }
  res.end();
}
