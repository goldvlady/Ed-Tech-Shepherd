import { ShareIcon } from '../../../../../../components/icons';
import useUserStore from '../../../../../../state/userStore';
import { useEffect } from 'react';
import { useParams } from 'react-router';
import useChatManager from '../hooks/useChatManager';
import ChatMessage from './_components/chat-message';
import PromptInput from './_components/prompt-input';

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
    ...rest
  } = useChatManager();

  console.log('socket id', currentSocket?.id, messages);

  useEffect(() => {
    console.log(conversationId === id);
    startConversation(
      {
        studentId: user._id,
        namespace: 'homework-help',
        conversationId: id,
        subject: 'Maths',
        topic: 'Algebra'
      },
      'Shall we begin, Socrates?'
    );
  }, [id, startConversation]);

  return (
    <div className="w-full h-full overflow-hidden bg-transparent flex justify-center pt-8">
      <div className="interaction-area w-full max-w-[832px] mx-auto flex flex-col">
        <header className="flex justify-center relative items-center w-full">
          <span>Chat name</span>
          <button className="absolute right-0 top-0 flex items-center justify-center mr-8 p-2 rounded-lg bg-white shadow-md">
            <ShareIcon />
          </button>
        </header>
        <div className="chat-area flex-1 overflow-y-scroll py-10 px-3 w-full mx-auto max-w-[728px] mt-6 flex flex-col gap-3 no-scrollbar">
          {messages.map((message) => (
            <ChatMessage
              key={Math.random()}
              message={message.log.content}
              type={message.log.role === 'user' ? 'user' : 'bot'}
            />
          ))}
        </div>
        <footer className=" w-full flex justify-center mb-6">
          <PromptInput onSubmit={sendMessage} />
        </footer>
      </div>
    </div>
  );
}

export default ChatRoom;
