import { useCustomToast } from '../../../components/CustomComponents/CustomToast/useCustomToast';
import TagModal from '../../../components/TagModal';
import LoaderOverlay from '../../../components/loaderOverlay';
import { useSearch } from '../../../hooks';
import ApiService from '../../../services/ApiService';
import quizStore from '../../../state/quizStore';
import { QuizData, QuizQuestion } from '../../../types';
import {
  ManualQuizForm, // TextQuizForm,
  UploadQuizForm,
  TopicQuizForm
} from './forms';
import LoaderScreen from './forms/quizz_setup/loader_page';
import { ManualPreview as QuizPreviewer } from './previews';
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
  AlertStatus,
  ToastPosition
} from '@chakra-ui/react';
import {
  filter,
  isEmpty,
  isNil,
  last,
  omit,
  pull,
  union,
  map,
  merge,
  unionBy // uniqBy
} from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

type NewQuizQuestion = QuizQuestion & {
  canEdit?: boolean;
};

const CreateQuizPage = () => {
  const TAG_TITLE = 'Tags Alert';
  const [searchParams] = useSearchParams();
  const toast = useCustomToast();
  const {
    loadQuiz,
    fetchQuizzes,
    handleIsLoadingQuizzes,
    quiz,
    isLoading,
    handleCreateQuiz: handleCreateQuizService,
    handleUpdateQuiz: handleUpdateQuizService,
    handleToggleStartQuizModal,
    handleDeleteQuizQuestion: handleDeleteQuizQuestionService
  } = quizStore();
  const [isLoadingButton, setIsLoadingButton] = useState(false);
  const [quizId, setQuizId] = useState<string | null | undefined>(null);

  const [questions, setQuestions] = useState<NewQuizQuestion[]>([]);
  const [searchQuestions, setSearchQuestions] = useState<NewQuizQuestion[]>([]);
  const [openTags, setOpenTags] = useState<boolean>(false);
  const [tags, setTags] = useState<string[]>([]);
  const [newTags, setNewTags] = useState<string[]>(tags);
  const [inputValue, setInputValue] = useState('');
  const [title, setTitle] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [uploadingState, setUploadingState] = useState(false);

  const handleSetUploadingState = (value: boolean) => setUploadingState(value);
  const handleSetTitle = (str: string) => setTitle(str);

  const handleClearQuiz = () => setQuestions([]);

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

  const handleUpdateQuizQuestion = (
    index: number,
    question: NewQuizQuestion
  ) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = merge({}, question, { canEdit: true });

    setQuestions(updatedQuestions);
  };

  const handleDeleteQuizQuestion = async (
    quizId: number | string,
    questionId: number | string
  ) => {
    handleIsLoadingQuizzes(true);
    setIsLoadingButton(true);
    // setUploadingState(true);

    handleDeleteQuizQuestionService(quizId, questionId, async (error) => {
      handleIsLoadingQuizzes(false);
      setIsLoadingButton(false);
      setUploadingState(false);
      if (error) {
        toast({
          position: 'top-right',
          title: `failed to delete question`,
          status: 'error'
        });

        return;
      }
      toast({
        position: 'top-right',
        title: `question deleted`,
        status: 'success'
      });

      await fetchQuizzes();
    });
  };

  useEffect(() => {
    const queryQuizId = searchParams.get('quiz_id');

    if (isNil(quiz) && !isEmpty(queryQuizId) && !isNil(queryQuizId)) {
      (async () => {
        setIsLoadingButton(true);
        await fetchQuizzes();
        await loadQuiz(queryQuizId);
        setIsLoadingButton(false);
      })();
    }

    if (!isNil(quiz)) {
      setQuizId(quiz?._id);
      setTitle(quiz.title);
      setTags(quiz.tags);
      setQuestions(
        map(quiz?.questions, (question) =>
          merge({}, question, { canEdit: !isNil(queryQuizId) })
        )
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, quiz]);

  const handleRemoveTag = (idx: number, length = 1) => {
    const tag = tags.splice(idx, length);

    setTags((prevTags) => [...pull(prevTags, last(tag) as string)]);
  };

  const handleOpenTagsModal = () => setOpenTags(true);

  const handleCreateQuiz = async (
    quizQuestions = questions,
    canEdit = false,
    quizTitle = title,
    quizTags = tags
  ) => {
    setIsLoadingButton(true);
    setUploadingState(true);

    await handleCreateQuizService(
      {
        questions: map(quizQuestions, (question) => {
          return {
            ...omit(question, ['id', 'updatedAt', 'createdAt', 'canEdit']),
            options: question?.options?.map((option) => {
              return omit(option, ['_id', 'updatedAt', 'createdAt']);
            })
          };
        }) as any[],
        title: quizTitle,
        tags: quizTags,
        canEdit
      },
      async (error, res) => {
        handleIsLoadingQuizzes(false);
        setIsLoadingButton(false);
        setUploadingState(false);
        if (error) {
          toast({
            position: 'top-right',
            title: `failed to create quiz`,
            status: 'error'
          });

          return;
        }
        toast({
          position: 'top-right',
          title: `quiz created`,
          status: 'success'
        });
        setQuizId(res?._id);
        setTitle(res?.title);
      }
    );
  };

  const handleUpdateQuiz = async (
    quizId,
    payload = {
      quizQuestions: questions,
      quizTitle: title,
      quizTags: tags,
      canEdit: false
    }
  ) => {
    const { quizQuestions, quizTitle, quizTags, canEdit } = payload;
    setIsLoadingButton(true);
    setUploadingState(true);

    await handleUpdateQuizService(
      quizId,
      {
        questions: map(quizQuestions, (question) => {
          return {
            ...omit(question, ['id', 'updatedAt', 'createdAt', 'canEdit']),
            options: question?.options?.map((option) => {
              return omit(option, ['_id', 'updatedAt', 'createdAt']);
            })
          };
        }) as any[],
        title: quizTitle,
        tags: quizTags,
        canEdit
      },
      async (error, res) => {
        handleIsLoadingQuizzes(false);
        setIsLoadingButton(false);
        setUploadingState(false);
        if (error) {
          toast({
            position: 'top-right',
            title: `failed to update quiz`,
            status: 'error'
          });

          return;
        }
        toast({
          position: 'top-right',
          title: `quiz updated!`,
          status: 'success'
        });
        setQuizId(res?._id);
        setTitle(res?.title);
        await fetchQuizzes();
      }
    );
  };

  const handleLoadQuiz = () => {
    handleToggleStartQuizModal(true);
    loadQuiz(quizId);
  };
  const searchQuizzes = useCallback(
    (query: string) => {
      if (isEmpty(query)) return setSearchQuestions([]);
      if (!hasSearched) setHasSearched(true);
      const re = new RegExp(query, 'i');
      const filtered = questions.filter((entry) =>
        Object.values(entry).some(
          (val) => typeof val === 'string' && val.match(re)
        )
      );

      setSearchQuestions(filtered);
    },
    [hasSearched, questions]
  );

  const handleSearch = useSearch(searchQuizzes);

  useEffect(() => {
    // setQuestions([
    //   {
    //     question: 'What is the main purpose of a knife?',
    //     type: 'openEnded',
    //     answer: 'Cutting',
    //     explanation:
    //       'Knife primarily serves as a cutting tool. It may be used in various contexts like kitchen for food preparation or in arts for creating crafts.'
    //   },
    //   {
    //     canEdit: true,
    //     question:
    //       'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    //     type: 'multipleChoiceMulti',
    //     options: [
    //       {
    //         content:
    //           'Cutting food Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    //         isCorrect: true
    //       },
    //       {
    //         content:
    //           'Sewing clothes Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    //         isCorrect: false
    //       },
    //       {
    //         content:
    //           'Opening a package Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    //         isCorrect: false
    //       },
    //       {
    //         content:
    //           'Writing a letter Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    //         isCorrect: false
    //       }
    //     ]
    //   },
    //   {
    //     question:
    //       'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    //     type: 'multipleChoiceSingle',
    //     options: [
    //       {
    //         content:
    //           'Cutting food Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    //         isCorrect: true
    //       },
    //       {
    //         content:
    //           'Sewing clothes Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    //         isCorrect: false
    //       },
    //       {
    //         content:
    //           'Opening a package Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    //         isCorrect: false
    //       },
    //       {
    //         content:
    //           'Writing a letter Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    //         isCorrect: false
    //       }
    //     ]
    //   },
    //   {
    //     question: 'A knife can be used for...',
    //     type: 'multipleChoiceMulti',
    //     options: [
    //       {
    //         content: 'Cutting food',
    //         isCorrect: true
    //       },
    //       {
    //         content: 'Sewing clothes',
    //         isCorrect: false
    //       },
    //       {
    //         content: 'Opening a package',
    //         isCorrect: true
    //       },
    //       {
    //         content: 'Writing a letter',
    //         isCorrect: false
    //       }
    //     ]
    //   },
    //   {
    //     question: 'The sharp side of the knife is called...?',
    //     type: 'multipleChoiceSingle',
    //     options: [
    //       {
    //         content: 'Handle',
    //         isCorrect: false
    //       },
    //       {
    //         content: 'Edge',
    //         isCorrect: true
    //       },
    //       {
    //         content: 'Point',
    //         isCorrect: false
    //       },
    //       {
    //         content: 'Blade',
    //         isCorrect: false
    //       }
    //     ]
    //   },
    //   {
    //     question: 'Is it safe to play with a knife?',
    //     type: 'trueFalse',
    //     options: [
    //       {
    //         content: 'true',
    //         isCorrect: false
    //       },
    //       {
    //         content: 'false',
    //         isCorrect: true
    //       }
    //     ]
    //   },
    //   {
    //     question: 'If you see a knife lying around, you should...',
    //     type: 'multipleChoiceSingle',
    //     options: [
    //       {
    //         content: 'Pick it up and play with it',
    //         isCorrect: false
    //       },
    //       {
    //         content: 'Leave it there',
    //         isCorrect: false
    //       },
    //       {
    //         content: 'Tell an adult',
    //         isCorrect: true
    //       },
    //       {
    //         content: 'Put it in your pocket',
    //         isCorrect: false
    //       }
    //     ]
    //   }
    // ]);
  }, []);

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
        <Box
          className="create-quiz-wrapper"
          px={'30px'}
          width={['100%', '100%', '100%', '50%', '30%']}
          bg="white"
          overflowY={'auto'}
          overflowX={'hidden'}
          h={'100%'}
          sx={{
            '&::-webkit-scrollbar': {
              width: '4px'
            },
            '&::-webkit-scrollbar-track': {
              width: '6px'
            },
            '&::-webkit-scrollbar-thumb': {
              borderRadius: '24px'
            }
          }}
        >
          {isLoading && <LoaderOverlay />}

          <>
            <Text
              fontFamily="Inter"
              fontWeight="500"
              fontSize="18px"
              lineHeight="23px"
              color="#212224"
              py={8}
            >
              Create Quiz
            </Text>
            <Tabs defaultIndex={2} isLazy isFitted position={'relative'}>
              <TabList display="flex">
                <Tab
                  _selected={{ color: '#207DF7' }}
                  flex="1"
                  justifyContent={'flex-start'}
                  pl={0}
                >
                  Upload
                </Tab>
                <Tab _selected={{ color: '#207DF7' }} flex="1">
                  Topic
                </Tab>
                {false && (
                  <Tab _selected={{ color: '#207DF7' }} flex="1">
                    Text
                  </Tab>
                )}
                <Tab
                  _selected={{ color: '#207DF7' }}
                  flex="1"
                  justifyContent={'flex-end'}
                  pr={0}
                >
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
                <TabPanel p={0}>
                  <UploadQuizForm
                    quizId={quiz?._id ?? quizId}
                    handleSetUploadingState={handleSetUploadingState}
                    handleCreateQuiz={handleCreateQuiz}
                    handleUpdateQuiz={handleUpdateQuiz}
                    handleSetTitle={handleSetTitle}
                    isLoadingButton={uploadingState}
                    title={title}
                  />
                </TabPanel>

                <TabPanel p={0}>
                  <TopicQuizForm
                    quizId={quiz?._id ?? quizId}
                    handleSetUploadingState={handleSetUploadingState}
                    handleCreateQuiz={handleCreateQuiz}
                    handleUpdateQuiz={handleUpdateQuiz}
                    handleSetTitle={handleSetTitle}
                    isLoadingButton={uploadingState}
                    title={title}
                  />
                </TabPanel>
                <TabPanel p={0}>
                  <ManualQuizForm
                    quizId={quiz?._id ?? quizId}
                    openTags={handleOpenTagsModal}
                    tags={tags}
                    removeTag={handleRemoveTag}
                    title={title}
                    handleSetTitle={handleSetTitle}
                    isLoadingButton={isLoadingButton}
                    handleCreateQuiz={handleCreateQuiz}
                    handleUpdateQuiz={handleUpdateQuiz}
                  />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </>
        </Box>
        <Box
          className="review-quiz-wrapper"
          width={['100%', '100%', '100%', '50%', '70%']}
          bg="#F9F9FB"
          borderLeft="1px solid #E7E8E9"
        >
          {uploadingState && <LoaderScreen />}
          {!uploadingState && (
            <QuizPreviewer
              handleClearQuiz={handleClearQuiz}
              onOpen={handleLoadQuiz}
              updateQuiz={handleUpdateQuiz}
              questions={
                !isEmpty(searchQuestions) ? searchQuestions : questions
              }
              quizId={quiz?._id ?? (quizId as string)}
              isLoadingButton={isLoadingButton}
              handleUpdateQuizQuestion={handleUpdateQuizQuestion}
              handleSearch={handleSearch}
              handleDeleteQuizQuestion={handleDeleteQuizQuestion}
              handleSetUploadingState={handleSetUploadingState}
            />
          )}
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
            if (newTags?.length <= 10) {
              handleAddTag();
            }
          }}
          newTags={newTags}
          setNewTags={(tag) => {
            if (newTags?.length <= 10) {
              setNewTags(tag);
            }
          }}
          setInputValue={(value) => {
            if (newTags?.length <= 10) {
              setInputValue(value);
            }
          }}
        />
      )}
    </>
  );
};

const CreateQuiz = () => {
  return <CreateQuizPage />;
};

export default CreateQuiz;
