import { memo, useEffect, useState } from 'react';
import ChatInitiator from './chat-initiator';
import useUserStore from '../../../../../state/userStore';
import useChatManager from './hooks/useChatManager';
import { Outlet, useNavigate, useParams } from 'react-router-dom';

function AiChatBotWindow() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  const [connectionQuery, setConnectionQuery] = useState({
    subject: '',
    topic: ''
  });
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
    setChatWindowParams,
    ...rest
  } = useChatManager('homework-help');

  console.log(conversationId);

  useEffect(() => {
    if (conversationId) {
      console.log('connection query', connectionQuery);
      setChatWindowParams({ connectionQuery, isNewWindow: true });
      navigate(`/dashboard/ace-homework/${conversationId}`, {
        replace: true
      });
    }
  }, [conversationId]);

  const initiateConversation = ({
    subject,
    topic
  }: {
    subject: string;
    topic: string;
  }) => {
    setConnectionQuery({ subject, topic });
    // alert(JSON.stringify({ subject, topic }));
    startConversation({
      subject,
      topic,
      studentId: studentId,
      firebaseId: user?.firebaseId,
      namespace: 'homework-help'
    });
  };

  return (
    <div className="h-full flex flex-col gap-4 w-full justify-between bg-[#F9F9FB] overflow-hidden">
      {isChatRoom ? (
        // This outlet is for the chat room, it will be replaced by the chat room component using the react-router-dom
        <Outlet />
      ) : (
        <ChatInitiator initiateConversation={initiateConversation} /> // Subject and topic
      )}
    </div>
  );
}

export default AiChatBotWindow;
