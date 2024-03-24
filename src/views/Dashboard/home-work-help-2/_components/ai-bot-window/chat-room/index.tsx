import { ShareIcon } from '../../../../../../components/icons';
import useUserStore from '../../../../../../state/userStore';
import { useEffect, useMemo, useState } from 'react';
import { useLocation, useParams } from 'react-router';
import useChatManager from '../hooks/useChatManager';
import ChatMessage from './_components/chat-message';
import PromptInput from './_components/prompt-input';
import ChatInfoDropdown from './_components/chat-info-dropdown';
import { useQueryClient } from '@tanstack/react-query';
import ShareModal from '../../../../../../components/ShareModal';
import { ChatScrollAnchor } from './chat-scroll-anchor';
import { useSearchQuery } from '../../../../../../hooks';
import PlansModal from '../../../../../../components/PlansModal';
import { fetchEventSource } from '@microsoft/fetch-event-source';
import { encodeQueryParams } from '../../../../../../helpers';
const CONVERSATION_INITIALIZER = 'Shall we begin, Socrates?';

function ChatRoom() {
  const { id } = useParams();
  const location = useLocation();
  const { user } = useUserStore();
  const search = useSearchQuery();
  const apiKey = search.get('apiKey');
  const hasInitialMessagesParam = search.get('initial_messages');

  const studentId = user?._id;
  const query = useQueryClient();

  const [openPricingModel, setOpenPricingModel] = useState(false); // It will open when conversation is in share mode and user try to chat

  const {
    startConversation,
    conversationId,
    messages,
    currentChat,
    sendMessage,
    setCurrentChat,
    fetchHistory,
    onEvent,
    currentSocket,
    getChatWindowParams,
    ...rest
  } = useChatManager('homework-help', {
    autoHydrateChat: true,
    autoPersistChat: true
  });

  const [autoScroll, setAutoScroll] = useState(true);
  const [streamEnded, setStreamEnded] = useState(true);
  const [streamStarted, setStreamStarted] = useState(false);
  const [subject, setSubject] = useState<'Math' | 'any'>('any');
  useEffect(() => {
    const chatWindowParams = getChatWindowParams();
    const { connectionQuery } = chatWindowParams;
    if (hasInitialMessagesParam && connectionQuery.subject === 'Math') {
      // on streamEnded use useQuery's refetch function to fetch title
      const b = {
        ...connectionQuery,
        studentId,
        firebaseid: user.firebaseId,
        name: user.name.first,
        query: '',
        messages: JSON.stringify([])
      };
      const q = encodeQueryParams(b);

      setSubject(connectionQuery.subject === 'Math' ? 'Math' : 'any');
      const newSearchParams = new URLSearchParams(location.search);
      newSearchParams.delete('initial_messages');
      window.history.replaceState(
        {},
        '',
        `${location.pathname}?${newSearchParams.toString()}`
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location, hasInitialMessagesParam, id]);
  useEffect(() => {
    const chatWindowParams = getChatWindowParams();
    const { connectionQuery } = chatWindowParams;
    console.log(connectionQuery);
    if (chatWindowParams && connectionQuery.topic !== 'Math') {
      const { isNewWindow, connectionQuery } = chatWindowParams;

      startConversation(
        {
          studentId: user._id,
          conversationId: id,
          firebaseId: user?.firebaseId,
          ...connectionQuery
        },
        {
          conversationInitializer: CONVERSATION_INITIALIZER,
          isNewConversation: isNewWindow
        }
      );
      setSubject(connectionQuery.subject === 'Math' ? 'Math' : 'any');
    } else if (apiKey && connectionQuery.subject !== 'Math') {
      startConversation(
        {
          conversationId: id
        },
        {
          conversationInitializer: CONVERSATION_INITIALIZER,
          isNewConversation: false
        }
      );
    } else {
      fetchHistory(30, 0, id);
      setSubject(connectionQuery.subject === 'Math' ? 'Math' : 'any');
    }

    query.invalidateQueries({
      queryKey: ['chatHistory', { studentId }]
    });
  }, [id]);

  const currentChatRender = useMemo(() => {
    // This useCallback will return the ChatMessage component or null based on currentChat's value
    // It ensures that the component is only re-rendered when currentChat changes
    if (!currentChat) {
      return ''; // Don't render anything if there's no current chat content
    }

    return (
      <ChatMessage
        streaming={!streamEnded}
        key={Math.random()}
        message={currentChat}
        type={'bot'}
      />
    );
  }, [currentChat, streamEnded]);

  const handleAutoScroll = () => {
    setAutoScroll(true);
  };

  useEffect(() => {
    setAutoScroll(Boolean(currentChat));
  }, [currentChat]);
  console.log(streamEnded, 'has the stream ended');
  return (
    <div className="h-full overflow-hidden bg-transparent flex justify-center min-w-[375px] mx-auto w-full px-2">
      <div className="interaction-area w-full max-w-[832px] mx-auto flex flex-col relative">
        <div
          className="glass-top absolute top-0 pointer-events-none w-full h-[70px] inset-0 backdrop-blur-xl z-10"
          style={{
            maskImage: 'linear-gradient(black 60%, transparent)'
          }}
        ></div>
        <header className="flex justify-center absolute top-[4%] items-center w-full z-10">
          <ChatInfoDropdown id={id} disabled={apiKey ? true : false} />
          <button className="absolute right-0 top-0 flex items-center justify-center mr-4 sm:mr-8 p-2 rounded-lg bg-white shadow-md">
            <ShareModal type="aichat" customTriggerComponent={<ShareIcon />} />
          </button>
        </header>
        <div className="chat-area flex-1 overflow-y-scroll pt-[6rem] pb-[12rem] px-3 w-full mx-auto max-w-[728px] flex flex-col gap-3 no-scrollbar relative scroll-smooth">
          {messages
            ?.filter(
              (message) => message.log.content !== CONVERSATION_INITIALIZER
            )
            .filter((message) => message.log.role !== 'function')
            .sort((a, b) => a.id - b.id)
            .map((message) => (
              <ChatMessage
                key={message.id}
                message={message.log.content}
                type={message.log.role === 'user' ? 'user' : 'bot'}
                userImage={user ? user.avatar : null}
                userName={
                  user ? user.name.first + ' ' + user.name.last : 'John Doe'
                }
                suggestionPromptsVisible={
                  message.id === messages[messages.length - 1].id &&
                  messages.length >= 4 &&
                  (apiKey ? false : true)
                }
                sendSuggestedPrompt={(message: string) => {
                  sendMessage(message);
                  handleAutoScroll();
                }}
              />
            ))}
          {currentChatRender}
          <ChatScrollAnchor trackVisibility={autoScroll} />
        </div>
        <footer className=" w-full flex justify-center pb-6 absolute bottom-0">
          <div
            className="glass-top absolute bottom-0 pointer-events-none w-full h-[80px]  backdrop-blur-xl z-0"
            style={{
              maskImage: 'linear-gradient(transparent, black 60%)'
            }}
          ></div>
          <PlansModal
            togglePlansModal={openPricingModel}
            setTogglePlansModal={() => setOpenPricingModel(false)}
          />
          <PromptInput
            disabled={apiKey ? true : false}
            streaming={!streamEnded}
            onSubmit={async (message: string) => {
              if (subject === 'Math') {
                console.log('make it?????');
                const chatWindowParams = getChatWindowParams();
                const { connectionQuery } = chatWindowParams;
                const body = {
                  ...connectionQuery,
                  studentId,
                  firebaseid: user.firebaseId,
                  name: user.name.first,
                  query: message,
                  messages: JSON.stringify(messages.map((el) => el.log))
                };
                setStreamEnded(false);
                const q = encodeQueryParams(body);
                sendMessage(message, 'math');
                handleAutoScroll();
                await fetchEventSource(
                  `${process.env.REACT_APP_AI_II}/solve/${q}`,
                  {
                    method: 'GET',
                    headers: {
                      'X-Shepherd-Header': process.env.REACT_APP_AI_HEADER_KEY
                    },
                    openWhenHidden: true,
                    credentials: 'include',
                    async onmessage(event) {
                      console.log(event, 'the event log ->');
                      if (event.data.includes('done with stream')) {
                        await fetchHistory(30, 0, id);
                        setStreamEnded(true);
                        return;
                      }
                      // Append the streamed text data to the current state
                      setCurrentChat((prevData) => prevData + event.data);
                      handleAutoScroll();
                    },
                    onclose() {
                      setStreamEnded(true);
                    },
                    onerror(err) {
                      //
                      setStreamEnded(true);
                      console.log('ERROR ->', err);
                    }
                  }
                );
                // const fetchData = () => {
                //   console.log('FETCH');
                //   // const response = await fetch(
                //   //   `${process.env.REACT_APP_AI_II}/solve/${q}`,
                //   //   {
                //   //     method: 'GET',
                //   //     headers: {
                //   //       'X-Shepherd-Header': process.env.REACT_APP_AI_HEADER_KEY
                //   //     }
                //   //   }
                //   // );

                //   // if (!response.ok) {
                //   //   throw new Error('Network response was not ok');
                //   // }

                //   // Create a new EventSource instance to handle server sent events
                //   const eventSource = new EventSource(
                //     `${process.env.REACT_APP_AI_II}/solve/${q}`
                //   );

                //   // Event listener to handle incoming events
                //   eventSource.onmessage = async (event) => {
                //     console.log(event, 'THE E');
                //     if (event.data.includes('done with stream')) {
                //       await fetchHistory(30, 0, id);
                //       eventSource.close();
                //       setStreamEnded(true);
                //       return;
                //     }

                //     setCurrentChat((prevData) => prevData + event.data);
                //     handleAutoScroll();
                //   };

                //   // Event listener for errors
                //   eventSource.onerror = (error) => {
                //     setStreamEnded(true);
                //     console.error('EventSource failed:', error);
                //     // Close the EventSource connection
                //     eventSource.close();
                //   };
                // };
                // fetchData();
              } else {
                console.log('no?');
                sendMessage(message);
                handleAutoScroll();
              }
            }}
            conversationId={id}
            onClick={() => {
              if (apiKey && !studentId) setOpenPricingModel(true);
            }}
          />
        </footer>
      </div>
    </div>
  );
}

export default ChatRoom;
