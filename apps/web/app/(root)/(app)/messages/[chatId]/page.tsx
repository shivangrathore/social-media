export default function MessagesPage({
  params,
}: {
  params: { chatId: string };
}) {
  const { chatId } = params;
  if (chatId) {
    return <div>Chat ID: {chatId}</div>;
  }
  return <div>No Chat Selected</div>;
}
