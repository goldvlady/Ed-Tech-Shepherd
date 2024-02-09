import { useParams } from 'react-router';
import { useEffect, useState } from 'react';
import ChatRoom from './chat-room';
import ChatInitiator from './chat-initiator';
import useUserStore from '../../../../../state/userStore';
import useChatManager from './hooks/useChatManager';
import { useNavigate } from 'react-router-dom';

function AiChatBotWindow() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  const [connectionQuery, setConnectionQuery] = useState({});
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
    currentSocket,
    ...rest
  } = useChatManager();

  useEffect(() => {
    if (conversationId) {
      navigate(`/dashboard/ace-homework/${conversationId}`);
    }
  }, [conversationId]);

  const initiateConversation = ({
    subject,
    topic
  }: {
    subject: string;
    topic: string;
  }) => {
    alert(JSON.stringify({ subject, topic }));
    setConnectionQuery({
      subject,
      topic,
      studentId: '1234',
      namespace: 'homework-help'
    });
    startConversation({
      subject,
      topic,
      studentId: '1234',
      namespace: 'homework-help'
    });
  };

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
