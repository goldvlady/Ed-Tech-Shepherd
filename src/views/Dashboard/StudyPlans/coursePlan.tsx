import React, {
  useRef,
  useState,
  ChangeEvent,
  useCallback,
  useEffect
} from 'react';
import axios from 'axios';
import {
  Grid,
  Box,
  Divider,
  Flex,
  Image,
  Link as ChakraLink,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuDivider,
  Text,
  Input,
  Button,
  Heading,
  UnorderedList,
  ListItem,
  Icon,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Spacer,
  List,
  VStack,
  IconButton,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  HStack,
  Alert,
  AlertIcon,
  AlertDescription,
  Badge,
  Modal,
  ModalHeader,
  ModalCloseButton,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalFooter,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Tooltip,
  FormControl,
  FormLabel,
  GridItem,
  Card,
  CardFooter,
  SimpleGrid,
  Spinner
} from '@chakra-ui/react';
import {
  FaPlus,
  FaCheckCircle,
  FaPencilAlt,
  FaRocket,
  FaSuitcase
} from 'react-icons/fa';
import SelectComponent, { Option } from '../../../components/Select';
import { MdInfo, MdOutlineKeyboardArrowDown } from 'react-icons/md';
import { FiChevronDown } from 'react-icons/fi';
import { SiMicrosoftbing, SiWikipedia } from 'react-icons/si';
import { GrResources } from 'react-icons/gr';

import {
  ArrowLeftIcon,
  ChevronDownIcon,
  ChevronRightIcon
} from '@chakra-ui/icons';
import { IoIosArrowRoundBack } from 'react-icons/io';
import SubjectCard from '../../../components/SubjectCard';
import Events from '../../../components/Events';
import ResourceIcon from '../../../assets/resources-plan.svg';
import QuizIcon from '../../../assets/quiz-plan.svg';
import Ribbon from '../../../assets/ribbon-grey.svg';
import EmptyFlashcard from '../../../assets/no-flashcard.svg';
import CloudDay from '../../../assets/day.svg';
import CloudNight from '../../../assets/night.svg';
import Summary from '../../../assets/summary.svg';
import Flash from '../../../assets/flash.svg';
import FlashcardIcon from '../../../assets/flashcard-plan.svg';
import DocChatIcon from '../../../assets/dochat-plan.svg';
import AiTutorIcon from '../../../assets/aitutor-plan.svg';
import studyPlanStore from '../../../state/studyPlanStore';
import resourceStore from '../../../state/resourceStore';
import flashcardStore from '../../../state/flashcardStore';
import { useNavigate, useLocation } from 'react-router';
import { loadStripe } from '@stripe/stripe-js';
import ApiService from '../../../services/ApiService';
import PaymentDialog, {
  PaymentDialogRef
} from '../../../components/PaymentDialog';
import { useCustomToast } from '../../../components/CustomComponents/CustomToast/useCustomToast';
import BountyOfferModal from '../components/BountyOfferModal';
import { async } from '@firebase/util';
import moment from 'moment';
import SelectedNoteModal from '../../../components/SelectedNoteModal';
import CalendarDateInput from '../../../components/CalendarDateInput';
import Select from '../../../components/Select';
import { RxDotFilled } from 'react-icons/rx';
import { numberToDayOfWeekName } from '../../../util';
import DatePicker from '../../../components/DatePicker';
import { parseISO, format, parse } from 'date-fns';
import SciPhiService from '../../../services/SciPhiService'; // SearchRagResponse // SearchRagOptions,

import userStore from '../../../state/userStore';

