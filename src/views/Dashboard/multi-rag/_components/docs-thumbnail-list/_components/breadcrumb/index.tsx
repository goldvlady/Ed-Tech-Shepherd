import { ChevronRightIcon } from '@radix-ui/react-icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import ApiService from '../../../../../../../services/ApiService';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '../../../../../../../components/ui/tooltip';
import { Input } from '../../../../../../../components/ui/input';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '../../../../../../../components/ui/sheet';
import useUserStore from '../../../../../../../state/userStore';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '../../../../../../../components/ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '../../../../../../../components/ui/dropdown-menu';
import { Button } from '../../../../../../../components/ui/button';

function BreadCrumb({ conversationId }: { conversationId: string }) {
  const { data, isLoading } = useQuery({
    queryKey: ['doc-chat-name', conversationId],
    queryFn: () =>
      ApiService.multiDocGetTitle(conversationId).then((res) => res.json())
  });
  const [renameOpen, setRenameOpen] = useState(false);

  return (
    <Sheet>
      <AlertDialog
        onOpenChange={(open: boolean) => {
          setRenameOpen(open);
        }}
      >
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="h-[1.56rem] shadow-md bg-white rounded-[10px] flex justify-start items-center px-[0.87rem] select-none">
              <span className="text-[0.62rem] flex  whitespace-nowrap w-full text-ellipsis overflow-hidden items-center">
                <span className="text-[#969CA6] cursor-pointer">Doc Chat</span>
                <ChevronRightIcon className="text-[#969CA6] w-[16px]" />
                {isLoading ? (
                  <div className="w-24 h-4 rounded-sm animate-pulse bg-gray-100"></div>
                ) : (
                  <ChatName data={data} />
                )}
              </span>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-40 bg-white">
            <DropdownMenuGroup>
              <DropdownMenuItem className="hover:bg-gray-100 cursor-pointer">
                <AlertDialogTrigger asChild>
                  <span>Rename</span>
                </AlertDialogTrigger>
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-gray-100 cursor-pointer">
                <SheetTrigger asChild>
                  <span>Chat History</span>
                </SheetTrigger>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
          <RenameChatDialog
            chatName={data?.data}
            conversationId={conversationId}
            renameOpen={renameOpen}
          />
        </DropdownMenu>
        <ChatHistory />
      </AlertDialog>
    </Sheet>
  );
}

const ChatName = ({ data }: { data: any }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="text-[#585F68] truncate cursor-pointer">
            {data?.data}
          </span>
        </TooltipTrigger>
        <TooltipContent className="bg-white border">
          <p>{data?.data}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const RenameChatDialog = ({
  conversationId,
  chatName,
  renameOpen
}: {
  conversationId: string;
  chatName: string;
  renameOpen: boolean;
}) => {
  const queryClient = useQueryClient();
  const [name, setName] = useState(chatName);
  const { mutate, isPending, isSuccess, reset } = useMutation({
    mutationFn: () =>
      ApiService.mutiDocUpdateTitle({
        conversationId,
        newTitle: name.trim()
      }).then((res) => res.json()),
    onSuccess: (data) => {
      if (data.status === 'success') {
        queryClient.invalidateQueries({
          queryKey: ['doc-chat-name']
        });
      }
    }
  });

  useEffect(() => {
    if (!renameOpen) {
      reset();
    }
  }, [renameOpen]);

  const handleChange = (e) => {
    setName(e.target.value);
  };

  const handleSubmit = () => {
    if (name.trim().length > 0) {
      mutate();
    }
  };

  useEffect(() => {
    setName(chatName);
  }, [chatName]);

  return (
    <AlertDialogContent className="bg-white">
      <AlertDialogHeader>
        <AlertDialogTitle>Rename Chat</AlertDialogTitle>
      </AlertDialogHeader>
      <div className="body">
        <Input value={name} onChange={handleChange} />
      </div>
      <AlertDialogFooter>
        {isSuccess ? null : <AlertDialogCancel>Cancel</AlertDialogCancel>}
        {isSuccess && chatName === name ? (
          <AlertDialogAction>
            Name updated successfully. Close dialog
          </AlertDialogAction>
        ) : (
          <Button onClick={handleSubmit} disabled={isPending}>
            Save
          </Button>
        )}
      </AlertDialogFooter>
    </AlertDialogContent>
  );
};

const ChatHistory = () => {
  const [searchValue, setSearchValue] = useState('');
  const { user } = useUserStore();
  const { data } = useQuery({
    queryKey: ['doc-chat-history'],
    queryFn: () =>
      ApiService.multiPreviousConversations(user._id).then((res) => res.json())
  });

  if (!data) {
    return null;
  }

  return (
    <div className="flex justify-end pb-0">
      <SheetContent className="bg-white" side="left">
        <SheetHeader>
          <SheetTitle>Chat History</SheetTitle>
        </SheetHeader>
        <div className="mt-2 w-full">
          <Input
            placeholder="Search"
            className="w-full"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
        <div className="w-full overflow-auto mt-[1rem] space-y-4 overscroll-y-scroll pb-10 h-full">
          {data?.data
            ?.sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            )
            ?.filter(
              (item) =>
                item?.title?.length > 0 &&
                item?.title.toLowerCase().includes(searchValue.toLowerCase())
            )
            .map((item) => (
              <Link to={'/dashboard/doc-chat/' + item.id} key={item.id} replace>
                <div
                  key={item.id}
                  className="flex w-full h-[36px] text-[#000000] my-2 justify-between leading-5 text-[12px] rounded-[8px] border gap-2 font-normal bg-[#F9F9FB] border-none px-2 hover:bg-[#e5e5e5ba] hover:cursor-pointer"
                >
                  <button
                    // onClick={() => handleConversationClick()}
                    className="flex-1 py-2 text-ellipsis text-start truncate"
                  >
                    <span className="w-full text-ellipsis truncate">
                      {item.title}
                    </span>
                  </button>
                </div>
              </Link>
            ))}
        </div>
      </SheetContent>
    </div>
  );
};

export default BreadCrumb;
