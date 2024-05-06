import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useState
} from 'react';
import Message from './_components/message';
import ApiService from '../../../../../services/ApiService';
import { ReloadIcon } from '@radix-ui/react-icons';
import { ArrowRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { MultiragDocument, multiragResponse } from '../../../../../types';
import { ChatMessage } from '../../../home-work-help-2/_components/ai-bot-window/hooks/useChatManager';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '../../../../../components/ui/popover';
import { Ore } from '@glamboyosa/ore';
import { encodeQueryParams } from '../../../../../helpers';
import { useVectorsStore } from '../../../../../state/vectorsStore';
const firstKeyword = 'start of metadata';
const lastKeyword = 'end of metadata';

const MessageArea = ({ children }) => (
  <div className="messages-area flex-1 overflow-scroll pb-32 no-scrollbar">
    {children}
  </div>
);

const SuggestionButton = ({ text }) => (
  <div className="px-[1.125rem] py-[0.03rem] rounded-full border h-[1.68rem] border-[#4D8DF9] text-center flex items-center justify-center backdrop-blur-sm">
    <span className="text-[0.75rem] text-center text-[#4D8DF9] whitespace-nowrap">
      {text}
    </span>
  </div>
);

const SuggestionArea = () => (
  <div className="w-full h-[3.75rem] absolute top-[-4.5rem] cursor-pointer space-y-2 flex flex-col justify-center items-center">
    <SuggestionButton text="What do I need to know to understand this document?" />
    <SuggestionButton text="What topics should I explore after this document?" />
  </div>
);

const SourceButton = () => (
  <button className="h-[1.3rem] border border-dashed absolute flex items-center justify-center rounded-full p-4 bottom-[-48px]">
    <span className="whitespace-nowrap text-[#969CA6] font-[0.5rem]">
      1 source selected
    </span>
  </button>
);

const InputArea = ({
  value,
  setValue,
  submitHandler,
  documents
}: {
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
  submitHandler: VoidFunction;
  documents: Array<MultiragDocument>;
}) => {
  const [open, setOpen] = useState(false);
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === '@') {
      console.log('Hey?');
      setOpen(true);
    }
  };

  const addAtHandler = (name: string) => {
    const v = value + name + ' ';
    setValue(v);
    setOpen(false);
  };
  return (
    <div className="h-[50px] w-full border bg-white rounded-[8px] shadow-md flex px-4 relative">
      <SourceButton />
      <Popover open={open}>
        <PopoverTrigger>
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyUp={handleKeyDown}
            className="w-full input flex-1 border-none bg-transparent outline-none active:outline-none active:ring-0 border-transparent focus:border-transparent focus:ring-0 placeholder:text-[#CDD1D5] placeholder:font-normal text-[#6E7682] font-normal p-0 resize-none"
            placeholder="How can Shepherd help with your homework?"
          />
          <PopoverContent className="z-20 bg-white">
            {documents
              ? documents
                  .filter((el) =>
                    el.collection_name.includes(value.split('@')[1])
                  )
                  .map((doc) => (
                    <p
                      className="p-1 cursor-pointer hover:bg-slate-200"
                      key={doc.document_id}
                      onClick={() => addAtHandler(doc.collection_name)}
                    >
                      {doc.collection_name}
                    </p>
                  ))
              : null}
          </PopoverContent>
        </PopoverTrigger>
      </Popover>
      <div className="flex items-center gap-3 ml-2">
        <button
          onClick={submitHandler}
          className="w-[1.75rem] h-[1.75rem] rounded-full bg-[#207DF7] flex justify-center items-center"
        >
          <ArrowRight className="text-white w-[17px]" />
        </button>
        <button className="w-[2.18rem] h-[1.75rem] rounded-full bg-[#F9F9FB] flex items-center justify-center">
          <ReloadIcon className="w-[14px]" />
        </button>
      </div>
    </div>
  );
};

