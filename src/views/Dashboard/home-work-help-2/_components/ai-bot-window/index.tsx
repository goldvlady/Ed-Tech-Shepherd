import { useParams } from 'react-router';
import ChatRoom from './chat-room';
import ChatInitiator from './chat-initiator';
import useSocket from './hooks/useSocket';
import useUserStore from '../../../../../state/userStore';

function AiChatBotWindow() {
  const { id } = useParams();
  const user = useUserStore((state) => state.user);
  const studentId = user?._id;
  const { botStatus, initiateSocket, llmResponse, messages, readyToChat } =
    useSocket();
  // If id is null, It mean user is not in the chat room
  const isChatRoom = id !== undefined;

  const initiateConversation = ({
    subject,
    topic
  }: {
    subject: string;
    topic: string;
  }) => {
    alert(JSON.stringify({ subject, topic }));
  };

  return (
    <div className="h-full flex flex-col gap-4 w-full justify-between bg-[#F9F9FB] overflow-hidden">
      {isChatRoom ? (
        <ChatRoom />
      ) : (
        <ChatInitiator initiateConversation={initiateConversation} />
      )}
    </div>
  );
}

export default AiChatBotWindow;
