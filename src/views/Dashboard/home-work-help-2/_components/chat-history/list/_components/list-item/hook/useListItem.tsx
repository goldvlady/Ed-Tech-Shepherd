import { useMutation, useQueryClient } from '@tanstack/react-query';
import { editConversationId } from '../../../../../../../../../services/AI';
import useUserStore from '../../../../../../../../../state/userStore';

function useListItem({
  onRenameSuccess
}: {
  onRenameSuccess: (newTitle: any) => void;
}) {
  const user = useUserStore((state) => state.user);
  const studentId = user?._id;
  const queryClient = useQueryClient();
  const { mutate, isPending: renaming } = useMutation({
    mutationFn: editConversationId,
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ['chatHistory', { studentId }]
      });
    },
    onSuccess(data, variables, context) {
      onRenameSuccess(variables);
    }
  });

  const renameConversation = (
    id: string,
    newTitle: string,
    callback?: (values: any) => void
  ) => {
    console.log('delete', id);
    mutate(
      {
        editConversation: id,
        newTitle
      },
      {
        onSuccess: (data, variables, context) => {
          callback(variables);
        }
      }
    );
  };
  //   editConversationId();
  return { renameConversation, renaming };
}

export default useListItem;
