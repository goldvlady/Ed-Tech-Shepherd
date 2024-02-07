import ListGroup from './_components/list-group';
import ListItem from './_components/list-item';

function ChatList({ conversations }: { conversations: any[] }) {
  return (
    <div className="w-full flex flex-col gap-2 no-scrollbar">
      <ListGroup date="Today" groupItems={conversations.slice(0, 5)} />
      <ListGroup date="Yesterday" groupItems={conversations.slice(0, 5)} />
      <ListGroup
        date="1 February 2024"
        groupItems={conversations.slice(0, 5)}
      />
    </div>
  );
}

export default ChatList;
