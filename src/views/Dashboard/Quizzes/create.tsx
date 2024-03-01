import { useCustomToast } from '../../../components/CustomComponents/CustomToast/useCustomToast';
import TagModal from '../../../components/TagModal';
import LoaderOverlay from '../../../components/loaderOverlay';
import { useSearch } from '../../../hooks';
import userStore from '../../../state/userStore';
import quizStore from '../../../state/quizStore';
import {
  MULTIPLE_CHOICE_MULTI,
  MULTIPLE_CHOICE_SINGLE,
  OPEN_ENDED,
  QuizQuestion,
  TRUE_FALSE
} from '../../../types';
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
  ToastPosition,
  Center,
  Icon,
  Drawer,
  DrawerBody,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Button,
  useBreakpointValue,
  VStack
} from '@chakra-ui/react';
import {
  isEmpty,
  isNil,
  last,
  omit,
  pull,
  union,
  map,
  merge,
  isArray,
  slice,
  size,
  toLower,
  includes,
  filter,
  toNumber,
  toString,
  isBoolean,
  isObject,
  isNaN,
  findIndex,
  unionBy
} from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './styles.css';
import { HeaderButton, HeaderButtonText } from './styles';
import clsx from 'clsx';
import PlansModal from '../../../components/PlansModal';
import { RiLockFill, RiLockUnlockFill } from 'react-icons/ri';
import { InfoOutlineIcon } from '@chakra-ui/icons';
import { languages } from '../../../helpers';

type NewQuizQuestion = QuizQuestion & {
  canEdit?: boolean;
  question?: string;
};

