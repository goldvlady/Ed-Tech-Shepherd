import * as React from 'react';
import { useInView } from 'react-intersection-observer';
import { useAtBottom } from '../../../../../../../hooks/use-at-bottom';
import { cn } from '../../../../../../../library/utils';

interface ChatScrollAnchorProps {
  trackVisibility?: boolean;
}

export function ChatScrollAnchor({ trackVisibility }: ChatScrollAnchorProps) {
  const isAtBottom = useAtBottom();
  const { ref, inView, entry } = useInView({
    trackVisibility,
    delay: 100,
    rootMargin: '0px 0px -150px 0px'
  });

  const scrollToBottom = () => {
    entry?.target.scrollIntoView({
      behavior: 'smooth',
      block: 'end'
    });
  };

  React.useEffect(() => {
    let intervalId: any = null;
    if (trackVisibility && !inView) {
      intervalId = setInterval(scrollToBottom, 200);
    }
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [inView, isAtBottom, trackVisibility]);

  return <div ref={ref} className={cn('h-px w-full transition-all')} />;
}
