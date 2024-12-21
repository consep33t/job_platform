import Avatar from "../components/avatar";

export default function UsersPage() {
  const users = [
    {
      user_id: 1,
      name: "Alice",
      avatar_url: "https://example.com/avatar1.png",
    },
    { user_id: 2, name: "Bob", avatar_url: "https://example.com/avatar2.png" },
    {
      user_id: 3,
      name: "Charlie",
      avatar_url: "https://example.com/avatar3.png",
    },
  ];

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Users</h1>
      <div className="space-y-4">
        {users.map((user) => (
          <Avatar key={user.user_id} user={user} />
        ))}
      </div>
    </div>
  );
}
