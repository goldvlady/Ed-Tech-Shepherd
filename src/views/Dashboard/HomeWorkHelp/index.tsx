import CustomModal from '../../../components/CustomComponents/CustomModal';
import { chatHomeworkHelp } from '../../../services/AI';
import socketWithAuth from '../../../socket';
import userStore from '../../../state/userStore';
import { FlashcardData } from '../../../types';
import Chat from '../DocChat/chat';
import ChatHistory from '../DocChat/chatHistory';
import ViewHomeWorkHelpDetails from './ViewHomeWorkHelpDetails';
import ViewTutors from './ViewTutors';
import {
  HomeWorkHelpChatContainer,
  HomeWorkHelpContainer,
  HomeWorkHelpHistoryContainer
} from './style';
import React, { useState, useCallback, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const HomeWorkHelp = () => {
  const [isOpenModal, setOpenModal] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const location = useLocation();
  const [isShowPrompt, setShowPrompt] = useState<boolean>(false);
  const [openAceHomework, setAceHomeWork] = useState(false);
  const { user } = userStore();
  const [messages, setMessages] = useState<
    { text: string; isUser: boolean; isLoading: boolean }[]
  >([]);
  const [llmResponse, setLLMResponse] = useState('');
  const [readyToChat, setReadyToChat] = useState(false);
  const [botStatus, setBotStatus] = useState(
    'Philosopher, thinker, study companion.'
  );
  const studentId = user?._id ?? '';
  const topic = location?.state?.topic;
  const [countNeedTutor, setCountNeedTutor] = useState<number>(1);
  const [socket, setSocket] = useState<any>(null);
  const [subjectId, setSubject] = useState<string>('Subject');
  const [localData, setLocalData] = useState<any>({
    subject: subjectId,
    topic: ''
  });
  const [level, setLevel] = useState<any>('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!socket) {
      const authSocket = socketWithAuth({
        studentId,
        topic
      }).connect();
      setSocket(authSocket);
    }
  }, [socket, studentId, topic]);

  useEffect(() => {
    if (socket) {
      socket.on('ready', (ready) => {
        setReadyToChat(ready);
      });

      return () => socket.off('ready');
    }
  }, [socket]);

  useEffect(() => {
    if (socket) {
      socket.on('bot response done', (completeText) => {
        setLLMResponse('');
        setTimeout(
          () => setBotStatus('Philosopher, thinker, study companion.'),
          1000
        );

        // eslint-disable-next-line
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: completeText, isUser: false, isLoading: false }
        ]);
      });

      return () => socket.off('bot response done');
    }
  }, [socket]);

  useEffect(() => {
    if (socket) {
      socket.on('homework chatbot response', async (token) => {
        setBotStatus('Typing...');
        setLLMResponse((llmResponse) => llmResponse + token);
      });

      return () => socket.off('bot response');
    }
  }, [socket]);

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      setInputValue(event.target.value);
    },
    [setInputValue]
  );

  const handleClose = () => {
    setAceHomeWork((prevState) => !prevState);
  };

  const handleAceHomeWorkHelp = useCallback(() => {
    setAceHomeWork((prevState) => !prevState);
  }, [setAceHomeWork]);

  const onCountTutor = useCallback(
    async (message: string) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: message, isUser: true, isLoading: false }
      ]);

      setCountNeedTutor((prevState) => prevState + 1);

      socket.emit('chat message');
    },
    [setMessages, setCountNeedTutor, socket]
  );

  const handleClickPrompt = useCallback(
    async (event: React.SyntheticEvent<HTMLDivElement>, prompt: string) => {
      event.preventDefault();

      setShowPrompt(true);

      setMessages((prevMessages) => [
        ...prevMessages,
        { text: prompt, isUser: true, isLoading: false }
      ]);
      setInputValue('');

      socket.emit('chat message');
    },
    [socket]
  );

  const onOpenModal = useCallback(() => {
    setOpenModal((prevState) => !prevState);
  }, []);

  const handleSendMessage = useCallback(
    async (event: React.SyntheticEvent<HTMLButtonElement>) => {
      event.preventDefault();

      if (inputValue.trim() === '') {
        return;
      }

      setShowPrompt(true);

      setMessages((prevMessages) => [
        ...prevMessages,
        { text: inputValue, isUser: true, isLoading: false }
      ]);
      setInputValue('');

      socket.emit('chat message', inputValue);
    },
    [inputValue, socket]
  );

  const handleKeyDown = useCallback(
    (event: any) => {
      // If the key pressed was 'Enter', and the Shift key was not also held down
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault(); // Prevent a new line from being added to the textarea
        handleSendMessage(event);
      }
    },
    [handleSendMessage]
  );

  const onRouteHomeWorkHelp = useCallback(() => {
    handleClose();
    navigate('/dashboard/ace-homework', {
      state: { subject: subjectId, topic: topic, level }
    });
    setMessages([]);
    setCountNeedTutor(1);
    setInputValue('');
  }, [
    subjectId,
    localData,
    level,
    setMessages,
    handleClose,
    handleAceHomeWorkHelp,
    navigate
  ]);

  return (
    <HomeWorkHelpContainer>
      <HomeWorkHelpHistoryContainer>
        <ChatHistory />
      </HomeWorkHelpHistoryContainer>
      <HomeWorkHelpChatContainer>
        <Chat
          isReadyToChat={true}
          HomeWorkHelp
          isShowPrompt={isShowPrompt}
          messages={messages}
          llmResponse={llmResponse}
          botStatus={botStatus}
          onOpenModal={onOpenModal}
          inputValue={inputValue}
          handleInputChange={handleInputChange}
          handleSendMessage={handleSendMessage}
          handleKeyDown={handleKeyDown}
          homeWorkHelpPlaceholder={'How can Shepherd help with your homework?'}
          handleClickPrompt={handleClickPrompt}
          countNeedTutor={countNeedTutor}
          onCountTutor={onCountTutor}
          handleAceHomeWorkHelp={handleAceHomeWorkHelp}
        />
      </HomeWorkHelpChatContainer>

      <CustomModal
        isOpen={isOpenModal}
        onClose={onOpenModal}
        modalSize="lg"
        style={{
          height: '100Vh',
          maxWidth: '100%'
        }}
      >
        <ViewTutors
          onOpenModal={onOpenModal}
          subjectID={location?.state?.subject}
        />
      </CustomModal>

      {openAceHomework && (
        <ViewHomeWorkHelpDetails
          isHomeWorkHelp
          openAceHomework={openAceHomework}
          handleClose={handleClose}
          setMessages={setMessages}
          handleAceHomeWorkHelp={handleAceHomeWorkHelp}
          setSubject={setSubject}
          subjectId={subjectId}
          setLocalData={setLocalData}
          setLevel={setLevel}
          localData={localData}
          level={level}
          onRouteHomeWorkHelp={onRouteHomeWorkHelp}
        />
      )}
    </HomeWorkHelpContainer>
  );
};

export default HomeWorkHelp;
