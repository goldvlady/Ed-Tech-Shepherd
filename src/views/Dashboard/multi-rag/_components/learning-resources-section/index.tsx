import { ChevronDown } from 'lucide-react';
import { useEffect, useState } from 'react';
import { cn } from '../../../../../library/utils';
import { useQuery } from '@tanstack/react-query';
import ApiService from '../../../../../services/ApiService';
import ShareModal from '../../../../../components/ShareModal';
import { User } from '../../../../../types';
import { Share1Icon } from '@radix-ui/react-icons';

const LearningResourcesSection = ({
  conversationID,
  selectedDocumentID: documentId,
  setHighlightedDocumentPageIndex,
  user
}: {
  conversationID: string;
  selectedDocumentID: string;
  setHighlightedDocumentPageIndex;
  user: User;
}) => {
  const [expanded, setExpanded] = useState(false);
  const [currentTabOpened, setCurrentTabOpened] = useState<
    'Summary' | 'Highlight' | 'Pinned' | ''
  >('');
  return (
    <div>
      <div className="w-[10rem] flex justify-end p-4 pb-0">
        <ActionButton onClick={() => setExpanded(!expanded)}>
          <span className="flex items-center justify-center">
            Quick Actions
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
        {user && (
          <ShareModal
            type="docchat"
            customTriggerComponent={
              <div className="h-[30px] rounded-[10px] bg-white flex justify-center items-center cursor-pointer select-none transition-shadow hover:shadow-md px-[0.43rem] py-[0.93rem]">
                <Share1Icon className="mr-2" />
                <span className="text-xs inline-block text-black whitespace-nowrap">
                  Share
                </span>
              </div>
            }
          />
        )}
        <SummarySection
          conversationID={conversationID}
          selectedDoc={documentId}
          setCurrentTabOpened={setCurrentTabOpened}
          currentTabOpened={currentTabOpened}
        />
        <HighlightsSection
          documentId={documentId}
          setHighlightedDocumentPageIndex={setHighlightedDocumentPageIndex}
          setCurrentTabOpened={setCurrentTabOpened}
          currentTabOpened={currentTabOpened}
        />
        <PinnedSection
          convId={conversationID}
          setCurrentTabOpened={setCurrentTabOpened}
          currentTabOpened={currentTabOpened}
        />
        <GenerateQuizSection />
        <GenerateFlashcardsSection />
      </div>
    </div>
  );
};

const SummarySection = ({
  conversationID,
  selectedDoc,
  setCurrentTabOpened,
  currentTabOpened
}: {
  conversationID: string;
  selectedDoc?: string;
  setCurrentTabOpened: any;
  currentTabOpened: string;
}) => {
  const [summaryExpanded, setSummaryExpanded] = useState(false);

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
    setCurrentTabOpened('Summary');
  };

  useEffect(() => {
    if (currentTabOpened !== 'Summary') {
      setSummaryExpanded(false);
    }
  }, [currentTabOpened]);
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
  setHighlightedDocumentPageIndex,
  setCurrentTabOpened,
  currentTabOpened
}: {
  setHighlightedDocumentPageIndex;
  documentId: string;
  setCurrentTabOpened: any;
  currentTabOpened: string;
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

  useEffect(() => {
    if (currentTabOpened !== 'Highlight') {
      setExpanded(false);
    }
  }, [currentTabOpened]);

  return (
    <div className="relative">
      <ActionButton
        active={expanded}
        onClick={() => {
          setExpanded(!expanded);
          setCurrentTabOpened('Highlight');
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

const PinnedSection = ({
  convId,
  setCurrentTabOpened,
  currentTabOpened
}: {
  convId: string;
  setCurrentTabOpened: any;
  currentTabOpened: string;
}) => {
  const [expanded, setExpanded] = useState(false);
  const { data } = useQuery({
    queryKey: ['pinned-messages'],
    queryFn: () =>
      ApiService.getPinnedMessages(convId).then((res) => res.json()),
    select: (data) => {
      if (data.status === 'success') {
        return data.data;
      } else {
        return [];
      }
    }
  });

  console.log('Pinned section', data);

  useEffect(() => {
    if (currentTabOpened !== 'Pinned') {
      setExpanded(false);
    }
  }, [currentTabOpened]);

  return (
    <div className="relative">
      <ActionButton
        active={expanded}
        onClick={() => {
          setExpanded(!expanded);
          setCurrentTabOpened('Pinned');
        }}
      >
        Pinned
      </ActionButton>
      <div
        className={cn(
          'absolute w-[31.25rem] bg-white rounded-md shadow-md right-0 top-10 pointer-events-none opacity-0 transition-opacity max-h-[29rem] overflow-y-scroll no-scrollbar z-50 space-y-2 p-2',
          {
            'opacity-100 pointer-events-auto': expanded
          }
        )}
      >
        {data?.map((item) => {
          return (
            <div className="p-2 border rounded-md">
              <p className="text-xs">{item.log.content}</p>
            </div>
          );
        })}
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
