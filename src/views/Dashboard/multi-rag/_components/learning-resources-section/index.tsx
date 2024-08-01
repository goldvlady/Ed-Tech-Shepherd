import {
  ChevronDown,
  File,
  Highlighter,
  PinOff,
  TrashIcon
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Checkbox } from '../../../../../components/ui/checkbox';
import { cn } from '../../../../../library/utils';
import { useMutation, useQuery } from '@tanstack/react-query';
import ApiService from '../../../../../services/ApiService';
import ShareModal from '../../../../../components/ShareModal';
import { FlashcardData, QuizData, User } from '../../../../../types';
import { Share1Icon } from '@radix-ui/react-icons';
import CustomMarkdownView, {
  stripMarkdown
} from '../../../../../components/CustomComponents/CustomMarkdownView';
import { useVectorsStore } from '../../../../../state/vectorsStore';
import { GenerateFlashcardModal, GenerateQuizModal } from './generate-modals';
import { Button } from '../../../../../components/ui/button';
import { useNavigate } from 'react-router';

const LearningResourcesSection = ({
  conversationID,
  selectedDocumentID: documentId,
  setHighlightedDocumentPageIndex,
  user,
  refetch
}: {
  conversationID: string;
  selectedDocumentID: string;
  setHighlightedDocumentPageIndex;
  user: User;
  refetch: boolean;
}) => {
  const [flashcardsPageIndex, setFlashcardsPageIndex] = useState(1);
  const [quizzesPageIndex, setQuizzesPageIndex] = useState(1);
  const [expanded, setExpanded] = useState(false);
  const [currentTabOpened, setCurrentTabOpened] = useState<
    | 'Summary'
    | 'Highlight'
    | 'Pinned'
    | 'Flashcards'
    | 'Quizzes'
    | ''
    | 'Flashcards_View'
    | 'Quizzes_View'
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
          refetch={refetch}
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
        <QuizzesViewSection
          currentTabOpened={currentTabOpened}
          conversationId={conversationID}
          index={quizzesPageIndex}
          setIndex={setQuizzesPageIndex}
          setCurrentTabOpened={setCurrentTabOpened}
        />
        <GenerateQuizSection
          index={quizzesPageIndex}
          setCurrentTabOpened={setCurrentTabOpened}
          currentTabOpened={currentTabOpened}
        />
        <FlashcardsViewSection
          currentTabOpened={currentTabOpened}
          conversationId={conversationID}
          index={flashcardsPageIndex}
          setIndex={setFlashcardsPageIndex}
          setCurrentTabOpened={setCurrentTabOpened}
        />
        <GenerateFlashcardsSection
          index={flashcardsPageIndex}
          setCurrentTabOpened={setCurrentTabOpened}
          currentTabOpened={currentTabOpened}
        />
      </div>
    </div>
  );
};

