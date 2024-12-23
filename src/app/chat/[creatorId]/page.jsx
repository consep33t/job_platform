"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import io from "socket.io-client";
import { usePathname } from "next/navigation";
import { jwtDecode } from "jwt-decode";

// Inisialisasi koneksi socket
const socket = io(
  process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3000",
  {
    path: "/api/socket",
  }
);

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [receiverId, setReceiverId] = useState(null);
  const [userId, setUserId] = useState(null);
  const [contacts, setContacts] = useState([]);
  const messagesEndRef = useRef(null);

  const pathname = usePathname();

  // Ambil userId dari URL path
  useEffect(() => {
    const creatorIdFromPath = pathname.split("/")[2];
    if (creatorIdFromPath) {
      setReceiverId(creatorIdFromPath);
    }
  }, [pathname]);

  // Decode JWT dan join room
  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const decoded = jwtDecode(token);
          setUserId(decoded.userId);
          socket.emit("join_room", decoded.userId); // Join room saat login
        } catch (err) {
          console.error("Failed to decode JWT:", err.message);
        }
      }
    }
  }, []);

  // Fetch chat history
  useEffect(() => {
    const fetchChatHistory = async () => {
      if (!receiverId || !userId) return;

      try {
        const response = await fetch(
          `/api/chat-history?sender_id=${userId}&receiver_id=${receiverId}`
        );

        if (response.ok) {
          const data = await response.json();
          setMessages(data || []);
        } else {
          console.error("Failed to fetch chat history");
        }
      } catch (err) {
        console.error("Error fetching chat history:", err.message);
      }
    };

    fetchChatHistory();
  }, [receiverId, userId]);

  // Fetch kontak
  useEffect(() => {
    const fetchContacts = async () => {
      if (!userId) return;

      try {
        const response = await fetch(`/api/contacts?user_id=${userId}`);
        if (response.ok) {
          const data = await response.json();
          setContacts(data);
        } else {
          console.error("Failed to fetch contacts");
        }
      } catch (err) {
        console.error("Error fetching contacts:", err.message);
      }
    };

    fetchContacts();
  }, [userId]);

  // Terima pesan real-time
  useEffect(() => {
    socket.on("receive_message", (data) => {
      if (
        (data.sender_id === receiverId && data.receiver_id === userId) ||
        (data.sender_id === userId && data.receiver_id === receiverId)
      ) {
        setMessages((prev) => [...prev, data]);
      }
    });

    return () => {
      socket.off("receive_message");
    };
  }, [receiverId, userId]);

  // Kirim pesan
  const sendMessage = useCallback(() => {
    if (!newMessage.trim() || !receiverId) return;

    const messageData = {
      sender_id: userId,
      receiver_id: receiverId,
      pesan: newMessage.trim(),
    };

    socket.emit("send_message", messageData);
    setMessages((prev) => [...prev, messageData]);
    setNewMessage("");
  }, [newMessage, receiverId, userId]);

  // Scroll otomatis ke bawah
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="p-4 w-full h-full">
      <h1 className="text-2xl mb-4">Real-Time Chat</h1>

      <div className="mb-4">
        <h2 className="text-xl mb-2">Contacts</h2>
        <div className="space-y-2">
          {contacts.length > 0 ? (
            contacts.map((contact) => (
              <div
                key={contact.contact_id}
                className={`p-2 border rounded cursor-pointer hover:bg-gray-200 ${
                  contact.contact_id === receiverId ? "bg-blue-100" : ""
                }`}
                onClick={() => setReceiverId(contact.contact_id)}
              >
                Contact ID: {contact.contact_id}
              </div>
            ))
          ) : (
            <p>No contacts available.</p>
          )}
        </div>
      </div>

      {receiverId === null ? (
        <p>Select a contact to start chatting</p>
      ) : (
        <div className="border p-4 h-64 overflow-y-scroll">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`mb-2 p-2 ${
                msg.sender_id === userId ? "text-right" : "text-left"
              }`}
            >
              <p className="text-sm">{msg.pesan}</p>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      )}

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
