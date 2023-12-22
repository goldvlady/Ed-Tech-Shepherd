import { useCustomToast } from '../../../../components/CustomComponents/CustomToast/useCustomToast';
import SelectComponent, { Option } from '../../../../components/Select';
import { WardIcon } from '../../../../components/icons';
import ApiService from '../../../../services/ApiService';
import quizStore from '../../../../state/quizStore';
import userStore from '../../../../state/userStore';
import {
  MIXED,
  MULTIPLE_CHOICE_MULTI,
  MULTIPLE_CHOICE_SINGLE,
  OPEN_ENDED,
  QuizQuestion,
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
  omit,
  toString
} from 'lodash';
import { ChangeEvent, useCallback, useState } from 'react';

// DownloadIcon
const TopicQuizForm = ({
  handleSetTitle,
  title,
  handleSetUploadingState,
  handleCreateQuiz,
  handleUpdateQuiz,
  quizId = null,
  isLoadingButton
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
      // handleIsLoadingQuizzes(true);
      handleSetUploadingState(true);

      const result = await ApiService.generateQuizQuestion(user._id, {
        ...localData,
        count: toNumber(localData.count)
      });
      const { quizzes } = await result.json();

      // console.log('quizzes ===========>>> ', quizzes);

      // const questions = map([...quizzes], (quiz) => {
      //   let type = quiz?.type;
      //   let options = [];
      //   if (!isNil(quiz?.options) && isArray(quiz?.options)) {
      //     options = quiz?.options;
      //   }

      //   if (isNil(type) || isEmpty(type)) {
      //     if (!isNil(options) || !isEmpty(options)) {
      //       if (options.length < 3) {
      //         type = TRUE_FALSE;
      //       } else {
      //         type = MULTIPLE_CHOICE_SINGLE;
      //       }
      //     } else {
      //       if (!isEmpty(quiz?.answer) || !isNil(quiz?.answer)) {
      //         type = OPEN_ENDED;
      //       }
      //     }
      //   } else {
      //     if (
      //       includes(toLower(type), 'multiple answers') ||
      //       includes(toLower(type), 'multipleanswers') ||
      //       includes(toLower(type), 'multipleanswer') ||
      //       toLower(type) === 'multiplechoice'
      //     ) {
      //       type = MULTIPLE_CHOICE_MULTI;
      //     }
      //     if (
      //       includes(toLower(type), 'single answer') ||
      //       includes(toLower(type), 'singleanswer')
      //     ) {
      //       type = MULTIPLE_CHOICE_SINGLE;
      //     }
      //     if (
      //       includes(toLower(type), 'true') ||
      //       includes(toLower(type), 'false')
      //     ) {
      //       type = TRUE_FALSE;
      //     }
      //     if (
      //       includes(toLower(type), 'open') ||
      //       includes(toLower(type), 'ended')
      //     ) {
      //       type = OPEN_ENDED;
      //     }
      //   }

      //   return {
      //     ...omit(quiz, ['explanation']),
      //     options,
      //     type
      //   };
      // });

      const questions = map([...quizzes], (quiz) => {
        let type = quiz?.type;
        let options = [];
        if (
          !isNil(quiz?.options) ||
          (isArray(quiz?.options) && isEmpty(quiz?.options))
        ) {
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
            includes(toLower(type), 'multiple answers') ||
            includes(toLower(type), 'multipleanswers') ||
            includes(toLower(type), 'multipleanswer') ||
            toLower(type) === 'multiplechoice'
          ) {
            type = MULTIPLE_CHOICE_MULTI;
          }
          if (
            includes(toLower(type), 'single answer') ||
            includes(toLower(type), 'singleanswer')
          ) {
            type = MULTIPLE_CHOICE_SINGLE;
          }
          if (
            includes(toLower(type), 'true') ||
            includes(toLower(type), 'false')
          ) {
            type = TRUE_FALSE;
          }
          if (
            includes(toLower(type), 'open') ||
            includes(toLower(type), 'ended')
          ) {
            type = OPEN_ENDED;
            if (!isEmpty(options)) {
              if (options.length < 3) {
                type = TRUE_FALSE;
              } else {
                type = MULTIPLE_CHOICE_SINGLE;
              }
              const arrOptions = [...options];
              options = map(arrOptions, (option, idx) => ({
                content: option,
                isCorrect: toNumber(quiz?.answer) === idx + 1
              }));
            }
          }
        }

        const result: Omit<QuizQuestion, 'options' | 'question'> & {
          options?: string[];
          question?: string;
        } = {
          ...omit(quiz, ['explanation']),
          options,
          type
        };

        if (quiz?.answer) result.answer = toString(quiz?.answer);
        return result;
      });

      if (isNil(quizId) && isEmpty(quizId)) {
        await handleCreateQuiz(questions);
      } else {
        await handleUpdateQuiz(quizId, { quizQuestions: questions });
      }

      setLocalData(dummyData);
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
