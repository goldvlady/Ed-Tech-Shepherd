import { ReactComponent as HightLightIcon } from '../../assets/highlightIcn.svg';
import { ReactComponent as SummaryIcon } from '../../assets/summaryIcn.svg';
import CustomSideModal from '../../components/CustomComponents/CustomSideModal';
import CustomTabs from '../../components/CustomComponents/CustomTabs';
import { useChatScroll } from '../../components/hooks/useChatScroll';
import FlashcardDataProvider from '../Dashboard/FlashCards/context/flashcard';
import HighLight from './highlist';
import SetUpFlashCards from './setupFlashCards';
import {
  AiMessage,
  ChatbotContainer,
  ChatContainerResponse,
  CircleContainer,
  ClockButton,
  ContentWrapper,
  FlexColumnContainer,
  FlexContainer,
  Form,
  GridContainer,
  GridItem,
  InnerWrapper,
  Input,
  InputContainer,
  NeedPills,
  OptionsContainer,
  PillsContainer,
  SendButton,
  StyledDiv,
  StyledText,
  TextContainer,
  UserMessage,
  Wrapper
} from './styles';
import Summary from './summary';
import { Text } from '@chakra-ui/react';
import { useState, useEffect, useCallback } from 'react';

const Chat = () => {
  const [chatbotSpace, setChatbotSpace] = useState(647);
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [isFlashCard, setFlashCard] = useState<boolean>(false);
  const [isQuiz, setQuiz] = useState<boolean>(false);
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>(
    []
  );
  const [inputValue, setInputValue] = useState('');
  const [isShowPrompt, setShowPrompt] = useState<boolean>(false);
  const ref = useChatScroll(messages);

  const prompts = [
    "Explain this document to me like I'm five",
    'Who wrote this book?',
    'How many chapters are in this book?'
  ];

  const onClose = useCallback(() => {
    setModalOpen((prevState) => !prevState);
  }, []);

  const onFlashCard = useCallback(() => {
    setFlashCard((prevState) => !prevState);
  }, []);

  const onQuiz = useCallback(() => {
    setQuiz((prevState) => !prevState);
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();

    if (inputValue.trim() === '') {
      return;
    }

    setShowPrompt(true);

    setMessages((prevMessages) => [
      ...prevMessages,
      { text: inputValue, isUser: true }
    ]);
    setInputValue('');

    setTimeout(() => {
      const aiResponse = 'AI response';
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: aiResponse, isUser: false }
      ]);
    }, 500);
  };

  const tabLists = [
    {
      id: 1,
      title: 'Summary',
      icon: <SummaryIcon />
    },
    {
      id: 2,
      title: 'Highlight',
      icon: <HightLightIcon />
    }
  ];

  const tabPanelList = [
    {
      id: 1,
      component: <Summary />
    },
    {
      id: 2,
      component: <HighLight />
    }
  ];

  const yourNeeds = [
    {
      id: 1,
      img: <NeedPills src="/svgs/summary.svg" alt="summary" />,
      title: 'Summary',
      onClick: onClose
    },
    {
      id: 2,
      img: <NeedPills src="/svgs/flashcards.svg" alt="flash cards" />,
      title: 'Flashcards',
      onClick: onFlashCard
    },
    {
      id: 3,
      img: <NeedPills src="/svgs/quiz.svg" alt="quiz" />,
      title: 'Quiz',
      onClick: onQuiz
    }
  ];

  useEffect(() => {
    window.addEventListener('resize', () => {
      const chatbotWidth =
        document.getElementById('chatbot')?.clientWidth || 647;
      // ts-ignore
      setChatbotSpace(chatbotWidth + 24);
    });
    return window.removeEventListener('resize', () => {
      const chatbotWidth =
        document.getElementById('chatbot')?.clientWidth || 647;
      // ts-ignore
      setChatbotSpace(chatbotWidth + 24);
    });
  }, []);

  return (
    <>
      <Form id="chatbot">
        <Wrapper>
          <ContentWrapper>
            <FlexColumnContainer>
              <InnerWrapper>
                <GridContainer>
                  <GridItem>
                    <FlexContainer>
                      <CircleContainer>
                        <img
                          src="/svgs/robot-face.svg"
                          className="h-9 w-9 text-gray-400"
                          alt=""
                        />
                      </CircleContainer>
                      <TextContainer>
                        <Text className="font-semibold">Plato.</Text>
                        <Text>Philosopher, thinker, study companion.</Text>
                      </TextContainer>
                    </FlexContainer>
                    <StyledText>
                      Welcome! I'm here to help you make the most of your time
                      and your notes. Ask me questions, and I'll find the
                      answers that match, given the information you've supplied.
                      Let's get learning!
                    </StyledText>
                  </GridItem>
                  <ChatContainerResponse ref={ref}>
                    {messages.map((message, index) =>
                      message.isUser ? (
                        <UserMessage key={index}>{message.text}</UserMessage>
                      ) : (
                        <AiMessage key={index}>{message.text}</AiMessage>
                      )
                    )}
                  </ChatContainerResponse>
                  {!isShowPrompt && (
                    <OptionsContainer>
                      <Text className="">What do you need?</Text>
                      <PillsContainer>
                        {yourNeeds.map((need) => (
                          <StyledDiv onClick={need.onClick} key={need.id}>
                            {need.img}
                            {need.title}
                          </StyledDiv>
                        ))}
                      </PillsContainer>
                    </OptionsContainer>
                  )}
                  {!isShowPrompt && (
                    <div className="flex flex-col col-span-full px-3 py-1 h-36 rounded-lg justify-between ml-7 text-sm">
                      <Text className="my-4">Try asking about:</Text>
                      <div className="flex flex-wrap">
                        {prompts.map((prompt, key) => {
                          return (
                            <div
                              key={key}
                              className="border-gray-300 border-1 rounded-full py-2 px-3 mb-2 mx-1 hover:bg-gray-200 cursor-pointer"
                            >
                              <Text>{prompt}</Text>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </GridContainer>
              </InnerWrapper>
            </FlexColumnContainer>
          </ContentWrapper>
          {isShowPrompt && (
            <div
              style={{
                position: 'relative',
                bottom: '240px',
                background: 'whitesmoke'
              }}
            >
              <OptionsContainer>
                <PillsContainer>
                  {yourNeeds.map((need) => (
                    <StyledDiv onClick={need.onClick} key={need.id}>
                      {need.img}
                      {need.title}
                    </StyledDiv>
                  ))}
                </PillsContainer>
              </OptionsContainer>
            </div>
          )}
        </Wrapper>
        <ChatbotContainer chatbotSpace={chatbotSpace}>
          <InputContainer>
            <Input
              type="text"
              placeholder="Tell Shepherd what to do next"
              value={inputValue}
              onChange={handleInputChange}
            />
            <SendButton onClick={handleSendMessage}>
              <img alt="" src="/svgs/send.svg" className="w-8 h-8" />
            </SendButton>
          </InputContainer>
          <ClockButton>
            <img alt="" src="/svgs/anti-clock.svg" className="w-5 h-5" />
          </ClockButton>
        </ChatbotContainer>
      </Form>

      <CustomSideModal onClose={onClose} isOpen={isModalOpen}>
        <div style={{ marginTop: '3rem' }}>
          <CustomTabs
            isSideComponent
            tablists={tabLists}
            tabPanel={tabPanelList}
          />
        </div>
      </CustomSideModal>

      <CustomSideModal onClose={onFlashCard} isOpen={isFlashCard}>
        <div style={{ margin: '3rem 0', overflowY: 'scroll' }}>
          <FlashcardDataProvider>
            <SetUpFlashCards />
          </FlashcardDataProvider>
        </div>
      </CustomSideModal>

      <CustomSideModal onClose={onQuiz} isOpen={isQuiz}>
        <p>hellloo </p>
      </CustomSideModal>
    </>
  );
};

export default Chat;
