import { ChevronDownIcon } from '@chakra-ui/icons';
import { Button } from '../../../../../../../../components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '../../../../../../../../components/ui/dropdown-menu';
import useListItem from '../../../../hooks/useListItem';
import { useState } from 'react';
import useStudentConversations from '../../../../hooks/useStudentConversations';
import useUserStore from '../../../../../../../../state/userStore';

function ChatInfoDropdown({ id }: { id: string }) {
  const studentId = useUserStore((state) => state.user?._id);
  const [renameMode, setRenameMode] = useState({
    enabled: false,
    title: 'Untitled'
  });
  const { data } = useStudentConversations({
    studentId: studentId,
    select: (data) => {
      const conversation = data.find((item) => item.id === id);
      if (conversation) {
        if (renameMode.title !== conversation.title) {
          setRenameMode((prev) => ({
            title: conversation.title,
            enabled: false
          }));
        }
      }
      return conversation;
    }
  });

  const { renameConversation, renaming, deleteConversationById, deleting } =
    useListItem({
      onRenameSuccess: (values: any) => {
        setRenameMode((prev) => ({ title: values.newTitle, enabled: false }));
        // toast({
        //   status: 'success',
        //   title: 'Conversation renamed successfully'
        // });
      },
      onDeletedSuccess: (id: string) => {
        // toast({
        //   status: 'success',
        //   title: 'Conversation deleted successfully'
        // });
      }
    });
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="p-0 text-black text-sm font-medium focus-visible:ring-0 w-[60%] sm:w-full"
        >
          <p className="truncate text-ellipsis"> {renameMode.title} </p>
          <ChevronDownIcon
            className="
            w-4 h-4
            ml-1
            text-[#212224]
          "
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[180px] bg-white rounded-md shadow-md">
        <DropdownMenuGroup className="p-2">
          <DropdownMenuItem
            className="
            flex items-center
            text-sm
            text-[#212224]
            rounded-md
            hover:bg-[#F2F4F7]
          "
          >
            Rename
          </DropdownMenuItem>
          <DropdownMenuItem
            className="flex items-center
            text-sm
            rounded-md
            hover:bg-[#F2F4F7] text-[#DB0B0B]"
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default ChatInfoDropdown;
