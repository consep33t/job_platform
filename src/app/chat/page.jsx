"use client";

import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import io from "socket.io-client";

// Inisialisasi koneksi socket
const socket = io("http://localhost:3000", {
  path: "/api/socket",
});

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [receiverId, setReceiverId] = useState(null);
  const [loading, setLoading] = useState(true);

  const userId = jwtDecode(localStorage.getItem("token")).userId;

  useEffect(() => {
    // Ambil riwayat chat dari server
    const fetchChatHistory = async () => {
      const response = await fetch(
        `/api/chat-history?sender_id=${userId}&receiver_id=${receiverId}`
      );
      const data = await response.json();
      if (data) {
        setMessages(data);
      }
      setLoading(false);
    };

    if (receiverId) {
      fetchChatHistory();
    }
  }, [receiverId, userId]);

  useEffect(() => {
    // Dengarkan pesan yang diterima
    socket.on(`receive_message_${userId}`, (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off(`receive_message_${userId}`);
    };
  }, [userId]);

  const sendMessage = () => {
    if (!newMessage.trim() || !receiverId) return;

    const messageData = {
      sender_id: userId,
      receiver_id: receiverId,
      pesan: newMessage,
    };

    socket.emit("send_message", messageData);
    setMessages((prev) => [...prev, messageData]);
    setNewMessage("");
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Real-Time Chat</h1>
      <div className="mb-4">
        <label htmlFor="receiver" className="block mb-2">
          Receiver ID:
        </label>
        <input
          type="number"
          id="receiver"
          value={receiverId || ""}
          onChange={(e) => setReceiverId(Number(e.target.value))}
          className="border p-2 rounded w-full"
        />
      </div>
      <div className="border p-4 h-64 overflow-y-scroll">
        {loading ? (
          <p>Loading chat history...</p>
        ) : (
          messages.map((msg, idx) => (
            <div
              key={idx}
              className={`mb-2 p-2 ${
                msg.sender_id === userId ? "text-right" : "text-left"
              }`}
            >
              <p className="text-sm">{msg.pesan}</p>
            </div>
          ))
        )}
      </div>
      <div className="mt-4">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="border p-2 rounded w-full mb-2"
          placeholder="Type your message..."
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white p-2 rounded w-full"
        >
          Send
        </button>
      </div>
    </div>
  );
}
