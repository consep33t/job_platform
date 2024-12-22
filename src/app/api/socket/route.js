import promisePool from "@/lib/db";
import { Server } from "socket.io";

let io;

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

      socket.on("send_message", async (data) => {
        const { sender_id, receiver_id, pesan } = data;

        try {
          const query = `INSERT INTO chat (sender_id, receiver_id, pesan, sent_at, status_dibaca) VALUES (?, ?, ?, NOW(), 0)`;
          await promisePool.query(query, [sender_id, receiver_id, pesan]);

          // Emit ke penerima
          io.emit(`receive_message_${receiver_id}`, data);
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

export async function GET(req, res) {
  if (!res.socket.server.io) {
    console.log("Initializing Socket.IO...");
    initializeSocket(res.socket.server);
    res.socket.server.io = io;
  }
  res.end();
}
