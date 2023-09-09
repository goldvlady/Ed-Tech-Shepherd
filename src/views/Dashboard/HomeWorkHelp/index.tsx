import CustomModal from '../../../components/CustomComponents/CustomModal';
import CustomToast from '../../../components/CustomComponents/CustomToast/index';
import { chatHomeworkHelp, getConversionById } from '../../../services/AI';
import { chatHistory } from '../../../services/AI';
import ApiService from '../../../services/ApiService';
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
import { useToast } from '@chakra-ui/react';
import React, {
  useState,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef
} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const HomeWorkHelp = () => {
  const [isOpenModal, setOpenModal] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const toast = useToast();
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
  const [subjectId, setSubject] = useState<string>('');
  const [localData, setLocalData] = useState<any>({
    subject: '',
    topic: ''
  });
  const [level, setLevel] = useState<any>('');
  const navigate = useNavigate();
  const [conversationId, setConversationId] = useState('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [onlineTutorsId, setOnlineTutorsId] = useState([]);
  const storedConvoId = localStorage.getItem('conversationId');
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (!socket && messages.length >= 2 && storedConvoId) {
      const authSocket = socketWithAuth({
        studentId,
        topic: localData.topic,
        subject: localData.subject,
        namespace: 'homework-help'
      }).connect();
      setSocket(authSocket);
    }
  }, [socket, messages, storedConvoId, studentId, localData]);

  useEffect(() => {
    if (isSubmitted) {
      const authSocket = socketWithAuth({
        studentId,
        topic: localData.topic,
        subject: localData.subject,
        // conversationId,
        namespace: 'homework-help'
      }).connect();
      setSocket(authSocket);
    }
    return () => setIsSubmitted(false);
  }, [isSubmitted]);

  useEffect(() => {
    if (socket) {
      socket.on('ready', (ready) => {
        setReadyToChat(ready);
        socket.emit('chat message', 'Shall we begin, Socrates?');
      });

      return () => socket.off('ready');
    }
  }, [socket]);

  useEffect(() => {
    if (socket) {
      socket.on('chat response end', (completeText) => {
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

      return () => socket.off('chat response end');
    }
  }, [socket]);

  useEffect(() => {
    if (socket) {
      socket.on('chat response start', async (token: string) => {
        setBotStatus('Typing...');
        setLLMResponse((llmResponse) => llmResponse + token);
      });

      return () => socket.off('chat response end');
    }
  }, [socket]);

  useLayoutEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const historyData = await chatHistory({
          studentId
        });
        const mappedData = historyData?.map((item) => ({
          text: item.content,
          isUser: item.role === 'user',
          isLoading: false
        }));

        setMessages((prevMessages) => [...prevMessages, ...mappedData]);
      } catch (error) {
        toast({
          render: () => (
            <CustomToast
              title="Failed to fetch chat history..."
              status="error"
            />
          ),
          position: 'top-right',
          isClosable: true
        });
      }
    };
    fetchChatHistory();
  }, [studentId, toast]);

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

      socket.emit('chat message', message);
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

      socket.emit('chat message', prompt);
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

      socket && socket.emit('chat message', inputValue);
      // setIsSubmitted(true);
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

  useEffect(() => {
    const fetchConversationId = async () => {
      const response = await getConversionById({
        conversationId
      });

      const previousConvoData = response
        ?.map((conversation) => ({
          text: conversation?.log?.content,
          isUser: conversation?.log?.role === 'user',
          isLoading: false
        }))
        ?.sort((a, b) => {
          const dateA = new Date(a.createdAt);
          const dateB = new Date(b.createdAt);
          // If dates are the same
          if (dateA.getTime() === dateB.getTime()) {
            return a.id - b.id;
          }
          return dateA.getTime() - dateB.getTime();
        })
        .slice(1);
      setMessages((prevState) => [...previousConvoData]);
    };
    fetchConversationId();
    if (conversationId) setShowPrompt(true);
  }, [conversationId, socket]);

  const onRouteHomeWorkHelp = useCallback(() => {
    handleClose();
    setIsSubmitted(true);
    setMessages([]);
    setCountNeedTutor(1);
    setInputValue('');
  }, [
    subjectId,
    localData,
    level,
    setMessages,
    handleClose,
    navigate,
    socket,
    topic,
    studentId,
    localData.topic,
    setIsSubmitted
  ]);

  useEffect(() => {
    if (isSubmitted) {
      setMessages([]);
      setConversationId('');
    }
  }, [isSubmitted]);

  useEffect(() => {
    const storedConvoId = localStorage.getItem('conversationId');

    if (conversationId && (!storedConvoId || conversationId !== storedConvoId))
      localStorage.setItem('conversationId', conversationId);
  }, [conversationId]);

  useEffect(() => {
    const storedConvoId = localStorage.getItem('conversationId');

    if (storedConvoId) {
      setConversationId(storedConvoId);
    }
  }, []);

  useEffect(() => {
    const getOnlineTutors = async () => {
      try {
        const resp = await ApiService.getOnlineTutors();

        const response = await resp.json();
        setOnlineTutorsId(response?.data);
      } catch (error: any) {
        toast({
          render: () => (
            <CustomToast
              title="Failed to fetch chat history..."
              status="error"
            />
          ),
          position: 'top-right',
          isClosable: true
        });
      }
    };
    getOnlineTutors();
  }, []);

  return (
    <HomeWorkHelpContainer>
      <HomeWorkHelpHistoryContainer>
        <ChatHistory
          studentId={studentId}
          setConversationId={setConversationId}
          conversationId={conversationId}
          isSubmitted={isSubmitted}
        />
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
          subjectID={localData.subjectId}
          onlineTutorsId={onlineTutorsId}
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
