import { useCustomToast } from '../../../../components/CustomComponents/CustomToast/useCustomToast';
import SelectComponent, { Option } from '../../../../components/Select';
import { WardIcon } from '../../../../components/icons';
import ApiService from '../../../../services/ApiService';
import userStore from '../../../../state/userStore';
// import { QuizQuestion } from '../../../../types';
// import { useQuizState } from '../context';
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
import { isEmpty } from 'lodash';
import { ChangeEvent, useCallback, useState } from 'react';

// DownloadIcon
const TopicQuizForm = ({ addQuestion }) => {
  const toast = useCustomToast();
  const { user } = userStore();
  const dummyData = {
    subject: '',
    topic: '',
    difficulty: 'kindergarten',
    count: 1,
    type: 'mixed'
  };

  const [isLoading, setIsLoading] = useState(false);
  const [localData, setLocalData] = useState<any>(dummyData);
  // const { setQuestions, goToQuestion, currentQuestionIndex, questions } =
  //   useQuizState();

  // const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion>({
  //   type: 'multipleChoiceSingle', //default question type option
  //   question: '',
  //   options: [],
  //   answer: ''
  // });

  const levelOptions = [
    { label: 'Very Easy', value: 'kindergarten' },
    { label: 'Medium', value: 'high school' },
    { label: 'Hard', value: 'college' },
    { label: 'Very Hard', value: 'PhD' }
  ];

  const typeOptions = [
    { label: 'Multiple Single Choice', value: 'multipleChoiceSingle' },
    { label: 'True/False', value: 'trueFalse' },
    { label: 'Open Ended', value: 'openEnded' },
    { label: 'Mixed', value: 'mixed' }
  ];

  // const handlePreviousQuestion = () => {
  //   goToQuestion((prevIndex: number) => prevIndex - 1);
  // };

  const handleGenerateQuestions = async () => {
    try {
      setIsLoading(true);

      const result = await ApiService.generateQuizQuestion(user._id, localData);
      const { data } = await result.json();

      addQuestion([...data.quizzes], 'multiple');

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

  // useEffect(() => {
  //   if (questions[currentQuestionIndex]) {
  //     setCurrentQuestion(questions[currentQuestionIndex]);
  //   }
  // }, [currentQuestionIndex, questions]);

  // const handleChangeQuestionType = (
  //   e: React.ChangeEvent<
  //     HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
  //   >
  // ) => {
  //   const { name, value } = e.target;

  //   setCurrentQuestion((prevQuestion) => ({
  //     ...prevQuestion,
  //     [name]: value
  //   }));
  // };

  // const handleQuestionAdd = () => {
  //   setQuestions((prevQuestions) => {
  //     const updatedQuestions = [...prevQuestions];
  //     updatedQuestions[currentQuestionIndex] = currentQuestion;
  //     // console.log('updatedQuestions', updatedQuestions);
  //     return updatedQuestions;
  //   });
  //   // if (questions.length > currentQuestionIndex + 1) {
  //   goToQuestion((prevIndex) => prevIndex + 1);

  //   addQuestion(currentQuestion);

  //   setCurrentQuestion({
  //     type: 'multipleChoiceSingle',
  //     question: '',
  //     options: [],
  //     answer: ''
  //   });
  //   // }
  // };

  // const handlePreviousQuestion = () => {
  //   goToQuestion((prevIndex: number) => prevIndex - 1);
  // };

  return (
    <Box width={'100%'} mt="20px" padding="0 10px">
      <FormControl mb={7}>
        <FormLabel color={'text.500'}>Enter a topic</FormLabel>
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
          your own content in the{' '}
          <Text display={'inline'} color={'#207DF7'}>
            text input mode
          </Text>{' '}
          instead.
        </FormHelperText>
      </FormControl>

      <FormControl mb={7}>
        <FormLabel color={'text.500'}>Question type:</FormLabel>
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
        <FormLabel color={'text.500'}>Subject: </FormLabel>
        <Input
          type="text"
          name="subject"
          placeholder="e.g. Chemistry"
          value={localData.subject}
          onChange={handleChange}
          _placeholder={{ fontSize: '14px', color: '#9A9DA2' }}
        />
      </FormControl>

      <FormControl mb={8}>
        <FormLabel color={'text.500'}>Level (optional): </FormLabel>
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
        <FormLabel color={'text.500'}>
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
          value={localData.count}
        />
      </FormControl>

      {/* <FormControl mb={7}>
        <FormLabel color={'text.500'}>Question type:</FormLabel>
        <Select
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
        </Select>
      </FormControl> */}

      {/* <FormControl mb={7}>
        <FormLabel color={'text.500'}>
          Number of questions
          <Tooltip
            hasArrow
            label="Number of questions to create"
            placement="right-end"
          >
            <QuestionIcon mx={2} w={3} h={3} />
          </Tooltip>
        </FormLabel>
        <Input textColor={'text.700'} height={'48px'} type="number" />
      </FormControl> */}

      {/* 
      {currentQuestion.questionType && (
        <FormControl mb={4}>
          <FormLabel>Answer:</FormLabel>
          {currentQuestion.questionType === 'multipleChoiceSingle' && (
            <Select
              name="answer"
              placeholder="Select answer"
              value={currentQuestion.answer}
              onChange={handleChange}
            >
              <option value="optionA">Option A</option>
              <option value="optionB">Option B</option>
              <option value="optionC">Option C</option>
              <option value="optionD">Option D</option>
            </Select>
          )}

          {currentQuestion.questionType === 'trueFalse' && (
            <Select
              name="answer"
              placeholder="Select answer"
              value={currentQuestion.answer}
              onChange={handleChange}
            >
              <option value="true">True</option>
              <option value="false">False</option>
            </Select>
          )}
          {currentQuestion.questionType === 'openEnded' && (
            <Textarea
              _placeholder={{ fontSize: '14px', color: '#9A9DA2' }}
              name="answer"
              placeholder="Select answer"
              value={currentQuestion.answer}
              onChange={handleChange}
            />
          )}
        </FormControl>
      )} */}

      <HStack
        w="100%"
        alignItems={'center'}
        justifyContent={'end'}
        marginTop="40px"
        align={'flex-end'}
      >
        {/* {currentQuestionIndex > 0 && (
          <Button
            aria-label="Edit"
            height={'fit-content'}
            width={'fit-content'}
            variant="unstyled"
            fontWeight={500}
            p={0}
            color={'#207DF7'}
            _hover={{ bg: 'none', padding: '0px' }}
            _active={{ bg: 'none', padding: '0px' }}
            _focus={{ boxShadow: 'none' }}
            colorScheme="primary"
            onClick={handlePreviousQuestion}
            mr={2}
          >
            Previous
          </Button>
        )} */}
        (
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
          <WardIcon
            className={'h-[20px] w-[20px] mx-2'}
            onClick={handleGenerateQuestions}
          />
          Generate
        </Button>
        )
      </HStack>
    </Box>
  );
};

export default TopicQuizForm;
