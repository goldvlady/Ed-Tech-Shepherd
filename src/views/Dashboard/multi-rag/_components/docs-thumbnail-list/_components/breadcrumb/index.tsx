import { ChevronRightIcon } from '@radix-ui/react-icons';
import { useQuery } from '@tanstack/react-query';
import ApiService from '../../../../../../../services/ApiService';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '../../../../../../../components/ui/tooltip';

function BreadCrumb({ conversationId }: { conversationId: string }) {
  const { data, isLoading } = useQuery({
    queryKey: ['doc-chat-name', conversationId],
    queryFn: () =>
      ApiService.multiDocGetTitle(conversationId).then((res) => res.json())
  });

  return (
    <div className="h-[1.56rem] shadow-md bg-white rounded-[10px] flex justify-start items-center px-[0.87rem] select-none">
      <span className="text-[0.62rem] flex  whitespace-nowrap w-full text-ellipsis overflow-hidden items-center">
        <span className="text-[#969CA6]">Doc Chat</span>
        <ChevronRightIcon className="text-[#969CA6] h-[10px]" />
        {isLoading ? (
          <div className="w-24 h-4 rounded-sm animate-pulse bg-gray-100"></div>
        ) : (
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
        )}
      </span>
    </div>
  );
}

export default BreadCrumb;
