import { ChevronRightIcon } from '@radix-ui/react-icons';
import { useQuery } from '@tanstack/react-query';
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
import React, { useState } from 'react';
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

function BreadCrumb({ conversationId }: { conversationId: string }) {
  const { data, isLoading } = useQuery({
    queryKey: ['doc-chat-name', conversationId],
    queryFn: () =>
      ApiService.multiDocGetTitle(conversationId).then((res) => res.json())
  });

  return (
    <div className="h-[1.56rem] shadow-md bg-white rounded-[10px] flex justify-start items-center px-[0.87rem] select-none">
      <span className="text-[0.62rem] flex  whitespace-nowrap w-full text-ellipsis overflow-hidden items-center">
        <ChatHistory>
          <span className="text-[#969CA6] cursor-pointer">Doc Chat</span>
        </ChatHistory>
        <ChevronRightIcon className="text-[#969CA6] h-[10px]" />
        {isLoading ? (
          <div className="w-24 h-4 rounded-sm animate-pulse bg-gray-100"></div>
        ) : (
          <ChatName data={data} />
        )}
      </span>
    </div>
  );
}

const ChatName = ({ data }: { data: any }) => {
  return (
    <AlertDialog>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <AlertDialogTrigger asChild>
              <span className="text-[#585F68] truncate cursor-pointer">
                {data?.data}
              </span>
            </AlertDialogTrigger>
          </TooltipTrigger>
          <TooltipContent className="bg-white border">
            <p>{data?.data}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <AlertDialogContent className="bg-white">
        <div className="p-2">
          <Input placeholder="Name of Chat" />
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

const ChatHistory = ({ children }: { children: React.ReactNode }) => {
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
      <Sheet>
        <SheetTrigger asChild>{children}</SheetTrigger>
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
              ?.filter(
                (item) =>
                  item?.title?.length > 0 &&
                  item?.title.toLowerCase().includes(searchValue.toLowerCase())
              )
              .map((item) => (
                <Link
                  to={'/dashboard/doc-chat/' + item.id}
                  key={item.id}
                  replace
                >
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
      </Sheet>
    </div>
  );
};

export default BreadCrumb;
