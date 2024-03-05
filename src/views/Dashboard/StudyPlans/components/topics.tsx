import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router';
import {
  Badge,
  Box,
  Button,
  Divider,
  Flex,
  Text,
  Menu,
  MenuItem,
  MenuList,
  MenuButton,
  Spacer,
  VStack,
  HStack,
  useDisclosure,
  UnorderedList,
  ListItem
} from '@chakra-ui/react';
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
import { SmallCloseIcon } from '@chakra-ui/icons';

function Topics(props) {
  const { planTopics } = props;
  const { studyPlanResources, isLoading: studyPlanStoreLoading } =
    studyPlanStore();
  const { fetchSingleFlashcard } = flashcardStore();
  const {
    courses: courseList,
    levels: levelOptions,
    studyPlanCourses
  } = resourceStore();
  const [showNoteModal, setShowNoteModal] = useState(false);

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
      testDate = new Date(topic.topicMetaData[0].testDate).toDateString();
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

  const TopicCard = ({ topic }) => {
    const [isCollapsed, setIsCollapsed] = useState(true); // Initialize isCollapsed state for each topic card

    const toggleCollapse = () => {
      setIsCollapsed(!isCollapsed);
    };

    return (
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
                  findQuizzesByTopic(topic.topicDetails?.label)?.map((quiz) => (
                    <>
                      <MenuItem
                        key={quiz.id}
                        onClick={() =>
                          navigate(`/dashboard/quizzes/take?quiz_id=${quiz.id}`)
                        }
                      >
                        {quiz.title}
                      </MenuItem>
                    </>
                  ))}
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

            <VStack
              onClick={() =>
                navigate(
                  `/dashboard/ace-homework?subject=${getSubject(
                    planTopics.course
                  )}&topic=${topic.topicDetails?.label}`
                )
              }
            >
              <AiTutorIcon />
              <Text fontSize={12} fontWeight={500}>
                AI Tutor
              </Text>
            </VStack>
            <VStack onClick={() => setShowNoteModal(true)}>
              <DocChatIcon />
              <Text fontSize={12} fontWeight={500}>
                Doc Chat
              </Text>
            </VStack>
            <VStack
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
                    findStudyEventsByTopic(topic.topicDetails?.label)?.startDate
                  )
                });
                updateState({
                  recurrenceStartDate: new Date(
                    findStudyEventsByTopic(topic.topicDetails?.label)?.startDate
                  ),
                  recurrenceEndDate: new Date(
                    findStudyEventsByTopic(
                      topic.topicDetails?.label
                    )?.recurrence?.endDate
                  ),
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
                    findStudyEventsByTopic(topic.topicDetails?.label)?.startDate
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
    );
  };

  return (
    <>
      {' '}
      <Box>
        <Box mb={6}>
          {groupedTopics &&
            Array.from(groupedTopics).map((testTopics) => (
              <>
                {' '}
                <Flex direction="column" gap={2} key={testTopics[0]}>
                  {testTopics[1].map((topic) => (
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
    </>
  );
}

export default Topics;
