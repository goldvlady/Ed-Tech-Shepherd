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
  const { renameConversation, renaming, deleteConversationById, deleting } =
    useListItem({
      onRenameSuccess: (values: any) => {
        setRenameMode((prev) => ({ title: values.newTitle, enabled: false }));
        toast({
          status: 'success',
          title: 'Conversation renamed successfully'
        });
      },
      onDeletedSuccess: (id: string) => {
        toast({
          status: 'success',
          title: 'Conversation deleted successfully'
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
    deleteConversationById(id);
  };

  return (
    <div
      className={`flex w-full h-[36px] text-[#000000] leading-5 text-[12px] rounded-[8px] border gap-2 font-normal bg-[#F9F9FB] border-none px-2 hover:bg-[#E5E5E5] hover:cursor-pointer ${
        id === conversationId ? 'bg-[#E5E5E5]' : ''
      } ${renaming || deleting ? 'opacity-50' : ''}`}
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
        <Link
          to={`/dashboard/ace-homework/${id}`}
          className="flex-1 py-2 text-ellipsis truncate"
        >
          <span className="w-full text-ellipsis truncate">{title}</span>
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
