import { useCustomToast } from '../../../components/CustomComponents/CustomToast/useCustomToast';
import TagModal from '../../../components/TagModal';
import LoaderOverlay from '../../../components/loaderOverlay';
import ApiService from '../../../services/ApiService';
import quizStore from '../../../state/quizStore';
import { QuizQuestion } from '../../../types';
import QuizDataProvider from './context';
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
  Text,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Flex,
  TabIndicator,
  useDisclosure,
  AlertStatus,
  ToastPosition
} from '@chakra-ui/react';
import { last, pull, union } from 'lodash';
import { useEffect, useState } from 'react';

const CreateQuizPage = () => {
  const TAG_TITLE = 'Tags Alert';

  const toast = useCustomToast();
  const { isLoading } = quizStore();
  const [isLoadingButton, setIsLoadingButton] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [openTags, setOpenTags] = useState<boolean>(false);
  const [tags, setTags] = useState<string[]>([]);
  const [newTags, setNewTags] = useState<string[]>(tags);
  const [inputValue, setInputValue] = useState('');
  const [title, setTitle] = useState('');

  const handleAddTag = () => {
    const value = inputValue.toLowerCase().trim();
    if (inputValue && !newTags.includes(value)) {
      setNewTags([...newTags, value]);
    }
    setInputValue('');
  };

  const showToast = (
    title: string,
    description: string,
    status: AlertStatus,
    position: ToastPosition = 'top-right',
    duration = 5000,
    isClosable = true
  ) => {
    toast({
      title: description ?? title,
      status: status,
      position: position,
      duration: duration,
      isClosable: isClosable
    });
  };

  const AddTags = async () => {
    setOpenTags(false);
    showToast(TAG_TITLE, 'Tag added', 'success');
    setTags(union(tags, newTags));
    setNewTags([]);
    setInputValue('');
  };

  useEffect(() => {
    setQuestions([
      {
        question: 'question 1',
        type: 'multipleChoiceSingle',
        options: [
          { content: 'option A', isCorrect: false },
          { content: 'option B', isCorrect: false },
          { content: 'option C', isCorrect: false },
          { content: 'option D', isCorrect: true }
        ]
      },
      {
        question: 'question 2',
        type: 'trueFalse',
        options: [
          { content: 'True', isCorrect: true },
          { content: 'False', isCorrect: false }
        ]
      },
      { question: 'question 3', type: 'openEnded', answer: '' }
    ]);
  }, []);

  const addQuestion = (question: QuizQuestion) => {
    setQuestions([...questions, question]);
  };

  const handleRemoveTag = (idx: number, length = 1) => {
    const tag = tags.splice(idx, length);

    setTags((prevTags) => [...pull(prevTags, last(tag) as string)]);
  };

  const handleOpenTagsModal = () => setOpenTags(true);
  const addTitle = (value: string) => setTitle(value);
  const handleCreateQuiz = async () => {
    setIsLoadingButton(true);
    const result = await ApiService.createQuiz({
      title,
      questions,
      tags
    });

    setIsLoadingButton(false);
  };

  return (
    <>
      <Flex
        className="quiz-page-wrapper"
        width={'100%'}
        height={'100vh'}
        maxH={'calc(100vh - 80px)'}
        overflowY={'hidden'}
        flexWrap="wrap"
      >
        {isLoading && <LoaderOverlay />}
        <QuizModal isOpen={isOpen} onClose={onClose} />

        <Box
          className="create-quiz-wrapper"
          width={['100%', '100%', '100%', '50%', '30%']}
          bg="white"
          overflowY={'auto'}
          h={'100%'}
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
          <Tabs defaultIndex={3} isLazy isFitted position={'relative'}>
            <TabList display="flex">
              <Tab isDisabled _selected={{ color: '#207DF7' }} flex="1">
                Upload
              </Tab>
              <Tab isDisabled _selected={{ color: '#207DF7' }} flex="1">
                Topic
              </Tab>
              <Tab isDisabled _selected={{ color: '#207DF7' }} flex="1">
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
                <UploadQuizForm
                  // openTags={handleOpenTagsModal}
                  addQuestion={addQuestion}
                />
              </TabPanel>
              <TabPanel>
                <TopicQuizForm
                  // openTags={handleOpenTagsModal}
                  addQuestion={addQuestion}
                />
              </TabPanel>
              <TabPanel>
                <TextQuizForm
                  // openTags={handleOpenTagsModal}
                  addQuestion={addQuestion}
                />
              </TabPanel>
              <TabPanel>
                <ManualQuizForm
                  openTags={handleOpenTagsModal}
                  addQuestion={addQuestion}
                  tags={tags}
                  removeTag={handleRemoveTag}
                  addTitle={addTitle}
                  isLoadingButton={isLoadingButton}
                />
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
          <QuizPreviewer
            createQuiz={handleCreateQuiz}
            questions={questions}
            onOpen={onOpen}
            isLoadingButton={isLoadingButton}
          />
        </Box>
      </Flex>

      {openTags && (
        <TagModal
          onSubmit={AddTags}
          isOpen={openTags}
          onClose={() => {
            setNewTags([]);
            setOpenTags(false);
          }}
          tags={[]}
          inputValue={inputValue}
          handleAddTag={() => {
            if (newTags.length <= 10) {
              handleAddTag();
            }
          }}
          newTags={newTags}
          setNewTags={(tag) => {
            if (newTags.length <= 10) {
              setNewTags(tag);
            }
          }}
          setInputValue={(value) => {
            if (newTags.length <= 10) {
              setInputValue(value);
            }
          }}
        />
      )}
    </>
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
