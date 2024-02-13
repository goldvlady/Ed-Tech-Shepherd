import useStudentConversations from './useStudentConversations';
import useUserStore from '../../../../../state/userStore';

function useConversationDetails({
  conversationId
}: {
  conversationId: string;
}) {
  const studentId = useUserStore((state) => state.user._id);
  const { data, isLoading } = useStudentConversations({
    studentId,
    select: (data) => {
      return data.find((item) => item.id === conversationId);
    }
  });
  return {
    data,
    isLoading
  };
}

export default useConversationDetails;
