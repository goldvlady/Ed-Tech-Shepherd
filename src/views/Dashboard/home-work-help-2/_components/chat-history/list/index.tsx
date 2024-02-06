function ChatList({ conversations }: { conversations: any[] }) {
  return (
    <div className="w-full flex flex-col gap-2">
      {conversations.map((conversation) => {
        return <ListItem title={conversation.title} key={conversation.id} />;
      })}
    </div>
  );
}

const ListItem = ({ title }: { title: string }) => {
  if (!title) return null;
  return (
    <div className="flex gap-3 p-3 w-full rounded border shadow">{title}</div>
  );
};

export default ChatList;
