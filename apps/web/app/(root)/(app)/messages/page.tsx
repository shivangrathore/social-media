import { cn } from "@/lib/utils";

export default function MessagesPage({
  params,
}: {
  params: { chatId: string };
}) {
  const { chatId } = params;
  // Simulate a chat, incoming and outgoing messages
  const messages = [
    {
      id: "1",
      content: "Hello, how are you?",
      sender: "user",
      timestamp: "2023-10-01T12:00:00Z",
    },
    {
      id: "2",
      content: "I'm good, thanks! How about you?",
      sender: "assistant",
      timestamp: "2023-10-01T12:01:00Z",
    },
    {
      id: "3",
      content: "Doing well, just working on some code.",
      sender: "user",
      timestamp: "2023-10-01T12:02:00Z",
    },
  ];
  return (
    <div className="flex w-full flex-col p-4">
      <h2 className="text-lg font-semibold mb-4">Chat {chatId}</h2>
      <ul className="w-full flex flex-col">
        {messages.map((message) => (
          <li key={message.id} className="mb-2 flex flex-col">
            <div className={cn(message.sender == "user" ? "ml-auto" : "")}>
              <strong>
                {message.sender === "user" ? "You" : "Assistant"}:
              </strong>{" "}
              {message.content} <br />
              <small>{new Date(message.timestamp).toLocaleString()}</small>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
