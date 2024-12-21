import { Server } from "socket.io";
import { createConnection } from "mysql2/promise";

let io;

const db = createConnection({
  host: "localhost",
  user: "root",
  password: "consep33t",
  database: "job_platform",
});

const initializeSocket = (server) => {
  if (!io) {
    io = new Server(server, {
      path: "/api/socket",
      cors: {
        origin: "*", // Set domain Anda jika diperlukan
        methods: ["GET", "POST"],
      },
    });

    io.on("connection", (socket) => {
      console.log("User connected:", socket.id);

      socket.on("send_message", async (data) => {
        const { sender_id, receiver_id, pesan } = data;
        const query = `INSERT INTO chat (sender_id, receiver_id, pesan) VALUES (?, ?, ?)`;
        await db.execute(query, [sender_id, receiver_id, pesan]);

        io.emit(`receive_message_${receiver_id}`, data);
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