const SummarySection = ({
  conversationID,
  selectedDoc,
  setCurrentTabOpened,
  currentTabOpened,
  refetch
}: {
  conversationID: string;
  selectedDoc?: string;
  setCurrentTabOpened: any;
  currentTabOpened: string;
  refetch: boolean;
}) => {
  const [summaryExpanded, setSummaryExpanded] = useState(false);
  const [summaries, setSummaries] = useState([]);
  const ref = useRef(null);
  const docIds = useVectorsStore((state) => state.chatDocuments).map(
    (item) => item.document_id
  );
  const { data: summary } = useQuery({
    queryKey: ['summary', docIds],
    queryFn: () =>
      ApiService.multiDocSummary(JSON.stringify(docIds)).then((res) =>
        res.json()
      ),
    select: (data) => {
      if (data.status === 'success') {
        if (summaries.length === 0) {
          setSummaries(data.data);
        }
        return data.data;
      } else {
        return [];
      }
    },
    enabled: docIds && docIds.length > 0
  });

  const index = docIds?.indexOf(selectedDoc);

  const toggleExpand = () => {
    setSummaryExpanded(!summaryExpanded);
    setCurrentTabOpened('Summary');
  };

  useEffect(() => {
    if (currentTabOpened !== 'Summary') {
      setSummaryExpanded(false);
    }
  }, [currentTabOpened]);

  const handleClickOutside = (event) => {
    if (ref.current && !ref.current.contains(event.target)) {
      setSummaryExpanded(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  return (
    <div className="relative">
      <ActionButton active={summaryExpanded} onClick={toggleExpand}>
        Summary
      </ActionButton>
      <div
        ref={ref}
        className={cn(
          'absolute w-[31.25rem] bg-white rounded-md shadow-md right-0 top-10 pointer-events-none opacity-0 transition-opacity max-h-[29rem] overflow-y-scroll no-scrollbar z-50',
          {
            'opacity-100 pointer-events-auto': summaryExpanded
          }
        )}
      >
        {summary && summary?.length === 0 ? (
          <div className="bg-white p-4 h-64 flex justify-center items-center">
            <div className="flex justify-center flex-col gap-2 mr-2">
              <File className="w-24 font-[4rem]" size={60} />
              <p className="text-xs text-center">Summary not found</p>
            </div>
          </div>
        ) : (
          <p className="p-[1.625rem] text-[#585F68] text-[0.75rem]">
            {summary ? (
              summary.length > 0 ? (
                <CustomMarkdownView
                  source={summary[index]}
                  paragraphClass="[&_p]:leading-[20px] !px-0 py-0 !shadow-none"
                />
              ) : (
                'No summaries found'
              )
            ) : (
              'Loading summaries...'
            )}
          </p>
        )}
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
  const ref = useRef(null);

  const { data: highlightPositions, refetch } = useQuery({
    queryKey: ['documentHighlight', documentId],
    queryFn: () =>
      ApiService.getMultiDocHighlight(documentId).then((res) => res.json()),
    select(data) {
      if (data.status === 'success') {
        console.log(data.data, 'HIGHLIGHT FROM API');
        console.log(
          data.data.map((item) => {
            return JSON.parse(item.highlight);
          }),
          'MAP OVER FLAT MAP'
        );
        const positions = data.data.flatMap((item) => {
          return JSON.parse(item.highlight);
        });
        console.log(positions, 'Positions flat map from the actual data');
        return [].concat(...positions);
      } else {
        return [];
      }
    }
  });
  const { mutate, isPending } = useMutation({
    mutationKey: ['delete-highlight'],
    mutationFn: (data: any) =>
      ApiService.multiDocHighlightDelete(data).then((res) => res.json()),
    onSuccess: () => refetch()
  });
  console.log('highlightPositions', highlightPositions);

  const HighlightItem = ({
    title,
    onClick,
    deleteHandler,
    isDeletingHighlight
  }: {
    title: string;
    onClick: () => void;
    deleteHandler: (highlightText: string) => void;
    isDeletingHighlight: boolean;
  }) => {
    return (
      <div
        className="p-2 flex items-start bg-orange-200 rounded-md transition-shadow hover:shadow-md cursor-pointer"
        role="listitem"
      >
        <p onClick={onClick} className="text-xs font-normal flex-1">
          {title}
        </p>
        <TrashIcon
          style={{ pointerEvents: isDeletingHighlight ? 'none' : 'auto' }}
          onClick={() => deleteHandler(title)}
          className={cn(
            'text-red-500 w-4 ml-auto mr-0.5 cursor:pointer hover:text-red-300',
            isDeletingHighlight && 'text-red-400'
          )}
        />
      </div>
    );
  };

  useEffect(() => {
    if (currentTabOpened !== 'Highlight') {
      setExpanded(false);
    }
  }, [currentTabOpened]);

  const handleClickOutside = (event) => {
    if (ref.current && !ref.current.contains(event.target)) {
      setExpanded(false);
    }
  };
  const deleteHandler = (highlightText: string) => {
    const highlight = highlightPositions.find((h) =>
      h.name.includes(highlightText)
    );
    console.log(highlight);
    if (highlight) {
      mutate({ highlight, documentId });
    }
  };
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
        ref={ref}
        className={cn(
          'absolute w-[31.25rem] bg-white rounded-md shadow-md right-0 top-10 pointer-events-none opacity-0 transition-opacity max-h-[29rem] overflow-y-scroll no-scrollbar z-50',
          {
            'opacity-100 pointer-events-auto': expanded
          }
        )}
      >
        {!highlightPositions?.length ? (
          <div className="h-60 flex justify-center items-center flex-col">
            <Highlighter size={48} />
            <p className="p-2 text-sm text-gray-500">No highlights found</p>
          </div>
        ) : (
          <div className="p-2 space-y-2">
            {highlightPositions?.map((item) => (
              <HighlightItem
                title={item.name}
                onClick={() => {
                  // const pageIndex = item.position[0]
                  //   ? item.position[0].pageIndex
                  //   : 0;
                  //setHighlightedDocumentPageIndex(pageIndex);
                }}
                deleteHandler={deleteHandler}
                isDeletingHighlight={isPending}
              />
            ))}
          </div>
        )}
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
  const ref = useRef(null);
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

  const handleClickOutside = (event) => {
    if (ref.current && !ref.current.contains(event.target)) {
      setExpanded(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  console.log('Pinned section', data);

  useEffect(() => {
    if (currentTabOpened !== 'Pinned') {
      setExpanded(false);
    }
  }, [currentTabOpened]);
  const normalizeText = (text: string) => {
    return text.replace(/\s+/g, ' ').toLowerCase();
  };
  function getCharFrequency(str: string) {
    const frequency = {};
    for (const char of str) {
      if (char.trim()) {
        frequency[char] = (frequency[char] || 0) + 1;
      }
    }
    return frequency;
  }

  function containsCharFrequency(sub: string, full: string) {
    const subFrequency = getCharFrequency(sub);
    const fullFrequency = getCharFrequency(full);

    for (const char in subFrequency) {
      if (!fullFrequency[char] || subFrequency[char] > fullFrequency[char]) {
        return false;
      }
    }
    return true;
  }
  const scrollToMessage = (text: string) => {
    console.log(text);
    const containers = document.querySelectorAll(
      '.memoized-react-markdown.bot'
    );
    console.log(containers);
    const c = stripMarkdown(text).replace(/-:/g, ':');
    containers.forEach((container) => {
      let fullText = '';
      const elements = container.querySelectorAll('*'); // Select all children
      elements.forEach((element) => {
        fullText += element.textContent || '';
      });

      const ft = fullText;
      const isMatch = containsCharFrequency(c, ft);
      if (isMatch) {
        setExpanded(false);
        container.scrollIntoView({ behavior: 'smooth' });
      }
      // console.log(ft, "FULL TEXT");
      // console.log(c);
      // console.log(ft.includes(c));
    });
  };

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
        ref={ref}
        className={cn(
          'absolute w-[31.25rem] bg-white rounded-md shadow-md right-0 top-10 pointer-events-none opacity-0 transition-opacity max-h-[29rem] overflow-y-scroll no-scrollbar z-50 space-y-2 p-2',
          {
            'opacity-100 pointer-events-auto': expanded
          }
        )}
      >
        {!data?.length ? (
          <div className="h-60 flex justify-center items-center flex-col">
            <PinOff size={48} />
            <p className="p-2 text-sm text-gray-500 text-center">
              No pinned messages yet. <br />
              Pin a message to see it here.
            </p>
          </div>
        ) : (
          data?.map((item) => {
            return (
              <div
                onClick={() => scrollToMessage(item.log.content)}
                className="p-2.5 mb-2 cursor-pointer border  rounded-md hover:bg-slate-50"
              >
                <CustomMarkdownView
                  source={item.log.content}
                  paragraphClass="[&_p]:leading-[20px] !text-xs !px-0 py-0 !shadow-none"
                />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

const GenerateQuizSection = ({
  setCurrentTabOpened,
  currentTabOpened,
  index
}: {
  setCurrentTabOpened: any;
  currentTabOpened: string;
  index: number;
}) => {
  const [quizExpanded, setQuizExpanded] = useState(false);
  const docNames = useVectorsStore((state) => state.chatDocuments).map(
    (d) => d.collection_name
  );
  const [selectedDocs, setSelectedDocs] = useState<Array<string>>([]);
  const [isOpen, setIsOpen] = useState(false);
  console.log('sELECTED DOCS FROM QUIZ', selectedDocs);
  const ref = useRef(null);
  const toggleExpand = () => {
    setQuizExpanded(!quizExpanded);
    setCurrentTabOpened('Quizzes');
  };

  useEffect(() => {
    if (currentTabOpened !== 'Quizzes') {
      setQuizExpanded(false);
    }
  }, [currentTabOpened]);

  const handleClickOutside = (event) => {
    if (ref.current && !ref.current.contains(event.target)) {
      setQuizExpanded(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  return (
    <div className="relative">
      <ActionButton active={quizExpanded} onClick={toggleExpand}>
        Generate Quiz
      </ActionButton>
      <div
        ref={ref}
        className={cn(
          'absolute flex flex-col gap-2 items-center  w-[15.25rem] bg-white rounded-md shadow-md right-0 p-1 top-10 pointer-events-none opacity-0 transition-opacity max-h-[29rem] overflow-y-scroll no-scrollbar z-50',
          {
            'opacity-100 pointer-events-auto': quizExpanded
          }
        )}
      >
        {docNames.length > 0
          ? docNames.map((d) => (
              <div className="flex text-xs items-center bg-stone-50 p-2.5  gap-2 hover:bg-stone-100">
                <Checkbox
                  checked={selectedDocs.includes(d)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedDocs((prev) => prev.concat(d));
                    } else {
                      const existing = [...selectedDocs];
                      setSelectedDocs(existing.filter((e) => e !== d));
                    }
                  }}
                />
                <span key={d}>{d}</span>
              </div>
            ))
          : null}
        <button
          className="px-3 py-2 self-center rounded-md bg-primaryBlue disabled:bg-blue-200 hover:bg-blue-400 text-white text-sm"
          disabled={selectedDocs.length === 0}
          onClick={() => setIsOpen(true)}
        >
          Configure Quiz
        </button>
      </div>
      <GenerateQuizModal
        index={index}
        isOpen={isOpen}
        onClose={() => {
          setSelectedDocs([]);
          setIsOpen(false);
        }}
        docNames={selectedDocs}
      />
    </div>
  );
};

const GenerateFlashcardsSection = ({
  setCurrentTabOpened,
  currentTabOpened,
  index
}: {
  setCurrentTabOpened: any;
  currentTabOpened: string;
  index: number;
}) => {
  const [flashcardExpanded, setFlashcardExpanded] = useState(false);
  const docNames = useVectorsStore((state) => state.chatDocuments).map(
    (d) => d.collection_name
  );
  const [selectedDocs, setSelectedDocs] = useState<Array<string>>([]);
  const [isOpen, setIsOpen] = useState(false);
  console.log('SELECTED DCOS FROM FLASHCARD', selectedDocs);
  const ref = useRef(null);
  const toggleExpand = () => {
    setFlashcardExpanded(!flashcardExpanded);
    setCurrentTabOpened('Flashcards');
  };

  useEffect(() => {
    if (currentTabOpened !== 'Flashcards') {
      setFlashcardExpanded(false);
    }
  }, [currentTabOpened]);

  const handleClickOutside = (event) => {
    if (ref.current && !ref.current.contains(event.target)) {
      setFlashcardExpanded(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  return (
    <div className="relative">
      <ActionButton active={flashcardExpanded} onClick={toggleExpand}>
        Generate Flashcards
      </ActionButton>
      <div
        ref={ref}
        className={cn(
          'absolute flex flex-col gap-2 items-center w-[15.25rem] bg-white rounded-md shadow-md right-0 p-1 top-10 pointer-events-none opacity-0 transition-opacity max-h-[29rem] overflow-y-scroll no-scrollbar z-50',
          {
            'opacity-100 pointer-events-auto': flashcardExpanded
          }
        )}
      >
        {docNames.length > 0
          ? docNames.map((d) => (
              <div className="flex text-xs w-full items-center bg-stone-50 p-2.5  gap-2 hover:bg-stone-100">
                <Checkbox
                  checked={selectedDocs.includes(d)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedDocs((prev) => prev.concat(d));
                    } else {
                      const existing = [...selectedDocs];
                      setSelectedDocs(existing.filter((e) => e !== d));
                    }
                  }}
                />
                <span key={d}>{d}</span>
              </div>
            ))
          : null}
        <button
          className="px-3 py-2 self-center rounded-md bg-primaryBlue disabled:bg-blue-200 hover:bg-blue-400 text-white text-sm"
          disabled={selectedDocs.length === 0}
          onClick={() => setIsOpen(true)}
        >
          Configure Flashcards
        </button>
      </div>
      <GenerateFlashcardModal
        index={index}
        isOpen={isOpen}
        onClose={() => {
          setSelectedDocs([]);
          setIsOpen(false);
        }}
        docNames={selectedDocs}
      />
    </div>
  );
};
const FlashcardPage = ({
  conversationId,
  index
}: {
  conversationId: string;
  index: number;
}) => {
  const navigate = useNavigate();
  const { data, isPending } = useQuery({
    queryKey: [
      `getFlashcardsForMultiragConversation?page=${index}&limit=3&convoId=${conversationId}`
    ],
    queryFn: async () => {
      const response = await ApiService.getFlashcardsForMultiCovno({
        limit: 3,
        convoId: conversationId,
        page: index
      });
      const data: { data: Array<FlashcardData> } = await response.json();
      return data;
    },
    select(data) {
      const transformed: Array<Pick<FlashcardData, '_id' | 'deckname'>> =
        data.data.map((d) => ({ deckname: d.deckname, _id: d._id }));
      return transformed;
    }
  });
  console.log('paginated data si', data);

  if (!data && isPending) {
    return [1, 2, 3].map((el) => (
      <div className="flex text-xs w-full items-center bg-stone-50 p-2.5 h-6  gap-2 hover:bg-stone-100"></div>
    ));
  }
  return (
    <div className="w-full">
      {data && data.length > 0 &&
        !isPending ?
        data.map((flashcard) => (
          <div
            onClick={() => navigate(`/dashboard/flashcards/${flashcard._id}`)}
            key={flashcard._id}
            className="flex text-sm cursor-pointer w-full items-center my-1 bg-stone-50 p-2.5 h-6  gap-2 hover:bg-stone-100"
          >
            {flashcard.deckname}{' '}
            <span>
              <svg
                width="15"
                height="15"
                viewBox="0 0 15 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3 2C2.44772 2 2 2.44772 2 3V12C2 12.5523 2.44772 13 3 13H12C12.5523 13 13 12.5523 13 12V8.5C13 8.22386 12.7761 8 12.5 8C12.2239 8 12 8.22386 12 8.5V12H3V3L6.5 3C6.77614 3 7 2.77614 7 2.5C7 2.22386 6.77614 2 6.5 2H3ZM12.8536 2.14645C12.9015 2.19439 12.9377 2.24964 12.9621 2.30861C12.9861 2.36669 12.9996 2.4303 13 2.497L13 2.5V2.50049V5.5C13 5.77614 12.7761 6 12.5 6C12.2239 6 12 5.77614 12 5.5V3.70711L6.85355 8.85355C6.65829 9.04882 6.34171 9.04882 6.14645 8.85355C5.95118 8.65829 5.95118 8.34171 6.14645 8.14645L11.2929 3H9.5C9.22386 3 9 2.77614 9 2.5C9 2.22386 9.22386 2 9.5 2H12.4999H12.5C12.5678 2 12.6324 2.01349 12.6914 2.03794C12.7504 2.06234 12.8056 2.09851 12.8536 2.14645Z"
                  fill="currentColor"
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                ></path>
              </svg>
            </span>
          </div>
        )) :  <div className='text-sm text-center mt-1'>No Flashcards created for conversation.</div>}
    </div>
  );
};
const QuizPage = ({
  conversationId,
  index
}: {
  conversationId: string;
  index: number;
}) => {
  const navigate = useNavigate();
  const { data, isPending } = useQuery({
    queryKey: [
      `getQuizzesForMultiragConversation?page=${index}&limit=3&convoId=${conversationId}`
    ],
    queryFn: async () => {
      const response = await ApiService.getQuizzesForMultiCovno({
        limit: 3,
        convoId: conversationId,
        page: index
      });
      const data: { data: Array<QuizData> } = await response.json();
      return data;
    },
    select(data) {
      const transformed: Array<Pick<QuizData, '_id' | 'title'>> = data.data.map(
        (d) => ({ title: d.title, _id: d._id })
      );
      return transformed;
    }
  });
  console.log('paginated data for quiz is', data);

  if (!data && isPending) {
    return [1, 2, 3].map((el) => (
      <div className="flex text-xs w-full items-center bg-stone-50 p-2.5 h-6  gap-2 hover:bg-stone-100"></div>
    ));
  }
  return (
    <div className="w-full">
      {data && data.length > 0 &&
        !isPending ?
        data.map((quiz) => (
          <div
            onClick={() =>
              navigate(`/dashboard/quizzes/take?quiz_id=${quiz._id}`)
            }
            key={quiz._id}
            className="flex text-sm cursor-pointer w-full items-center my-1 bg-stone-50 p-2.5 h-6  gap-2 hover:bg-stone-100"
          >
            {quiz.title}{' '}
            <span>
              <svg
                width="15"
                height="15"
                viewBox="0 0 15 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3 2C2.44772 2 2 2.44772 2 3V12C2 12.5523 2.44772 13 3 13H12C12.5523 13 13 12.5523 13 12V8.5C13 8.22386 12.7761 8 12.5 8C12.2239 8 12 8.22386 12 8.5V12H3V3L6.5 3C6.77614 3 7 2.77614 7 2.5C7 2.22386 6.77614 2 6.5 2H3ZM12.8536 2.14645C12.9015 2.19439 12.9377 2.24964 12.9621 2.30861C12.9861 2.36669 12.9996 2.4303 13 2.497L13 2.5V2.50049V5.5C13 5.77614 12.7761 6 12.5 6C12.2239 6 12 5.77614 12 5.5V3.70711L6.85355 8.85355C6.65829 9.04882 6.34171 9.04882 6.14645 8.85355C5.95118 8.65829 5.95118 8.34171 6.14645 8.14645L11.2929 3H9.5C9.22386 3 9 2.77614 9 2.5C9 2.22386 9.22386 2 9.5 2H12.4999H12.5C12.5678 2 12.6324 2.01349 12.6914 2.03794C12.7504 2.06234 12.8056 2.09851 12.8536 2.14645Z"
                  fill="currentColor"
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                ></path>
              </svg>
            </span>
          </div>
        )) : <div className='text-sm text-center mt-1'>No quizzes created for conversation</div>}
    </div>
  );
};
const FlashcardsViewSection = ({
  index,
  currentTabOpened,
  setCurrentTabOpened,
  setIndex,
  conversationId
}: {
  conversationId: string;
  index: number;
  setIndex: React.Dispatch<React.SetStateAction<number>>;
  currentTabOpened: string;
  setCurrentTabOpened: React.Dispatch<
    React.SetStateAction<
      | ''
      | 'Summary'
      | 'Highlight'
      | 'Pinned'
      | 'Flashcards'
      | 'Quizzes'
      | 'Flashcards_View'
      | 'Quizzes_View'
    >
  >;
}) => {
  const [flashcardExpanded, setFlashcardExpanded] = useState(false);
  const ref = useRef(null);
  const toggleExpand = () => {
    setFlashcardExpanded(!flashcardExpanded);
    setCurrentTabOpened('Flashcards_View');
  };

  useEffect(() => {
    if (currentTabOpened !== 'Flashcards_View') {
      setFlashcardExpanded(false);
    }
  }, [currentTabOpened]);

  const handleClickOutside = (event) => {
    if (ref.current && !ref.current.contains(event.target)) {
      setFlashcardExpanded(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  return (
    <div className="relative">
      <ActionButton active={flashcardExpanded} onClick={toggleExpand}>
        View Flashcards
      </ActionButton>
      <div
        ref={ref}
        className={cn(
          'absolute flex flex-col gap-2 items-center w-[15.25rem] bg-white rounded-md shadow-md right-0 p-1 top-10 pointer-events-none opacity-0 transition-opacity max-h-[29rem] overflow-y-scroll no-scrollbar z-50',
          {
            'opacity-100 pointer-events-auto': flashcardExpanded
          }
        )}
      >
        <FlashcardPage conversationId={conversationId} index={index} />
        <div style={{display: 'none'}}> <FlashcardPage conversationId={conversationId} index={index + 1} /></div>
        <div className="flex mt-3 items-center gap-2">
          <Button
            disabled={index === 1}
            onClick={() => setIndex(index - 1)}
            variant="ghost"
          >
            &larr; Prev
          </Button>
          <Button onClick={() => setIndex(index + 1)} variant="ghost">
            &rarr; Next
          </Button>
        </div>
      </div>
    </div>
  );
};
const QuizzesViewSection = ({
  index,
  currentTabOpened,
  setCurrentTabOpened,
  setIndex,
  conversationId
}: {
  conversationId: string;
  index: number;
  setIndex: React.Dispatch<React.SetStateAction<number>>;
  currentTabOpened: string;
  setCurrentTabOpened: React.Dispatch<
    React.SetStateAction<
      | ''
      | 'Summary'
      | 'Highlight'
      | 'Pinned'
      | 'Flashcards'
      | 'Quizzes'
      | 'Flashcards_View'
      | 'Quizzes_View'
    >
  >;
}) => {
  const [quizExpanded, setQuizExpanded] = useState(false);
  const ref = useRef(null);
  const toggleExpand = () => {
    setQuizExpanded(!quizExpanded);
    setCurrentTabOpened('Quizzes_View');
  };

  useEffect(() => {
    if (currentTabOpened !== 'Quizzes_View') {
      setQuizExpanded(false);
    }
  }, [currentTabOpened]);

  const handleClickOutside = (event) => {
    if (ref.current && !ref.current.contains(event.target)) {
      setQuizExpanded(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  return (
    <div className="relative">
      <ActionButton active={quizExpanded} onClick={toggleExpand}>
        View Quizzes
      </ActionButton>
      <div
        ref={ref}
        className={cn(
          'absolute flex flex-col gap-2 items-center w-[15.25rem] bg-white rounded-md shadow-md right-0 p-1 top-10 pointer-events-none opacity-0 transition-opacity max-h-[29rem] overflow-y-scroll no-scrollbar z-50',
          {
            'opacity-100 pointer-events-auto': quizExpanded
          }
        )}
      >
        <QuizPage conversationId={conversationId} index={index} />
        <div style={{ display: 'none' }}>
          {' '}
          <QuizPage conversationId={conversationId} index={index + 1} />
        </div>
        <div className="flex mt-3 items-center gap-2 p-1">
          <Button
            disabled={index === 1}
            onClick={() => setIndex(index - 1)}
            variant="outline"
          >
            &larr; Prev
          </Button>
          <Button onClick={() => setIndex(index + 1)} variant="outline">
            &rarr; Next
          </Button>
        </div>
      </div>
    </div>
  );
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
