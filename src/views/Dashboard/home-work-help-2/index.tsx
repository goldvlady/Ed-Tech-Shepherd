import { memo, useMemo, useState } from 'react';
import AiChatBotWindow from './_components/ai-bot-window';
import ChatHistory from './_components/chat-history';

const Component = () => {
  return (
    <div className="w-full h-full flex gap-[1px] overflow-x-hidden">
      <ChatHistory />
      <div className="h-full flex-[1] w-full">
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
