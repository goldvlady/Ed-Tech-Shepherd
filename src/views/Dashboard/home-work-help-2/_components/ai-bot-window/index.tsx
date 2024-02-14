import { memo, useEffect, useState } from 'react';
import ChatInitiator from './chat-initiator';
import useUserStore from '../../../../../state/userStore';
import useChatManager from './hooks/useChatManager';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import LimitReachModel from './chat-initiator/_components/limit-reach-model';

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
    limitReached,
    resetLimitReached,
    ...rest
  } = useChatManager('homework-help');

  const [limitReachedModal, setLimitReachedModal] = useState(false);

  const handleOpenLimitReached = () => {
    setLimitReachedModal(true);
  };

  const handleCloseLimitModal = () => {
    setLimitReachedModal(false);
    setTimeout(() => {
      resetLimitReached();
    }, 100);
  };

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

  useEffect(() => {
    if (limitReached) {
      handleOpenLimitReached();
    }
  }, [limitReached]);

  return (
    <div className="h-full flex flex-col gap-4 w-full justify-between bg-[#F9F9FB] overflow-hidden">
      <LimitReachModel
        isLimitModalOpen={limitReached && limitReachedModal}
        handleOpenLimitReached={handleOpenLimitReached}
        handleCloseLimitModal={handleCloseLimitModal}
      />
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
