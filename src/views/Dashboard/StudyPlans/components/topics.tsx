import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router';
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
  Icon
} from '@chakra-ui/react';
import useInitializeAIChat from '../hooks/useInitializeAITutor';
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
import { AiOutlineDown, AiOutlineUp } from 'react-icons/ai'; // Import dropdown icons
import { HiChevronDown, HiChevronUp } from 'react-icons/hi';
import { parseISO, format, parse } from 'date-fns';
import { SmallCloseIcon } from '@chakra-ui/icons';
import DatePicker from '../../../../components/DatePicker';
import Select, { Option } from '../../../../components/Select';
import CalendarDateInput from '../../../../components/CalendarDateInput';
import ApiService from '../../../../services/ApiService';
import SelectedNoteModal from '../../../../components/SelectedNoteModal';
import useStoreConversationIdToStudyPlan from '../hooks/useStoreConversationIdToStudyPlan';
import { FaPlus } from 'react-icons/fa';

function Topics(props) {
  const { planTopics, selectedPlan } = props;
  const {
    fetchPlanResources,
    studyPlanResources,
    isLoading: studyPlanStoreLoading
  } = studyPlanStore();
  const { user } = useUserStore();
  const { fetchSingleFlashcard } = flashcardStore();
  const {
    courses: courseList,
    levels: levelOptions,
    studyPlanCourses
  } = resourceStore();

  const [convoId, setConvoId] = useState(null);
  const [hasConversationId, setHasConversationId] = useState(false);
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

  const updateState = (newState) =>
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

  console.log(groupedTopics);

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
    const selectedTopic = planTopics.progressLog[0].topicProgress.find(
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
  const getTopicResource = async (topic: string) => {
    updateState({ isLoading: true });
    try {
      // Instantiate SciPhiService
      const sciPhiService = new SciPhiService();

      // Define search options
      const searchOptions = {
        query: topic
      };

      // Call searchRag method
      const response = await sciPhiService.searchRag(searchOptions);
      if (response) {
        updateState({ isLoading: false, topicResource: response });
      }
    } catch (error) {
      updateState({ isLoading: false });
      console.error('Error searching topic:', error);
    }
  };

  const findQuizzesByTopic = (topic) => {
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
  };

  const findDocumentsByTopic = (topic) => {
    if (studyPlanResources[topic] && studyPlanResources[topic].documents) {
      return studyPlanResources[topic].documents;
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
    console.log(payload);
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
            console.log('Metadata saved:', data);
          }
        } catch (error) {
          console.error('Error saving metadata:', error);
        }
      },
      [topic]
    );

    const initializeAItutor = useInitializeAIChat('homework-help', {
      navigateOnInitialized: true,
      onInitialized: saveStudyPlanMetaData
    });
    const handleAiTutor = () => {
      const convoId = topic.topicMetaData[0]?.conversationId;
      if (convoId) {
        navigate(`/dashboard/ace-homework/${convoId}`);
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
                  {studyPlanResources &&
                    findQuizzesByTopic(topic.topicDetails?.label)?.map(
                      (quiz) => (
                        <>
                          <MenuItem
                            key={quiz.id}
                            onClick={() =>
                              navigate(
                                `/dashboard/quizzes/take?quiz_id=${quiz.id}`
                              )
                            }
                          >
                            {quiz.title}
                          </MenuItem>
                        </>
                      )
                    )}
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
                  {studyPlanResources &&
                    findFlashcardsByTopic(topic.topicDetails?.label).map(
                      (flashcard) => (
                        <>
                          <MenuItem
                            key={flashcard.id}
                            onClick={() => fetchSingleFlashcard(flashcard.id)}
                          >
                            {flashcard.deckname}
                          </MenuItem>
                        </>
                      )
                    )}
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
                    setInitializing(true);
                    handleAiTutor();
                  }}
                >
                  <AiTutorIcon />
                  <Text fontSize={12} fontWeight={500}>
                    AI Tutor
                  </Text>
                </VStack>
              )}

              <Menu isLazy>
                <MenuButton>
                  {' '}
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
                      {findDocumentsByTopic(topic.topicDetails?.label)?.map(
                        (doc, index) => (
                          <MenuItem
                            key={index}
                            _hover={{ bg: 'gray.100' }}
                            fontSize={12}
                            onClick={() =>
                              navigate(
                                `/dashboard/docchat?documentUrl=${doc.documentUrl}`
                              )
                            }
                          >
                            {doc.title?.replace(/%20%26|%20|%2F/g, (match) => {
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
                            })}
                          </MenuItem>
                        )
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
              <VStack
                cursor={'pointer'}
                onClick={() => {
                  updateState({
                    selectedTopic: topic._id
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
            <Flex alignItems={'center'} px={4}>
              <Badge
                variant="subtle"
                colorScheme="blue"
                p={1}
                letterSpacing="wide"
                textTransform="none"
                borderRadius={8}
                cursor={'grab'}
                onClick={() => {
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
              <Button
                size={'sm'}
                my={4}
                onClick={() => {
                  updateState({
                    selectedTopic: topic.topicDetails?.label
                  });

                  openBountyModal();
                }}
              >
                Find a tutor
              </Button>
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
          <ModalBody overflowY={'auto'} maxH="500px" flexDirection="column">
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
                    <Text lineHeight="6">{state.topicResource?.response}</Text>
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
                    {state.topicResource?.search_results.map(
                      (source, index) => (
                        <a
                          key={index}
                          href={`${source.url}`}
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
                                {source.title.length > 15
                                  ? source.title.substring(0, 15) + '...'
                                  : source.title}
                              </Text>
                              <Flex alignItems="center">
                                <Text color="gray.500" fontSize="xs">
                                  {source.url.length > 19
                                    ? source.url.substring(0, 19) + '...'
                                    : source.url}
                                </Text>
                                <Spacer />
                                <img
                                  className="h-3 w-3"
                                  alt={source.url}
                                  src={`https://www.google.com/s2/favicons?domain=${
                                    source.url
                                  }&sz=${16}`}
                                />
                              </Flex>
                            </Flex>
                          </Box>
                        </a>
                      )
                    )}
                  </SimpleGrid>
                </Box>
              ) : (
                'No resource'
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
                <Select
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
                />
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
