import { Link, useParams } from 'react-router-dom';
import Options from './_components/options';
import { useEffect, useRef, useState } from 'react';

const ListItem = ({ id, title }: { id: string; title: string }) => {
  const inputRef = useRef<HTMLInputElement | null>();
  const { id: conversationId } = useParams();
  const [renameMode, setRenameMode] = useState(false);
  if (!title) return null;

  const handleRename = () => {
    setRenameMode(true);
  };

  const handleRenameOnBlur = () => {
    setRenameMode(false);
  };

  return (
    <div
      className={`flex w-full h-[36px] text-[#000000] leading-5 text-[12px] rounded-[8px] border truncate text-ellipsis gap-2 font-normal bg-[#F9F9FB] border-none pr-2 ${
        id === conversationId ? 'bg-[#E5E5E5]' : ''
      } hover:bg-[#E5E5E5] hover:cursor-pointer hover:shadow-md hover:z-10 hover:transition-all hover:duration-300 hover:ease-in-out`}
    >
      {renameMode ? (
        <input
          ref={inputRef}
          onBlur={handleRenameOnBlur}
          type="text"
          className="w-full py-2 pl-2 text-[12px] border-none bg-blue-100 italic"
          value={title}
          onChange={() => {}}
        />
      ) : (
        <Link to={`/dashboard/ace-homework/${id}`} className="w-full py-2 pl-2">
          <span className="flex-1 text-ellipsis truncate">{title}</span>
        </Link>
      )}
      <Options
        actions={{
          handleRename
        }}
      />
    </div>
  );
};

export default ListItem;
