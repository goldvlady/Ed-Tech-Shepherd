const ChatItem = ({
  type,
  message
}: {
  type: 'user' | 'bot';
  message: string;
}) => {
  return (
    <div
      className={`flex w-full items-start ${
        type === 'user' ? 'justify-end' : 'justify-start'
      }`}
    >
      <div
        className={`flex gap-3 p-3 rounded-3xl border shadow ${
          type === 'user' ? 'bg-blue-100' : ''
        }`}
      >
        {message}
      </div>
    </div>
  );
};

export default ChatItem;
