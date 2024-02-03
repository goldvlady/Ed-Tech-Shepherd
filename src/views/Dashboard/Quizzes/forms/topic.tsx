import { useCustomToast } from '../../../../components/CustomComponents/CustomToast/useCustomToast';
import SelectComponent, { Option } from '../../../../components/Select';
import { WardIcon } from '../../../../components/icons';
import ApiService from '../../../../services/ApiService';
import userStore from '../../../../state/userStore';
import {
  MIXED,
  MULTIPLE_CHOICE_SINGLE,
  OPEN_ENDED,
  TRUE_FALSE
} from '../../../../types';
import { QuestionIcon } from '@chakra-ui/icons';
import {
  Box,
  FormControl,
  Input,
  HStack,
  Button,
  FormLabel,
  Tooltip
} from '@chakra-ui/react';
import { isEmpty, toNumber } from 'lodash';
import { ChangeEvent, useCallback, useState } from 'react';

const TopicQuizForm = ({
  handleSetTitle,
  title,
  handleFormatQuizQuestionCallback,
  handleSetUploadingState,
  uploadingState
}) => {
  const toast = useCustomToast();
  const { user } = userStore();
  const dummyData = {
    subject: '',
    topic: '',
    difficulty: 'kindergarten',
    count: 1,
    type: MIXED
  };

  // const { handleIsLoadingQuizzes, fetchQuizzes } = quizStore();

  const [isLoading, setIsLoading] = useState(false);
  const [localData, setLocalData] = useState<any>(dummyData);

  const levelOptions = [
    { label: 'Very Easy', value: 'kindergarten' },
    { label: 'Medium', value: 'high school' },
    { label: 'Hard', value: 'college' },
    { label: 'Very Hard', value: 'PhD' }
  ];

  const typeOptions = [
    { label: 'Multiple Single Choice', value: MULTIPLE_CHOICE_SINGLE },
    { label: 'True/False', value: TRUE_FALSE },
    { label: 'Open Ended', value: OPEN_ENDED },
    { label: 'Mixed', value: MIXED }
  ];

  const handleGenerateQuestions = async () => {
    try {
      handleSetUploadingState(true);
      setIsLoading(true);
      const result = await ApiService.generateQuizQuestion(user._id, {
        ...localData,
        count: toNumber(localData.count),
        firebaseId: user.firebaseId
      });
      const { quizzes } = await result.json();

      await handleFormatQuizQuestionCallback(quizzes, localData.count, () => {
        setIsLoading(false);
        handleSetUploadingState(false);
      });
    } catch (error) {
      toast({
        position: 'top-right',
        title: `failed to generate quizzes job `,
        status: 'error'
      });
    } finally {
      handleSetUploadingState(false);
    }
  };

  const handleChange = useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >
    ) => {
      const { name, value } = e.target;
      setLocalData((prevState) => ({ ...prevState, [name]: value }));
    },
    []
  );

  return (
    <Box width={'100%'} mt="20px">
      <FormControl mb={4}>
        <FormLabel textColor={'text.600'}>Enter a title</FormLabel>
        <Input
          value={title}
          type="text"
          _placeholder={{
            color: 'text.200',
            fontSize: '14px'
          }}
          height={'48px'}
          onChange={(e) => handleSetTitle(e.target.value)}
          autoComplete="off"
          defaultValue={title}
        />
      </FormControl>
      <FormControl mb={8}>
        <FormLabel textColor={'text.600'}>Subject: </FormLabel>
        <Input
          type="text"
          name="subject"
          placeholder="e.g. Chemistry"
          value={localData.subject}
          onChange={handleChange}
          _placeholder={{ fontSize: '14px', color: '#9A9DA2' }}
        />
      </FormControl>
      <FormControl mb={7}>
        <FormLabel textColor={'text.600'}>Enter a topic</FormLabel>
        <Input
          type="text"
          _placeholder={{
            color: 'text.200',
            fontSize: '14px'
          }}
          name="topic"
          value={localData?.topic}
          onChange={handleChange}
        />
      </FormControl>

      <FormControl mb={7}>
        <FormLabel textColor={'text.600'}>Question type:</FormLabel>

        <SelectComponent
          name="type"
          defaultValue={typeOptions.find(
            (option) => option.value === localData.type
          )}
          placeholder="Select Type"
          options={typeOptions}
          size={'md'}
          onChange={(option) => {
            const event = {
              target: {
                name: 'type',
                value: (option as Option).value
              }
            } as ChangeEvent<HTMLSelectElement>;
            handleChange(event);
          }}
        />
      </FormControl>

      <FormControl mb={8}>
        <FormLabel textColor={'text.600'}>Level (optional): </FormLabel>
        <SelectComponent
          name="difficulty"
          placeholder="Select Level"
          defaultValue={levelOptions.find(
            (option) => option.value === localData.difficulty
          )}
          options={levelOptions}
          size={'md'}
          onChange={(option) => {
            const event = {
              target: {
                name: 'difficulty',
                value: (option as Option).value
              }
            } as ChangeEvent<HTMLSelectElement>;
            handleChange(event);
          }}
        />
      </FormControl>

      <FormControl mb={7}>
        <FormLabel textColor={'text.600'}>
          Number of questions
          <Tooltip
            hasArrow
            label="Number of questions to create"
            placement="right-end"
          >
            <QuestionIcon mx={2} w={3} h={3} />
          </Tooltip>
        </FormLabel>
        <Input
          textColor={'text.700'}
          height={'48px'}
          name="count"
          onChange={handleChange}
          type="text"
          color={'text.200'}
          value={localData.count}
        />
      </FormControl>

      <HStack
        w="100%"
        alignItems={'center'}
        justifyContent={'end'}
        marginTop="40px"
        align={'flex-end'}
        marginBottom={4}
      >
        <Button
          width={'180px'}
          borderRadius="8px"
          p="10px 20px"
          fontSize="14px"
          lineHeight="20px"
          variant="solid"
          colorScheme="primary"
          onClick={handleGenerateQuestions}
          isDisabled={
            uploadingState ||
            localData.count < 1 ||
            isEmpty(localData.topic) ||
            isEmpty(localData.subject)
          }
          isLoading={isLoading}
          ml={5}
        >
          <WardIcon className={'h-[20px] w-[20px] mx-2'} onClick={() => ''} />
          Generate
        </Button>
      </HStack>
    </Box>
  );
};

export default TopicQuizForm;
