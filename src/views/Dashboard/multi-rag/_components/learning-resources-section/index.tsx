import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { cn } from '../../../../../library/utils';
import { useQuery } from '@tanstack/react-query';
import ApiService from '../../../../../services/ApiService';

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
        <SummarySection conversationID={conversationID} />
        <HighlightsSection
          documentId={documentId}
          setHighlightedDocumentPageIndex={setHighlightedDocumentPageIndex}
        />
        <PinnedSection />
        <GenerateQuizSection />
        <GenerateFlashcardsSection />
      </div>
    </div>
  );
};

const SummarySection = ({ conversationID }: { conversationID: string }) => {
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
        // ApiService.multiDocSummary(JSON.stringify(docIDs))
        //   .then((res) => res.json())
        //   .then((newData) => {
        //     console.log('new data', newData);
        //     if (newData.status === 'success') {
        //       setSummaries(newData.data);
        //     }
        //   });
        return docIDs;
      } else {
        return [];
      }
    }
  });

  const { data: summary } = useQuery({
    queryKey: ['summary', data],
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
    }
  });

  console.log('multiDocSummary', summary);

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
          'absolute w-[31.25rem] bg-white rounded-md shadow-md right-0 top-10 pointer-events-none opacity-0 transition-opacity max-h-[29rem] overflow-y-scroll no-scrollbar',
          {
            'opacity-100 pointer-events-auto': summaryExpanded
          }
        )}
      >
        <p className="p-[1.625rem] text-[#585F68] text-[0.75rem]">
          {summary
            ? summary.length > 0
              ? summary[0]
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
          'absolute w-[31.25rem] bg-white rounded-md shadow-md right-0 top-10 pointer-events-none opacity-0 transition-opacity max-h-[29rem] overflow-y-scroll no-scrollbar',
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

const PinnedSection = () => {
  return <ActionButton>Pinned</ActionButton>;
};

const GenerateQuizSection = () => {
  return <ActionButton>Generate Quiz</ActionButton>;
};

const GenerateFlashcardsSection = () => {
  return <ActionButton>Generate Flashcards</ActionButton>;
};

export default LearningResourcesSection;
