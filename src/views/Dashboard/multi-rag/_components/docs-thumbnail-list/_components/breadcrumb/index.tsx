import { ChevronRightIcon } from '@radix-ui/react-icons';
import { useQuery } from '@tanstack/react-query';
import ApiService from '../../../../../../../services/ApiService';

function BreadCrumb({ conversationId }: { conversationId: string }) {
  const { data, isLoading } = useQuery({
    queryKey: ['doc-chat-name', conversationId],
    queryFn: () =>
      ApiService.multiDocGetTitle(conversationId).then((res) => res.json())
  });

  console.log('conversation name', data);

  return (
    <div className="h-[1.56rem] shadow-md bg-white rounded-[10px] flex justify-start items-center px-[0.87rem] select-none">
      <span className="text-[0.62rem] flex  whitespace-nowrap w-full text-ellipsis overflow-hidden items-center">
        <span className="text-[#969CA6]">Doc Chat</span>
        <ChevronRightIcon className="text-[#969CA6] h-[10px]" />
        {isLoading ? (
          <div className="w-24 h-4 rounded-sm animate-pulse bg-gray-100"></div>
        ) : (
          <span className="text-[#585F68] truncate">{data?.data}</span>
        )}
      </span>
    </div>
  );
}

export default BreadCrumb;