const ChatArea = ({
  conversationID,
  studentId
}: {
  conversationID: string;
  studentId: string;
}) => {
  const [fetchedDocuments, setFetchedDocuments] = useState<any[]>([]);
  const [userMessage, setUserMessage] = useState('');
  const [streamEnded, setStreamEnded] = useState(true);
  const [fullBuffer, setFullBuffer] = useState('');
  const [currentChat, setCurrentChat] = useState('');
  const documents = useVectorsStore((state) => state.chatDocuments);
  const { data, isLoading, isRefetching, isError } = useQuery({
    queryKey: ['conversationHistory', conversationID],

    queryFn: async () => {
      const r: multiragResponse<Array<ChatMessage>> =
        await ApiService.fetchMultiragConvoHistory(conversationID).then((res) =>
          res.json()
        );
      return r;
    }
  });
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  console.log('data is', data);
  useEffect(() => {
    if (data) {
      setMessages(data.data);
    }
  }, [data]);
  useEffect(() => {
    if (streamEnded && fullBuffer) {
      const startIndex = fullBuffer.indexOf(firstKeyword);
      const endIndex = fullBuffer.indexOf(lastKeyword);

      // Extract the substring between startIndex and endIndex
      const extractedContent = fullBuffer.substring(
        startIndex + firstKeyword.length,
        endIndex
      );

      console.log('EXTRACTED CONTENT', extractedContent);
      // also refetch and reset streamEnded
    }
  }, [streamEnded, fullBuffer]);
  const currentChatRender = useMemo(() => {
    // This useCallback will return the ChatMessage component or null based on currentChat's value
    // It ensures that the component is only re-rendered when currentChat changes
    console.log('current chat is', currentChat);
    if (currentChat.length === 0) {
      console.log(currentChat, 'should be empty');
      return ''; // Don't render anything if there's no current chat content
    }

    return <Message key={Math.random()} content={currentChat} type={'bot'} />;
  }, [currentChat]);
  const submitMessageHandler = () => {
    messages.push({
      id: Date.now(), // Simplified ID generation, should be unique in a real application
      studentId: studentId, // Placeholder, replace with dynamic student ID
      log: { role: 'user', content: userMessage },
      liked: false,
      disliked: false,
      isPinned: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      conversationId: conversationID //
    });
    setStreamEnded(false);
    const body = {
      studentId,
      query: userMessage,
      language: 'English',
      conversationId: conversationID,
      documents: JSON.stringify(documents)
    };

    const q = encodeQueryParams(body);
    const ore = new Ore({
      url: `https://shepherd-ai-pr-123.onrender.com/multirag/chat${q}`,
      headers: {
        'X-Shepherd-Header': process.env.REACT_APP_AI_HEADER_KEY
      }
    });
    ore.fetchSSE((buffer, parts) => {
      setFullBuffer(buffer);
      if (
        buffer.includes('done with stream') ||
        buffer.includes(firstKeyword)
      ) {
        setStreamEnded(true);
        return;
      }
      if (buffer.includes('run out of credits')) {
        // here eventually we will implement running out of credits like AI tutor
        //setOpenPricingModel(true);
        setStreamEnded(true);
        return;
      }
      setCurrentChat(buffer);
    });
  };
  return (
    <div className="flex-[1.5] h-full space-y-2 pt-6 px-[3.25rem] flex flex-col no-scrollbar pr-0">
      <MessageArea>
        {isLoading && (
          <>
            <Message type="bot" loading content="" />
            <Message type="user" loading content="" />
            <Message type="bot" loading content="" />
            <Message type="user" loading content="" />
            <Message type="bot" loading content="" />
            <Message type="user" loading content="" />
            <Message type="bot" loading content="" />
            <Message type="user" loading content="" />
          </>
        )}{' '}
        {messages && messages.length > 0 ? (
          <>
            {messages
              .sort((a, b) => a.id - b.id)
              .map((msg) => (
                <Message
                  key={msg.id}
                  type={msg.log.role === 'user' ? 'user' : 'bot'}
                  content={msg.log.content}
                />
              ))}
          </>
        ) : null}
        {currentChatRender}
      </MessageArea>
      <div className="w-full pb-[3.5rem] relative">
        <SuggestionArea />
        <InputArea
          documents={documents}
          submitHandler={submitMessageHandler}
          value={userMessage}
          setValue={setUserMessage}
        />
      </div>
    </div>
  );
};

export default ChatArea;
