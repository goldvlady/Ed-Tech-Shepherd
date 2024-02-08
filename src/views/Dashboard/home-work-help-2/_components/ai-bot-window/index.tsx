import { useParams } from 'react-router';
import ChatRoom from './chat-room';
import ChatInitiator from './chat-initiator';

function AiChatBotWindow() {
  const { id } = useParams();
  // If id is null, It mean user is not in the chat room
  const isChatRoom = id !== undefined;

  const initiateConversation = () => {
    alert('Initiate conversation');
  };

  return (
    <div className="h-full flex flex-col gap-4 w-full justify-between bg-[#F9F9FB]">
      {isChatRoom ? (
        <ChatRoom />
      ) : (
        <ChatInitiator initiateConversation={initiateConversation} />
      )}
    </div>
  );
}

export default AiChatBotWindow;
