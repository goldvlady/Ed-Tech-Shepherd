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
        </div>
      </div>
      <div className="min-w-10 min-h-10 rounded-full bg-black/10 basis-1 opacity-0 pointer-events-none"></div>
    </div>
  );
};

export default Message;
