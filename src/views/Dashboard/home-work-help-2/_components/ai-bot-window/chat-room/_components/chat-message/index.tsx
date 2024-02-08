import { Avatar } from '@chakra-ui/avatar';

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
        name={userName}
        src={type === 'user' ? userImage : ''}
        bgColor={type === 'user' ? 'blue.500' : 'gray.200'}
        // icon={type === 'user' ? '' : '🤖'}
      />
      <div
        className={`message shadow-md rounded-md flex justify-center items-center ${
          type === 'user' ? '' : 'bg-white'
        }`}
      >
        <p className="text-sm w-full py-2 px-4 font-normal">{message}</p>
      </div>
      <div className="w-9 h-9 opacity-0 pointer-events-none shrink-0"></div>
    </div>
  );
};

export default ChatMessage;
