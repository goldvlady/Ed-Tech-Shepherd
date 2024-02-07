import { Link, useParams } from 'react-router-dom';
import Options from './_components/options';
import { useRef, useState } from 'react';
import useListItem from './hook/useListItem';
import { useCustomToast } from '../../../../../../../../components/CustomComponents/CustomToast/useCustomToast';

const ListItem = ({ id, title }: { id: string; title: string }) => {
  const inputRef = useRef<HTMLInputElement | null>();
  const toast = useCustomToast();
  const { id: conversationId } = useParams();
  const [renameMode, setRenameMode] = useState({
    enabled: false,
    title: title
  });
  const { renameConversation, renaming } = useListItem({
    onRenameSuccess: (values: any) => {
      setRenameMode((prev) => ({ title: values.newTitle, enabled: false }));
      toast({
        status: 'success',
        title: 'Conversation renamed successfully'
      });
    }
  });
  if (!title) return null;

  const handleRename = () => {
    setRenameMode((prev) => ({ ...prev, enabled: true }));
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const handleRenameOnBlur = () => {
    renameConversation(id, inputRef.current?.value || '');
  };

  const handleDelete = (id: string) => {
    console.log('delete', id);
  };

  return (
    <div
      className={`flex w-full h-[36px] text-[#000000] leading-5 text-[12px] rounded-[8px] border truncate text-ellipsis gap-2 font-normal bg-[#F9F9FB] border-none pr-2
                ${id === conversationId ? 'bg-[#E5E5E5]' : ''} 
                hover:bg-[#E5E5E5] hover:cursor-pointer hover:shadow-md hover:z-10 hover:transition-all hover:duration-300 hover:ease-in-out 
                ${renaming ? 'opacity-50' : ''}`}
    >
      {renameMode.enabled ? (
        <input
          ref={inputRef}
          onBlur={handleRenameOnBlur}
          type="text"
          defaultValue={title}
          className="w-full py-2 pl-2 text-[12px] border-none bg-blue-100 italic"
          value={renameMode.title}
          onChange={(e) =>
            setRenameMode((prev) => ({ ...prev, title: e.target.value }))
          }
        />
      ) : (
        <Link to={`/dashboard/ace-homework/${id}`} className="w-full py-2 pl-2">
          <span className="flex-1 text-ellipsis truncate">{title}</span>
        </Link>
      )}
      <Options
        id={id}
        actions={{
          handleRename,
          handleDelete
        }}
      />
    </div>
  );
};

export default ListItem;
