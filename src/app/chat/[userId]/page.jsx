"use client";
import { useEffect, useState } from "react";
import ChatMessage from "@/app/components/ChatMessage";
import ChatInput from "@/app/components/ChatInput";

export default function ChatPage({ userId = 2 }) {
  const [chats, setChats] = useState([]);
  const currentUserId = 1; // Ganti dengan ID user yang sedang login.

  const fetchChats = async () => {
    const res = await fetch(`/api/chats/${userId}`);
    const data = await res.json();
    setChats(data);

    // Tandai pesan sebagai dibaca
    const unreadMessages = data.filter(
      (chat) => chat.status_dibaca === 0 && chat.receiver_id === currentUserId
    );
    unreadMessages.forEach(async (message) => {
      await fetch(`/api/chats/mark-as-read`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chatId: message.chat_id }),
      });
    });
  };

  useEffect(() => {
    fetchChats();
  }, [userId]);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Chat with User {userId}</h1>
      <div className="space-y-4">
        {chats.map((chat) => (
          <ChatMessage
            key={chat.chat_id}
            chat={chat}
            currentUserId={currentUserId}
          />
        ))}
      </div>
      <ChatInput
        senderId={currentUserId}
        receiverId={parseInt(userId)}
        onMessageSent={fetchChats}
      />
    </div>
  );
}
