/* eslint-disable no-loop-func */

/* eslint-disable no-unsafe-optional-chaining */
import PultoJPG from '../../../assets/PlutoAi.jpg';
import { ReactComponent as HightLightIcon } from '../../../assets/highlightIcn.svg';
import { ReactComponent as SummaryIcon } from '../../../assets/summaryIcn.svg';
// import { ReactComponent as TellMeMoreIcn } from '../../../assets/tellMeMoreIcn.svg';
import { ReactComponent as TutorBag } from '../../../assets/tutor-bag.svg';
import ChatLoader from '../../../components/CustomComponents/CustomChatLoader';
import CustomMarkdownView from '../../../components/CustomComponents/CustomMarkdownView';
import CustomMarkdownViewLLM from '../../../components/CustomComponents/CustomMarkdownViewLLM';
import CustomSideModal from '../../../components/CustomComponents/CustomSideModal';
import CustomTabs from '../../../components/CustomComponents/CustomTabs';
import { useChatScroll } from '../../../components/hooks/useChatScroll';
// import { chatWithDoc } from '../../../services/AI';
import FlashcardDataProvider from '../FlashCards/context/flashcard';
import ChatHistory from './chatHistory';
import HighLight from './highlist';
import SetUpFlashCards from './setupFlashCards';
import {
  AiMessage,
  AskSomethingContainer,
  AskSomethingPill,
  AskSomethingPillContainer,
  AskSomethingPillHeadingText,
  ChatbotContainer,
  ChatContainerResponse,
  CircleContainer,
  ClockButton,
  ContentWrapper,
  DownPillContainer,
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
  TellMeMorePill,
  TextContainer,
  UserMessage,
  Wrapper
} from './styles';
import Summary from './summary';
import { Text } from '@chakra-ui/react';
import { useState, useEffect, useCallback, useRef, useMemo } from 'react';