const CreateQuizPage = () => {
  const navigate = useNavigate();
  const { user }: any = userStore();
  const { hasActiveSubscription } = userStore.getState();
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
  const [preferredLanguage, setPreferredLanguage] = useState<
    (typeof languages)[number]
  >(languages[0]);
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
  const [togglePlansModal, setTogglePlansModal] = useState(false);
  const [plansModalMessage, setPlansModalMessage] = useState('');
  const [plansModalSubMessage, setPlansModalSubMessage] = useState('');
  const [isHovering, setIsHovering] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isMobile = useBreakpointValue({ base: true, lg: false });

  const handleLockClick = () => {
    setTogglePlansModal(true);
  };

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
    if (!hasActiveSubscription) {
      // Set messages and show the modal if the user has no active subscription
      setPlansModalMessage(
        !user.hadSubscription
          ? 'Start Your Free Trial!'
          : 'Pick a plan to access your AI Study Tools! 🚀'
      );
      setPlansModalSubMessage('One-click Cancel at anytime.');
      setTogglePlansModal(true);
    }
  }, [user.subscription, hasActiveSubscription]);

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

  const parsedQuestionsArrayFunc = (createdQuestions) =>
    map(createdQuestions, (question) => {
      const options = question?.options?.map((option) => {
        return omit(option, ['_id', 'updatedAt', 'createdAt']);
      });
      const answer =
        isNil(question?.answer) || isEmpty(question?.answer)
          ? toString(findIndex(options, 'isCorrect'))
          : question?.answer;
      return {
        ...omit(question, ['id', 'updatedAt', 'createdAt', 'canEdit']),
        options,
        answer
      };
    });

  const handleCreateQuiz = async (
    quizQuestions = questions,
    canEdit = false,
    quizTitle = title,
    quizTags = tags
  ) => {
    setIsLoadingButton(true);
    setUploadingState(true);

    const parsedQuestionsArray = parsedQuestionsArrayFunc(
      quizQuestions
    ) as QuizQuestion[];

    await handleCreateQuizService(
      {
        questions: parsedQuestionsArray,
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
  // may need to handle
  const handleUpdateQuiz = async (
    quizId,
    payload: {
      quizQuestions?: NewQuizQuestion[];
      quizTitle?: string;
      quizTags?: string[];
      canEdit?: boolean;
    } = {}
  ) => {
    const mergedPayload = merge(
      {
        quizQuestions: [],
        quizTitle: title,
        quizTags: tags,
        canEdit: false
      },
      payload
    );
    const { quizQuestions, quizTitle, quizTags, canEdit } = mergedPayload;
    setIsLoadingButton(true);
    setUploadingState(true);

    const parsedQuestionsArray = parsedQuestionsArrayFunc(
      unionBy(quizQuestions, questions, 'question')
    ) as QuizQuestion[];

    await handleUpdateQuizService(
      quizId,
      {
        questions: parsedQuestionsArray,
        title: quizTitle,
        tags: quizTags,
        canEdit
      },
      async (error, res) => {
        handleIsLoadingQuizzes(false);
        setIsLoadingButton(false);
        setUploadingState(false);
        if (error) {
          console.log('QUIZ ERROR: ', error);
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
    await loadQuiz(quiz?._id ?? quizId, undefined, () => {
      setTimeout(() => {
        handleToggleStartQuizModal(true);
      });
    });
  };

  const handleBackClick = () => {
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

  const handleCreateUpdateQuiz = async (
    createdQuestions = [],
    payload: { canEdit?: boolean; quizID?: string } = {}
  ) => {
    const opts = merge(
      {
        canEdit: false,
        quizID: quizId
      },
      payload
    );

    if (isNil(opts.quizID) && isEmpty(opts.quizID)) {
      await handleCreateQuiz(createdQuestions, opts.canEdit);
    } else {
      await handleUpdateQuiz(opts.quizID, {
        ...opts,
        quizQuestions: createdQuestions
      });
    }
    await fetchQuizzes();
  };

  const handleFormatQuizQuestionCallback = (
    quizQuestions,
    localData,
    cb = null
  ) => {
    if (isArray(quizQuestions) && !isEmpty(quizQuestions)) {
      (async () => {
        const sliceQuestions = slice(quizQuestions, 0, localData.count);
        const questions = map([...sliceQuestions], (quiz) => {
          let type = quiz?.type;
          let options = quiz?.options ?? [];
          if (
            !isNil(quiz?.options) ||
            (isArray(quiz?.options) && !isEmpty(quiz?.options))
          ) {
            options = quiz?.options;
          }

          if (isNil(type) || isEmpty(type)) {
            if (!isNil(options) || !isEmpty(options)) {
              if (options.length < 3) {
                type = TRUE_FALSE;
              } else {
                const isMulti =
                  size(filter(options, (option) => option.isCorrect === true)) >
                  1;
                if (isMulti) {
                  type = MULTIPLE_CHOICE_MULTI;
                } else {
                  type = MULTIPLE_CHOICE_SINGLE;
                }
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
              toLower(type) === 'multiplechoice' ||
              toLower(type) === 'multiplechoicemultiple'
            ) {
              type = MULTIPLE_CHOICE_MULTI;
            }
            if (
              includes(toLower(type), 'single answer') ||
              includes(toLower(type), 'singleanswer') ||
              toLower(type) === 'multiplechoicesingle'
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
                  const isMulti =
                    size(
                      filter(options, (option) => option.isCorrect === true)
                    ) > 1;
                  if (isMulti) {
                    type = MULTIPLE_CHOICE_MULTI;
                  } else {
                    type = MULTIPLE_CHOICE_SINGLE;
                  }
                }
                const arrOptions = [...options];
                options = map(
                  arrOptions,
                  (
                    option:
                      | string
                      | { content: string; isCorrect: string | boolean },
                    idx: number
                  ) => {
                    let isCorrect = !isNaN(toNumber(quiz?.answer))
                      ? toNumber(quiz?.answer) === idx + 1
                      : false;
                    let content = typeof option === 'string' && option;

                    if (isObject(option) && !isArray(option)) {
                      if (
                        !isNil(option?.isCorrect) &&
                        typeof option?.isCorrect === 'string'
                      ) {
                        isCorrect =
                          option?.isCorrect === 'true' || option?.isCorrect
                            ? true
                            : false;

                        content = option?.content;
                      }
                    }

                    return {
                      content,
                      isCorrect
                    };
                  }
                );
              }
            }
          }

          return {
            ...omit(quiz, ['explanation', 'answerKey']),
            options,
            type,
            answer: toString(quiz?.answer)
          };
        }) as NewQuizQuestion[];

        await handleCreateUpdateQuiz(questions);

        if (typeof cb === 'function') {
          cb();
        }
      })();
    }
  };
  // if (!hasActiveSubscription) {
  //   return (
  //     <Center height="100vh" width="100%">
  //       <Box display={'flex'} flexDirection={'column'} alignItems={'center'}>
  //         <Icon
  //           as={isHovering ? RiLockUnlockFill : RiLockFill}
  //           fontSize="100px"
  //           color="#fc9b65"
  //           onMouseEnter={() => setIsHovering(true)}
  //           onMouseLeave={() => setIsHovering(false)}
  //           onClick={handleLockClick}
  //           cursor="pointer"
  //         />
  //         <Text
  //           mt="20px"
  //           fontSize="20px"
  //           fontWeight="bold"
  //           color={'lightgrey'}
  //           textAlign="center"
  //         >
  //           Unlock your full potential today!
  //         </Text>
  //       </Box>
  //       {togglePlansModal && (
  //         <PlansModal
  //           togglePlansModal={togglePlansModal}
  //           setTogglePlansModal={setTogglePlansModal}
  //           message={plansModalMessage}
  //           subMessage={plansModalSubMessage}
  //         />
  //       )}
  //     </Center>
  //   );
  // } else {
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
                    Topic
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
                    handleSetTitle={handleSetTitle}
                    title={title}
                    handleFormatQuizQuestionCallback={
                      handleFormatQuizQuestionCallback
                    }
                    handleSetUploadingState={handleSetUploadingState}
                    uploadingState={uploadingState}
                  />
                </TabPanel>

                <TabPanel p={0}>
                  <TopicQuizForm
                    handleSetTitle={handleSetTitle}
                    title={title}
                    handleFormatQuizQuestionCallback={
                      handleFormatQuizQuestionCallback
                    }
                    handleSetUploadingState={handleSetUploadingState}
                    uploadingState={uploadingState}
                  />
                </TabPanel>
                <TabPanel p={0}>
                  <ManualQuizForm
                    openTags={handleOpenTagsModal}
                    tags={tags}
                    removeTag={handleRemoveTag}
                    title={title}
                    handleSetTitle={handleSetTitle}
                    setPreferredLang={setPreferredLanguage}
                    isLoadingButton={isLoadingButton}
                    handleCreateUpdateQuiz={handleCreateUpdateQuiz}
                    uploadingState={uploadingState}
                  />
                </TabPanel>
              </TabPanels>
              {isMobile && (
                <Flex justifyContent={'flex-end'}>
                  <Button
                    borderRadius="8px"
                    p="10px 20px"
                    m="20px 0px"
                    fontSize="14px"
                    lineHeight="20px"
                    variant="solid"
                    colorScheme="primary"
                    onClick={onOpen}
                    isDisabled={isEmpty(questions) && isEmpty(searchQuestions)}
                  >
                    View Quiz
                  </Button>
                </Flex>
              )}
            </Tabs>
            <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
              <DrawerOverlay />
              <DrawerContent>
                <DrawerCloseButton />
                <DrawerBody>
                  {!isEmpty(searchQuestions) || !isEmpty(questions) ? (
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
                  ) : (
                    <Center h="full">
                      <VStack spacing={4}>
                        <InfoOutlineIcon boxSize="50px" color="gray.400" />
                        <Text
                          fontSize="lg"
                          fontWeight="medium"
                          color="gray.600"
                        >
                          No generated quiz questions
                        </Text>
                      </VStack>
                    </Center>
                  )}
                </DrawerBody>
              </DrawerContent>
            </Drawer>
          </>
        </Box>
        <Box
          className="review-quiz-wrapper relative"
          width={['100%', '100%', '100%', '50%', '70%']}
          bg="#F9F9FB"
          borderLeft="1px solid #E7E8E9"
        >
          <Box>
            <HeaderButton
              onClick={handleBackClick}
              className={clsx(
                'w-full max-w-[150px] hover:opacity-75 absolute left-5 top-9 z-10 hidden 2xl:flex cursor-pointer items-center'
              )}
            >
              <BackArrow className="mx-2" />
              <HeaderButtonText className={clsx('ml-3')}>Back</HeaderButtonText>
            </HeaderButton>
          </Box>

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
  // }
};

const CreateQuiz = () => {
  return <CreateQuizPage />;
};

export default CreateQuiz;
