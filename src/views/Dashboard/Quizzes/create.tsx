import { useCustomToast } from '../../../components/CustomComponents/CustomToast/useCustomToast';
import TagModal from '../../../components/TagModal';
import LoaderOverlay from '../../../components/loaderOverlay';
import { useSearch } from '../../../hooks';
import quizStore from '../../../state/quizStore';
import { QuizQuestion } from '../../../types';
import { ManualQuizForm, UploadQuizForm, TopicQuizForm } from './forms';
import LoaderScreen from './forms/quizz_setup/loader_page';
import { ManualPreview as QuizPreviewer } from './previews';
import BackArrow from '../../../assets/backArrowFill.svg?react';
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
import { isEmpty, isNil, last, omit, pull, union, map, merge } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './styles.css';
import { HeaderButton, HeaderButtonText } from './styles';
import clsx from 'clsx';

type NewQuizQuestion = QuizQuestion & {
  canEdit?: boolean;
};

const CreateQuizPage = () => {
  const navigate = useNavigate();
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

  const handleLoadQuiz = async () => {
    console.log('quiz?._id ?? quizId ========>> ', quiz?._id ?? quizId);
    await loadQuiz(quiz?._id ?? quizId, undefined, () => {
      setTimeout(() => {
        handleToggleStartQuizModal(true);
      });
    });
  };

  const handleBackClick = () => {
    // setCanStartSaving(false);
    // clearEditor();
    setTimeout(() => {
      navigate(-1);
    }, 100);
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
          className="review-quiz-wrapper relative"
          width={['100%', '100%', '100%', '50%', '70%']}
          bg="#F9F9FB"
          borderLeft="1px solid #E7E8E9"
        >
          {uploadingState && (
            <>
              <Box>
                <HeaderButton
                  onClick={handleBackClick}
                  className={clsx(
                    'w-full max-w-[150px] hover:opacity-75 absolute left-5 top-5 z-10 hidden 2xl:flex cursor-pointer items-center'
                  )}
                >
                  <BackArrow className="mx-2" />
                  <HeaderButtonText className={clsx('ml-3')}>
                    Back
                  </HeaderButtonText>
                </HeaderButton>
              </Box>
              <LoaderScreen />
            </>
          )}
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
