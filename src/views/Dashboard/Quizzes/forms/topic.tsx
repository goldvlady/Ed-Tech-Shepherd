import { useCustomToast } from '../../../../components/CustomComponents/CustomToast/useCustomToast';
import SelectComponent, { Option } from '../../../../components/Select';
import { WardIcon } from '../../../../components/icons';
import ApiService from '../../../../services/ApiService';
import quizStore from '../../../../state/quizStore';
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
  Text,
  FormControl,
  FormLabel,
  FormHelperText,
  Input,
  HStack,
  Button,
  Tooltip
} from '@chakra-ui/react';
import {
  includes,
  isArray,
  isEmpty,
  isNil,
  map,
  toLower,
  toNumber,
  omit
} from 'lodash';
import { ChangeEvent, useCallback, useState } from 'react';

// DownloadIcon
const TopicQuizForm = ({ addQuestion, handleSetTitle }) => {
  const toast = useCustomToast();
  const { user } = userStore();
  const dummyData = {
    subject: '',
    topic: '',
    difficulty: 'kindergarten',
    count: 1,
    type: MIXED
  };

  const { handleIsLoadingQuizzes } = quizStore();

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
      setIsLoading(true);
      handleIsLoadingQuizzes(true);

      const result = await ApiService.generateQuizQuestion(user._id, {
        ...localData,
        count: toNumber(localData.count)
      });
      const { quizzes } = await result.json();

      addQuestion(
        map([...quizzes], (quiz) => {
          let type = quiz?.type;
          let options = [];
          if (!isNil(quiz?.options) && isArray(quiz?.options)) {
            options = quiz?.options;
          }

          if (isNil(type) || isEmpty(type)) {
            if (!isNil(options) || !isEmpty(options)) {
              if (options.length < 3) {
                type = TRUE_FALSE;
              } else {
                type = MULTIPLE_CHOICE_SINGLE;
              }
            } else {
              if (!isEmpty(quiz?.answer) || !isNil(quiz?.answer)) {
                type = OPEN_ENDED;
              }
            }
          } else {
            if (
              includes(toLower(type), 'multiple') ||
              includes(toLower(type), 'choice')
            ) {
              type = MULTIPLE_CHOICE_SINGLE;
            }
            if (includes(toLower(type), 'true')) {
              type = TRUE_FALSE;
            }
            if (
              includes(toLower(type), 'open') ||
              includes(toLower(type), 'ended')
            ) {
              type = OPEN_ENDED;
            }
          }

          return {
            ...omit(quiz, ['explanation']),
            options,
            type
          };
        }),
        'multiple'
      );

      handleSetTitle(localData?.topic);

      setLocalData(dummyData);
      toast({
        position: 'top-right',
        title: `quizzes generated`,
        status: 'success'
      });
    } catch (error) {
      console.log('error =======>> ', error);
      toast({
        position: 'top-right',
        title: `failed to generate quizzes `,
        status: 'error'
      });
    } finally {
      setIsLoading(false);
      handleIsLoadingQuizzes(false);
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
        <FormHelperText textColor={'text.600'} fontSize={'14px'}>
          Enter a topic to generate questions from. We'll search the web for
          reliable sources first. For very specific topics, we recommend adding
          your own content in
          <Text display={'inline'} color={'#207DF7'} mx={2}>
            text input mode
          </Text>{' '}
          .
        </FormHelperText>
      </FormControl>

      <FormControl mb={7}>
        <FormLabel textColor={'text.600'}>Question type:</FormLabel>
        {/* <Select
          height={'48px'}
          sx={{
            padding: '8px'
          }}
          name="type"
          value={currentQuestion.type}
          onChange={handleChangeQuestionType}
          textColor={'text.700'}
        >
          <option value="multipleChoiceSingle">Multiple Choice</option>
          <option value="openEnded">Open Ended</option>
          <option value="trueFalse">True/False</option>
        </Select> */}

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
          type="number"
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
