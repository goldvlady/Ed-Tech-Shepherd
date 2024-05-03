import { useEffect, useState } from 'react';
import Message from './_components/message';
import ApiService from '../../../../../services/ApiService';
import { ReloadIcon } from '@radix-ui/react-icons';
import { ArrowRight } from 'lucide-react';

const MessageArea = ({ children }) => (
  <div className="messages-area flex-1 overflow-scroll pb-32">{children}</div>
);

const SuggestionButton = ({ text }) => (
  <div className="px-[1.125rem] py-[0.03rem] rounded-full border h-[1.68rem] border-[#4D8DF9] text-center flex items-center justify-center backdrop-blur-sm">
    <span className="text-[0.75rem] text-center text-[#4D8DF9]">{text}</span>
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

const InputArea = () => (
  <div className="h-[50px] w-full border bg-white rounded-[8px] shadow-md flex px-4 relative">
    <SourceButton />
    <input
      className="w-full input flex-1 border-none bg-transparent outline-none active:outline-none active:ring-0 border-transparent focus:border-transparent focus:ring-0 placeholder:text-[#CDD1D5] placeholder:font-normal text-[#6E7682] font-normal p-0 resize-none"
      placeholder="How can Shepherd help with your homework?"
    />
    <div className="flex items-center gap-3 ml-2">
      <button className="w-[1.75rem] h-[1.75rem] rounded-full bg-[#207DF7] flex justify-center items-center">
        <ArrowRight className="text-white w-[17px]" />
      </button>
      <button className="w-[2.18rem] h-[1.75rem] rounded-full bg-[#F9F9FB] flex items-center justify-center">
        <ReloadIcon className="w-[14px]" />
      </button>
    </div>
  </div>
);

const ChatArea = ({ conversationID }: { conversationID: string }) => {
  const [fetchedDocuments, setFetchedDocuments] = useState<any[]>([]);

  useEffect(() => {
    ApiService.fetchMultiDocBasedOnConversationID(conversationID)
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'success') {
          console.log('fetchMultiDocBasedOnConversationID', data);
          ApiService.multiragChat({
            studentId: '64906166763aa2579e58c97d',
            query: 'Tell me about this document',
            language: 'English',
            conversationId: conversationID,
            documents: JSON.stringify(data.data)
          })
            .then((res) => res.json())
            .then((data) => {
              console.log('DOC chat response', data);
            });
        }
      });
  }, []);
  return (
    <div className="flex-[1.5] h-full space-y-2 pt-6 px-[3.25rem] flex flex-col">
      <MessageArea>
        <Message
          type="bot"
          content="Welcome! I'm here to help you make the most of your time and notes. Ask me questions related to the documents added and I'll find answers that match. Let's get learning!"
        />
        <Message type="user" content="What is relativity?" />
        <Message
          type="bot"
          content="In Physics, it is the dependence of various physical phenomena on relative motion of the observer and the observed objects, especially regarding the nature and behavior of light, space, time, and gravity."
        />
        <Message type="user" content="Explain this to me like I'm five " />
      </MessageArea>
      <div className="w-full pb-[3.5rem] relative">
        <SuggestionArea />
        <InputArea />
      </div>
    </div>
  );
};

export default ChatArea;
