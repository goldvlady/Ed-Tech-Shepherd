import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router';
import FileProcessingService from '../../../../helpers/files.helpers/fileProcessing';
import useUserStore from '../../../../state/userStore';
import {
  Badge,
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Text,
  Menu,
  MenuItem,
  MenuList,
  MenuButton,
  Modal,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  ModalHeader,
  ModalOverlay,
  ModalContent,
  Spacer,
  SimpleGrid,
  Spinner,
  VStack,
  HStack,
  useDisclosure,
  UnorderedList,
  ListItem,
  PopoverContent,
  PopoverTrigger,
  Popover,
  CircularProgress,
  Icon,
  Tooltip,
  Center
} from '@chakra-ui/react';
import useInitializeAIChat from '../hooks/useInitializeAITutor';
import { useSearchParams } from 'react-router-dom';
import ResourceIcon from '../../../../assets/resources-plan.svg';
import QuizIcon from '../../../../assets/quiz-plan.svg';
import moment from 'moment';
import FlashcardIcon from '../../../../assets/flashcard-plan.svg';
import DocChatIcon from '../../../../assets/dochat-plan.svg';
import AiTutorIcon from '../../../../assets/aitutor-plan.svg';
import SciPhiService from '../../../../services/SciPhiService';
import studyPlanStore from '../../../../state/studyPlanStore';
import { useCustomToast } from '../../../../components/CustomComponents/CustomToast/useCustomToast';
import flashcardStore from '../../../../state/flashcardStore';
import resourceStore from '../../../../state/resourceStore';
import { AiFillThunderbolt, AiOutlineDown, AiOutlineUp } from 'react-icons/ai'; // Import dropdown icons
import { HiChevronDown, HiChevronUp } from 'react-icons/hi';
import { parseISO, format, parse } from 'date-fns';
import {
  EditIcon,
  RepeatIcon,
  SearchIcon,
  SmallCloseIcon
} from '@chakra-ui/icons';
import DatePicker from '../../../../components/DatePicker';
import Select, { Option } from '../../../../components/Select';
import CalendarDateInput from '../../../../components/CalendarDateInput';
import ApiService from '../../../../services/ApiService';
import SelectedNoteModal from '../../../../components/SelectedNoteModal';
import useStoreConversationIdToStudyPlan from '../hooks/useStoreConversationIdToStudyPlan';
import { FaPlus } from 'react-icons/fa';
import R2RClient from '../../../../services/R2R';
import { IoCreateOutline } from 'react-icons/io5';
import quizStore from '../../../../state/quizStore';
import TimePicker from '../../../../components/TimePicker';
import { BiPlayCircle } from 'react-icons/bi';
import { MdEdit } from 'react-icons/md';

