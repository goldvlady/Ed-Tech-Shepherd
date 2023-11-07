/* eslint-disable no-loop-func,@typescript-eslint/no-non-null-assertion,no-unsafe-optional-chaining,react-hooks/exhaustive-deps */
import PultoJPG from '../../../assets/PlutoAi.jpg';
import PinLogo from '../../../assets/SVGComponent/Pin';
import { ThumbsDown } from '../../../assets/SVGComponent/ThumbsDown';
import { ThumbsUp } from '../../../assets/SVGComponent/ThumbsUp';
import { ReactComponent as HightLightIcon } from '../../../assets/highlightIcn.svg';
import PDFImg from '../../../assets/pdf_img.png';
// import { ReactComponent as PinLogo } from '../../../assets/pin.svg';
import SocratesImg from '../../../assets/socrates-image.png';
import { ReactComponent as SummaryIcon } from '../../../assets/summaryIcn.svg';
// import { ReactComponent as TellMeMoreIcn } from '../../../assets/tellMeMoreIcn.svg';
import ChatLoader from '../../../components/CustomComponents/CustomChatLoader';
import { TutorBagIcon } from '../../../components/CustomComponents/CustomImage/tutor-bag';
import CustomMarkdownView from '../../../components/CustomComponents/CustomMarkdownView';
import CustomSideModal from '../../../components/CustomComponents/CustomSideModal';
import CustomTabs from '../../../components/CustomComponents/CustomTabs';
import { useChatScroll } from '../../../components/hooks/useChatScroll';
import { snip } from '../../../helpers/file.helpers';
import useIsMobile from '../../../helpers/useIsMobile';
import FlashcardDataProvider from '../FlashCards/context/flashcard';
import SetupFlashcardPage from '../FlashCards/forms/flashcard_setup';
import PinnedMessages from './PinnedMessages';
import ChatHistory from './chatHistory';
import HighLight from './highlist';
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
import { Text, Icon } from '@chakra-ui/react';
import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { AiFillLike } from 'react-icons/ai';
import { AiFillDislike } from 'react-icons/ai';
import { FiThumbsUp } from 'react-icons/fi';
import { FiThumbsDown } from 'react-icons/fi';

