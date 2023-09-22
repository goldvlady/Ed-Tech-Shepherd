import Sally from '../../../assets/saly.svg';
import CustomModal from '../../../components/CustomComponents/CustomModal';
import CustomToast from '../../../components/CustomComponents/CustomToast/index';
import PaymentDialog, {
  PaymentDialogRef
} from '../../../components/PaymentDialog';
import { SHALL_WE_BEGIN } from '../../../helpers/constants';
import {
  chatHomeworkHelp,
  editConversationId,
  getConversionById,
  getDescriptionById,
  updateGeneratedSummary
} from '../../../services/AI';
import { chatHistory } from '../../../services/AI';
import ApiService from '../../../services/ApiService';
import socketWithAuth from '../../../socket';
import userStore from '../../../state/userStore';
import theme from '../../../theme';
import { FlashcardData } from '../../../types';
import Chat from '../DocChat/chat';
import ChatHistory from '../DocChat/chatHistory';
import BountyOfferModal from '../components/BountyOfferModal';
import ViewHomeWorkHelpDetails from './ViewHomeWorkHelpDetails';
import ViewTutors from './ViewTutors';
import {
  HomeWorkHelpChatContainer,
  HomeWorkHelpContainer,
  HomeWorkHelpHistoryContainer
} from './style';
import {
  useToast,
  useDisclosure,
  Box,
  Image,
  VStack,
  Text,
  Button,
  Alert,
  AlertIcon,
  AlertDescription
} from '@chakra-ui/react';
import { loadStripe } from '@stripe/stripe-js';
import React, {
  useState,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef
} from 'react';
import { MdInfo } from 'react-icons/md';
import { MdTune } from 'react-icons/md';
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
  const [visibleButton, setVisibleButton] = useState(true);
  const storedConvoId = localStorage.getItem('conversationId');
  const [deleteConservationModal, setDeleteConservationModal] = useState(false);
  const [recentConversationId, setRecentConverstionId] = useState(null);
  const [certainConversationId, setCertainConversationId] = useState('');
  const bountyOption = JSON.parse(localStorage.getItem('bountyOpt') as any);
  const [someBountyOpt, setSomeBountyOpt] = useState({
    subject: bountyOption?.subject,
    topic: bountyOption?.topic,
    level: bountyOption?.level
  });
  const [description, setDescription] = useState('');

  const paymentDialogRef = useRef<PaymentDialogRef>(null);
  const [loading, setLoading] = useState(false);
  const isFirstRender = useRef(true);
  const authSocketConnected = '';
  const {
    isOpen: isBountyModalOpen,
    onOpen: openBountyModal,
    onClose: closeBountyModal
  } = useDisclosure();
  const storedGroupChatsArr = JSON.parse(
    localStorage.getItem('groupChatsByDateArr') as any
  );

  useEffect(() => {
    if (certainConversationId) {
      const authSocket = socketWithAuth({
        studentId,
        topic: localData.topic,
        subject: localData.subject,
        level: level.label,
        namespace: 'homework-help',
        conversationId: certainConversationId ?? storedConvoId
      }).connect();
      setSocket(authSocket);
    }
  }, [certainConversationId]);

  useEffect(() => {
    if (isSubmitted) {
      const authSocket = socketWithAuth({
        studentId,
        topic: localData.topic,
        subject: localData.subject,
        level: level.label,
        // conversationId,
        namespace: 'homework-help'
      }).connect();

      setSocket(authSocket);
    }
    return () => setIsSubmitted(false);
  }, [isSubmitted]);

  useEffect(() => {
    if (socket && !messages.length) {
      socket.on('ready', (ready) => {
        setReadyToChat(ready);
        if (!messages.length) {
          socket.emit('chat message', SHALL_WE_BEGIN);
        }
      });
      return () => socket.off('ready');
    }
  }, [messages, socket]);

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
    if (user && user.paymentMethods?.length > 0) {
      openBountyModal();
    } else {
      setupPaymentMethod();
    }
  }, [user]);

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
      setLoading(true);
      const response = await getConversionById({
        conversationId: recentConversationId ?? conversationId
      });

      if (response) {
        setVisibleButton(false);
      }
      const previousConvoData = response
        ?.map((conversation) => ({
          text: conversation?.log?.content,
          isUser: conversation?.log?.role === 'user',
          isLoading: false
        }))
        ?.filter((convo) => convo.text !== SHALL_WE_BEGIN)
        ?.sort((a, b) => {
          const dateA = new Date(a.createdAt);
          const dateB = new Date(b.createdAt);
          // If dates are the same
          if (dateA.getTime() === dateB.getTime()) {
            return a.id - b.id;
          }
          return dateA.getTime() - dateB.getTime();
        });

      const countOfIDontUnderstand = previousConvoData.filter(
        (convo) => convo.text === "I don't understand"
      ).length;

      const hasContentThreeTimes = countOfIDontUnderstand >= 3;

      if (hasContentThreeTimes) {
        setCountNeedTutor((prevState) => prevState + 2);
      }

      setMessages((prevState) => [...previousConvoData]);
      setLoading(false);
    };
    fetchConversationId();
    if (conversationId) {
      setShowPrompt(true);
    }
  }, [conversationId, socket, recentConversationId]);

  useEffect(() => {
    const fectchDescriptionById = async () => {
      const response = await getDescriptionById({
        conversationId: recentConversationId ?? conversationId
      });
      setDescription(response?.data);
    };

    fectchDescriptionById();
  }, [conversationId, recentConversationId]);

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

  //Payment Method Handlers
  const url: URL = new URL(window.location.href);
  const params: URLSearchParams = url.searchParams;
  const clientSecret = params.get('setup_intent_client_secret');
  const stripePromise = loadStripe(
    process.env.REACT_APP_STRIPE_PUBLIC_KEY as string
  );

  const setupPaymentMethod = async () => {
    try {
      const paymentIntent = await ApiService.createStripeSetupPaymentIntent();

      const { data } = await paymentIntent.json();

      paymentDialogRef.current?.startPayment(
        data.clientSecret,
        `${window.location.href}`
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (clientSecret) {
      (async () => {
        const stripe = await stripePromise;
        const setupIntent = await stripe?.retrieveSetupIntent(clientSecret);
        await ApiService.addPaymentMethod(
          setupIntent?.setupIntent?.payment_method as string
        );
        // await fetchUser();
        switch (setupIntent?.setupIntent?.status) {
          case 'succeeded':
            toast({
              title: 'Your payment method has been saved.',
              status: 'success',
              position: 'top',
              isClosable: true
            });
            openBountyModal();
            break;
          case 'processing':
            toast({
              title:
                "Processing payment details. We'll update you when processing is complete.",
              status: 'loading',
              position: 'top',
              isClosable: true
            });
            break;
          case 'requires_payment_method':
            toast({
              title:
                'Failed to process payment details. Please try another payment method.',
              status: 'error',
              position: 'top',
              isClosable: true
            });
            break;
          default:
            toast({
              title: 'Something went wrong.',
              status: 'error',
              position: 'top',
              isClosable: true
            });
            break;
        }
        // setSettingUpPaymentMethod(false);
      })();
    }
    /* eslint-disable */
  }, [clientSecret]);

  useEffect(() => {
    if (isSubmitted) {
      setMessages([]);
      setConversationId('');
      setVisibleButton(false);
      setCountNeedTutor(1);
    }
  }, [isSubmitted]);

  useEffect(() => {
    const storedConvoId = localStorage.getItem('conversationId');

    if (conversationId && (!storedConvoId || conversationId !== storedConvoId))
      localStorage.setItem('conversationId', conversationId);
    setCertainConversationId(conversationId);
  }, [conversationId]);

  useEffect(() => {
    const storedConvoId = localStorage.getItem('conversationId');

    if (storedConvoId) {
      setConversationId(storedConvoId);
      setCountNeedTutor(1);
      setRecentConverstionId(null);
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

  // useEffect(() => {
  //   if (messages.length || conversationId) {
  //     localStorage.setItem('recentMessages', JSON.stringify(messages));
  //   }
  // }, [messages, conversationId]);

  // useEffect(() => {
  //   const firstId = storedGroupChatsArr?.[0]?.messages[0]?.id;
  //   if (!storedConvoId) {
  //     setRecentConverstionId(firstId);
  //   }
  // }, [storedConvoId]);

  return (
    <HomeWorkHelpContainer>
      <HomeWorkHelpHistoryContainer>
        <ChatHistory
          studentId={studentId}
          setConversationId={setConversationId}
          conversationId={conversationId}
          isSubmitted={isSubmitted}
          setCountNeedTutor={setCountNeedTutor}
          setMessages={setMessages}
          setDeleteConservationModal={setDeleteConservationModal}
          deleteConservationModal={deleteConservationModal}
          setVisibleButton={setVisibleButton}
          setSocket={setSocket}
          setCertainConversationId={setCertainConversationId}
          messages={messages}
          setSomeBountyOpt={setSomeBountyOpt}
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
          visibleButton={visibleButton}
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

      <BountyOfferModal
        isBountyModalOpen={isBountyModalOpen}
        closeBountyModal={closeBountyModal}
        topic={localData?.topic || someBountyOpt?.topic}
        subject={localData?.subject || someBountyOpt?.subject}
        level={level.label || someBountyOpt?.level}
        description={description}
      />
      <PaymentDialog
        ref={paymentDialogRef}
        prefix={
          <Alert status="info" mb="22px">
            <AlertIcon>
              <MdInfo color={theme.colors.primary[500]} />
            </AlertIcon>
            <AlertDescription>
              Payment will not be deducted until after your first lesson, You
              may decide to cancel after your initial lesson.
            </AlertDescription>
          </Alert>
        }
      />
    </HomeWorkHelpContainer>
  );
};

export default HomeWorkHelp;
