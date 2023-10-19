import LoaderOverlay from '../../../components/loaderOverlay';
import quizStore from '../../../state/quizStore';
// import { QuizQuestion } from '../../../types';
import QuizDataProvider, { QuizQuestion } from './context';
import { ManualQuizForm } from './forms';
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
  Flex
} from '@chakra-ui/react';
import { useState } from 'react';

const CreateQuizPage = () => {
  const {
    isLoading
    //  createQuiz,
    // quiz,
    //  fetchQuizzes
  } = quizStore();

  const [questions, setQuestions] = useState<QuizQuestion[]>([]);

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
      {/* <QuizModal isOpen={Boolean(quiz)} /> */}

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
            <Tab flex="1">Upload</Tab>
            <Tab flex="1">Topic</Tab>
            <Tab flex="1">Manual</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <p>renderUploadForm</p>
              {/* {renderUploadForm()} */}
            </TabPanel>
            <TabPanel>
              <p>renderTopicForm</p>
              {/* {renderTopicForm()} */}
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
        {/* {renderPreview()} */}
        <QuizPreviewer questions={questions} />
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
