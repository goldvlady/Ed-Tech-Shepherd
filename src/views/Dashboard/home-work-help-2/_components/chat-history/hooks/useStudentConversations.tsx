import { useQuery } from '@tanstack/react-query';
import { fetchStudentConversations } from '../../../../../../services/AI';
import useUserStore from '../../../../../../state/userStore';

function useStudentConversations({ studentId }) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['chatHistory', { studentId }],
    queryFn: () => fetchStudentConversations(studentId)
  });

  return { data: data ?? [], isLoading, isError };
}

export default useStudentConversations;
