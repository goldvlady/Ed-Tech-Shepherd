import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { cn } from '../../../../../library/utils';
import { useQuery } from '@tanstack/react-query';
import ApiService from '../../../../../services/ApiService';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '../../../../../components/ui/sheet';
import { Button } from '../../../../../components/ui/button';
import useUserStore from '../../../../../state/userStore';
import { Link } from 'react-router-dom';

const LearningResourcesSection = ({
  conversationID,
  selectedDocumentID: documentId,
  setHighlightedDocumentPageIndex
}: {
  conversationID: string;
  selectedDocumentID: string;
  setHighlightedDocumentPageIndex;
}) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <div>
      <ChatHistory />
      <div className="w-[10rem] flex justify-end p-4 pb-0">
        <ActionButton onClick={() => setExpanded(!expanded)}>
          <span className="flex items-center justify-center">
            Quick Action
            <ChevronDown
              className={cn('w-[18px] transition-transform rotate-[-90deg]', {
                'rotate-0': expanded
              })}
            />
          </span>
        </ActionButton>
      </div>
      <div
        className={cn(
          'items mt-2 flex justify-end items-end gap-3 p-4 pt-2 flex-col w-full opacity-0 pointer-events-none transition-opacity',
          {
            'opacity-100 pointer-events-auto': expanded
          }
        )}
      >
        <SummarySection
          conversationID={conversationID}
          selectedDoc={documentId}
        />
        <HighlightsSection
          documentId={documentId}
          setHighlightedDocumentPageIndex={setHighlightedDocumentPageIndex}
        />
        <PinnedSection convId={conversationID} />
        <GenerateQuizSection />
        <GenerateFlashcardsSection />
      </div>
    </div>
  );
};

