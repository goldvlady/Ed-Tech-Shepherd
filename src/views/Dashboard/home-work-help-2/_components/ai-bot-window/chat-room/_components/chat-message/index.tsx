import { Avatar } from '@chakra-ui/avatar';
import CustomMarkdownView from '../../../../../../../../components/CustomComponents/CustomMarkdownView';

const ChatMessage = ({
  message,
  type,
  userName,
  userImage
}: {
  message: string;
  type: 'user' | 'bot';
  userName?: string;
  userImage?: string;
}) => {
  return (
    <div
      className={`flex gap-3 ${
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
        bgColor={type === 'user' ? 'blue.500' : '#207DF7'}
        // icon={type === 'user' ? '' : '🤖'}
      />
      <div
        className={`message shadow-element rounded-md flex justify-center items-center ${
          type === 'user' ? '' : 'bg-white'
        }`}
      >
        <CustomMarkdownView
          source={message}
          className="text-sm w-full py-2 px-4 font-normal"
        />
      </div>
      <div className="w-9 h-9 opacity-0 pointer-events-none shrink-0"></div>
    </div>
  );
};

export default ChatMessage;
