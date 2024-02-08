import useUserStore from '../../../../../../../../../state/userStore';
import useStudentConversations from '../../../../../chat-history/hooks/useStudentConversations';

function useRecentConversations() {
  const user = useUserStore((state) => state.user);
  const studentId = user?._id;
  const { data, isLoading } = useStudentConversations({ studentId });
  const lastFourConversations = [];
  if (data && data.length > 0) {
    data
      .sort((a, b) => {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      })
      .slice(0, 4)
      .forEach((conversation) => {
        lastFourConversations.push(conversation);
      });
  }
  return { data: lastFourConversations, isLoading };
}

export default useRecentConversations;
