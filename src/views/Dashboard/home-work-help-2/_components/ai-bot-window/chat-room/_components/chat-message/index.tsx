import { Avatar } from '@chakra-ui/avatar';
import CustomMarkdownView from '../../../../../../../../components/CustomComponents/CustomMarkdownView';

const ChatMessage = ({
  lastMessage,
  message,
  type,
  userName,
  userImage,
  sendSuggestedPrompt
}: {
  lastMessage?: boolean;
  message: string;
  type: 'user' | 'bot';
  userName?: string;
  userImage?: string;
  sendSuggestedPrompt?: (message: string) => void;
}) => {
  return (
    <div
      className={`flex gap-3 relative ${
        type === 'user' ? 'flex-row-reverse' : 'flex-row'
      }`}
    >
      <Avatar
        style={{
          width: '36px',
          height: '36px'
        }}
        name={type === 'user' ? userName : 'Socrates'}
        src={type === 'user' ? userImage : ''}
        bgColor={type === 'user' ? '#4CAF50;' : '#fff'}
        color={type === 'user' ? '#fff' : 'blue.500'}
        shadow={'md'}
      />
      <div
        className={`message shadow-element rounded-md flex justify-center items-center relative ${
          type === 'user' ? '' : 'bg-white'
        }`}
      >
        <CustomMarkdownView
          source={message}
          className="text-sm w-full py-2 px-4 font-normal"
        />
        {type === 'bot' && lastMessage && (
          <div className="question-suggestions absolute bottom-[-3.5rem] w-full flex gap-2">
            <div
              role="button"
              className="question-suggestion p-2 border rounded-full cursor-pointer select-none hover:shadow transition-shadow"
              onClick={() => {
                sendSuggestedPrompt?.("I don't understand");
              }}
            >
              <p className="question-suggestion-text text-[#6E7682] text-sm font-normal">
                I don't understand
              </p>
            </div>
            <div
              role="button"
              className="question-suggestion p-2 border rounded-full cursor-pointer select-none hover:shadow transition-shadow"
              onClick={() => {
                sendSuggestedPrompt?.('Teach me more!');
              }}
            >
              <p className="question-suggestion-text text-[#6E7682] text-sm font-normal">
                Teach me more!
              </p>
            </div>
          </div>
        )}
      </div>
      <div className="w-9 h-9 opacity-0 pointer-events-none shrink-0"></div>
    </div>
  );
};

export default ChatMessage;
