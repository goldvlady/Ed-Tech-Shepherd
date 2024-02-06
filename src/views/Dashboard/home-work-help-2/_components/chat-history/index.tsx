import ChatList from './list';
import useUserStore from '../../../../../state/userStore';
import useStudentConversations from './hooks/useStudentConversations';

function ChatHistory() {
  const user = useUserStore((state) => state.user);
  const userId = user?._id;
  const { data: conversations } = useStudentConversations({
    studentId: userId
  });
  return (
    <div className="w-full p-4">
      <ChatList conversations={conversations} />
    </div>
  );
}

export default ChatHistory;
