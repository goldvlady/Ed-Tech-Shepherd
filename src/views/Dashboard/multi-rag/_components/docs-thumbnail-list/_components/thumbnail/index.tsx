import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { CheckIcon } from 'lucide-react';
import { useState } from 'react';
import { cn } from '../../../../../../../library/utils';

function truncateText(text, maxLength) {
  if (text.length > maxLength) {
    const extension = text.substring(text.lastIndexOf('.'));
    return text.slice(0, maxLength - extension.length - 3) + '...' + extension;
  } else {
    return text;
  }
}

function Thumbnail({ data }: { data: any }) {
  const [selected, setSelected] = useState(false);
  return (
    <div
      className={cn(
        'border h-[10.31rem] w-[10.31rem] rounded-[10px] bg-white relative p-[0.68rem] flex items-end transition-colors',
        {
          'bg-[#EBF4FE]': selected
        }
      )}
    >
      <div className="w-[1.87rem] h-[1.87rem] absolute rounded-full bg-[#F9F9FB] top-0 right-0 m-[0.68rem] flex justify-center items-center cursor-pointer">
        <DotsHorizontalIcon />
      </div>
      <div className="flex items-center gap-1 justify-between w-full">
        <p className="text-[#585F68] text-[10px] whitespace-nowrap">
          {truncateText(data.collection_name, 25)}
        </p>
        <div
          role="button"
          onClick={() => {
            setSelected(!selected);
          }}
          className={cn(
            'w-[0.87rem] h-[0.87rem] rounded-[3px] bg-[#F9F9FB] flex justify-center items-center p-[2px] transition',
            {
              'bg-[#207DF7]': selected
            }
          )}
        >
          <CheckIcon className="text-white" />
        </div>
      </div>
    </div>
  );
}

export default Thumbnail;
