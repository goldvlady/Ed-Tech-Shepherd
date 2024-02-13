import useStudentConversations from './useStudentConversations';
import useUserStore from '../../../../../state/userStore';
import { useQuery } from '@tanstack/react-query';
import { getDescriptionById } from '../../../../../services/AI';

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
  const { data: description } = useQuery({
    queryKey: ['conversationDescription', { conversationId }],
    queryFn: () =>
      getDescriptionById({
        conversationId
      })
  });
  return {
    data: {
      ...data,
      description: description.data
    },
    isLoading
  };
}

export default useConversationDetails;
