import { Button } from '@chakra-ui/button';
import { RightArrowIcon, ShareIcon } from '../../../../../../components/icons';
import ChatMessage from './_components/chat-message';

function ChatRoom() {
  return (
    <div className="w-full h-full overflow-hidden bg-transparent flex justify-center pt-8">
      <div className="interaction-area w-full max-w-[832px] mx-auto flex flex-col">
        <header className="flex justify-center relative items-center w-full">
          <span>Chat name</span>
          <button className="absolute right-0 top-0 flex items-center justify-center mr-8 p-2 rounded-lg bg-white shadow-md">
            <ShareIcon />
          </button>
        </header>
        <div className="chat-area flex-1 overflow-y-scroll py-10 px-3 w-full mx-auto max-w-[728px] mt-6 flex flex-col gap-3 no-scrollbar">
          <ChatMessage message="Hello" type="user" />
          <ChatMessage
            message="Hi, 
          How can I help you today?"
            type="bot"
          />
          <ChatMessage message="What is AI?" type="user" />
          <ChatMessage
            message="AI is the simulation of human intelligence processes by machines, especially computer systems. These processes include learning, reasoning, and self-correction."
            type="bot"
          />
          <ChatMessage message="What is AI?" type="user" />
          <ChatMessage
            message="AI is the simulation of human intelligence processes by machines, especially computer systems. These processes include learning, reasoning, and self-correction."
            type="bot"
          />
          <ChatMessage message="What is AI?" type="user" />
          <ChatMessage
            message="AI is the simulation of human intelligence processes by machines, especially computer systems. These processes include learning, reasoning, and self-correction."
            type="bot"
          />
          <ChatMessage message="What is AI?" type="user" />
          <ChatMessage
            message="AI is the simulation of human intelligence processes by machines, especially computer systems. These processes include learning, reasoning, and self-correction."
            type="bot"
          />
        </div>
        <footer className=" w-full flex justify-center mb-6">
          <PromptInput />
        </footer>
      </div>
    </div>
  );
}

const PromptInput = () => {
  return (
    <div className="w-full h-full flex gap-5 flex-col items-center justify-center max-w-[600px]">
      <div className="find-tutor-button flex justify-end w-full">
        <Button
          variant="outline"
          borderRadius="full"
          size="sm"
          style={{
            border: '1px solid #207DF7',
            fontSize: '14px',
            fontWeight: 400,
            lineHeight: '20px',
            color: '#207DF7'
          }}
        >
          Find a tutor
        </Button>
      </div>
      <div className="input-box h-[85px] flex gap-2 flex-col bg-white rounded-md shadow-md w-full px-2 pb-2">
        <div className="input-element w-full flex-1 mt-1.5">
          <input
            type="text"
            className="w-full input flex-1 border-none bg-transparent outline-none active:outline-none active:ring-0 border-transparent focus:border-transparent focus:ring-0 placeholder:text-[#CDD1D5] placeholder:font-normal text-[#6E7682] font-normal pb-0"
            placeholder="How can Shepherd help with your homework?"
          />
        </div>
        <div className="file-uploader-submit-section flex-1 flex justify-between px-2">
          <div className="file-uploader flex gap-[1px] mb-1">
            <button className="flex items-center justify-center w-[28px] h-[28px] rounded-tl-md rounded-bl-md bg-[#F9F9FB]">
              <ShareIcon />
            </button>
            {/* <span className="text-[#969CA6] bg-[#F9F9FB] font-normal h-[28px] text-[10px] flex items-center px-2">
              <span>File.txt</span>
            </span> */}
          </div>
          <div className="submit-button">
            <button className="w-[28px] h-[28px] rounded-full bg-[#207DF7] flex items-center justify-center">
              <RightArrowIcon />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
