import ConversationWindow from './_components/conversation-window';
import AIBotProfile from './_components/ai-bot-profile';
import ChatInput from './_components/chat-input';

function AiChatBotWindow() {
  return (
    <div className="p-4 h-full flex flex-col gap-4 w-full justify-between">
      <AIBotProfile />
      <ConversationWindow />
      <ChatInput />
    </div>
  );
}

export default AiChatBotWindow;
