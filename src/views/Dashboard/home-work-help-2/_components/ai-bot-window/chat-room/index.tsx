import { ShareIcon } from '../../../../../../components/icons';
import useUserStore from '../../../../../../state/userStore';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router';
import useChatManager from '../hooks/useChatManager';
import ChatMessage from './_components/chat-message';
import PromptInput from './_components/prompt-input';
import ChatInfoDropdown from './_components/chat-info-dropdown';
import { useQueryClient } from '@tanstack/react-query';
import ShareModal from '../../../../../../components/ShareModal';
import { ChatScrollAnchor } from './chat-scroll-anchor';
import { useSearchQuery } from '../../../../../../hooks';

const CONVERSATION_INITIALIZER = 'Shall we begin, Socrates?';

function ChatRoom() {
  const { id } = useParams();
  const { user } = useUserStore();
  const search = useSearchQuery();
  const apiKey = search.get('apiKey');
  const studentId = user?._id;
  const query = useQueryClient();

  const {
    startConversation,
    conversationId,
    messages,
    currentChat,
    sendMessage,
    onEvent,
    currentSocket,
    getChatWindowParams,
    ...rest
  } = useChatManager('homework-help', {
    autoHydrateChat: true,
    autoPersistChat: true
  });

  const [autoScroll, setAutoScroll] = useState(true);

  useEffect(() => {
    const chatWindowParams = getChatWindowParams();
    if (chatWindowParams) {
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
    } else if (apiKey) {
      startConversation(
        {
          conversationId: id
        },
        {
          conversationInitializer: CONVERSATION_INITIALIZER,
          isNewConversation: false
        }
      );
    }

    query.invalidateQueries({
      queryKey: ['chatHistory', { studentId }]
    });
  }, [id, apiKey]);

  const currentChatRender = useMemo(() => {
    // This useCallback will return the ChatMessage component or null based on currentChat's value
    // It ensures that the component is only re-rendered when currentChat changes
    if (!currentChat) {
      return ''; // Don't render anything if there's no current chat content
    }

    return (
      <ChatMessage key={Math.random()} message={currentChat} type={'bot'} />
    );
  }, [currentChat]);

  const handleAutoScroll = () => {
    setAutoScroll(true);
  };

  useEffect(() => {
    setAutoScroll(Boolean(currentChat));
  }, [currentChat]);

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
          <ChatInfoDropdown id={id} />
          <button className="absolute right-0 top-0 flex items-center justify-center mr-4 sm:mr-8 p-2 rounded-lg bg-white shadow-md">
            <ShareModal type="aichat" customTriggerComponent={<ShareIcon />} />
          </button>
        </header>
        <div className="chat-area flex-1 overflow-y-scroll pt-[6rem] pb-[12rem] px-3 w-full mx-auto max-w-[728px] flex flex-col gap-3 no-scrollbar relative scroll-smooth">
          {messages
            ?.filter(
              (message) => message.log.content !== CONVERSATION_INITIALIZER
            )
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
                  messages.length >= 4
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
          <PromptInput
            onSubmit={(message: string) => {
              sendMessage(message);
              handleAutoScroll();
            }}
            conversationId={id}
          />
        </footer>
      </div>
    </div>
  );
}

export default ChatRoom;
