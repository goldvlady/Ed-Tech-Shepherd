import { useParams } from 'react-router';
import ChatRoom from './chat-room';
import ChatInitiator from './chat-initiator';
import useUserStore from '../../../../../state/userStore';
import useChatManager from './hooks/useChatManager';
import { useNavigate } from 'react-router-dom';

function AiChatBotWindow() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  const studentId = user?._id;
  // If id is null, It mean user is not in the chat room
  const isChatRoom = id !== undefined;

  const {
    startConversation,
    conversationId,
    messages,
    currentChat,
    sendMessage,
    onEvent,
    ...rest
  } = useChatManager();

  const initiateConversation = ({
    subject,
    topic
  }: {
    subject: string;
    topic: string;
  }) => {
    alert(JSON.stringify({ subject, topic }));
    startConversation({
      subject,
      topic,
      studentId: '1234',
      namespace: 'homework-help'
    });
  };

  onEvent('new_conversation_ready', () => {
    console.log('New conversation ready');
    // if (!isChatRoom && conversationId) {
    //   navigate(`/dashboard/ace-homework/${conversationId}`);
    // }
  });

  // First we uuid  - i can navigate to
  // Shell we begin

  console.log('Bot messages', messages, currentChat);

  return (
    <div className="h-full flex flex-col gap-4 w-full justify-between bg-[#F9F9FB] overflow-hidden">
      {isChatRoom ? (
        <ChatRoom />
      ) : (
        <ChatInitiator initiateConversation={initiateConversation} /> // Subject and topic
      )}
    </div>
  );
}

export default AiChatBotWindow;