interface IChat {
  HomeWorkHelp?: boolean;
  studentId?: any;
  documentId?: any;
  docKeywords?: any;
  onOpenModal?: () => void;
  isShowPrompt?: boolean;
  messages?: {
    text: string;
    isUser: boolean;
    isLoading: boolean;
    chatId?: number;
    liked?: boolean;
    disliked?: boolean;
    isPinned?: boolean;
  }[];
  llmResponse?: string;
  botStatus?: string;
  handleSendMessage?: any;
  handleSendKeyword?: any;
  handleInputChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  inputValue: string;
  handleKeyDown?: any;
  handleSummary?: any;
  isReadyToChat: boolean;
  summaryLoading?: boolean;
  summaryText?: string;
  setSummaryText?: any;
  handleClickPrompt?: any;
  homeWorkHelpPlaceholder?: any;
  countNeedTutor?: number | undefined;
  onCountTutor?: any;
  handleAceHomeWorkHelp?: () => void;
  handleDeleteSummary?: () => void;
  handleUpdateSummary?: () => void;
  hightlightedText?: any[];
  setSelectedHighlightArea?: any;
  loading?: boolean;
  setHightlightedText?: any;
  setLoading?: any;
  isUpdatedSummary?: boolean;
  directStudentId?: string;
  title?: string;
  visibleButton?: boolean;
  fetchDescription?: any;
  freshConversationId?: any;
  onChatHistory?: any;
  onSwitchOnMobileView?: any;
  handleDislike?: any;
  handleLike?: any;
  likesDislikes?: any;
  setChatId?: any;
  handlePinPrompt?: any;
}
const Chat = ({
  HomeWorkHelp,
  isReadyToChat,
  onOpenModal,
  isShowPrompt,
  messages,
  llmResponse,
  botStatus,
  inputValue,
  handleSendMessage,
  handleSendKeyword,
  handleInputChange,
  handleKeyDown,
  handleSummary,
  summaryLoading,
  summaryText,
  setSummaryText,
  documentId,
  docKeywords,
  handleClickPrompt,
  homeWorkHelpPlaceholder,
  countNeedTutor,
  onCountTutor,
  handleAceHomeWorkHelp,
  handleDeleteSummary,
  handleUpdateSummary,
  hightlightedText,
  setSelectedHighlightArea,
  loading,
  isUpdatedSummary,
  title,
  directStudentId,
  visibleButton,
  fetchDescription,
  freshConversationId,
  onChatHistory,
  onSwitchOnMobileView,
  handleDislike,
  handleLike,
  likesDislikes,
  setChatId,
  handlePinPrompt,
  studentId
}: IChat) => {
  const [chatbotSpace, setChatbotSpace] = useState(647);
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [isFlashCard, setFlashCard] = useState<boolean>(false);
  const [isQuiz, setQuiz] = useState<boolean>(false);
  const textAreaRef = useRef<any>();
  const textAreaRef2 = useRef<any>();
  const ref = useChatScroll(messages);
  const [hoveredIndex, setHoveredIndex] = useState(0);
  const [hoveredUserIndex, setHoveredUserIndex] = useState(0);
  const isMobile = useIsMobile();

  const [isPinnedMessages, setPinnedMessages] = useState(false);

  // const handleLike = (index) => {
  //   setLikesDislikes((prev) => {
  //     const newState = [...prev];
  //     newState[index] = { like: !prev[index]?.like, dislike: false };
  //     return newState;
  //   });
  // };

  // const handleDislike = (index) => {
  //   setLikesDislikes((prev) => {
  //     const newState = [...prev];
  //     newState[index] = { dislike: !prev[index]?.dislike, like: false };
  //     return newState;
  //   });
  // };

  const prompts = [
    "Explain this document to me like I'm five",
    'What do I need to know to understand this document?',
    'What other topics should I explore after this document?'
  ];

  const onClose = useCallback(() => {
    setModalOpen((prevState) => !prevState);
  }, []);

  const onFlashCard = useCallback(() => {
    setFlashCard((prevState) => !prevState);
  }, []);

  const onPinnedMessages = useCallback(() => {
    setPinnedMessages((prevState) => !prevState);
  }, [setPinnedMessages]);

  const onQuiz = useCallback(() => {
    setQuiz((prevState) => !prevState);
  }, []);

  const isShowPills = useMemo(
    () => !!messages?.length && !HomeWorkHelp && !!isShowPrompt,
    [messages, HomeWorkHelp, isShowPrompt]
  );

  const isFindTutor = useMemo(() => {
    return (
      countNeedTutor! >= 3 && HomeWorkHelp && !messages?.length && !isShowPrompt
    );
  }, [countNeedTutor, messages, HomeWorkHelp, isShowPrompt]);

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
          handleDeleteSummary={handleDeleteSummary}
          handleUpdateSummary={handleUpdateSummary}
          loading={loading}
          isUpdatedSummary={isUpdatedSummary}
        />
      )
    },
    {
      id: 2,
      component: (
        <HighLight
          hightlightedText={hightlightedText!}
          setSelectedHighlightArea={setSelectedHighlightArea}
          loading={loading!}
        />
      )
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
      title: 'Pinned Messages',
      onClick: onPinnedMessages
    }
  ];

  const homeHelp = [
    {
      id: 1,
      title: "I don't understand",
      onClick: () => {
        onCountTutor("I don't understand");
        freshConversationId?.length && fetchDescription(freshConversationId);
      },
      show: true
    },
    {
      id: 2,
      img: <TutorBagIcon iconColor="#FB8441" />,
      title: 'Find a tutor',
      onClick: onOpenModal,
      show: countNeedTutor! > 3
    },
    {
      id: 3,
      title: 'Start New Conversation',
      onClick: handleAceHomeWorkHelp,
      show: true
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
    if (textAreaRef.current) {
      textAreaRef.current.style.height = '2.5rem'; // Initially set height
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`; // Then adjust it

      // Adjust border radius based on inputValue
      if (inputValue.length > 0) {
        textAreaRef.current.style.borderRadius = '16px';
        textAreaRef.current.style.minHeight = '2.5rem';
      } else {
        textAreaRef.current.style.borderRadius = '100px'; // Set initial border radius
      }
    }
  }, [inputValue, textAreaRef.current]);

  useEffect(() => {
    if (textAreaRef2.current) {
      textAreaRef2.current.style.height = '2.5rem'; // Initially set height
      textAreaRef2.current.style.height = `${textAreaRef2.current.scrollHeight}px`; // Then adjust it

      // Adjust border radius based on inputValue
      if (inputValue.length > 0) {
        textAreaRef2.current.style.borderRadius = '16px';
        textAreaRef2.current.style.minHeight = '2.5rem';
      } else {
        textAreaRef2.current.style.borderRadius = '100px'; // Set initial border radius
      }
    }
  }, [inputValue, textAreaRef2.current, visibleButton]);

  const scrollToMessage = (chatId) => {
    const messageIndex = messages.findIndex((m) => m.chatId === chatId);
    ref.current[messageIndex]?.scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    });
  };

  return (
    <>
      <Form id="chatbot" isHomeWorkHelp={HomeWorkHelp}>
        <Wrapper>
          <ContentWrapper>
            <FlexColumnContainer>
              <InnerWrapper ref={ref}>
                <div
                  style={{
                    // position: 'fixed',
                    width: 'auto'
                  }}
                >
                  <GridItem>
                    <FlexContainer>
                      <CircleContainer>
                        <img
                          src={HomeWorkHelp ? SocratesImg : PultoJPG}
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
                        <Text className="font-semibold">
                          {HomeWorkHelp ? 'Socrates' : 'Plato.'}
                        </Text>
                        <Text>{botStatus}</Text>
                      </TextContainer>
                    </FlexContainer>
                    {HomeWorkHelp ? (
                      <StyledText>
                        Hello! I'm Socrates. I'm here to help you with your
                        homework. Instead of just giving you answers, I prefer
                        to ask questions that'll help you think and understand
                        the topic better. Let's work together to explore the
                        subjects you're studying. What would you like to start
                        with?
                      </StyledText>
                    ) : (
                      <StyledText>
                        Welcome! I'm here to help you make the most of your time
                        and your notes. Ask me questions, and I'll find the
                        answers that match, given the information you've
                        supplied. Let's get learning!
                      </StyledText>
                    )}
                  </GridItem>
                </div>

                <GridContainer isHomeWorkHelp={HomeWorkHelp}>
                  {HomeWorkHelp && visibleButton ? (
                    <div
                      style={{
                        position: 'absolute',
                        top: '25rem',
                        right: '36%',
                        zIndex: '111111111'
                      }}
                    >
                      <StyledDiv
                        onClick={handleAceHomeWorkHelp}
                        style={{
                          color: '#FB8441',
                          background: 'white'
                        }}
                        needIndex
                      >
                        Start New Conversation
                      </StyledDiv>
                    </div>
                  ) : null}
                  {isFindTutor && (
                    <OptionsContainer>
                      <Text className="">What do you need?</Text>

                      <PillsContainer>
                        {homeHelp.map((need) => (
                          <StyledDiv key={need.id} onClick={need.onClick}>
                            {need.img}
                            <p></p>
                            {need.title}
                          </StyledDiv>
                        ))}
                      </PillsContainer>
                    </OptionsContainer>
                  )}
                  {!messages?.length && !HomeWorkHelp && !isShowPrompt && (
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
                  {!HomeWorkHelp && !messages?.length && !isShowPrompt && (
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
                  <ChatContainerResponse
                    messages={messages && messages.length >= 1}
                  >
                    <>
                      {messages?.map((message, index) => {
                        // const isHovered = index === hoveredIndex;
                        // const isUserHovered = index === hoveredUserIndex;
                        return message.isUser ? (
                          <>
                            <UserMessage
                              key={index}
                              style={{ position: 'relative' }}
                              // onMouseEnter={() => setHoveredUserIndex(index)}
                              // onMouseLeave={() => setHoveredUserIndex(0)}
                            >
                              {message.text}
                            </UserMessage>
                            {!HomeWorkHelp && (
                              <div
                                style={{
                                  display: 'flex',
                                  alignItems: 'self-end',
                                  gap: '20px',
                                  marginLeft: 'auto',
                                  marginBottom: '15px'
                                }}
                              >
                                <div
                                  style={{
                                    width: 'auto',
                                    padding: '10px',
                                    borderRadius: '100px',
                                    gap: '5px',
                                    background: '#F7F7F8',
                                    display: 'flex',
                                    alignItems: 'center',
                                    fontSize: ' 0.875rem',
                                    cursor: 'pointer'
                                  }}
                                  onClick={() =>
                                    handlePinPrompt({
                                      studentId,
                                      chatHistoryId: String(message.chatId)
                                    })
                                  }
                                >
                                  <PinLogo
                                    iconColor={
                                      message?.isPinned ? 'blue' : '#6E7682'
                                    }
                                  />
                                  {/* <p>Pin</p> */}
                                </div>
                              </div>
                            )}
                          </>
                        ) : (
                          <div
                            key={index}
                            onMouseEnter={() => setHoveredIndex(index)}
                            onMouseLeave={() => setHoveredIndex(0)}
                          >
                            {message.isLoading ? (
                              <ChatLoader />
                            ) : (
                              <div style={{ maxWidth: '439px' }}>
                                <AiMessage style={{ position: 'relative' }}>
                                  {/* <PinLogo
                                    style={{
                                      display: isHovered ? 'block' : 'none',
                                      cursor: 'pointer',
                                      bottom: '-10px',
                                      left: '15px',
                                      position: 'relative'
                                    }}
                                  /> */}
                                  <CustomMarkdownView
                                    source={message.text}
                                    keywords={docKeywords}
                                    handleSendMessage={handleSendMessage}
                                    handleSendKeyword={handleSendKeyword}
                                  />
                                </AiMessage>
                                {!HomeWorkHelp && (
                                  <div
                                    style={{
                                      display: 'flex',
                                      alignItems: 'self-end',
                                      gap: '20px',
                                      marginBottom: '15px'
                                    }}
                                  >
                                    <div
                                      style={{
                                        width: 'auto',
                                        // height: '33px',
                                        padding: '10px',
                                        borderRadius: '100px',
                                        gap: '10px',
                                        background: '#F7F7F8',
                                        display: 'flex',
                                        alignItems: 'center',
                                        fontSize: ' 0.875rem',
                                        cursor: 'pointer'
                                      }}
                                      onClick={() => {
                                        handleLike(index);
                                        setChatId(String(message?.chatId));
                                      }}
                                    >
                                      <ThumbsUp
                                        iconColor={
                                          likesDislikes[index]?.like
                                            ? 'green'
                                            : '#6E7682'
                                        }
                                      />
                                      {/* <p>Like</p> */}
                                    </div>
                                    <div
                                      style={{
                                        width: 'auto',
                                        padding: '10px',
                                        borderRadius: '100px',
                                        gap: '10px',
                                        background: '#F7F7F8',
                                        display: 'flex',
                                        alignItems: 'center',
                                        fontSize: ' 0.875rem',
                                        cursor: 'pointer'
                                      }}
                                      onClick={() => {
                                        handleDislike(index);
                                        setChatId(String(message?.chatId));
                                      }}
                                    >
                                      <ThumbsDown
                                        iconColor={
                                          likesDislikes[index]?.dislike
                                            ? 'red'
                                            : '#6E7682'
                                        }
                                      />
                                      {/* <p>Dislike</p> */}
                                    </div>
                                    <div
                                      style={{
                                        width: 'auto',
                                        padding: '10px',
                                        borderRadius: '100px',
                                        gap: '5px',
                                        background: '#F7F7F8',
                                        display: 'flex',
                                        alignItems: 'center',
                                        fontSize: ' 0.875rem',
                                        cursor: 'pointer'
                                      }}
                                      onClick={() =>
                                        handlePinPrompt({
                                          studentId,
                                          chatHistoryId: String(message.chatId)
                                        })
                                      }
                                    >
                                      <PinLogo
                                        iconColor={
                                          message?.isPinned ? 'blue' : '#6E7682'
                                        }
                                      />
                                      {/* <p>Pin</p> */}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </>
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
          {isShowPills && (
            <div
              style={{
                position: 'fixed',
                width: '100%',
                bottom: isMobile ? '40px' : '40px',
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
          )}
        </Wrapper>

        {/* {isShowPrompt && (
          <TellMeMorePill isHomeWorkHelp={HomeWorkHelp}>
            <p>Tell me more</p>
            <TellMeMoreIcn />
          </TellMeMorePill>
        )} */}
        {!visibleButton && HomeWorkHelp && isShowPrompt && (
          <DownPillContainer>
            <PillsContainer>
              {homeHelp.map((need) => (
                <>
                  {!!need.show && (
                    <StyledDiv
                      onClick={need.onClick}
                      needIndex={need.id === 2}
                      style={{
                        color: need.id === 2 ? '#FB8441' : '',
                        background: need.id === 2 ? 'white' : ''
                      }}
                      key={need.id}
                    >
                      {need.img}
                      {need.title}
                    </StyledDiv>
                  )}
                </>
              ))}
            </PillsContainer>
          </DownPillContainer>
        )}
        {HomeWorkHelp && !visibleButton ? (
          <ChatbotContainer chatbotSpace={chatbotSpace}>
            <InputContainer>
              <Input
                ref={textAreaRef2}
                placeholder={
                  HomeWorkHelp
                    ? homeWorkHelpPlaceholder
                    : `Ask Shepherd about ${snip(title, 40)}`
                }
                value={inputValue}
                onKeyDown={handleKeyDown}
                disabled={!isReadyToChat}
                onChange={handleInputChange}
                style={{
                  maxHeight: HomeWorkHelp ? '70px' : '2rem',
                  overflowY: 'scroll'
                }}
              />
              <SendButton type="button" onClick={handleSendMessage}>
                <img alt="" src="/svgs/send.svg" className="w-8 h-8" />
              </SendButton>
            </InputContainer>
            {isMobile && (
              <>
                {HomeWorkHelp ? (
                  <ClockButton type="button" onClick={onChatHistory}>
                    <img
                      alt="clock"
                      src="/svgs/anti-clock.svg"
                      className="w-5 h-5"
                    />
                  </ClockButton>
                ) : (
                  <ClockButton type="button" onClick={onChatHistory}>
                    <img alt="pdf" src={PDFImg} className="w-5 h-5" />
                  </ClockButton>
                )}
              </>
            )}
          </ChatbotContainer>
        ) : null}
        {!HomeWorkHelp && (
          <ChatbotContainer chatbotSpace={chatbotSpace}>
            <InputContainer>
              <Input
                ref={textAreaRef}
                placeholder={
                  HomeWorkHelp
                    ? homeWorkHelpPlaceholder
                    : `Ask Shepherd about ${snip(title, 40)}`
                }
                value={inputValue}
                onKeyDown={handleKeyDown}
                disabled={!isReadyToChat}
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
            {isMobile && (
              <ClockButton type="button" onClick={onSwitchOnMobileView}>
                <img alt="pdf" src={PDFImg} className="w-5 h-5" />
              </ClockButton>
            )}
          </ChatbotContainer>
        )}
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
        <div style={{ margin: '3rem 0', overflowY: 'auto' }}>
          <SetupFlashcardPage showConfirm isAutomated />
        </div>
      </CustomSideModal>

      <CustomSideModal onClose={onPinnedMessages} isOpen={isPinnedMessages}>
        <PinnedMessages
          messages={messages}
          scrollToMessage={scrollToMessage}
          onPinnedMessages={onPinnedMessages}
        />
      </CustomSideModal>
    </>
  );
};

export default Chat;
