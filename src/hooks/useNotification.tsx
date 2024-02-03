import { useToast } from '@chakra-ui/react';

export const useNotification = () => {
  const toast = useToast();

  const notify = ({
    type,
    title,
    description
  }: {
    type: 'success' | 'error' | 'info' | 'warning';
    title: string;
    description?: string;
  }) => {
    switch (type) {
      case 'success':
        toast({
          title,
          description,
          status: 'success',
          isClosable: true
        });
        break;
      case 'error':
        toast({
          title,
          description,
          status: 'error',
          isClosable: true
        });
        break;
      case 'info':
        toast({
          title,
          description,
          status: 'info',
          isClosable: true
        });
        break;
      case 'warning':
        toast({
          title,
          description,
          status: 'warning',
          isClosable: true
        });
        break;
      default:
        break;
    }
  };

  return notify;
};
