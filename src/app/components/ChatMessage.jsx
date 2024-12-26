export default function ChatMessage({ chat, currentUserId }) {
  const isSender = chat.sender_id === currentUserId;

  return (
    <div
      className={`p-3 rounded-lg max-w-xs ${
        isSender
          ? "bg-blue-500 text-white self-end"
          : "bg-gray-200 text-black self-start"
      }`}
    >
      <p>{chat.pesan}</p>
      <div className="flex justify-between items-center mt-2 text-sm text-gray-500">
        <span>{new Date(chat.sent_at).toLocaleString()}</span>
        <span>
          {chat.status_dibaca === 1 ? (
            <span className="text-blue-500">✔✔</span>
          ) : (
            <span className="text-gray-500">✔✔</span>
          )}
        </span>
      </div>
    </div>
  );
}
