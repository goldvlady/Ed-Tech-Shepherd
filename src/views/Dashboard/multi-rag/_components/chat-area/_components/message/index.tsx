import { cn } from '../../../../../../../library/utils';

const Message = ({
  type,
  content,
  loading
}: {
  type: 'bot' | 'user';
  content: string;
  loading?: boolean;
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
      <div className="flex-1 rounded-[10px] basis-1">
        <div
          className={cn('flex', {
            'justify-end': type === 'user'
          })}
        >
          {prefix ? (
            <QuoteMessage type={prefix} content={actualContent} />
          ) : (
            <p
              className={cn(
                'text-black bg-white text-[0.87rem] rounded-[10px] px-[1.56rem] py-[0.5rem] shadow-md',
                {
                  'bg-black/10 text-[#072D5F]': type === 'user',
                  'w-32 h-10': loading
                }
              )}
            >
              {content}
            </p>
          )}
        </div>
      </div>
      <div className="min-w-10 min-h-10 rounded-full bg-black/10 basis-1 opacity-0 pointer-events-none"></div>
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
            {content}
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
