import CustomToast from '../../../components/CustomComponents/CustomToast/index';
import {
  chatHistory,
  chatWithDoc,
  generateSummary,
  postGenerateSummary
} from '../../../services/AI';
import socketWithAuth from '../../../socket';
import userStore from '../../../state/userStore';
import TempPDFViewer from './TempPDFViewer';
import Chat from './chat';
import { useToast } from '@chakra-ui/react';
import { useEffect, useState, useCallback, useLayoutEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function DocChat() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = userStore();
  const toast = useToast();
  const [llmResponse, setLLMResponse] = useState('');
  const [readyToChat, setReadyToChat] = useState(false);
  const [botStatus, setBotStatus] = useState(
    'Philosopher, thinker, study companion.'
  );
  const [messages, setMessages] = useState<
    { text: string; isUser: boolean; isLoading: boolean }[]
  >([]);
  const [inputValue, setInputValue] = useState('');
  const [isShowPrompt, setShowPrompt] = useState<boolean>(false);
  const documentId = location.state.docTitle ?? '';
  const studentId = user?._id ?? '';
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summaryText, setSummaryText] = useState('');
  const [socket, setSocket] = useState<any>(null);

  useEffect(() => {
    if (!socket) {
      const authSocket = socketWithAuth({
        studentId,
        documentId
      }).connect();
      setSocket(authSocket);
    }
  }, [socket, studentId, documentId]);

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
      socket.on('bot response', async (token) => {
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

  const handleClickPrompt = useCallback(
    async (event: React.SyntheticEvent<HTMLDivElement>, prompt: string) => {
      event.preventDefault();

      setShowPrompt(!!messages?.length);

      setMessages((prevMessages) => [
        ...prevMessages,
        { text: prompt, isUser: true, isLoading: false }
      ]);

      socket.emit('chat message');
    },
    [socket, messages?.length]
  );

  const handleSendMessage = useCallback(
    async (event: React.SyntheticEvent<HTMLButtonElement>) => {
      event.preventDefault();

      if (inputValue.trim() === '') {
        return;
      }

      setShowPrompt(!!messages?.length);

      setMessages((prevMessages) => [
        ...prevMessages,
        { text: inputValue, isUser: true, isLoading: false }
      ]);
      setInputValue('');

      socket.emit('chat message', inputValue);
    },
    [inputValue, messages, socket]
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

  const handleSummary = useCallback(
    async (event: React.SyntheticEvent<HTMLButtonElement>) => {
      event.preventDefault();
      try {
        setSummaryLoading(true);
        const response = await postGenerateSummary({
          documentId,
          studentId
        });
        setSummaryLoading(false);
        const reader = response.body?.getReader();
        //@ts-ignore:convert to a readable text
        const { value } = await reader.read();
        const decoder = new TextDecoder('utf-8');
        const chunk = decoder.decode(value);
        if (chunk.length) {
          const response = await generateSummary({
            documentId,
            studentId
          });
          setSummaryText(response?.summary);
        }
      } catch (error) {
        toast({
          render: () => (
            <CustomToast
              title="Unable to process your request at this time. Please try again later."
              status="error"
            />
          ),
          position: 'top-right',
          isClosable: true
        });
      }
    },
    [documentId, studentId, toast]
  );

  useEffect(() => {
    const getSummary = async () => {
      try {
        const response = await generateSummary({
          documentId,
          studentId
        });
        setSummaryText(response?.summary);
      } catch (error) {
        toast({
          render: () => (
            <CustomToast
              title="Unable to process your request at this time. Please try again later."
              status="error"
            />
          ),
          position: 'top-right',
          isClosable: true
        });
      }
    };
    getSummary();
  }, [documentId, studentId, toast]);

  useLayoutEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const historyData = await chatHistory({
          documentId,
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
  }, [documentId, studentId, toast]);

  useEffect(() => setShowPrompt(!!messages?.length), [messages?.length]);

  useEffect(() => {
    if (!location.state?.documentUrl) navigate('/dashboard/notes');
  }, [navigate, location.state?.documentUrl]);

  return (
    location.state?.documentUrl && (
      <section className="divide-y max-w-screen-xl fixed mx-auto">
        <div className="h-screen bg-white divide-y divide-gray-200 lg:grid lg:grid-cols-12 lg:divide-y-0 lg:divide-x">
          <TempPDFViewer
            pdfLink={location.state.documentUrl}
            name={location.state.docTitle}
            documentId={documentId}
          />
          <Chat
            isShowPrompt={isShowPrompt}
            isReadyToChat={readyToChat}
            messages={messages}
            llmResponse={llmResponse}
            botStatus={botStatus}
            handleSendMessage={handleSendMessage}
            handleInputChange={handleInputChange}
            inputValue={inputValue}
            handleKeyDown={handleKeyDown}
            handleSummary={handleSummary}
            summaryLoading={summaryLoading}
            summaryText={summaryText}
            setSummaryText={setSummaryText}
            documentId={documentId}
            handleClickPrompt={handleClickPrompt}
          />
        </div>
      </section>
    )
  );
}
