function ChatList({ conversations }: { conversations: any[] }) {
  return (
    <div className="w-full flex flex-col gap-2">
      {conversations.map((conversation) => {
        return <ListItem title={conversation.title} key={conversation.id} />;
      })}
    </div>
  );
}

// const ListGroup = ({ children }: { children: React.ReactNode }) => {};

const ListItem = ({ title }: { title: string }) => {
  if (!title) return null;
  return (
    <div className="flex p-2 w-full rounded border shadow text-sm truncate text-ellipsis gap-2">
      <span className="flex-1">{title}</span>
    </div>
  );
};

export default ChatList;
