import { useState } from 'react';
import { cn } from '../../../../../library/utils';
import ChatHistory from './_components/chat-history';
import UploadingItems from './_components/uploading-items';
import Sections from './_components/sections';

function DocSelector() {
  const [active, setActive] = useState(0);
  const [filesUploaded, setFilesUploaded] = useState({
    jobId: '',
    uploaded: false,
    tables: []
  });
  return (
    <div className="w-full h-full bg-[#F9F9FB] flex">
      <div className="h-full flex-1 bg-[#F9F9FB] flex justify-center items-center">
        <div className="w-[50rem] h-[34rem]">
          <header className="w-full h-[2.5rem] flex overflow-hidden">
            <HeaderItem
              title="Upload"
              isActive={active === 0}
              onClick={() => setActive(0)}
            />
            <HeaderItem
              title="Documents"
              isActive={active === 1}
              onClick={() => setActive(1)}
              className="mx-[-0.5rem]"
            />
            <HeaderItem
              title="External Sources"
              isActive={active === 2}
              onClick={() => setActive(2)}
            />
          </header>
          <Sections active={active} setFilesUploaded={setFilesUploaded} />
          <UploadingItems filesUploaded={filesUploaded} />
        </div>
      </div>
      <ChatHistory />
    </div>
  );
}

const HeaderItem = ({
  title,
  isActive,
  onClick,
  className
}: {
  title: string;
  isActive: boolean;
  onClick: () => void;
  className?: string;
}) => {
  return (
    <div
      role="button"
      onClick={onClick}
      className={cn(
        'py-[0.6rem] px-[1.75rem] bg-[#F6F6F6] border rounded-t-[0.93rem] flex justify-center items-center border-b-0 text-[0.87rem] font-normal will-change-auto transition-all z-0',
        {
          'bg-white text-[#207DF7] border-white relative z-[10] shadow-lg':
            isActive
        },
        className
      )}
    >
      {title}
    </div>
  );
};

export default DocSelector;
