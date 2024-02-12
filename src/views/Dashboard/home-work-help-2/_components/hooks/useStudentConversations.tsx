import { useQuery } from '@tanstack/react-query';
import { fetchStudentConversations } from '../../../../../services/AI';

function useStudentConversations({ studentId, ...options }) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['chatHistory', { studentId }],
    queryFn: () => fetchStudentConversations(studentId),
    ...options
  });

  return { data: data ?? [], isLoading, isError };
}

export default useStudentConversations;
