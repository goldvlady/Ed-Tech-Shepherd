import './index.css';
import { DrawingPinIcon } from '@radix-ui/react-icons';
import CustomMarkdownView from '../../../../../../../components/CustomComponents/CustomMarkdownView';
import { cn } from '../../../../../../../library/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import ApiService from '../../../../../../../services/ApiService';
import { useState } from 'react';
import { ThumbsUpIcon } from 'lucide-react';
import React from 'react';
import * as HoverCard from '@radix-ui/react-hover-card';
import { motion, AnimatePresence } from 'framer-motion';
import { off } from 'process';
interface DocumentMetadata {
  page_label: string;
  file_name: string;
  file_path: string;
  file_type: string;
  file_size: number;
}

interface VectorsMetadata {
  node_id: string;
  text: string;
  score: number;
  metadata: DocumentMetadata;
  chat: string;
}

const transition = {
  type: 'spring',
  stiffness: 200,
  mass: 0.2,
  damping: 20
};

const variants = {
  initial: {
    opacity: 0,
    y: 300
  },
  enter: {
    opacity: 1,
    y: 0,
    transition
  }
};

const Message = ({
  id,
  type,
  content,
  loading,
  isPinned,
  isLiked,
  metadata,
  clickable,
  bubble
}: {
  id?: number;
  type: 'bot' | 'user';
  metadata: Array<VectorsMetadata[]>;
  clickable: boolean;
  content: string;
  loading?: boolean;
  isPinned?: boolean;
  bubble?: boolean;
  isLiked?: boolean;
}) => {
  const prefixes = ['Explain: ', 'Summarize: ', 'Translate: '];
  let prefix = '';
  let actualContent = content;
  const [showCitations, setShowCitations] = useState(false);
  const citations = metadata.reduce((acc, el) => {
    const matches = el.filter((e) => e.chat === content);
    if (matches.length > 0) {
      matches.forEach((m) => acc.push(m));
    }
    return acc;
  }, []);

  console.log(content, type);
  console.log('METADATA PASSED IN', metadata);
  console.log('citation', citations);
  for (const p of prefixes) {
    if (content.startsWith(p)) {
      prefix = p;
      actualContent = content.substring(p.length);
      break;
    }
  }

  if (prefix) {
    prefix = prefix.split(':')[0];
  }

  return (
    <motion.div initial="initial" animate="enter" variants={variants} layout>
      <div
        className={cn(
          'w-full rounded-[10px] p-2 flex items-end gap-[1rem] justify-start',
          {
            'flex-row-reverse': type === 'user',
            'animate-pulse': loading
          }
        )}
      >
        <div
          className={cn('w-10 h-10 rounded-full bg-black/10 basic-1', {
            'bg-[#1A356E]': type === 'user'
          })}
        ></div>
        <div className="flex-1 rounded-[10px] basis-1 relative">
          <div
            className={cn('flex gap-1 relative', {
              'justify-end': type === 'user',
              'bg-white rounded-[10px] shadow-md': type !== 'user',
              'bg-transparent shadow-none': bubble
            })}
          >
            {bubble ? (
              <Bubble />
            ) : prefix ? (
              <QuoteMessage type={prefix} content={actualContent} />
            ) : (
              <div className="flex flex-col">
                <CustomMarkdownView
                  source={content}
                  className={cn('text-black text-[0.87rem]', {
                    'bg-black/10 text-[#072D5F] rounded-[10px] shadow-md':
                      type === 'user',
                    'w-32 h-10': loading
                  })}
                  paragraphClass="[&_p]:leading-[20px]"
                />
                {citations.length > 0 ? (
                  <div className="justify-start flex p-2 items-center gap-2">
                    <button
                      onClick={() => setShowCitations(!showCitations)}
                      className="bg-inherit whitespace-nowrap rounded-md border border-black/20 px-2 py-1 text-xs hover:bg-white/20"
                    >
                      {citations.length}{' '}
                      {citations.length === 1 ? 'citation' : 'citations'}
                    </button>
                    {showCitations ? (
                      <div className="px-2 cursor-pointer flex items-center gap-1.5 py-1 max-w-[83%] overflow-x-scroll scroller rounded-md bg-inherit border border-black/20">
                        {citations.map((el, index) => (
                          <HoverCard.Root key={el.node_id}>
                            <HoverCard.Trigger asChild>
                              <p className="text-xs hover:bg-white/60">
                                {index + 1}
                              </p>
                            </HoverCard.Trigger>
                            <HoverCard.Portal>
                              <HoverCard.Content
                                side="top"
                                className="overflow-y-scroll max-h-[300px] data-[side=bottom]:animate-slideUpAndFade data-[side=right]:animate-slideLeftAndFade data-[side=left]:animate-slideRightAndFade data-[side=top]:animate-slideDownAndFade w-[300px] rounded-md bg-white p-5 shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] data-[state=open]:transition-all no-scrollbar"
                                sideOffset={5}
                              >
                                <p className="text-xs">{el.text}</p>
                              </HoverCard.Content>
                            </HoverCard.Portal>
                          </HoverCard.Root>
                        ))}
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </div>
            )}
            {!bubble && type === 'bot' && id && (
              <div
                style={{ pointerEvents: clickable ? 'auto' : 'none' }}
                className="absolute bottom-[-1.5rem] w-full flex justify-end gap-2"
              >
                <div className="left-section">
                  <LikeMessageButton id={id} isLiked={isLiked} />
                </div>
                <div className="right-section pr-4">
                  <PinMessageButton id={id} isPinned={isPinned} />
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="min-w-10 min-h-10 rounded-full bg-black/10 basis-1 opacity-0 pointer-events-none"></div>
      </div>
    </motion.div>
  );
};

const PinMessageButton = ({
  id,
  isPinned
}: {
  id?: number;
  isPinned: boolean;
}) => {
  const queryClient = useQueryClient();
  const [localIsPinned, setLocalIsPinned] = useState(isPinned);
  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      ApiService.multiDocMessageTogglePin({
        conversationLogId: String(id),
        isPinned: !localIsPinned
      })
        .then((res) => res.json())
        .then((data) => {
          queryClient.invalidateQueries({
            queryKey: ['pinned-messages']
          });
          if (data.status === 'success') {
            setLocalIsPinned(data.data.isPinned);
          }
        })
  });

  const handlePin = () => {
    mutate();
  };

  return (
    <div
      onClick={handlePin}
      className={cn(
        'w-5 h-5 rounded-full border flex items-center justify-center p-0.5 cursor-pointer',
        { 'bg-black text-white': localIsPinned },
        {
          'pointer-events-none opacity-50': isPending
        }
      )}
    >
      <DrawingPinIcon />
    </div>
  );
};

const LikeMessageButton = ({
  id,
  isLiked
}: {
  id?: number;
  isLiked: boolean;
}) => {
  const [localIsLiked, setLocalIsLiked] = useState(isLiked);
  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      ApiService.multiDocMessageToggleLike({
        conversationLogId: String(id),
        disliked: localIsLiked,
        liked: !localIsLiked
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.status === 'success') {
            setLocalIsLiked(data.data.liked);
          }
        })
  });

  const handlePin = () => {
    mutate();
  };

  return (
    <div
      onClick={handlePin}
      className={cn(
        'w-5 h-5 rounded-full border flex items-center justify-center p-0.5 cursor-pointer',
        { 'bg-black text-white': localIsLiked },
        {
          'pointer-events-none opacity-50': isPending
        }
      )}
    >
      <ThumbsUpIcon />
    </div>
  );
};

const QuoteMessage = ({ type, content }) => {
  return (
    <div className="p-1 bg-white rounded-md select-none">
      <div className="w-full h-full">
        <div className="border-l border-l-blue-500 p-2 rounded-md bg-white">
          <h5 className="font-medium text-[0.75rem] text-blue-500">You</h5>
          <h6 className="text-[0.75rem] text-ellipsis break-words whitespace-pre-wrap leading-[20px] text-[#667781]">
            <CustomMarkdownView
              source={content}
              paragraphClass="[&_p]:leading-[20px] !px-0 py-0"
            />
          </h6>
        </div>
        <div>
          <span className="break-words whitespace-pre-wrap text-[0.87rem] leading-[19px] text-[#111b21]">
            {type}
          </span>
        </div>
      </div>
    </div>
  );
};

const Bubble = () => {
  return (
    <div
      id="message-loading-bubble"
      className="w-14 px-2 rounded-xl rounded-bl-none py-2 border flex bg-white shadow-md gap-1 justify-center"
    >
      <div
        id="bubble-1"
        className="bubble-dot bg-gray-200 w-2 h-2 rounded-full"
      ></div>
      <div
        id="bubble-2"
        className="bubble-dot bg-gray-200 w-2 h-2 rounded-full"
      ></div>
      <div
        id="bubble-3"
        className="bubble-dot bg-gray-200 w-2 h-2 rounded-full"
      ></div>
    </div>
  );
};

export default Message;
