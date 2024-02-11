import { memo, useMemo, useState } from 'react';
import AiChatBotWindow from './_components/ai-bot-window';
import ChatHistory from './_components/chat-history';
import { cn } from '../../../library/utils';

const Component = () => {
  console.log('I AM PARENT, I dont re-render on URL change, I am memoized.');
  return (
    <div className="w-full h-full flex gap-[1px]">
      <ChatHistorySidebar />
      <div className="h-full flex-[1]">
        <AiChatBotWindow />
        ChatHistorySidebar
      </div>
    </div>
  );
};

const ChatHistorySidebar = () => {
  const [sidebarClosed, setSidebarClosed] = useState(false);
  return (
    <div
      className={cn(
        'h-full max-h-screen hidden md:flex w-[348px] border-r transition-all justify-end mr-[-1px] relative duration-1000',
        {
          'w-[0%]': sidebarClosed
        }
      )}
    >
      <button
        className="absolute top-0 p-2 bg-white shadow-md rounded-l-md right-[-56px]"
        onClick={() => setSidebarClosed((prev) => !prev)}
      >
        close
      </button>
      <ChatHistory />
    </div>
  );
};

function HomeWorkHelp2() {
  const component = useMemo(() => <Component />, []);
  return component;
}

export default memo(HomeWorkHelp2, () => true);
