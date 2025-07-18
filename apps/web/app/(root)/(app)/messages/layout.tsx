function ChatList() {
  const chats = [
    {
      id: "1",
      name: "Chat 1",
      lastMessage: "Hello from Chat 1",
      timestamp: "2023-10-01T12:00:00Z",
    },
    {
      id: "2",
      name: "Chat 2",
      lastMessage: "Hello from Chat 2",
      timestamp: "2023-10-01T12:05:00Z",
    },
    {
      id: "3",
      name: "Chat 3",
      lastMessage: "Hello from Chat 3",
      timestamp: "2023-10-01T12:10:00Z",
    },
  ];
  return (
    <div className="p-4 w-64 border-r border-border">
      {chats.length > 0 ? (
        <ul>
          {chats.map((chat) => (
            <li key={chat.id} className="mb-2">
              <strong>{chat.name}</strong>: {chat.lastMessage} <br />
              <small>{new Date(chat.timestamp).toLocaleString()}</small>
            </li>
          ))}
        </ul>
      ) : (
        <p>No chats available</p>
      )}
    </div>
  );
}

export default function MessagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex w-[calc(100vw-var(--nav-width))] h-screen">
      <ChatList />
      <div className="flex-1 overflow-y-auto">{children}</div>
    </div>
  );
}
