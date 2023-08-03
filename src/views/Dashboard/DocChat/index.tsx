import CustomToast from '../../../components/CustomComponents/CustomToast/index';
import {
  chatHistory,
  chatWithDoc,
  generateSummary,
  postGenerateSummary
} from '../../../services/AI';
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

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      setInputValue(event.target.value);
    },
    [setInputValue]
  );

  const askLLM = async ({
    query,
    studentId,
    documentId
  }: {
    query: string;
    studentId: string;
    documentId: string;
  }) => {
    setBotStatus('Thinking');
    const response = await chatWithDoc({
      query,
      studentId,
      documentId
    });

    const reader = response.body?.getReader();
    const decoder = new TextDecoder('utf-8');
    let temp = '';

    // eslint-disable-next-line no-constant-condition
    while (true) {
      setBotStatus('Typing...');
      // @ts-ignore: scary scenes, but let's observe
      const { done, value } = await reader.read();
      if (done) {
        setLLMResponse('');
        setTimeout(
          () => setBotStatus('Philosopher, thinker, study companion.'),
          1000
        );

        // eslint-disable-next-line
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: temp, isUser: false, isLoading: false }
        ]);
        break;
      }
      const chunk = decoder.decode(value);
      temp += chunk;
      setLLMResponse((llmResponse) => llmResponse + chunk);
    }
  };

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

      await askLLM({ query: inputValue, studentId, documentId });
    },
    [inputValue, studentId, documentId, messages]
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
              title="Failed to fetch chat history..."
              status="error"
            />
          ),
          position: 'top-right',
          isClosable: true
        });
      }
    },
    []
  );

  useEffect(() => {
    const getSummary = async () => {
      const response = await generateSummary({
        documentId,
        studentId
      });
      setSummaryText(response?.summary);
    };
    getSummary();
  }, []);

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
          />
          <Chat
            isShowPrompt={isShowPrompt}
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
          />
        </div>
      </section>
    )
  );
}
