"use client";

import { useRouter } from "next/navigation";

export default function Avatar({ user }) {
  const router = useRouter();

  const openChat = () => {
    router.push(`/chat/${user.user_id}`);
  };

  return (
    <div
      className="cursor-pointer flex items-center space-x-2"
      onClick={openChat}
    >
      <img
        src={user.avatar_url}
        alt={user.name}
        className="w-10 h-10 rounded-full"
      />
      <span>{user.name}</span>
    </div>
  );
}
