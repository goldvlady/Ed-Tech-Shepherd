import { LightningBoltIcon } from '../icons';
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  ModalCloseButton,
  Box,
  Button,
  VStack,
  HStack,
  Text
} from '@chakra-ui/react';

export const QuizModal = ({
  isOpen,
  closeOnOverlayClick = false,
  size = '400px',
  title = '',
  handleContinueQuiz = () => null,
  onClose = () => null,
  count = 0
}: {
  handleContinueQuiz?: () => void;
  title?: string;
  count?: number;
  isOpen: boolean;
  onClose?: () => void;
  closeOnOverlayClick?: boolean;
  size?: string;
  questionType?: string;
  options?: string[];
  question?: string;
  index?: number | string;
  handleRestartQuiz?: () => void;
  handleReviewQuiz?: () => void;
  scores?: {
    questionIdx: string | number;
    score: string | 'true' | 'false' | boolean | null;
    selectedOptions: string[];
  }[];
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      closeOnOverlayClick={closeOnOverlayClick}
      size={size}
    >
      <ModalOverlay />
      <ModalContent w={'540px'} h={'380px'}>
        {/* <ModalCloseButton /> */}

        <ModalBody
          p={'0px'}
          pb={'0px'}
          // bg={false && '#E1EEFE'}
        >
          <Box
            h={'100%'}
            w={'100%'}
            display={'flex'}
            alignItems={'center'}
            justifyContent={'center'}
            flexDirection={'column'}
          >
            <VStack
              w={'100%'}
              h={'70%'}
              justifyContent={'center'}
              alignItems={'center'}
            >
              <Box>
                <Text
                  fontSize={'18px'}
                  lineHeight={'21px'}
                  fontFamily={'Inter'}
                  color={'text.800'}
                  textAlign={'center'}
                  fontWeight={'600'}
                >
                  You have{' '}
                  <Text as={'span'} fontWeight={'bold'}>
                    {count || 0}
                  </Text>{' '}
                  quiz question{count > 0 ? 's' : ''}, unanswered <br />
                  do still want to submit the{' '}
                  <Text as={'span'} fontWeight={'bold'}>
                    {title}
                  </Text>{' '}
                  quiz?
                </Text>
              </Box>
            </VStack>
            <HStack
              w={'100%'}
              justifyContent={'flex-end'}
              pt={8}
              pb={'40px'}
              px={'16px'}
              bg={'#F7F7F8'}
            >
              <Button
                w={'30%'}
                h={'40px'}
                borderRadius="8px"
                fontSize="14px"
                lineHeight="20px"
                variant="solid"
                onClick={onClose}
                display={'flex'}
                flexDirection={'row'}
                justifyContent={'center'}
                bg={'#fff'}
                textColor={'#5C5F64'}
                _hover={{ bg: 'gray.600', textColor: 'whiteAlpha.900' }}
              >
                Leave Quiz
              </Button>

              <Button
                w={'30%'}
                h={'40px'}
                borderRadius="8px"
                fontSize="14px"
                lineHeight="20px"
                variant="solid"
                onClick={handleContinueQuiz}
                display={'flex'}
                flexDirection={'row'}
                justifyContent={'center'}
              >
                Continue Quiz
              </Button>
            </HStack>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default QuizModal;
