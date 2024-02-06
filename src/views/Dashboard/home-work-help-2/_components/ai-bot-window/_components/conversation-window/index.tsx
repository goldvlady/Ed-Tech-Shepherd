import ChatItem from './chat-item';

const ConversationWindow = () => {
  return (
    <div className="flex-1 h-full overflow-y-scroll flex gap-3 w-full flex-col pr-4">
      <ChatItem type="user" message="Hello! How are you doing?" />
      <ChatItem
        type="bot"
        message="Hello! I am doing great. How can I help you?"
      />
      <ChatItem type="user" message="I need help with my homework." />
      <ChatItem type="bot" message="Sure! I can help you with that." />
      <ChatItem type="user" message="I am stuck on this question." />
      <ChatItem type="bot" message="What is the question?" />
      <ChatItem type="user" message="The question is 2+2." />
      <ChatItem type="bot" message="The answer is 4." />
      <ChatItem type="user" message="Thank you!" />
      <ChatItem type="bot" message="You're welcome!" />
    </div>
  );
};

export default ConversationWindow;
