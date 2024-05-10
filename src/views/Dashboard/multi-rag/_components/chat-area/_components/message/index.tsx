import { DrawingPinIcon } from '@radix-ui/react-icons';
import CustomMarkdownView from '../../../../../../../components/CustomComponents/CustomMarkdownView';
import { cn } from '../../../../../../../library/utils';
import { useMutation } from '@tanstack/react-query';
import ApiService from '../../../../../../../services/ApiService';
import { useState } from 'react';
import { ThumbsUpIcon } from 'lucide-react';

const Message = ({
  id,
  type,
  content,
  loading,
  isPinned,
  isLiked
}: {
  id?: number;
  type: 'bot' | 'user';
  content: string;
  loading?: boolean;
  isPinned?: boolean;
  isLiked?: boolean;
}) => {
  const prefixes = ['Explain: ', 'Summarize: ', 'Translate: '];
  let prefix = '';
  let actualContent = content;

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
          className={cn('flex relative', {
            'justify-end': type === 'user'
          })}
        >
          {prefix ? (
            <QuoteMessage type={prefix} content={actualContent} />
          ) : (
            <CustomMarkdownView
              source={content}
              className={cn(
                'text-black bg-white text-[0.87rem] rounded-[10px] shadow-md',
                {
                  'bg-black/10 text-[#072D5F]': type === 'user',
                  'w-32 h-10': loading
                }
              )}
              paragraphClass="[&_p]:leading-[20px]"
            />
          )}
          {type === 'bot' && id && (
            <div className="absolute bottom-[-1.5rem] w-full flex justify-between">
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
  );
};

const PinMessageButton = ({
  id,
  isPinned
}: {
  id?: number;
  isPinned: boolean;
}) => {
  const [localIsPinned, setLocalIsPinned] = useState(isPinned);
  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      ApiService.multiDocMessageTogglePin({
        conversationLogId: String(id),
        isPinned: !localIsPinned
      })
        .then((res) => res.json())
        .then((data) => {
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
    <div className="p-1 bg-black/10 rounded-md select-none">
      <div className="w-full h-full">
        <div className="border-l border-l-blue-500 p-2 rounded-md bg-black/5">
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

export default Message;
