import { memo, useMemo, useState } from 'react';
import AiChatBotWindow from './_components/ai-bot-window';
import ChatHistory from './_components/chat-history';
import { cn } from '../../../library/utils';
import { CaretRightIcon } from '@radix-ui/react-icons';
import { Button } from '../../../components/ui/button';

const Component = () => {
  console.log('I AM PARENT, I dont re-render on URL change, I am memoized.');
  return (
    <div className="w-full h-full flex gap-[1px]">
      <ChatHistory />
      <div className="h-full flex-[1]">
        <AiChatBotWindow />
        ChatHistorySidebar
      </div>
    </div>
  );
};

function HomeWorkHelp2() {
  const component = useMemo(() => <Component />, []);
  return component;
}

export default memo(HomeWorkHelp2, () => true);
