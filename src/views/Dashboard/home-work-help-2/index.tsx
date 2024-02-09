import { memo, useMemo } from 'react';
import AiChatBotWindow from './_components/ai-bot-window';
import ChatHistory from './_components/chat-history';

const Component = () => {
  console.log('I AM PARENT, I dont re-render on URL change, I am memoized.');
  return (
    <div className="w-full h-full flex">
      <div className="h-full max-h-screen hidden md:block w-[348px] border-r">
        <ChatHistory />
      </div>
      <div className="h-full flex-[1]">
        <AiChatBotWindow />
      </div>
    </div>
  );
};

function HomeWorkHelp2() {
  const component = useMemo(() => <Component />, []);
  return component;
}

export default memo(HomeWorkHelp2, () => true);
