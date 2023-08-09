import CustomModal from '../../../components/CustomComponents/CustomModal';
import { chatHomeworkHelp } from '../../../services/AI';
import userStore from '../../../state/userStore';
import Chat from '../DocChat/chat';
import ChatHistory from '../DocChat/chatHistory';
import ViewTutors from './ViewTutors';
import {
  HomeWorkHelpChatContainer,
  HomeWorkHelpContainer,
  HomeWorkHelpHistoryContainer
} from './style';
import React, { useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

const HomeWorkHelp = () => {
  const [isOpenModal, setOpenModal] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const location = useLocation();
  const [isShowPrompt, setShowPrompt] = useState<boolean>(false);
  const { user } = userStore();
  const [messages, setMessages] = useState<
    { text: string; isUser: boolean; isLoading: boolean }[]
  >([]);
  const [llmResponse, setLLMResponse] = useState('');
  const [botStatus, setBotStatus] = useState(
    'Philosopher, thinker, study companion.'
  );

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      setInputValue(event.target.value);
    },
    [setInputValue]
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

      await askLLM({
        query: prompt,
        studentId: user?._id ?? '',
        topic: location?.state?.topic
      });
    },
    [location?.state?.topic, user?._id]
  );

  const askLLM = async ({
    query,
    studentId,
    topic
  }: {
    query: string;
    studentId: string;
    topic: string;
  }) => {
    setBotStatus('Thinking');

    const response = await chatHomeworkHelp({
      query,
      studentId,
      topic
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

      await askLLM({
        query: inputValue,
        studentId: user?._id ?? '',
        topic: location?.state?.topic
      });
    },
    [inputValue, location?.state?.topic, user?._id]
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

  return (
    <HomeWorkHelpContainer>
      <HomeWorkHelpHistoryContainer>
        <ChatHistory />
      </HomeWorkHelpHistoryContainer>
      <HomeWorkHelpChatContainer>
        <Chat
          HomeWorkHelp
          isReadyToChat={true}
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
        <ViewTutors onOpenModal={onOpenModal} />
      </CustomModal>
    </HomeWorkHelpContainer>
  );
};

export default HomeWorkHelp;
