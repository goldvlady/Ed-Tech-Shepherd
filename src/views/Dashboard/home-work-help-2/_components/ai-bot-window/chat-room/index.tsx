import { ShareIcon } from '../../../../../../components/icons';
import useUserStore from '../../../../../../state/userStore';
import { useCallback, useEffect, useMemo } from 'react';
import { useQueryParams } from '../../../../../../hooks';
import { useParams } from 'react-router';
import useChatManager from '../hooks/useChatManager';
import ChatMessage from './_components/chat-message';
import PromptInput from './_components/prompt-input';

const CONVERSATION_INITIALIZER = 'Shall we begin, Socrates?';

function ChatRoom() {
  const { id } = useParams();
  const { user } = useUserStore();

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
    }
  }, [id]);

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

  return (
    <div className="h-full overflow-hidden bg-transparent flex justify-center pt-8 min-w-[375px] mx-auto w-full px-2">
      <div className="interaction-area w-full max-w-[832px] mx-auto flex flex-col">
        <header className="flex justify-center relative items-center w-full">
          <span>Chat name</span>
          <button className="absolute right-0 top-0 flex items-center justify-center mr-8 p-2 rounded-lg bg-white shadow-md">
            <ShareIcon />
          </button>
        </header>
        <div className="chat-area flex-1 overflow-y-scroll py-10 px-3 w-full mx-auto max-w-[728px] mt-6 flex flex-col gap-3 no-scrollbar">
          {messages
            .filter(
              (message) => message.log.content !== CONVERSATION_INITIALIZER
            )
            .map((message) => (
              <ChatMessage
                key={message.id}
                message={message.log.content}
                type={message.log.role === 'user' ? 'user' : 'bot'}
              />
            ))}
          {currentChatRender}
        </div>
        <footer className=" w-full flex justify-center mb-6">
          <PromptInput onSubmit={sendMessage} />
        </footer>
      </div>
    </div>
  );
}

export default ChatRoom;