interface IChat {
  HomeWorkHelp?: boolean;
  studentId?: any;
  documentId?: any;
  onOpenModal?: () => void;
  isShowPrompt?: boolean;
  messages?: { text: string; isUser: boolean; isLoading: boolean }[];
  llmResponse?: string;
  botStatus?: string;
  handleSendMessage?: any;
  handleInputChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  inputValue: string;
  handleKeyDown?: any;
  handleSummary?: any;
  summaryLoading?: boolean;
  summaryText?: string;
  setSummaryText?: any;
  handleClickPrompt?: any;
  homeWorkHelpPlaceholder?: any;
  historyArr?: any[];
}
const Chat = ({
  HomeWorkHelp,
  onOpenModal,
  isShowPrompt,
  messages,
  llmResponse,
  botStatus,
  inputValue,
  handleSendMessage,
  handleInputChange,
  handleKeyDown,
  handleSummary,
  summaryLoading,
  summaryText,
  setSummaryText,
  documentId,
  handleClickPrompt,
  homeWorkHelpPlaceholder,
  historyArr
}: IChat) => {
  const [chatbotSpace, setChatbotSpace] = useState(647);
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [isFlashCard, setFlashCard] = useState<boolean>(false);
  const [isQuiz, setQuiz] = useState<boolean>(false);

  const [isChatHistory, setChatHistory] = useState<boolean>(false);
  const textAreaRef = useRef<any>();
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

  const onChatHistory = useCallback(() => {
    setChatHistory((prevState) => !prevState);
  }, []);

  const isShowPills = useMemo(
    () => !!historyArr?.length && !HomeWorkHelp && !!isShowPrompt,
    [historyArr, HomeWorkHelp, isShowPrompt]
  );

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
      component: (
        <Summary
          handleSummary={handleSummary}
          summaryLoading={summaryLoading}
          summaryTexts={summaryText}
          setSummaryText={setSummaryText}
        />
      )
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
    }
    // {
    //   id: 3,
    //   img: <NeedPills src="/svgs/quiz.svg" alt="quiz" />,
    //   title: 'Quiz',
    //   onClick: onQuiz
    // }
  ];

  const homeHelp = [
    {
      id: 1,
      img: <TutorBag />,
      title: 'Find a tutor',
      onClick: onOpenModal
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

  useEffect(() => {
    textAreaRef.current.style.height = '2.5rem'; // Initially set height
    textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`; // Then adjust it

    // Adjust border radius based on inputValue
    if (inputValue.length > 0) {
      textAreaRef.current.style.borderRadius = '16px';
    } else {
      textAreaRef.current.style.borderRadius = '100px'; // Set initial border radius
    }
  }, [inputValue]);

  return (
    <>
      <Form id="chatbot" isHomeWorkHelp={HomeWorkHelp}>
        <Wrapper>
          <ContentWrapper>
            <FlexColumnContainer>
              <InnerWrapper>
                <GridContainer>
                  <GridItem>
                    <FlexContainer>
                      <CircleContainer>
                        <img
                          src={PultoJPG}
                          style={{
                            objectFit: 'cover',
                            height: 'auto',
                            width: '100%',
                            borderRadius: '50%'
                          }}
                          alt=""
                        />
                      </CircleContainer>
                      <TextContainer>
                        <Text className="font-semibold">Plato.</Text>
                        <Text>{botStatus}</Text>
                      </TextContainer>
                    </FlexContainer>
                    <StyledText>
                      Welcome! I'm here to help you make the most of your time
                      and your notes. Ask me questions, and I'll find the
                      answers that match, given the information you've supplied.
                      Let's get learning!
                    </StyledText>
                  </GridItem>
                  {HomeWorkHelp && !messages?.length && !isShowPrompt && (
                    <OptionsContainer>
                      <Text className="">What do you need?</Text>

                      <PillsContainer>
                        {homeHelp.map((need) => (
                          <StyledDiv key={need.id} onClick={need.onClick}>
                            {need.img}
                            {need.title}
                          </StyledDiv>
                        ))}
                      </PillsContainer>
                    </OptionsContainer>
                  )}
                  {!messages?.length &&
                    !historyArr?.length &&
                    !HomeWorkHelp &&
                    !isShowPrompt && (
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

                  {!messages?.length &&
                    !historyArr?.length &&
                    !isShowPrompt && (
                      <AskSomethingContainer>
                        <AskSomethingPillHeadingText>
                          Try asking about:
                        </AskSomethingPillHeadingText>
                        <AskSomethingPillContainer>
                          {prompts.map((prompt, key) => {
                            return (
                              <AskSomethingPill
                                key={key}
                                onClick={(e) => handleClickPrompt(e, prompt)}
                              >
                                <Text>{prompt}</Text>
                              </AskSomethingPill>
                            );
                          })}
                        </AskSomethingPillContainer>
                      </AskSomethingContainer>
                    )}
                  <ChatContainerResponse ref={ref}>
                    {historyArr?.map((history, index) =>
                      history?.isUser ? (
                        <UserMessage key={index + 1}>
                          {history.text}
                        </UserMessage>
                      ) : (
                        <>
                          {history?.isLoading ? (
                            <ChatLoader />
                          ) : (
                            <AiMessage key={index * 1}>
                              <CustomMarkdownView source={history?.text} />
                            </AiMessage>
                          )}
                        </>
                      )
                    )}
                    {messages?.map((message, index) =>
                      message.isUser ? (
                        <UserMessage key={index}>{message.text}</UserMessage>
                      ) : (
                        <>
                          {message.isLoading ? (
                            <ChatLoader />
                          ) : (
                            <AiMessage key={index + 1}>
                              <CustomMarkdownViewLLM source={message.text} />
                            </AiMessage>
                          )}
                        </>
                      )
                    )}
                    {llmResponse && (
                      <AiMessage key="hey">
                        <CustomMarkdownView source={llmResponse} />
                      </AiMessage>
                    )}
                  </ChatContainerResponse>
                </GridContainer>
              </InnerWrapper>
            </FlexColumnContainer>
          </ContentWrapper>
          {
            // When isShowPills is true and messages is either falsey or has length of 0
            (isShowPills && (!messages || messages.length === 0)) ||
            // When isShowPills is false and messages has a length greater than 0
            (isShowPills && messages && messages.length >= 1) ? (
              <div
                style={{
                  position: 'fixed',
                  width: '100%',
                  bottom: '60px',
                  background: 'white'
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
            ) : null
          }
        </Wrapper>

        {/* {isShowPrompt && (
          <TellMeMorePill isHomeWorkHelp={HomeWorkHelp}>
            <p>Tell me more</p>
            <TellMeMoreIcn />
          </TellMeMorePill>
        )} */}

        {!!messages?.length && HomeWorkHelp && isShowPrompt && (
          <DownPillContainer>
            <PillsContainer>
              {homeHelp.map((need) => (
                <StyledDiv onClick={need.onClick} key={need.id}>
                  {need.img}
                  {need.title}
                </StyledDiv>
              ))}
            </PillsContainer>
          </DownPillContainer>
        )}
        <ChatbotContainer chatbotSpace={chatbotSpace}>
          <InputContainer>
            <Input
              ref={textAreaRef}
              placeholder={
                HomeWorkHelp
                  ? homeWorkHelpPlaceholder
                  : `Ask Shepherd about ${documentId}`
              }
              value={inputValue}
              onKeyDown={handleKeyDown}
              onChange={handleInputChange}
              style={{
                minHeight: '2.5rem',
                maxHeight: '10rem',
                overflowY: 'auto'
              }}
            />
            <SendButton type="button" onClick={handleSendMessage}>
              <img alt="" src="/svgs/send.svg" className="w-8 h-8" />
            </SendButton>
          </InputContainer>
          {/* {!HomeWorkHelp && (
            <ClockButton type="button" onClick={onChatHistory}>
              <img alt="" src="/svgs/anti-clock.svg" className="w-5 h-5" />
            </ClockButton>
          )} */}
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

      <CustomSideModal onClose={onChatHistory} isOpen={isChatHistory}>
        <ChatHistory />
      </CustomSideModal>
    </>
  );
};

export default Chat;
