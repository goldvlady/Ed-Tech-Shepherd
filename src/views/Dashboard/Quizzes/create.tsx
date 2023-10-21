import LoaderOverlay from '../../../components/loaderOverlay';
import quizStore from '../../../state/quizStore';
// import { QuizQuestion } from '../../../types';
import QuizDataProvider, { QuizQuestion } from './context';
import {
  ManualQuizForm,
  TextQuizForm,
  UploadQuizForm,
  TopicQuizForm
} from './forms';
import { QuizModal } from './modal';
import { manualPreview as QuizPreviewer } from './previews';
import './styles.css';
import {
  Box,
  HStack,
  VStack,
  Text,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Flex,
  TabIndicator,
  useDisclosure
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';

const CreateQuizPage = () => {
  const {
    isLoading
    //  createQuiz,
    // quiz,
    //  fetchQuizzes
  } = quizStore();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [questions, setQuestions] = useState<QuizQuestion[]>([
    // { question: 'question 1', questionType: 'multipleChoice', answer: '' },
    // { question: 'question 2', questionType: 'trueFalse', answer: '' },
    // { question: 'question 3', questionType: 'openEnded', answer: '' }
  ]);

  useEffect(() => {
    setQuestions([
      {
        question: 'question 1',
        questionType: 'multipleChoice',
        answer: '',
        options: ['option A', 'option B', 'option C', 'option D']
      },
      { question: 'question 2', questionType: 'trueFalse', answer: '' },
      { question: 'question 3', questionType: 'openEnded', answer: '' }
    ]);
  }, []);

  const addQuestion = (question: QuizQuestion) => {
    setQuestions([...questions, question]);
  };

  return (
    <Flex
      className="quiz-page-wrapper"
      width={'100%'}
      height={'100vh'}
      flexWrap="wrap"
    >
      {isLoading && <LoaderOverlay />}
      <QuizModal isOpen={isOpen} onClose={onClose} />

      <Box
        className="create-quiz-wrapper"
        width={['100%', '100%', '100%', '50%', '30%']}
        bg="white"
      >
        <Text
          fontFamily="Inter"
          fontWeight="500"
          fontSize="18px"
          lineHeight="23px"
          color="#212224"
          m={8}
          mt={10}
        >
          Create Quiz
        </Text>
        <Tabs isLazy isFitted>
          <TabList display="flex">
            <Tab _selected={{ color: '#207DF7' }} flex="1">
              Upload
            </Tab>
            <Tab _selected={{ color: '#207DF7' }} flex="1">
              Topic
            </Tab>
            <Tab _selected={{ color: '#207DF7' }} flex="1">
              Text
            </Tab>
            <Tab _selected={{ color: '#207DF7' }} flex="1">
              Manual
            </Tab>
          </TabList>

          <TabIndicator
            mt="-1.5px"
            height="2px"
            bg="#207DF7"
            borderRadius="1px"
          />

          <TabPanels>
            <TabPanel>
              <UploadQuizForm addQuestion={addQuestion} />
            </TabPanel>
            <TabPanel>
              <TopicQuizForm addQuestion={addQuestion} />
            </TabPanel>
            <TabPanel>
              <TextQuizForm addQuestion={addQuestion} />
            </TabPanel>
            <TabPanel>
              <ManualQuizForm addQuestion={addQuestion} />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
      <Box
        className="review-quiz-wrapper"
        width={['100%', '100%', '100%', '50%', '70%']}
        bg="#F9F9FB"
        borderLeft="1px solid #E7E8E9"
      >
        <QuizPreviewer questions={questions} onOpen={onOpen} />
      </Box>
    </Flex>
  );
};

const CreateQuiz = () => {
  return (
    <QuizDataProvider>
      <CreateQuizPage />
    </QuizDataProvider>
  );
};

export default CreateQuiz;
