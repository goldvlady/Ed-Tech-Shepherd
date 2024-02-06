import ChatItem from './chat-item';

const ConversationWindow = () => {
  const messages = [];
  return (
    <div className="flex-1 h-full overflow-y-scroll flex gap-3 w-full flex-col pr-4">
      {messages.length > 0 ? 'Show messages' : <EmptyChat />}
    </div>
  );
};

const EmptyChat = () => {
  return (
    <div className="flex-1 h-full overflow-y-scroll flex gap-3 w-full flex-col pr-4">
      <div className="flex w-full h-full items-center justify-center">
        <p className="text-gray-400">No messages yet</p>
      </div>
    </div>
  );
};

export default ConversationWindow;
