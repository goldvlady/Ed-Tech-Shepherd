import { chatWithDoc } from '../../../services/AI';
import userStore from '../../../state/userStore';
import TempPDFViewer from './TempPDFViewer';
import Chat from './chat';
import { useEffect, useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function DocChat() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = userStore();
  const [response, setResponse] = useState({});
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

      setShowPrompt(true);

      setMessages((prevMessages) => [
        ...prevMessages,
        { text: inputValue, isUser: true, isLoading: false }
      ]);
      setInputValue('');

      await askLLM({ query: inputValue, studentId, documentId });
    },
    [inputValue, studentId, documentId]
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
          />
        </div>
      </section>
    )
  );
}
