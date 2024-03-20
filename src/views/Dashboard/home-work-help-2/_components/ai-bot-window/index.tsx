import { memo, useEffect, useState } from 'react';
import ChatInitiator from './chat-initiator';
import useUserStore from '../../../../../state/userStore';
import useChatManager from './hooks/useChatManager';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import LimitReachModel from './chat-initiator/_components/limit-reach-model';
import PlansModal from '../../../../../components/PlansModal';
import { languages } from '../../../../../helpers';
import { useMutation } from '@tanstack/react-query';
import ApiService from '../../../../../services/ApiService';

function AiChatBotWindow() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);

  const [connectionQuery, setConnectionQuery] = useState({
    subject: '',
    topic: '',
    level: '',
    language: 'English'
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
  const createMathConvoMutation = useMutation({
    mutationFn: (b: {
      subject: string;
      topic: string;
      level: string;
      language: (typeof languages)[number];
      referenceId: string;
    }) => ApiService.createMathConversation(b)
  });
  const [limitReachedModal, setLimitReachedModal] = useState(false);
  const [isPlansModalOpen, setPlansModalOpen] = useState(false);

  const handleOpenLimitReached = () => {
    setLimitReachedModal(true);
  };

  const handleCloseLimitModal = () => {
    setLimitReachedModal(false);
    setTimeout(() => {
      resetLimitReached();
    }, 100);
  };

  const handleOpenPlansModal = () => {
    setPlansModalOpen(true);
  };

  const handleClosePlansModal = () => {
    setPlansModalOpen(false);
  };

  useEffect(() => {
    if (conversationId) {
      setChatWindowParams({ connectionQuery, isNewWindow: true });
      navigate(`/dashboard/ace-homework/${conversationId}`, {
        replace: true
      });
    }
  }, [conversationId]);

  const initiateConversation = async ({
    subject,
    topic,
    level,
    language
  }: {
    subject: string;
    topic: string;
    level: string;
    language: (typeof languages)[number];
  }) => {
    const cq = { subject, topic, level, language };
    setConnectionQuery(cq);
    // alert(JSON.stringify({ subject, topic }));
    if (subject === 'Math') {
      try {
        const data = await createMathConvoMutation.mutateAsync({
          language,
          topic,
          level,
          subject,
          referenceId: studentId
        });
        console.log(data.data, 'DATA?');
        setChatWindowParams({ connectionQuery: cq, isNewWindow: true });
        navigate(`/dashboard/ace-homework/${data.data}?initial_messages=true`, {
          replace: true
        });
      } catch (error) {
        // render toast
      }
    } else {
      startConversation({
        subject,
        topic,
        level,
        language,
        name: user?.name?.first,
        studentId: studentId,
        firebaseId: user?.firebaseId,
        namespace: 'homework-help'
      });
    }
  };

  useEffect(() => {
    if (limitReached) {
      handleOpenLimitReached();
    }
  }, [limitReached]);

  return (
    <div className="h-full flex flex-col gap-0 w-full justify-between bg-[#F9F9FB] overflow-hidden">
      <LimitReachModel
        isLimitModalOpen={limitReached && limitReachedModal}
        handleOpenLimitReached={handleOpenLimitReached}
        handleCloseLimitModal={handleCloseLimitModal}
        handleOpenPlansModal={handleOpenPlansModal}
      />
      <PlansModal
        togglePlansModal={isPlansModalOpen}
        setTogglePlansModal={handleClosePlansModal}
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
