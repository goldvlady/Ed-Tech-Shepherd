import ChatList from './list';
import useUserStore from '../../../../../state/userStore';
import useStudentConversations from './hooks/useStudentConversations';
import SearchBar from './search-bar';

function ChatHistory() {
  const user = useUserStore((state) => state.user);
  const userId = user?._id;
  const { data: conversations } = useStudentConversations({
    studentId: userId
  });
  return (
    <div className="w-full h-full p-4 no-scrollbar flex flex-col gap-2">
      <div className="title">
        <h4 className="font-medium text-sm">Chat History</h4>
      </div>
      <div className="search-bar w-full">
        <SearchBar />
      </div>
      <div className="w-full flex-1 overflow-y-scroll">
        <ChatList conversations={conversations} />
      </div>
      <div className="clear-conversations-button-section w-full flex justify-end mt-10">
        <button className="text-red-600 leading-4 text-xs font-normal">
          Clear History
        </button>
      </div>
    </div>
  );
}

export default ChatHistory;