const ChatHistory = () => {
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
    <div className="flex justify-end p-4 pb-0">
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            className="top-0 right-0 rounded-full bg-primaryBlue text-white"
            size="sm"
          >
            <span className="text-xs">History</span>
          </Button>
        </SheetTrigger>
        <SheetContent className="bg-white">
          <SheetHeader>
            <SheetTitle>Chat History</SheetTitle>
          </SheetHeader>
          <div className="w-full overflow-auto mt-[1rem] space-y-2 overscroll-y-scroll pb-10 h-full">
            {data?.data
              ?.filter((item) => item?.title?.length > 0)
              .map((item) => (
                <Link
                  to={'/dashboard/doc-chat/' + item.id}
                  key={item.id}
                  replace
                >
                  <div
                    key={item.id}
                    className="flex w-full h-[36px] text-[#000000] justify-between leading-5 text-[12px] rounded-[8px] border gap-2 font-normal bg-[#F9F9FB] border-none px-2 hover:bg-[#e5e5e5ba] hover:cursor-pointer"
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

const SummarySection = ({
  conversationID,
  selectedDoc
}: {
  conversationID: string;
  selectedDoc?: string;
}) => {
  const [summaryExpanded, setSummaryExpanded] = useState(false);
  const [summaries, setSummaries] = useState([]);

  const { data } = useQuery({
    queryKey: ['documentsBasedOnConversationID'],
    queryFn: () =>
      ApiService.fetchMultiDocBasedOnConversationID(conversationID).then(
        (res) => res.json()
      ),
    select: (data) => {
      if (data.status === 'success') {
        const docIDs = data.data.map((item) => item.document_id);

        return docIDs;
      } else {
        return [];
      }
    },
    placeholderData: () => []
  });
  console.log(data);
  const { data: summary } = useQuery({
    queryKey: ['summary'],
    queryFn: () =>
      ApiService.multiDocSummary(JSON.stringify(data)).then((res) =>
        res.json()
      ),
    select: (data) => {
      if (data.status === 'success') {
        return data.data;
      } else {
        return [];
      }
    },
    enabled: data && data.length > 0
  });

  const index = data?.indexOf(selectedDoc);

  const toggleExpand = () => {
    setSummaryExpanded(!summaryExpanded);
  };
  return (
    <div className="relative">
      <ActionButton active={summaryExpanded} onClick={toggleExpand}>
        Summary
      </ActionButton>
      <div
        className={cn(
          'absolute w-[31.25rem] bg-white rounded-md shadow-md right-0 top-10 pointer-events-none opacity-0 transition-opacity max-h-[29rem] overflow-y-scroll no-scrollbar z-50',
          {
            'opacity-100 pointer-events-auto': summaryExpanded
          }
        )}
      >
        <p className="p-[1.625rem] text-[#585F68] text-[0.75rem]">
          {summary
            ? summary.length > 0
              ? summary[index]
              : 'No summaries found'
            : 'Loading summaries...'}
        </p>
      </div>
    </div>
  );
};

const HighlightsSection = ({
  documentId,
  setHighlightedDocumentPageIndex
}: {
  setHighlightedDocumentPageIndex;
  documentId: string;
}) => {
  const [expanded, setExpanded] = useState(false);

  const { data: highlightPositions } = useQuery({
    queryKey: ['documentHighlight', documentId],
    queryFn: () =>
      ApiService.getMultiDocHighlight(documentId).then((res) => res.json()),
    select(data) {
      if (data.status === 'success') {
        const positions = data.data.flatMap((item) => {
          return JSON.parse(item.highlight);
        });
        return [].concat(...positions);
      } else {
        return [];
      }
    }
  });

  console.log('highlightPositions', highlightPositions);

  const HighlightItem = ({
    title,
    onClick
  }: {
    title: string;
    onClick: () => void;
  }) => {
    return (
      <div
        className="p-2 bg-orange-200 rounded-md transition-shadow hover:shadow-md cursor-pointer"
        role="listitem"
        onClick={onClick}
      >
        <p className="text-xs font-normal">{title}</p>
      </div>
    );
  };

  return (
    <div className="relative">
      <ActionButton
        active={expanded}
        onClick={() => {
          setExpanded(!expanded);
        }}
      >
        Highlights
      </ActionButton>
      <div
        className={cn(
          'absolute w-[31.25rem] bg-white rounded-md shadow-md right-0 top-10 pointer-events-none opacity-0 transition-opacity max-h-[29rem] overflow-y-scroll no-scrollbar z-50',
          {
            'opacity-100 pointer-events-auto': expanded
          }
        )}
      >
        <div className="p-2 space-y-2">
          {highlightPositions?.map((item) => (
            <HighlightItem
              title={item.name}
              onClick={() => {
                const pageIndex = item.position[0]
                  ? item.position[0].pageIndex
                  : 0;
                setHighlightedDocumentPageIndex(pageIndex);
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const PinnedSection = ({ convId }: { convId: string }) => {
  const [expanded, setExpanded] = useState(false);
  const { data } = useQuery({
    queryKey: ['pinned-messages'],
    queryFn: () =>
      ApiService.getPinnedMessages(convId).then((res) => res.json())
  });

  console.log('Pinned section', data);

  return (
    <div className="relative">
      <ActionButton
        active={expanded}
        onClick={() => {
          setExpanded(!expanded);
        }}
      >
        Pinned
      </ActionButton>
      <div
        className={cn(
          'absolute w-[31.25rem] bg-white rounded-md shadow-md right-0 top-10 pointer-events-none opacity-0 transition-opacity max-h-[29rem] overflow-y-scroll no-scrollbar z-50',
          {
            'opacity-100 pointer-events-auto': expanded
          }
        )}
      >
        <div className="p-2"></div>
      </div>
    </div>
  );
};

const GenerateQuizSection = () => {
  return <ActionButton>Generate Quiz</ActionButton>;
};

const GenerateFlashcardsSection = () => {
  return <ActionButton>Generate Flashcards</ActionButton>;
};

const ActionButton = ({
  children,
  onClick,
  active
}: {
  active?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}) => (
  <div
    className={cn(
      'h-[30px] rounded-[10px] bg-white flex justify-center items-center cursor-pointer select-none transition-shadow hover:shadow-md px-[0.43rem] py-[0.93rem]',
      {
        'bg-[#F2F2F2]': active
      }
    )}
    role="button"
    onClick={onClick}
  >
    <span className="text-xs inline-block text-black whitespace-nowrap">
      {children}
    </span>
  </div>
);
export default LearningResourcesSection;
