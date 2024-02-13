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
  const { data, isLoading, isSuccess } = useStudentConversations({
    studentId,
    select: (data) => {
      return data.find((item) => item.id === conversationId);
    }
  });
  const {
    data: description,
    isLoading: isLoadingDescription,
    isSuccess: isSuccessDescription
  } = useQuery({
    queryKey: ['conversationDescription', { conversationId }],
    queryFn: () =>
      getDescriptionById({
        conversationId
      })
  });

  const allQueriesSuccessful = isSuccess && isSuccessDescription;
  const allQueriesLoading = isLoading || isLoadingDescription;

  return {
    data: allQueriesSuccessful
      ? { ...data, description: description?.data }
      : undefined,
    isLoading: isLoading || isLoadingDescription
  };
}

export default useConversationDetails;
