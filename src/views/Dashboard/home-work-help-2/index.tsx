import AiChatBotWindow from './_components/ai-bot-window';
import ChatHistory from './_components/chat-history';

function HomeWorkHelp2() {
  return (
    <div className="w-full h-full flex gap-2">
      <div className="h-full max-h-screen overflow-y-scroll hidden md:block max-w-[348px] border-r no-scroll">
        <ChatHistory />
      </div>
      <div className="h-full flex-[1]">
        <AiChatBotWindow />
      </div>
    </div>
  );
}

export default HomeWorkHelp2;
