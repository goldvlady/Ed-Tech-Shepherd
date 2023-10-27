import { useCustomToast } from '../../../../components/CustomComponents/CustomToast/useCustomToast';
import SelectComponent, { Option } from '../../../../components/Select';
import { WardIcon } from '../../../../components/icons';
import ApiService from '../../../../services/ApiService';
import userStore from '../../../../state/userStore';
import { QuizQuestion } from '../../../../types';
import { useQuizState } from '../context';
import { QuestionIcon } from '@chakra-ui/icons';
import {
  Box,
  FormControl,
  FormLabel,
  Select,
  Input,
  HStack,
  Button,
  Textarea,
  Tooltip
} from '@chakra-ui/react';
import { isEmpty } from 'lodash';
import { ChangeEvent, useCallback, useEffect, useState } from 'react';

// DownloadIcon

const TextQuizForm = ({ addQuestion }) => {
  const toast = useCustomToast();
  const { user } = userStore();
  const [isLoading, setIsLoading] = useState(false);
  const dummyData = {
    subject: '',
    topic: '',
    difficulty: 'kindergarten',
    count: 1,
    type: 'mixed'
  };

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

  // const { goToQuestion, currentQuestionIndex, questions } = useQuizState();

  // const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion>({
  //   type: 'multipleChoiceSingle', //default question type option
  //   question: '',
  //   options: [],
  //   answer: ''
  // });

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

  const [localData, setLocalData] = useState<any>(dummyData);

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

  return (
    <Box width={'100%'} mt="20px" padding="0 10px">
      <FormControl mb={7}>
        <FormLabel color={'text.500'}>Enter a text</FormLabel>
        <Textarea
          h={'200px'}
          _placeholder={{
            color: 'text.700',
            fontSize: '14px'
          }}
          placeholder="Generate questions from your notes. 
          Type or copy and paste from your notes. 
          Maximum 200 characters. Premium subscribers get up to 5000 characters"
          size="lg"
          value={localData.subject}
          name="subject"
          onChange={handleChange}
        />
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
        <FormLabel color={'text.500'}>Topic: </FormLabel>
        <Input
          type="text"
          name="topic"
          placeholder="e.g. Chemistry"
          value={localData.topic}
          onChange={handleChange}
          _placeholder={{ fontSize: '14px', color: '#9A9DA2' }}
        />
      </FormControl>

      <FormControl mb={8}>
        <FormLabel color={'text.500'}>Level (optional): </FormLabel>
        <SelectComponent
          name="level"
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
          ml={5}
          isDisabled={
            localData.count < 1 ||
            isEmpty(localData.topic) ||
            isEmpty(localData.subject)
          }
          isLoading={isLoading}
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

export default TextQuizForm;
