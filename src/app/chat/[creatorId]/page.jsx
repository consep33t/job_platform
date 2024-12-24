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

  // Ambil receiverId dari URL path
  useEffect(() => {
    const creatorIdFromPath = pathname.split("/")[2];
    if (creatorIdFromPath) {
      setReceiverId(creatorIdFromPath);
    }
  }, [pathname]);

  // Decode JWT dan bergabung ke room Socket.IO
  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const decoded = jwtDecode(token);
          setUserId(decoded.userId);
          socket.emit("join_room", decoded.userId);
        } catch (err) {
          console.error("Failed to decode JWT:", err.message);
        }
      }
    }
  }, []);

  // Ambil riwayat chat
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

  // Ambil kontak
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

  // Terima pesan secara real-time
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

  // Scroll otomatis ke bawah saat ada pesan baru
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="w-full h-[75vh] mb-20 -bg-secondary rounded-md flex flex-col">
      <div className="w-full h-full flex">
        {/* Sidebar */}
        <div className="h-full w-1/4 flex flex-col p-5 border-r border-black">
          <h1 className="text-2xl pb-5">Pesan Chat Lastron</h1>
          <input
            type="text"
            placeholder="Search contacts..."
            className="outline-none border-none focus:outline-none p-2 rounded w-full mb-5 -bg-primary bg-opacity-15 text-white"
          />
          <div className="space-y-2 overflow-y-auto">
            {contacts.length > 0 ? (
              contacts.map((contact) => (
                <>
                  <div
                    key={contact.contact_id}
                    className={`p-3 rounded cursor-pointer flex items-center gap-5
                    ${
                      contact.contact_id === receiverId
                        ? "-bg-primary bg-opacity-15"
                        : ""
                    } 
                      hover:-bg-primary hover:bg-opacity-15`}
                    onClick={() => setReceiverId(contact.contact_id)}
                  >
                    <div className="avatar">
                      <div className="w-16 rounded-full">
                        <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                      </div>
                    </div>
                    Contact ID: {contact.contact_id}
                  </div>
                </>
              ))
            ) : (
              <p>No contacts available.</p>
            )}
          </div>
        </div>

        {/* Chat Window */}
        <div className="w-full h-full flex flex-col pt-3 pr-5">
          <div className="pb-3 px-5 w-full flex items-center gap-5">
            <div className="avatar">
              <div className="w-12 rounded-full">
                <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
              </div>
            </div>
            anjayy
          </div>
          {receiverId === null ? (
            <p>Select a contact to start chatting</p>
          ) : (
            <div className="flex-grow bg-[url(/bgChat2.jpg)] bg-cover bg-center p-4 overflow-y-auto w-full">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`chat ${
                    msg.sender_id === userId ? "chat-end" : "chat-start"
                  }`}
                >
                  <div
                    className={`chat-bubble text-white ${
                      msg.sender_id === userId
                        ? "-bg-tertiary"
                        : "-bg-secondary"
                    }`}
                  >
                    {msg.pesan}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}

          {/* Input Message */}
          <div className="py-1 pl-5 flex gap-5 items-center">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="p-2 rounded w-full outline-none border-none focus:outline-none -bg-secondary"
              placeholder="Type your message..."
              autoFocus
            />

            <button
              onClick={sendMessage}
              className="-bg-tertiary text-white px-2 py-2 rounded w-1/4"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
