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
// import { Worker } from '@react-pdf-viewer/core';
// import {
//   Viewer,
//   SpecialZoomLevel,
//   ViewMode,
//   ScrollMode
// } from '@react-pdf-viewer/core';
import { Link } from 'react-router-dom';
import { memo } from 'react';

function ChatHistory() {
  const { user } = useUserStore();
  const { data } = useQuery({
    queryKey: ['doc-chat-history'],
    queryFn: () =>
      ApiService.multiPreviousConversations(user._id).then((res) => res.json())
  });

  if (!data) {
    return null;
  }
  console.log('Doc chat history', data.data);

  return (
    <div className="bg-white h-full flex flex-col">
      <div className="w-[17.25rem] p-[1rem] pb-0">
        <div className="w-full h-[30px] flex gap-2 my-4 items-center">
          <div>
            <InputGroup className="max-h-[30px] overflow-hidden flex items-center">
              <InputLeftElement pointerEvents="none" className="max-h-[30px] ">
                <SearchIcon color="gray.300" />
              </InputLeftElement>
              <Input type="text" rounded="full" className="max-h-[30px]" />
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
        {data.data.map((item) => (
          <HistoryItem
            key={item.id}
            id={item.id}
            title={document.title}
            documentId={
              item.referenceDocIds[
                Math.floor(Math.random() * item.referenceDocIds.length)
              ]
            }
          />
        ))}
      </div>
    </div>
  );
}

function truncateText(text, maxLength) {
  if (!text) return '';
  if (text.length > maxLength) {
    const extension = text.substring(text.lastIndexOf('.'));
    return text.slice(0, maxLength - extension.length - 3) + '...' + extension;
  } else {
    return text;
  }
}

const HistoryItem = memo(
  ({
    id,
    title,
    documentId
  }: {
    id: string;
    title: string;
    documentId: string;
  }) => {
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
  }
);

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