function Topics(props) {
  const { planTopics, selectedPlan } = props;
  const isTutor = window.location.pathname.includes(
    '/dashboard/tutordashboard'
  );

  const {
    fetchPlanResources,
    studyPlanResources,
    isLoading: studyPlanStoreLoading
  } = studyPlanStore();
  const { user } = useUserStore();
  const { fetchSingleFlashcard, fetchSingleFlashcardForAPIKey, isLoading } =
    flashcardStore();
  const { loadQuiz } = quizStore();

  const [params] = useSearchParams();
  const {
    courses: courseList,
    levels: levelOptions,
    studyPlanCourses
  } = resourceStore();

  const [convoId, setConvoId] = useState(null);
  const [hasConversationId, setHasConversationId] = useState(false);
  const [vidOverlay, setVidOverlay] = useState<boolean>(true);

  const [state, setState] = useState({
    // studyPlans: storePlans,
    isPageLoading: false,
    selectedTopic: '',
    topics: null,
    topicResource: null,
    selectedPlan: null,
    // planResource: studyPlanResources,
    // planReport: studyPlanReport,
    showSubjects: false,
    page: 1,
    limit: 100,
    isLoading: false,
    selectedStudyEvent: null,
    selectedRecurrence: 'daily',
    selectedRecurrenceTime: null,
    recurrenceFrequency: '',
    recurrenceStartDate: new Date(),
    recurrenceEndDate: new Date()
  });

  const updateState = (newState: Partial<typeof state>) =>
    setState((prevState) => ({ ...prevState, ...newState }));

  const toast = useCustomToast();
  const navigate = useNavigate();

  const {
    isOpen: isOpenResource,
    onOpen: onOpenResource,
    onClose: onCloseResource
  } = useDisclosure();

  const {
    isOpen: isOpenCadence,
    onOpen: onOpenCadence,
    onClose: onCloseCadence
  } = useDisclosure();
  const {
    isOpen: isBountyModalOpen,
    onOpen: openBountyModal,
    onClose: closeBountyModal
  } = useDisclosure();

  const groupedTopics = planTopics?.schedules.reduce((grouped, topic) => {
    let testDate;
    if (topic.topicMetaData && topic.topicMetaData.length > 0) {
      if (topic.topicMetaData[0]?.testDate) {
        testDate = new Date(topic.topicMetaData[0].testDate).toDateString();
      } else {
        testDate = new Date(topic.endDate).toDateString();
      }
    } else {
      testDate = new Date(topic.endDate).toDateString();
    }

    if (!grouped.has(testDate)) {
      grouped.set(testDate, []);
    }

    grouped.get(testDate).push(topic);
    return grouped;
  }, new Map());

  function getColorForStatus(status) {
    switch (status) {
      case 'Done':
        return '#4CAF50';
      case 'In progress':
        return '#FB8441';
      case 'To Do':
        return '#f53535';
      default:
        return 'black';
    }
  }

  function getBackgroundColorForStatus(status) {
    switch (status) {
      case 'Done':
        return '#f1f9f1';
      case 'In progress':
        return '#fff2eb';
      case 'To Do':
        return '#fef0f0';
      default:
        return 'lightgrey';
    }
  }
  const getSubject = useMemo(() => {
    return (id) => {
      if (!courseList || !studyPlanCourses) {
        return null; // Return null if either courseList or studyPlanCourses is undefined
      }

      const labelFromCourseList = courseList
        .filter((course) => course._id === id)
        .map((course) => course.label);

      const labelFromStudyPlanCourses = studyPlanCourses
        .filter((course) => course._id === id)
        .map((course) => course.label);

      const allLabels = [...labelFromCourseList, ...labelFromStudyPlanCourses];

      return allLabels.length > 0 ? allLabels[0] : null;
    };
  }, [courseList, studyPlanCourses]);

  const getTopicStatus = (topicId) => {
    const selectedTopic = planTopics.progressLog[0]?.topicProgress?.find(
      (topic) => topic.topic === topicId
    );

    if (!selectedTopic) {
      return 'Topic Not Found';
    }

    const isInProgress = selectedTopic.subTopicProgress.some(
      (subTopic) => subTopic.completed
    );

    const isDone = selectedTopic.subTopicProgress.every(
      (subTopic) => subTopic.completed
    );

    if (isDone) {
      return 'Done';
    } else if (isInProgress) {
      return 'In Progress';
    } else {
      return 'To Do';
    }
  };

  const redirectToLogin = (toastMessage?: string) => {
    const currentPathWithQuery = window.location.href.split('dashboard')[1];
    if (toastMessage) {
      toast({
        title: 'You need to login to take a quiz',
        position: 'top-right',
        status: 'error',
        isClosable: true
      });
    }
    navigate(`/login?redirect=/dashboard${currentPathWithQuery}`);
  };

  // const getTopicResource = async (topic: string) => {
  //   updateState({ isLoading: true });
  //   try {
  //     // Instantiate SciPhiService
  //     const sciPhiService = new SciPhiService();

  //     // Define search options
  //     const searchOptions = {
  //       query: topic
  //     };

  //     // Call searchRag method
  //     const response = await sciPhiService.searchRag(searchOptions);
  //     if (response) {
  //       updateState({ isLoading: false, topicResource: response });
  //     }
  //   } catch (error) {
  //     updateState({ isLoading: false });
  //     console.error('Error searching topic:', error);
  //   }
  // };
  const getTopicResource = async (topic: string) => {
    updateState({ isLoading: true });
    try {
      const client = new R2RClient();

      // Define search parameters
      const query = topic;
      const limit = 10;
      const filters = { tags: 'example' };
      const settings = {};

      // ragCompletion method
      const response = await client.ragCompletion(
        query,
        limit,
        filters,
        settings
      );
      if (response) {
        updateState({ isLoading: false, topicResource: response });
      }
    } catch (error) {
      updateState({ isLoading: false });
    }
  };
  const findQuizzesByTopic = (topic): any[] => {
    // const topicKey = topic.toLowerCase();

    if (studyPlanResources[topic] && studyPlanResources[topic].quizzes) {
      return studyPlanResources[topic].quizzes;
    }

    return [];
  };
  const findFlashcardsByTopic = (topic) => {
    // const topicKey = topic.toLowerCase();

    if (studyPlanResources[topic] && studyPlanResources[topic].flashcards) {
      return studyPlanResources[topic].flashcards;
    }
    return [];
  };
  const findStudyEventsByTopic = (topic) => {
    if (studyPlanResources[topic] && studyPlanResources[topic].studyEvent) {
      return studyPlanResources[topic].studyEvent;
    }
    return [];
  };

  const findDocumentsByTopic = (topic) => {
    if (studyPlanResources[topic] && studyPlanResources[topic].documents) {
      return studyPlanResources[topic].documents;
    }
    return [];
  };

  const loadFlashcard = async (flashcardId: string) => {
    if (!user) {
      return redirectToLogin('You need to login to load a flashcard');
    }
    const apiKeyParam = params.get('apiKey');
    if (apiKeyParam) {
      fetchSingleFlashcardForAPIKey(flashcardId, apiKeyParam);
    } else {
      fetchSingleFlashcard(flashcardId);
    }
  };

  const handleUpdatePlanCadence = async () => {
    updateState({ isLoading: true });
    const parsedTime = parse(
      state.selectedRecurrenceTime.toLowerCase(),
      'hh:mm aa',
      new Date()
    );
    const time = format(parsedTime, 'HH:mm');
    const payload = {
      // entityId: selectedPlan,
      eventId: state.selectedStudyEvent,

      // metadata: {
      //   topicId: selectedTopic
      // },

      updates: {
        startDate: moment(state.recurrenceStartDate).format('YYYY-MM-DD'),
        startTime: time,
        isActive: true,
        recurrence: {
          frequency: state.selectedRecurrence,
          endDate: moment(state.recurrenceEndDate).format('YYYY-MM-DD')
        }
      }
    };
    try {
      const resp = await ApiService.rescheduleStudyEvent(payload);
      if (resp) {
        const response = await resp.json();
        if (resp.status === 200) {
          // setIsCompleted(true);
          // setLoading(false);
          toast({
            title: 'Updated Successfully',
            position: 'top-right',
            status: 'success',
            isClosable: true
          });
          updateState({ isLoading: false });

          fetchPlanResources(selectedPlan);
          onCloseCadence();
        } else {
          // setLoading(false);
          toast({
            title: 'Failed to update, try again',
            position: 'top-right',
            status: 'error',
            isClosable: true
          });
          updateState({ isLoading: false });
        }
      }
    } catch (error: any) {
      // setLoading(false);
      return { error: error.message, message: error.message };
    }
  };

  const frequencyOptions = [
    // { label: 'Once daily', value: 'once' },
    // { label: 'Twice daily', value: 'twice' },
    { label: 'Daily', value: 'daily' },
    { label: 'Weekly', value: 'weekly' },
    { label: 'Monthly', value: 'monthly' },
    { label: "Doesn't Repeat", value: 'none' }
  ];
  const timeOptions = Array.from({ length: 96 }, (_, index) => {
    const hour = Math.floor(index / 4);
    const minute = 15 * (index % 4);
    const displayHour = hour === 0 || hour === 12 ? 12 : hour % 12;
    const displayMinute = minute === 0 ? '00' : String(minute);
    const period = hour < 12 ? ' AM' : ' PM';

    const time = `${displayHour}:${displayMinute}${period}`;

    return { label: time, value: time };
  });

  const TopicCard = ({ topic }) => {
    const [isCollapsed, setIsCollapsed] = useState(true); // Initialize isCollapsed state for each topic card
    const [initializing, setInitializing] = useState(false);
    const [initializingDocChat, setInitializingDocChat] = useState(false);
    const [showNoteModal, setShowNoteModal] = useState(false);

    const toggleCollapse = () => {
      setIsCollapsed(!isCollapsed);
    };

    const { loading, error } = useStoreConversationIdToStudyPlan(
      selectedPlan,
      topic.topic,
      convoId,
      topic.topicMetaData[0]?.testDate
    );

    // const handleStartConversation = () => {
    //   useStoreConversationIdToStudyPlan(
    //     selectedPlan,
    //     topic.topic,
    //     convoId,
    //     topic.topicMetaData[0].testDate
    //   );
    // };

    const redirectToLogin = (toastMessage?: string) => {
      const currentPathWithQuery = window.location.href.split('dashboard')[1];
      if (toastMessage) {
        toast({
          title: 'You need to login to take a quiz',
          position: 'top-right',
          status: 'error',
          isClosable: true
        });
      }
      navigate(`/login?redirect=/dashboard${currentPathWithQuery}`);
    };

    const saveStudyPlanMetaData = useCallback(
      async (conversationId: string) => {
        try {
          const response = await ApiService.storeStudyPlanMetaData({
            studyPlanId: selectedPlan,
            metadata: {
              conversationId,
              topicId: topic?.topicDetails._id
            }
          });
          if (response) {
            const data = await response.json();
          }
        } catch (error) {
          // console.error('Error saving metadata:', error);
        }
      },
      [topic]
    );

    const initializeAItutor = useInitializeAIChat('homework-help', {
      navigateOnInitialized: true,
      onInitialized: saveStudyPlanMetaData
    });

    const handleAiTutor = () => {
      setInitializing(true);
      const convoId = topic.topicMetaData[0]?.conversationId;
      if (!user) {
        return redirectToLogin('You need to login to use AI Tutor');
      }
      if (convoId) {
        const queryString = window.location.search;
        navigate(`/dashboard/ace-homework/${convoId}${queryString}`);
      } else {
        initializeAItutor({
          topic: topic.topicDetails?.label,
          subject: getSubject(planTopics.course),
          level: 'Sophomore',
          studentId: user?._id,
          firebaseId: user?.firebaseId,
          namespace: 'homework-help'
        });
      }
      setInitializing(false);
    };

    const handleDocAction = async (doc) => {
      setInitializingDocChat(true);
      if (!user) {
        return redirectToLogin('You need to login to use AI Tutor');
      }

      try {
        let docId = doc.ingestId;
        if (!doc.ingestId) {
          updateState({ isPageLoading: true });

          const ingestHandler = new FileProcessingService(
            { ...doc, student: user?._id },
            true
          );
          const response = await ingestHandler.process();
          const {
            data: [{ documentId }]
          } = response;
          docId = documentId;
        }
        let path = `/dashboard/docchat?documentUrl=${doc.documentUrl}&documentId=${docId}&language=English`;
        path += window.location.search.replace('?', '&');
        navigate(path);
      } catch (error) {
        toast({
          title: 'Error opening document',
          position: 'top-right',
          status: 'error',
          isClosable: true
        });
      } finally {
        updateState({ isPageLoading: false });
        setInitializingDocChat(false);
      }
    };

    const navigateToQuizPage = (quizId: string) => {
      const baseUrl = isTutor ? '/dashboard/tutordashboard' : '/dashboard';

      if (!user) {
        redirectToLogin('You need to login to take a quiz');
      } else {
        let quizPathWithQuery = `${baseUrl}/quizzes/take?quiz_id=${quizId}`;
        quizPathWithQuery += window.location.search.replace('?', '&');
        navigate(quizPathWithQuery);
      }
    };

    const resourceEmtpyState = (entity: 'quizzes' | 'flashcards') => {
      return (
        <Box textAlign={'center'} py={4} px={4}>
          <CircularProgress isIndeterminate color="blue.300" />
          <Text fontSize={12} mt="4" color="gray.500">
            Your {entity} are being prepared. Please wait a moment.
          </Text>
        </Box>
      );
    };

    const renderQuizzes = useCallback(() => {
      const quizzes = findQuizzesByTopic(topic.topicDetails?.label);
      if (!quizzes || !quizzes.length) return resourceEmtpyState('quizzes');
      return findQuizzesByTopic(topic.topicDetails?.label)?.map((quiz) => (
        <>
          <MenuItem key={quiz.id}>
            <Flex alignItems={'center'} gap={4} w="full">
              <Text fontSize={12}>{quiz.title}</Text>

              <Spacer />
              <Flex alignItems="center" gap={2}>
                {!isTutor && (
                  <Tooltip label="Take">
                    <Box
                      onClick={() => {
                        navigateToQuizPage(quiz.id);
                      }}
                    >
                      <AiFillThunderbolt color="#207df7" size={18} />
                    </Box>
                  </Tooltip>
                )}
                {planTopics?.creator === user?._id && (
                  <Tooltip label="Edit">
                    <Box
                      onClick={() => {
                        loadQuiz(quiz?.id);
                        if (!user) {
                          redirectToLogin('You need to login to edit a quiz');
                        }
                        const baseUrl = isTutor
                          ? '/dashboard/tutordashboard'
                          : '/dashboard';
                        navigate(
                          `${baseUrl}/quizzes/create?quiz_id=${quiz.id}`
                        );
                      }}
                    >
                      <EditIcon color="#207df7" boxSize={4} />
                    </Box>
                  </Tooltip>
                )}
              </Flex>
            </Flex>
          </MenuItem>
        </>
      ));
    }, [topic.topicDetails?.label]);

    const renderFlashcards = useCallback(() => {
      const flashcards = findFlashcardsByTopic(topic.topicDetails?.label);
      if (!flashcards || !flashcards.length)
        return resourceEmtpyState('flashcards');
      return flashcards.map((flashcard) => (
        <>
          <MenuItem key={flashcard.id}>
            <Flex alignItems={'center'} gap={4} w="full">
              <Text fontSize={12}> {flashcard.deckname}</Text>

              <Spacer />
              <Flex alignItems="center" gap={2}>
                {!isTutor && (
                  <Tooltip label="Study">
                    <Box onClick={() => loadFlashcard(flashcard.id)}>
                      <AiFillThunderbolt color="#207df7" size={18} />
                    </Box>
                  </Tooltip>
                )}
                {planTopics?.creator === user?._id && (
                  <Tooltip label="Edit">
                    <Box
                      onClick={() => {
                        if (!user) {
                          redirectToLogin(
                            'You need to login to edit a flashcard'
                          );
                        }
                        const baseUrl = isTutor
                          ? '/dashboard/tutordashboard'
                          : '/dashboard';
                        navigate(`${baseUrl}/flashcards/${flashcard.id}/edit`);
                      }}
                    >
                      <EditIcon color="#207df7" boxSize={4} />
                    </Box>
                  </Tooltip>
                )}
              </Flex>
            </Flex>
          </MenuItem>
        </>
      ));
    }, [topic.topicDetails?.label]);

    // const handleInitializeAiTutor = async () => {
    //   setInitializing(true);
    //   try {
    //     await initializeAItutor({
    //       topic: topic.topicDetails?.label,
    //       subject: getSubject(planTopics.course),
    //       level: 'Sophomore',
    //       studentId: user?._id,
    //       firebaseId: user?.firebaseId,
    //       namespace: 'homework-help'
    //     });
    //   } catch (error) {
    //     toast({
    //       title: 'Error initializing AI Tutor',
    //       position: 'top-right',
    //       status: 'error',
    //       isClosable: true
    //     });
    //     // console.error('Error initializing AI Tutor:', error);
    //   } finally {
    //     setInitializing(false);
    //   }
    // };
    const disableClick = !user || user._id !== planTopics?.user;

    return (
      <>
        {' '}
        <Box
          bg="white"
          rounded="md"
          shadow="md"
          key={topic._id}
          // ref={
          //   topic._id === state.selectedTopic
          //     ? selectedTopicRef
          //     : null
          // }
        >
          <Flex alignItems={'center'} py={1} px={4}>
            <Text
              fontSize="16px"
              fontWeight="500"
              mb={2}
              color="text.200"
              display={'flex'}
              alignItems="center"
              gap={2}
            >
              {topic.topicDetails?.label}
              {isCollapsed ? (
                <HiChevronUp onClick={toggleCollapse} />
              ) : (
                <HiChevronDown onClick={toggleCollapse} />
              )}
            </Text>

            <Spacer />
            <Badge
              variant="subtle"
              bgColor={`${getBackgroundColorForStatus(
                getTopicStatus(topic.topicDetails?._id)
              )}`}
              color={getColorForStatus(getTopicStatus(topic.topicDetails?._id))}
              p={1}
              letterSpacing="wide"
              textTransform="none"
              borderRadius={8}
            >
              {getTopicStatus(topic.topicDetails?._id)}
            </Badge>
          </Flex>

          {!isCollapsed && (
            <Box p={2}>
              <UnorderedList
                listStyleType="circle"
                listStylePosition="inside"
                color="gray.700"
                fontSize={14}
                // h={'100px'}
              >
                {topic.topicDetails?.subTopics.map((item, index) => (
                  <ListItem key={index}>{item.label}</ListItem>
                ))}
              </UnorderedList>
            </Box>
          )}
          <Divider />
          <Box width={'100%'}>
            <HStack
              spacing={9}
              p={4}
              justifyContent="space-between"
              textColor={'black'}
              pointerEvents={disableClick ? 'none' : 'auto'}
              opacity={disableClick ? 0.5 : 1}
            >
              <Menu isLazy>
                <MenuButton>
                  {' '}
                  <VStack>
                    <QuizIcon />
                    <Text fontSize={12} fontWeight={500}>
                      Quizzes
                    </Text>
                  </VStack>
                </MenuButton>
                <MenuList maxH={60} overflowY="scroll">
                  {studyPlanResources && renderQuizzes()}

                  <Button
                    color="gray"
                    size={'sm'}
                    variant="ghost"
                    alignItems="center"
                    float={'right'}
                    mt={2}
                    // onClick={() => setShowNoteModal(true)}
                    fontSize={12}
                  >
                    <Icon as={FaPlus} mr={2} />
                    Generate More
                  </Button>
                </MenuList>
              </Menu>
              <Menu isLazy>
                <MenuButton>
                  {' '}
                  <VStack>
                    <FlashcardIcon />
                    <Text fontSize={12} fontWeight={500}>
                      Flashcards
                    </Text>
                  </VStack>
                </MenuButton>
                <MenuList maxH={60} overflowY="scroll">
                  {studyPlanResources && renderFlashcards()}
                </MenuList>
              </Menu>
              {initializing ? (
                <Box textAlign={'center'}>
                  <Spinner boxSize={'15px'} my={2} />
                </Box>
              ) : (
                <VStack
                  cursor={'pointer'}
                  onClick={() => {
                    handleAiTutor();
                  }}
                >
                  <AiTutorIcon />
                  <Text fontSize={12} fontWeight={500}>
                    AI Tutor
                  </Text>
                </VStack>
              )}
              {initializingDocChat ? (
                <Box textAlign={'center'}>
                  <Spinner boxSize={'15px'} my={2} />
                </Box>
              ) : (
                <>
                  {' '}
                  <Menu isLazy>
                    <MenuButton>
                      <VStack>
                        <DocChatIcon />
                        <Text fontSize={12} fontWeight={500}>
                          Doc Chat
                        </Text>
                      </VStack>
                    </MenuButton>
                    <MenuList
                      maxH={60}
                      overflowY="scroll"
                      bg="white"
                      border="1px solid #E2E8F0"
                      borderRadius="md"
                    >
                      {studyPlanResources && (
                        <>
                          {findDocumentsByTopic(topic.topicDetails?.label).map(
                            (doc, index) => {
                              return (
                                <MenuItem
                                  key={index}
                                  _hover={{ bg: 'gray.100' }}
                                  w="full"
                                  fontSize={12}
                                  onClick={() => {
                                    handleDocAction(doc);
                                    // navigate(
                                    //   `/dashboard/docchat?documentUrl=${doc.documentUrl}&documentId=${doc.ingestId}&language=English`
                                    // )
                                  }}
                                >
                                  <Flex alignItems={'center'} gap={2}>
                                    <Text>
                                      {doc.title?.replace(
                                        /%20%26|%20|%2F/g,
                                        (match) => {
                                          switch (match) {
                                            case '%20%26':
                                              return ' ';
                                            case '%20':
                                              return ' ';
                                            case '%2F':
                                              return ' ';
                                            default:
                                              return match;
                                          }
                                        }
                                      )}
                                    </Text>
                                    {initializingDocChat && (
                                      <Box textAlign={'center'}>
                                        <Spinner boxSize={'15px'} my={2} />
                                      </Box>
                                    )}
                                  </Flex>
                                </MenuItem>
                              );
                            }
                          )}

                          <Button
                            color="gray"
                            size={'sm'}
                            variant="ghost"
                            alignItems="center"
                            float={'right'}
                            onClick={() => setShowNoteModal(true)}
                            fontSize={12}
                          >
                            <Icon as={FaPlus} mr={2} />
                            Add New
                          </Button>
                        </>
                      )}
                    </MenuList>
                  </Menu>
                </>
              )}

              <VStack
                cursor={'pointer'}
                onClick={() => {
                  updateState({
                    selectedTopic: topic.topicDetails?.label
                  });
                  getTopicResource(topic.topicDetails?.label);
                  onOpenResource();
                }}
              >
                <ResourceIcon />
                <Text fontSize={12} fontWeight={500}>
                  Resources
                </Text>
              </VStack>
            </HStack>
            <Flex alignItems={'center'} px={4} my={4}>
              <Badge
                variant="subtle"
                colorScheme="blue"
                p={1}
                letterSpacing="wide"
                textTransform="capitalize"
                borderRadius={8}
                cursor={'grab'}
                onClick={() => {
                  if (disableClick) {
                    return;
                  } else {
                    updateState({
                      recurrenceStartDate: new Date(
                        findStudyEventsByTopic(
                          topic.topicDetails?.label
                        )?.startDate
                      ),
                      recurrenceEndDate: new Date(
                        findStudyEventsByTopic(
                          topic.topicDetails?.label
                        )?.recurrence?.endDate
                      ),
                      selectedRecurrence: findStudyEventsByTopic(
                        topic.topicDetails?.label
                      )?.recurrence?.frequency,

                      selectedTopic: topic._id,
                      selectedStudyEvent: findStudyEventsByTopic(
                        topic.topicDetails?.label
                      )?._id
                    });

                    onOpenCadence();
                  }
                }}
              >
                {studyPlanResources &&
                studyPlanResources[topic.topicDetails?.label]
                  ? `
${findStudyEventsByTopic(topic.topicDetails?.label)?.recurrence?.frequency} 
from  ${moment(
                      findStudyEventsByTopic(topic.topicDetails?.label)
                        ?.startDate
                    ).format('MM.DD.YYYY')} - ${moment(
                      findStudyEventsByTopic(topic.topicDetails?.label)
                        ?.recurrence?.endDate
                    ).format('MM.DD.YYYY')}`
                  : '...'}
              </Badge>

              <Spacer />
              {!isTutor &&
                (user.school ? (
                  <Button
                    size={'sm'}
                    isDisabled={true}
                    onClick={() => {
                      openBountyModal();
                    }}
                  >
                    Book Session
                  </Button>
                ) : (
                  <Button
                    size={'sm'}
                    onClick={() => {
                      updateState({
                        selectedTopic: topic.topicDetails?.label
                      });

                      openBountyModal();
                    }}
                  >
                    Find a tutor
                  </Button>
                ))}
            </Flex>
          </Box>
        </Box>
        {showNoteModal && (
          <SelectedNoteModal
            show={showNoteModal}
            setShow={setShowNoteModal}
            studyPlanId={selectedPlan}
            topicId={topic.topic}
          />
        )}
      </>
    );
  };

  return (
    <>
      {' '}
      <Box>
        <Box mb={6}>
          {groupedTopics &&
            Array.from(groupedTopics)?.map((testTopics) => (
              <>
                {' '}
                <Flex direction="column" gap={2} key={testTopics[0]}>
                  {testTopics[1]?.map((topic) => (
                    <>
                      <TopicCard key={topic._id} topic={topic} />
                    </>
                  ))}
                </Flex>
                <Box
                  bg="#e2e8f0"
                  rounded="md"
                  shadow="md"
                  border="1px dotted #207df7"
                  p={4}
                  my={4}
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Box>
                    <Text fontSize="16px" fontWeight="500" color="gray.700">
                      Test Date:
                    </Text>
                    <Text fontSize="14px" color="gray.600">
                      {testTopics[0]}
                    </Text>
                  </Box>

                  {/* Add any additional content or styling as needed */}
                </Box>
              </>
            ))}
        </Box>
      </Box>
      <Modal
        isOpen={isOpenResource}
        onClose={() => {
          updateState({ topicResource: null });
          onCloseResource();
        }}
        size="3xl"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <HStack>
              <ResourceIcon />
              <Text fontSize="16px" fontWeight="500">
                Extra Resources
              </Text>
            </HStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody overflowY={'auto'} maxH="600px" flexDirection="column">
            <Box
              w="full"
              p={4}
              bg="white"
              borderRadius={10}
              borderWidth="1px"
              borderColor="#EEEFF1"
              justifyContent="center"
              alignItems="center"
              my={4}
            >
              <Text
                color="#6E7682"
                fontSize="12px"
                fontWeight="400"
                wordBreak={'break-word'}
                textTransform="uppercase"
              >
                Lecture
              </Text>

              <Center position="relative" borderRadius={10} my={2}>
                <Box
                  h={{ base: '350px', md: '350px' }}
                  w={{ base: 'full', md: 'full' }}
                >
                  <video
                    title="tutor-video"
                    controls
                    style={{
                      borderRadius: 10,
                      width: '100%',
                      height: '100%'
                    }}
                  >
                    <source
                      src={
                        'https://videos.pexels.com/video-files/5342194/5342194-hd_1920_1080_30fps.mp4'
                      }
                      type="video/mp4"
                    />
                    Your browser does not support the video tag.
                  </video>
                </Box>{' '}
                {/* </AspectRatio> */}
                <Center
                  color="white"
                  display={vidOverlay ? 'flex' : 'none'}
                  position={'absolute'}
                  bg="#0D1926"
                  opacity={'75%'}
                  boxSize="full"
                >
                  <VStack>
                    <BiPlayCircle
                      onClick={() => setVidOverlay(false)}
                      size={'50px'}
                    />
                    <Text display={'inline'}> play video</Text>
                  </VStack>
                </Center>
              </Center>
            </Box>
            {!state.isLoading ? (
              state.topicResource ? (
                <Box w="full">
                  <Flex alignItems={'center'} my={2}>
                    <Text
                      fontSize={'17px'}
                      fontWeight="500"
                      px={1}
                      color="#000"
                    >
                      Summary
                    </Text>
                  </Flex>

                  <Box
                    p={4}
                    maxH="350px"
                    overflowY="auto"
                    // borderWidth="1px"
                    // borderRadius="md"
                    // borderColor="gray.200"
                    // boxShadow="md"
                    className="custom-scroll"
                  >
                    <Text lineHeight="6">
                      {state.topicResource?.completion.choices[0].message.content.replace(
                        /\[.*?\]/g,
                        ''
                      )}
                    </Text>
                  </Box>
                  <Text
                    fontSize={'17px'}
                    fontWeight="500"
                    px={1}
                    color="#000"
                    my={4}
                  >
                    Sources
                  </Text>
                  <SimpleGrid minChildWidth="150px" spacing="10px">
                    {state.topicResource?.search_results
                      .filter((item) => item.title)
                      .map((source, index) => (
                        <a
                          key={index}
                          href={`${source.link}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Box
                            bg="#F3F5F6"
                            p={4}
                            borderRadius="md"
                            boxShadow="md"
                            borderWidth="1px"
                            borderColor="gray.200"
                            cursor="pointer"
                            transition="transform 0.3s"
                            _hover={{ transform: 'scale(1.05)' }}
                          >
                            <Flex direction="column" textAlign="left" gap={2}>
                              <Text fontWeight={600} fontSize="sm">
                                {source.title?.length > 15
                                  ? source.title?.substring(0, 15) + '...'
                                  : source.title}
                              </Text>
                              <Flex alignItems="center">
                                <Text color="gray.500" fontSize="xs">
                                  {source.link?.length > 19
                                    ? source.link?.substring(0, 19) + '...'
                                    : source.link}
                                </Text>
                                <Spacer />
                                <img
                                  className="h-3 w-3"
                                  alt={source.link}
                                  src={`https://www.google.com/s2/favicons?domain=${
                                    source.link
                                  }&sz=${16}`}
                                />
                              </Flex>
                            </Flex>
                          </Box>
                        </a>
                      ))}
                  </SimpleGrid>
                </Box>
              ) : (
                <VStack>
                  <Text>No resource, Please try again</Text>
                  <RepeatIcon
                    boxSize={6}
                    onClick={() => getTopicResource(state.selectedTopic)}
                  />
                </VStack>
              )
            ) : (
              <Spinner />
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
      <Modal isOpen={isOpenCadence} onClose={onCloseCadence} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <HStack>
              <ResourceIcon />
              <Text fontSize="16px" fontWeight="500">
                Set Cadence For your Reminders
              </Text>
            </HStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody overflowY={'auto'} maxH="500px" flexDirection="column">
            <Box width="100%">
              <FormControl id="startDay" marginBottom="20px">
                <FormLabel>Start Date</FormLabel>
                <CalendarDateInput
                  inputProps={{
                    placeholder: 'Select Start Date'
                  }}
                  value={state.recurrenceStartDate}
                  onChange={(newDate) => {
                    updateState({ recurrenceStartDate: newDate });
                  }}
                />{' '}
              </FormControl>
              <FormControl id="recurrenceEndDate" marginBottom="20px">
                <FormLabel>End Date</FormLabel>
                {/* <DatePicker
                  name={'recurrenceEndDate'}
                  placeholder="Select End Date"
                  selected={state.recurrenceEndDate}
                  dateFormat="MM/dd/yyyy"
                  onChange={(newDate) => {
                    updateState({ recurrenceEndDate: newDate });
                  }}
                  minDate={state.recurrenceStartDate}
                /> */}
                <CalendarDateInput
                  inputProps={{
                    placeholder: 'Select End Date'
                  }}
                  value={state.recurrenceEndDate}
                  onChange={(newDate) => {
                    updateState({ recurrenceEndDate: newDate });
                  }}
                />
              </FormControl>
              <FormControl id="frequency" marginBottom="20px">
                <FormLabel>Frequency</FormLabel>
                <Select
                  defaultValue={frequencyOptions.find(
                    (option) => option.value === state.selectedRecurrence
                  )}
                  tagVariant="solid"
                  placeholder="Select Frequency"
                  options={frequencyOptions}
                  size={'md'}
                  onChange={(option) => {
                    updateState({
                      selectedRecurrence: (option as Option).value
                    });
                  }}
                />
              </FormControl>
              <FormControl id="time" marginBottom="20px">
                <FormLabel>Time</FormLabel>
                <TimePicker
                  inputGroupProps={{
                    size: 'lg'
                  }}
                  inputProps={{
                    size: 'md',
                    placeholder: `01:00 PM`
                  }}
                  value={state.selectedRecurrenceTime}
                  onChange={(v) =>
                    updateState({
                      selectedRecurrenceTime: v
                    })
                  }
                />
                {/* <Select
                  defaultValue={timeOptions.find(
                    (option) => option.value === state.selectedRecurrenceTime
                  )}
                  tagVariant="solid"
                  placeholder="Select Time"
                  options={timeOptions}
                  size={'md'}
                  onChange={(option) => {
                    updateState({
                      selectedRecurrenceTime: (option as Option).value
                    });
                  }}
                /> */}
              </FormControl>
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button
              isLoading={state.isLoading}
              onClick={() => handleUpdatePlanCadence()}
            >
              Update
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default Topics;
