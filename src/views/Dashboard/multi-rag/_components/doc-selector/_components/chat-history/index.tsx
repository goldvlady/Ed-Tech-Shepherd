import { SearchIcon } from '@chakra-ui/icons';
import { Input, InputGroup, InputLeftElement } from '@chakra-ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../../../../../../../components/ui/select';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { useQuery } from '@tanstack/react-query';
import ApiService from '../../../../../../../services/ApiService';
import useUserStore from '../../../../../../../state/userStore';
import { cn } from '../../../../../../../library/utils';
import { Link } from 'react-router-dom';
import { memo, useState } from 'react';
import { AnyObject } from 'chart.js/dist/types/basic';
import { format, isToday, isYesterday } from 'date-fns';

function groupConversationsByDate(conversations: any[]): any {
  return conversations
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .reduce((acc: any, conversation) => {
      const date = new Date(conversation.createdAt);
      let key = '';

      if (isToday(date)) {
        key = 'Today';
      } else if (isYesterday(date)) {
        key = 'Yesterday';
      } else {
        key = format(date, 'dd MMMM yyyy');
      }

      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(conversation);

      return acc;
    }, {});
}

function ChatHistory() {
  const { user } = useUserStore();
  const { data } = useQuery({
    queryKey: ['doc-chat-history'],
    queryFn: () =>
      ApiService.multiPreviousConversations(user._id).then((res) => res.json())
  });
  const [searchValue, setSearchValue] = useState('');

  if (!data) {
    return null;
  }
  console.log('Doc chat history', data.data);

  const groupedConversations = groupConversationsByDate(data?.data);

  console.log('groupedConversations', groupedConversations);

  return (
    <div className="bg-white h-full flex flex-col">
      <div className="w-[17.25rem] p-[1rem] pb-0">
        <div className="w-full h-[30px] flex gap-2 my-4 items-center">
          <div>
            <InputGroup className="max-h-[30px] overflow-hidden flex items-center">
              <InputLeftElement pointerEvents="none" className="max-h-[30px] ">
                <SearchIcon color="gray.300" />
              </InputLeftElement>
              <Input
                type="text"
                rounded="full"
                className="max-h-[30px]"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </InputGroup>
          </div>
          <div>
            <Select defaultValue="all">
              <SelectTrigger className="w-20 max-h-[30px] rounded-full">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectGroup>
                  <SelectItem value="all">All</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      <div className="mt-[1.56rem] w-full">
        <h5 className="font-medium text-[1.25rem] text-[#212224] text-center tracking-normal">
          Chat History
        </h5>
      </div>
      <div className="history flex-1 overflow-auto mt-[1rem] space-y-2 overscroll-y-scroll pb-10">
        {Object.keys(groupedConversations).map((date) => {
          return (
            <HistoryItemGroup date={date} item={groupedConversations[date]} />
          );
        })}
        {/* {data?.data
          ?.sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
          .filter(
            (item) =>
              Boolean(item.title) &&
              item.title.toLowerCase().includes(searchValue.toLowerCase()) &&
              item.referenceDocIds
          )
          .map((item) => (
            <HistoryItem
              key={item.id}
              id={item.id}
              title={item.title}
              documentId={
                item.referenceDocIds[
                  Math.floor(Math.random() * item.referenceDocIds.length)
                ]
              }
            />
          ))} */}
      </div>
    </div>
  );
}

const HistoryItemGroup = ({ item, date }: { date: string; item: any }) => {
  return (
    <div className="w-full flex gap-2 flex-col my-2">
      <p className="text-[10px] text-[#585F68] font-normal pl-5">{date}</p>
      <div className="group-items flex flex-col gap-2">
        {item.map((conversation) => {
          return (
            <HistoryItem
              key={conversation.id}
              id={conversation.id}
              title={conversation.title}
            />
          );
        })}
      </div>
    </div>
  );
};

function truncateText(text, maxLength) {
  if (!text) return '';
  if (text.length > maxLength) {
    return text.slice(0, maxLength) + '...';
  } else {
    return text;
  }
}

const HistoryItem = memo(({ id, title }: { id: string; title: string }) => {
  return (
    <Link to={id}>
      <div
        className={cn(
          'border h-[10.31rem] w-[10.31rem] rounded-[10px] bg-white relative p-[0.68rem] flex items-end transition-all cursor-pointer mx-auto my-2 hover:shadow-md'
        )}
      >
        <div className="w-[1.87rem] h-[1.87rem] absolute rounded-full bg-[#F9F9FB] top-0 right-0 m-[0.68rem] flex justify-center items-center cursor-pointer z-10">
          <DotsHorizontalIcon />
        </div>
        {/* <PdfFirstPageImage documentId={documentId} /> */}
        <div className="flex items-center gap-1 justify-between w-full z-10">
          <p className="text-[#585F68] text-[10px] whitespace-nowrap">
            {truncateText(title, 25)}
          </p>
        </div>
      </div>
    </Link>
  );
});

// const PdfFirstPageImage = ({ documentId }: { documentId: string }) => {
//   const { data: pdfDocument } = useQuery({
//     queryKey: ['multiDocVectorDoc', { documentId }],
//     queryFn: () =>
//       ApiService.multiDocVectorDoc(documentId).then((res) => res.json()),
//     select(data) {
//       if (data.status === 'success') {
//         return data.data;
//       }
//       return null;
//     },
//     enabled: Boolean(documentId)
//   });
//   if (!pdfDocument) return null;

//   const pdfURL = `https://shepherd-document-upload.s3.us-east-2.amazonaws.com/${pdfDocument.collection_name}`;
//   return (
//     <div className="pointer-events-none absolute w-full h-full pt-[1.36rem] pr-[1.36rem]">
//       <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
//         <Viewer
//           fileUrl={pdfURL}
//           defaultScale={SpecialZoomLevel.PageFit}
//           viewMode={ViewMode.SinglePage}
//           scrollMode={ScrollMode.Page}
//         />
//       </Worker>
//     </div>
//   );
// };

export default ChatHistory;
