import { useState } from "react";

const ChatInput = ({ senderId, receiverId, onMessageSent }) => {
  const [message, setMessage] = useState("");

  const sendMessage = async () => {
    if (!message.trim()) return;

    await fetch("/api/chats/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sender_id: senderId,
        receiver_id: receiverId,
        pesan: message,
      }),
    });

    setMessage("");
    if (onMessageSent) onMessageSent(); // Refresh chat
  };

  return (
    <div className="flex items-center space-x-2">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message..."
        className="flex-1 p-2 border rounded-lg"
      />
      <button
        onClick={sendMessage}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg"
      >
        Send
      </button>
    </div>
  );
};

export default ChatInput;