function CoursePlan() {
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
  // const [selectedTopic, setSelectedTopic] = useState('');
  // const [topics, setTopics] = useState(null);
  // const [selectedPlan, setSelectedPlan] = useState(null);
  // const [planResource, setPlanResource] = useState(null);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(100);
  const btnRef = useRef();
  const location = useLocation();
  const navigate = useNavigate();
  const {
    courses: courseList,
    levels: levelOptions,
    studyPlanCourses
  } = resourceStore();
  const { fetchSingleFlashcard } = flashcardStore();
  const {
    studyPlans,
    fetchPlans,
    fetchPlanResources,
    studyPlanResources,
    fetchPlanReport,
    studyPlanReport,
    fetchUpcomingPlanEvent,
    studyPlanUpcomingEvent
  } = studyPlanStore();
  const { user } = userStore();
  // Combine related state variables into a single state object
  const [state, setState] = useState({
    selectedTopic: '',
    topics: null,
    topicResource: null,
    selectedPlan: null,
    planResource: null,
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

  // Batch state updates
  const updateState = (newState) =>
    setState((prevState) => ({ ...prevState, ...newState }));

  const date = new Date();
  const weekday = numberToDayOfWeekName(date.getDay(), 'dddd');
  const month = moment().format('MMMM');
  const monthday = date.getDate();
  console.log(studyPlanCourses);

  const hours = date.getHours();
  const isDayTime = hours > 6 && hours < 20;
  const frequencyOptions = [
    { label: 'Daily', value: 'daily' },
    { label: 'Weekly', value: 'weekly' },
    { label: 'Monthly', value: 'monthly' },
    { label: "Doesn't Repeat", value: 'none' }
  ];
  const resourceData = [
    {
      title: 'Summary',
      items: [
        {
          title: 'Covalent Bonds',
          link: 'https://www.sciencedirect.com/topics/chemistry/covalent-bond',
          duration: 25
        },
        {
          title: 'Chemical Bonds',
          link: 'https://www.sciencedirect.com/topics/chemistry/covalent-bond',
          duration: 30
        }
      ]
    },
    {
      title: 'Videos',
      items: [
        {
          title: 'Covalent Bonds',
          link: 'https://www.youtube.com/watch?v=h24UmH38_LI&ab_channel=FuseSchool-GlobalEducation',
          duration: 2
        },
        {
          title: 'Chemical Bonds',
          link: 'https://www.sciencedirect.com/topics/chemistry',
          duration: 8
        },
        {
          title: 'What are Covalent Bonds',
          link: 'https://www.sciencedirect.com/topics/chemistry/covalent-bond',
          duration: 9
        }
      ]
    },
    {
      title: 'Podcasts',
      items: [
        {
          title: 'Covalent Bonds',
          link: 'https://www.youtube.com/watch?v=h24UmH38_LI&ab_channel=FuseSchool-GlobalEducation',
          duration: 25
        },
        {
          title: 'Chemical Bonds',
          link: 'https://www.sciencedirect.com/topics/chemistry',
          duration: 48
        },
        {
          title: 'What is Covalence',
          link: 'https://www.sciencedirect.com/topics/chemistry/covalent-bond',
          duration: 4
        }
      ]
    }
  ];

  const toast = useCustomToast();

  const {
    isOpen: isBountyModalOpen,
    onOpen: openBountyModal,
    onClose: closeBountyModal
  } = useDisclosure();
  const paymentDialogRef = useRef<PaymentDialogRef>(null);
  //Payment Method Handlers
  const url: URL = new URL(window.location.href);
  const params: URLSearchParams = url.searchParams;
  const clientSecret = params.get('setup_intent_client_secret');
  const stripePromise = loadStripe(
    process.env.REACT_APP_STRIPE_PUBLIC_KEY as string
  );

  useEffect(() => {
    if (clientSecret) {
      (async () => {
        const stripe = await stripePromise;
        const setupIntent = await stripe?.retrieveSetupIntent(clientSecret);
        await ApiService.addPaymentMethod(
          setupIntent?.setupIntent?.payment_method as string
        );
        // await fetchUser();
        switch (setupIntent?.setupIntent?.status) {
          case 'succeeded':
            toast({
              title: 'Your payment method has been saved.',
              status: 'success',
              position: 'top',
              isClosable: true
            });
            openBountyModal();
            break;
          case 'processing':
            toast({
              title:
                "Processing payment details. We'll update you when processing is complete.",
              status: 'loading',
              position: 'top',
              isClosable: true
            });
            break;
          case 'requires_payment_method':
            toast({
              title:
                'Failed to process payment details. Please try another payment method.',
              status: 'error',
              position: 'top',
              isClosable: true
            });
            break;
          default:
            toast({
              title: 'Something went wrong.',
              status: 'error',
              position: 'top',
              isClosable: true
            });
            break;
        }
        // setSettingUpPaymentMethod(false);
      })();
    }
    /* eslint-disable */
  }, [clientSecret]);

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
  function getIconByDataset(dataset) {
    switch (dataset) {
      case 'Bing Search':
        return <SiMicrosoftbing size={'10px'} />;
      case 'wikipedia':
        return <SiWikipedia />;

      default:
        return <GrResources />;
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

  const handleUpdateTopicStatus = (status, topicId) => {
    // Update the status for the specific topic by topicId
    const updatedTopics = state.topics.map((topic) =>
      topic._id === topicId ? { ...topic, status } : topic
    );

    updateState({ topics: updatedTopics });
  };

  const selectedPlanRef = useRef(null);
  const selectedTopicRef = useRef(null);
  const fetchReportData = async (id) => {
    console.log(id);

    try {
      await fetchPlanReport(state.selectedPlan);
    } catch (error) {
      console.error('Error fetching study plan report:', error);
    }
  };
  const fetchResources = async (id) => {
    try {
      await fetchPlanResources(id);

      updateState({ planResource: studyPlanResources });
    } catch (error) {}
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (state.selectedPlan) {
          const [plansResponse, resourcesResponse, reportResponse] =
            await Promise.all([
              fetchPlans(state.page, state.limit),
              fetchPlanResources(state.selectedPlan),
              fetchPlanReport(state.selectedPlan)
            ]);
          updateState({ planResource: resourcesResponse });
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [state.selectedPlan]);

  function getSubject(id) {
    const labelFromCourseList = courseList
      .map((course) => (course._id === id ? course.label : null))
      .filter((label) => label !== null);

    const labelFromStudyPlanCourses = studyPlanCourses
      .map((course) => (course._id === id ? course.label : null))
      .filter((label) => label !== null);

    const allLabels = [...labelFromCourseList, ...labelFromStudyPlanCourses];

    return allLabels.length > 0 ? allLabels[0] : null;
  }
  useEffect(() => {
    const { pathname } = location;
    const planIdFromURL = pathname.split('planId=')[1];

    if (planIdFromURL) {
      updateState({ selectedPlan: planIdFromURL });
    }
  }, [location.pathname]);

  useEffect(() => {
    if (state.selectedPlan && selectedPlanRef.current) {
      const selectedPlanElement = selectedPlanRef.current;

      const { top, bottom } = selectedPlanElement.getBoundingClientRect();

      // Check if the selected plan is already in view
      if (top >= 0 && bottom <= window.innerHeight) {
        return;
      }

      // Scroll to the selected plan
      selectedPlanElement.scrollIntoView({ behavior: 'smooth' });
    }
  }, [state.selectedPlan]);
  useEffect(() => {
    if (state.selectedTopic && selectedTopicRef.current) {
      const selectedTopicElement = selectedTopicRef.current;

      const { top, bottom } = selectedTopicElement.getBoundingClientRect();

      // Check if the selected Topic is already in view
      if (top >= 0 && bottom <= window.innerHeight) {
        return;
      }

      // Scroll to the selected Topic
      selectedTopicElement.scrollIntoView({ behavior: 'smooth' });
    }
  }, [state.selectedTopic]);
  console.log(state.topicResource);

  const doFetchTopics = useCallback(() => {
    if (state.selectedPlan) {
      const selectedPlanData = studyPlans.find(
        (plan) => plan._id === state.selectedPlan
      );

      if (selectedPlanData) {
        const topics = selectedPlanData;
        updateState({ topics: topics });
        // setTopics(topics);
      }
    }
  }, [state.selectedPlan, studyPlans]);

  useEffect(() => {
    doFetchTopics();
  }, [doFetchTopics]);
  useEffect(() => {
    const events = async () => {
      await fetchUpcomingPlanEvent();
    };
    events();
  }, []);
  console.log(studyPlanReport);

  const clearIdFromURL = () => {
    const { pathname } = location;
    const updatedPathname = pathname.split('planId=')[0];

    navigate(updatedPathname, { replace: true });
  };
  const handlePlanSelection = (planId) => {
    updateState({ selectedPlan: planId });
  };
  const getTopicStatus = (topicId) => {
    const selectedTopic = state.topics.progressLog[0].topicProgress.find(
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

  const timeOptions = Array.from({ length: 96 }, (_, index) => {
    const hour = Math.floor(index / 4);
    const minute = 15 * (index % 4);
    const displayHour = hour === 0 || hour === 12 ? 12 : hour % 12;
    const displayMinute = minute === 0 ? '00' : String(minute);
    const period = hour < 12 ? ' AM' : ' PM';

    const time = `${displayHour}:${displayMinute}${period}`;

    return { label: time, value: time };
  });
  // const doFetchStudyPlans = useCallback(async () => {
  //   await fetchPlans(page, limit);
  //   /* eslint-disable */
  // }, []);
  // useEffect(() => {
  //   doFetchStudyPlans();
  // }, [doFetchStudyPlans]);

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

          fetchResources(state.selectedPlan);
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
  console.log(state.topics?.schedules);
  console.log(studyPlans);

  const saveTopicSummary = async (id: string) => {
    const payload = {
      topicId: id,
      summary: state.topicResource?.response,
      links: [
        {
          url: 'https://www.example.com',
          title: 'Example Title',
          summary: 'An example link related to the topic.'
        },
        {
          url: 'https://www.anotherexample.com',
          title: 'Another Example Title',
          summary: 'Another example link related to the topic.'
        }
      ]
    };
    try {
      const resp = await ApiService.saveTopicSummary(payload);
      if (resp.status === 200) {
        toast({
          title: 'Topic summary saved successfully',
          position: 'top-right',
          status: 'success',
          isClosable: true
        });
      } else {
        toast({
          title: `Couldn't save summary`,
          position: 'top-right',
          status: 'error',
          isClosable: true
        });
      }
    } catch (e) {
      toast({
        title: 'An unknown error occured',
        position: 'top-right',
        status: 'error',
        isClosable: true
      });
    }
  };

  const groupedTopics = state.topics?.schedules.reduce((grouped, topic) => {
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
  return (
    <>
      {' '}
      <Flex
        alignItems={'center'}
        onClick={() => navigate(-1)}
        _hover={{ cursor: 'pointer' }}
      >
        <IoIosArrowRoundBack />
        <Text fontSize={12}>Back</Text>
      </Flex>
      <Grid
        templateColumns={[
          '30% 45% 25%',
          '30% 45% 25%',
          '30% 45% 25%',
          '30% 45% 25%'
        ]}
        h="90vh"
        w="100%"
        maxW="100vw"
        overflowX="hidden"
      >
        <Box
          py={10}
          px={2}
          className="create-syllabus custom-scroll"
          bg="white"
          overflowY="auto"
        >
          <Box borderRadius={8} bg="#F7F7F7" p={18} mb={3}>
            <Box>
              <Text fontWeight="500" fontSize={'16px'}>
                Schedule study session
              </Text>
              <Text fontSize="sm" color="gray.600">
                Choose a study plan for more details
              </Text>
            </Box>
          </Box>

          <Box overflowY="scroll">
            {studyPlans.map((plan) => (
              <Box
                mb={2}
                border={
                  state.selectedPlan === plan._id
                    ? '1px solid #FC9B65'
                    : '1px solid #EAEBEB'
                }
                borderRadius={6}
                p={2}
                m={4}
                key={plan._id}
                onClick={() => {
                  updateState({ topics: plan });

                  fetchPlanResources(plan._id);
                  handlePlanSelection(plan._id);
                }}
                bg={state.selectedPlan === plan.id ? 'orange' : 'white'}
                cursor="pointer"
                ref={plan._id === state.selectedPlan ? selectedPlanRef : null}
              >
                <Flex alignItems="center" fontSize="12px" fontWeight={500}>
                  <Text mb={1}>
                    {plan.title ? plan.title : getSubject(plan.course)}
                  </Text>
                  <Spacer />
                  <Text color="gray.700" fontSize="base" ml={2}>
                    {`${plan.readinessScore}%`}
                  </Text>
                </Flex>{' '}
                <Box
                  bg="gray.200"
                  h="3"
                  rounded="full"
                  w="full"
                  mb={2}
                  overflow="hidden"
                >
                  <Box
                    bg={`green.500`}
                    h="3"
                    rounded="full"
                    width={`${plan.readinessScore}%`}
                  ></Box>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>

        <Box
          p={6}
          className="topics custom-scroll"
          bg="#F9F9FB"
          overflowY="scroll"
        >
          <Tabs variant="soft-rounded" color="#F9F9FB">
            <TabList mb="1em">
              <Tab>Topics</Tab>
              <Tab>Analytics</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Box>
                  <Box mb={6}>
                    {groupedTopics &&
                      Array.from(groupedTopics).map((testTopics) => (
                        <>
                          {' '}
                          <Flex direction="column" gap={2} key={testTopics[0]}>
                            {testTopics[1].map((topic) => (
                              <>
                                <Box
                                  bg="white"
                                  rounded="md"
                                  shadow="md"
                                  key={topic._id}
                                  ref={
                                    topic._id === state.selectedTopic
                                      ? selectedTopicRef
                                      : null
                                  }
                                >
                                  <Flex alignItems={'center'} py={2} px={4}>
                                    {' '}
                                    <Text
                                      fontSize="16px"
                                      fontWeight="500"
                                      mb={2}
                                      color="text.200"
                                    >
                                      {topic.topicDetails.label}
                                    </Text>
                                    <Spacer />
                                    <Badge
                                      variant="subtle"
                                      bgColor={`${getBackgroundColorForStatus(
                                        getTopicStatus(topic.topicDetails._id)
                                      )}`}
                                      color={getColorForStatus(
                                        getTopicStatus(topic.topicDetails._id)
                                      )}
                                      p={1}
                                      letterSpacing="wide"
                                      textTransform="none"
                                      borderRadius={8}
                                    >
                                      {getTopicStatus(topic.topicDetails._id)}
                                    </Badge>
                                  </Flex>
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
                                            <Text
                                              fontSize={12}
                                              fontWeight={500}
                                            >
                                              Quizzes
                                            </Text>
                                          </VStack>
                                        </MenuButton>
                                        <MenuList maxH={60} overflowY="scroll">
                                          {findQuizzesByTopic(
                                            topic.topicDetails.label
                                          ).map((quiz) => (
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
                                          ))}
                                        </MenuList>
                                      </Menu>
                                      <Menu isLazy>
                                        <MenuButton>
                                          {' '}
                                          <VStack>
                                            <FlashcardIcon />
                                            <Text
                                              fontSize={12}
                                              fontWeight={500}
                                            >
                                              Flashcards
                                            </Text>
                                          </VStack>
                                        </MenuButton>
                                        <MenuList maxH={60} overflowY="scroll">
                                          {findFlashcardsByTopic(
                                            topic.topicDetails.label
                                          ).map((flashcard) => (
                                            <>
                                              <MenuItem
                                                key={flashcard.id}
                                                onClick={() =>
                                                  fetchSingleFlashcard(
                                                    flashcard.id
                                                  )
                                                }
                                              >
                                                {flashcard.deckname}
                                              </MenuItem>
                                            </>
                                          ))}
                                        </MenuList>
                                      </Menu>

                                      <VStack
                                        onClick={() =>
                                          navigate(
                                            `/dashboard/ace-homework?subject=${getSubject(
                                              state.topics.course
                                            )}&topic=${
                                              topic.topicDetails.label
                                            }`
                                          )
                                        }
                                      >
                                        <AiTutorIcon />
                                        <Text fontSize={12} fontWeight={500}>
                                          AI Tutor
                                        </Text>
                                      </VStack>
                                      <VStack
                                        onClick={() => setShowNoteModal(true)}
                                      >
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
                                          getTopicResource(
                                            topic.topicDetails.label
                                          );
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
                                                topic.topicDetails.label
                                              )?.startDate
                                            )
                                          });
                                          updateState({
                                            recurrenceStartDate: new Date(
                                              findStudyEventsByTopic(
                                                topic.topicDetails.label
                                              )?.startDate
                                            ),
                                            recurrenceEndDate: new Date(
                                              findStudyEventsByTopic(
                                                topic.topicDetails.label
                                              )?.recurrence?.endDate
                                            ),
                                            selectedTopic: topic._id,
                                            selectedStudyEvent:
                                              findStudyEventsByTopic(
                                                topic.topicDetails.label
                                              )?._id
                                          });

                                          onOpenCadence();
                                        }}
                                      >
                                        {studyPlanResources[
                                          topic.topicDetails.label
                                        ]
                                          ? `
                                        ${
                                          findStudyEventsByTopic(
                                            topic.topicDetails.label
                                          )?.recurrence?.frequency
                                        } 
                                        from  ${moment(
                                          findStudyEventsByTopic(
                                            topic.topicDetails.label
                                          )?.startDate
                                        ).format('MM.DD.YYYY')} - ${moment(
                                              findStudyEventsByTopic(
                                                topic.topicDetails.label
                                              )?.recurrence?.endDate
                                            ).format('MM.DD.YYYY')}`
                                          : '...'}
                                      </Badge>

                                      <Spacer />
                                      <Button
                                        size={'sm'}
                                        my={4}
                                        onClick={() => {
                                          updateState({
                                            selectedTopic:
                                              topic.topicDetails.label
                                          });

                                          openBountyModal();
                                        }}
                                      >
                                        Find a tutor
                                      </Button>
                                    </Flex>
                                  </Box>
                                </Box>
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
                              <Text
                                fontSize="16px"
                                fontWeight="500"
                                color="gray.700"
                              >
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
              </TabPanel>
              <TabPanel>
                <Box>
                  {' '}
                  <Card
                    // height={{ base: 'auto', md: '275px' }}
                    borderRadius={{ base: '5px', md: '10px' }}
                    border="1px solid #eeeff2"
                    position={'relative'}
                    marginBottom={{ base: '26px', md: 'none' }}
                  >
                    {studyPlanReport?.studiedFlashcards > 0 ? (
                      <>
                        <Grid
                          h={{ base: 'auto', md: 'auto' }}
                          px={3}
                          templateRows="repeat(1, 1fr)"
                          templateColumns={{
                            base: 'repeat(1, 1fr)',
                            md: 'repeat(2, 1fr)'
                          }}
                          gap={1}
                        >
                          <GridItem
                            borderBottom={'1px solid #eeeff2'}
                            position="relative"
                            p={2}
                          >
                            <Box>
                              <Text
                                fontSize={{ base: 'md' }}
                                fontWeight={500}
                                color="text.400"
                              >
                                Cards studied
                              </Text>
                              <Text
                                fontSize={{ base: 'xl', md: '2xl' }}
                                fontWeight={600}
                              >
                                {studyPlanReport.studiedFlashcards}
                                <span
                                  style={{
                                    fontSize: 14,
                                    fontWeight: '400',
                                    color: '#6e7682'
                                  }}
                                >
                                  {' '}
                                  cards
                                </span>
                              </Text>
                            </Box>
                          </GridItem>

                          <GridItem
                            borderBottom={'1px solid #eeeff2'}
                            position="relative"
                            p={2}
                          >
                            <Box>
                              <Text
                                fontSize={{ base: 'md' }}
                                fontWeight={500}
                                color="text.400"
                              >
                                Time studied
                              </Text>
                              <Flex gap={1}>
                                <Text
                                  fontSize={{ base: 'xl', md: '2xl' }}
                                  fontWeight={600}
                                >
                                  {studyPlanReport.flashcardStudyDuration}
                                  <span
                                    style={{
                                      fontSize: 12,
                                      fontWeight: '400',
                                      color: '#6e7682'
                                    }}
                                  >
                                    {' '}
                                    hrs
                                  </span>
                                </Text>{' '}
                                <Text
                                  fontSize={{ base: 'xl', md: '2xl' }}
                                  fontWeight={600}
                                >
                                  {/* {
                                  timeStudied(
                                    studentReport.totalWeeklyStudyTime
                                  ).minute
                                } */}
                                  0
                                  <span
                                    style={{
                                      fontSize: 14,
                                      fontWeight: '400',
                                      color: '#6e7682'
                                    }}
                                  >
                                    {' '}
                                    mins
                                  </span>
                                </Text>
                              </Flex>
                            </Box>
                          </GridItem>
                        </Grid>
                        <Grid
                          // h={{ base: 'auto', md: '140px' }}
                          templateRows={{
                            base: 'repeat(2, 1fr)',
                            md: 'repeat(1, 1fr)'
                          }}
                          templateColumns={{
                            base: 'repeat(1, 1fr)',
                            md: 'repeat(2, 1fr)'
                          }}
                          gap={0}
                        >
                          <GridItem rowSpan={1} colSpan={1} p={3}>
                            <Text
                              fontSize={14}
                              fontWeight={500}
                              color="text.400"
                              my={'auto'}
                            >
                              Flashcard performance
                            </Text>
                            <Flex alignItems={'center'} fontSize={12} my={2}>
                              <Box
                                boxSize="12px"
                                bg="#4caf50"
                                borderRadius={'3px'}
                                mr={2}
                              />
                              <Text color="text.300">Got it right</Text>
                              <Spacer />
                              <Text
                                fontWeight={600}
                              >{`${studyPlanReport.passPercentage}%`}</Text>
                            </Flex>
                            <Flex alignItems={'center'} fontSize={12} my={2}>
                              <Box
                                boxSize="12px"
                                bg="#fb8441"
                                borderRadius={'3px'}
                                mr={2}
                              />
                              <Text color="text.300">Didn't remember</Text>
                              <Spacer />
                              <Text
                                fontWeight={600}
                              >{`${studyPlanReport.notRememberedPercentage}%`}</Text>
                            </Flex>
                            <Flex alignItems={'center'} fontSize={12} my={2}>
                              <Box
                                boxSize="12px"
                                bg="red"
                                borderRadius={'3px'}
                                mr={2}
                              />
                              <Text color="text.300">Got it wrong</Text>
                              <Spacer />
                              <Text
                                fontWeight={600}
                              >{`${studyPlanReport.failPercentage}%`}</Text>
                            </Flex>
                          </GridItem>
                          <GridItem
                            rowSpan={1}
                            colSpan={1}
                            position="relative"
                            borderLeft="1px solid #eeeff2"
                            p={3}
                          >
                            <Text
                              fontSize={14}
                              fontWeight={500}
                              color="text.400"
                              my={'auto'}
                            >
                              Quiz performance
                            </Text>
                            <Flex alignItems={'center'} fontSize={12} my={2}>
                              <Box
                                boxSize="12px"
                                bg="#4caf50"
                                borderRadius={'3px'}
                                mr={2}
                              />
                              <Text color="text.300">Got it right</Text>
                              <Spacer />
                              <Text
                                fontWeight={600}
                              >{`${studyPlanReport.passPercentage}%`}</Text>
                            </Flex>
                            <Flex alignItems={'center'} fontSize={12} my={2}>
                              <Box
                                boxSize="12px"
                                bg="#fb8441"
                                borderRadius={'3px'}
                                mr={2}
                              />
                              <Text color="text.300">Didn't remember</Text>
                              <Spacer />
                              <Text
                                fontWeight={600}
                              >{`${studyPlanReport.notRememberedPercentage}%`}</Text>
                            </Flex>
                            <Flex alignItems={'center'} fontSize={12} my={2}>
                              <Box
                                boxSize="12px"
                                bg="red"
                                borderRadius={'3px'}
                                mr={2}
                              />
                              <Text color="text.300">Got it wrong</Text>
                              <Spacer />
                              <Text
                                fontWeight={600}
                              >{`${studyPlanReport.failPercentage}%`}</Text>
                            </Flex>
                          </GridItem>
                        </Grid>
                        <CardFooter
                          bg="#f0f2f4"
                          // h={"45px"}
                          borderBottom="1px solid #eeeff2"
                          borderBottomRadius={'10px'}
                        >
                          {/* <Flex
                            h="16px"
                            alignItems={'center'}
                            gap={1}
                            direction="row"
                          >
                            <Flash />
                            <Text
                              fontSize={14}
                              fontWeight={400}
                              color="text.300"
                            >
                              Current study streak:
                            </Text>
                            <Text fontSize="14px" fontWeight="500" color="#000">
                              0 day
                            </Text>
                          </Flex> */}
                        </CardFooter>
                      </>
                    ) : (
                      <Box textAlign={'center'} px={20} mt={5} py={25}>
                        <VStack spacing={5}>
                          <EmptyFlashcard />
                          <Text fontSize={13} fontWeight={500} color="text.400">
                            Monitor your study plan performance for the week.
                            Start Practicing Today.
                          </Text>
                        </VStack>
                      </Box>
                    )}
                  </Card>
                </Box>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>

        <Box py={8} px={4} className="schedule" bg="white" overflowY="auto">
          <Flex
            color="text.300"
            fontSize={12}
            fontWeight={400}
            alignItems="center"
            height="fit-content"
            justifyContent="right"
          >
            <Box>{isDayTime ? <CloudDay /> : <CloudNight />}</Box>
            <Box mt={1}>
              <RxDotFilled />
            </Box>
            <Text mb={0}>{`${weekday}, ${month} ${monthday}`}</Text>
          </Flex>
          <Box my={4} fontSize={14}>
            <Text fontWeight={500}>Hey {user.name?.first}</Text>
            <Text color={'text.300'} fontSize={13}>
              {` You have
              ${studyPlanUpcomingEvent ? studyPlanUpcomingEvent.length : 0}
              topics to study before your big-day.`}
            </Text>
          </Box>
          <Box mt={4}>
            <Text fontSize={12} p={3}>
              Summary
            </Text>
            <ul className="space-y-3">
              {studyPlanUpcomingEvent?.length > 0 ? (
                studyPlanUpcomingEvent.map((event) => (
                  <li
                    className={`flex gap-x-3 cursor-pointer hover:drop-shadow-sm bg-gray-50`}
                    onClick={() => {
                      updateState({
                        selectedTopic: event.metadata.topicId,
                        selectedPlan: event.entityId
                      });
                    }}
                  >
                    <div
                      className={`min-h-fit w-1 rounded-tr-full rounded-br-full bg-red-500`}
                    />
                    <div className="py-2 w-full">
                      <div className="flex gap-x-1">
                        <div className="min-w-0 flex-auto">
                          <Text className="text-xs font-normal leading-6 text-gray-500">
                            {event.topic.label}
                          </Text>
                          <Flex alignItems={'center'}>
                            <Text className="mt-1 flex items-center truncate text-xs leading-5 text-gray-500">
                              <span>{event.startTime}</span>

                              {/* <>
                                {' '}
                                <ChevronRightIcon className="w-4 h-4" />
                                <span>12:00 PM</span>
                              </> */}
                            </Text>
                          </Flex>
                        </div>
                      </div>
                    </div>
                  </li>
                ))
              ) : (
                <Text fontSize={12} textAlign="center" color={'text.300'}>
                  no upcoming events
                </Text>
              )}
            </ul>
          </Box>
        </Box>
      </Grid>
      <PaymentDialog
        ref={paymentDialogRef}
        prefix={
          <Alert status="info" mb="22px">
            <AlertIcon>
              <MdInfo color={'blue.500'} />
            </AlertIcon>
            <AlertDescription>
              Payment will not be deducted until after your first lesson, You
              may decide to cancel after your initial lesson.
            </AlertDescription>
          </Alert>
        }
      />
      <BountyOfferModal
        isBountyModalOpen={isBountyModalOpen}
        closeBountyModal={closeBountyModal}
        topic={state.selectedTopic}
        subject={state.topics ? `${getSubject(state.topics.course)}` : ''}
        // level={level.label || someBountyOpt?.level}
        // description={description}
      />
      {showNoteModal && (
        <SelectedNoteModal show={showNoteModal} setShow={setShowNoteModal} />
      )}
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
                    {' '}
                    <Text
                      fontSize={'17px'}
                      fontWeight="500"
                      px={1}
                      color="#000"
                    >
                      Summary
                    </Text>
                    <Spacer />{' '}
                    <Button
                      variant="outline"
                      color={'#585F68'}
                      size="sm"
                      // bgColor={checkBookmarks() ? '#F0F6FE' : '#fff'}
                      border="1px solid #E7E8E9"
                      borderRadius="6px"
                      fontSize="12px"
                      leftIcon={<Ribbon />}
                      // p={'2px 24px'}
                      display="flex"
                      _hover={{
                        boxShadow: 'lg',
                        transform: 'translateY(-2px)'
                      }}
                      disabled={user === null}
                      style={{ pointerEvents: user ? 'auto' : 'none' }}
                      onClick={() => saveTopicSummary(state.selectedTopic)}
                    >
                      Save
                    </Button>
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
                <DatePicker
                  name={'recurrenceStartDate'}
                  placeholder="Select Start Date"
                  selected={state.recurrenceStartDate}
                  dateFormat="MM/dd/yyyy"
                  onChange={(newDate) => {
                    updateState({ recurrenceStartDate: newDate });
                  }}
                  minDate={new Date()}
                />
              </FormControl>
              <FormControl id="recurrenceEndDate" marginBottom="20px">
                <FormLabel>End Date</FormLabel>
                <DatePicker
                  name={'recurrenceEndDate'}
                  placeholder="Select End Date"
                  selected={state.recurrenceEndDate}
                  dateFormat="MM/dd/yyyy"
                  onChange={(newDate) => {
                    updateState({ recurrenceEndDate: newDate });
                  }}
                  minDate={state.recurrenceStartDate}
                />
              </FormControl>
              <FormControl id="frequency" marginBottom="20px">
                <FormLabel>Frequency</FormLabel>
                <Select
                  defaultValue={frequencyOptions.find(
                    (option) => option.value === state.selectedRecurrence
                  )}
                  tagVariant="solid"
                  placeholder="Select Time"
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

export default CoursePlan;
