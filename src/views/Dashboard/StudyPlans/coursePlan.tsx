import React, {
  useRef,
  useState,
  ChangeEvent,
  useCallback,
  useEffect
} from 'react';
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
  CardFooter
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
  const [selectedTopic, setSelectedTopic] = useState('');
  const [topics, setTopics] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [planResource, setPlanResource] = useState(null);
  const [showSubjects, setShowSubjects] = useState(false);
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
  const [selectedStatus, setSelectedStatus] = useState('To Do');
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [selectedRecurrence, setSelectedRecurrence] = useState('daily');
  const [selectedRecurrenceTime, setSelectedRecurrenceTime] = useState(null);
  const [recurrenceStartDate, setRecurrenceStartDate] = useState(new Date());
  const [recurrenceEndDate, setRecurrenceEndDate] = useState(new Date());
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
      title: 'Articles',
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

  const setupPaymentMethod = async () => {
    try {
      const paymentIntent = await ApiService.createStripeSetupPaymentIntent();

      const { data } = await paymentIntent.json();

      paymentDialogRef.current?.startPayment(
        data.clientSecret,
        `${window.location.href}`
      );
    } catch (error) {
      // console.log(error);
    }
  };

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
    const updatedTopics = topics.map((topic) =>
      topic._id === topicId ? { ...topic, status } : topic
    );

    setTopics(updatedTopics);
  };

  const selectedPlanRef = useRef(null);
  const fetchReportData = async (id) => {
    console.log(id);

    try {
      await fetchPlanReport(selectedPlan);
    } catch (error) {
      console.error('Error fetching study plan report:', error);
    }
  };
  const fetchResources = async (id) => {
    try {
      const response = await fetchPlanResources(id);

      setPlanResource(response);
    } catch (error) {}
  };
  useEffect(() => {
    if (selectedPlan) {
      fetchResources(selectedPlan);
      fetchReportData(selectedPlan);
    }
  }, [selectedPlan]);
  // useEffect(() => {
  //   const fetchReportData = async (id) => {
  //     console.log(id);

  //     try {
  //       await fetchPlanReport(selectedPlan);
  //     } catch (error) {
  //       console.error('Error fetching study plan report:', error);
  //     }
  //   };
  //   fetchReportData(selectedPlan);
  // }, [fetchPlanReport, selectedPlan]);
  console.log(studyPlanReport);
  console.log(selectedPlan);

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
      setSelectedPlan(planIdFromURL);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (selectedPlan && selectedPlanRef.current) {
      const selectedPlanElement = selectedPlanRef.current;

      const { top, bottom } = selectedPlanElement.getBoundingClientRect();

      // Check if the selected plan is already in view
      if (top >= 0 && bottom <= window.innerHeight) {
        return;
      }

      // Scroll to the selected plan
      selectedPlanElement.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedPlan]);

  const doFetchTopics = useCallback(() => {
    if (selectedPlan) {
      const selectedPlanData = studyPlans.find(
        (plan) => plan._id === selectedPlan
      );

      if (selectedPlanData) {
        const topics = selectedPlanData;
        setTopics(topics);
      }
    }
  }, [selectedPlan, studyPlans]);

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
    setSelectedPlan(planId);
  };
  const getTopicStatus = (topicId) => {
    const selectedTopic = topics.progressLog[0].topicProgress.find(
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
    const payload = {
      entityId: selectedPlan,
      entityType: 'studyPlan',
      startTime: selectedRecurrenceTime,
      metadata: {
        additionalInfo: 'Some extra information about the study plan'
      },
      startDates: [moment(recurrenceStartDate).format('YYYY-MM-DD')],
      recurrence: {
        frequency: selectedRecurrence,
        endDate: moment(recurrenceEndDate).format('YYYY-MM-DD')
      }
    };
    console.log(payload);
    try {
      const resp = await ApiService.rescheduleStudyEvent(payload);
      if (resp) {
        const response = await resp.json();
        if (resp.status === 201) {
          // setIsCompleted(true);
          // setLoading(false);
          toast({
            title: 'Updated Successfully',
            position: 'top-right',
            status: 'success',
            isClosable: true
          });
          onCloseCadence();
        } else {
          // setLoading(false);
          toast({
            title: 'Failed to update, try again',
            position: 'top-right',
            status: 'error',
            isClosable: true
          });
        }
      }
    } catch (error: any) {
      // setLoading(false);
      return { error: error.message, message: error.message };
    }
  };
  console.log(topics?.schedules);

  const groupedTopics = topics?.schedules.reduce((grouped, topic) => {
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
                  selectedPlan === plan._id
                    ? '1px solid #FC9B65'
                    : '1px solid #EAEBEB'
                }
                borderRadius={6}
                p={2}
                m={4}
                key={plan._id}
                onClick={() => {
                  setTopics(plan);
                  handlePlanSelection(plan._id);
                }}
                bg={selectedPlan === plan.id ? 'orange' : 'white'}
                cursor="pointer"
                ref={plan._id === selectedPlan ? selectedPlanRef : null}
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
          <Tabs colorScheme={'blue.400'}>
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
                                              topics.course
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
                                      <VStack onClick={onOpenResource}>
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
                                        // onClick={() => {
                                        //   setRecurrenceStartDate(
                                        //     new Date(topic.startDate)
                                        //   );
                                        //   setRecurrenceEndDate(
                                        //     new Date(topic.endDate)
                                        //   );
                                        //   onOpenCadence();
                                        // }}
                                      >
                                        Daily from
                                        {`
                                  ${moment(topic.startDate).format(
                                    'MM.DD.YYYY'
                                  )} - ${moment(topic.endDate).format(
                                          'MM.DD.YYYY'
                                        )}`}
                                      </Badge>

                                      <Spacer />
                                      <Button
                                        size={'sm'}
                                        my={4}
                                        onClick={() => {
                                          setSelectedTopic(
                                            topic.topicDetails.label
                                          );
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
          <Box my={4} fontSize={12}>
            <Text>Hey {user.name?.first}</Text>
            <Text color={'text.300'}>
              {` You have
              ${studyPlanUpcomingEvent ? studyPlanUpcomingEvent.length : 0}
              topics to study before your big-day.`}
            </Text>
          </Box>
          <Box mt={4}>
            <Text fontSize={12} p={3}>
              Summary
            </Text>

            {studyPlanUpcomingEvent?.length > 0 ? (
              studyPlanUpcomingEvent.map((event) => (
                <ul className="space-y-3">
                  <li
                    className={`flex gap-x-3 cursor-pointer hover:drop-shadow-sm bg-gray-50`}
                  >
                    <div
                      className={`min-h-fit w-1 rounded-tr-full rounded-br-full bg-red-500`}
                    />
                    <div className="py-2 w-full">
                      <div className="flex gap-x-1">
                        <div className="min-w-0 flex-auto">
                          <Text className="text-xs font-normal leading-6 text-gray-500">
                            Chemical Bonding
                          </Text>
                          <Flex alignItems={'center'}>
                            <Text className="mt-1 flex items-center truncate text-xs leading-5 text-gray-500">
                              <span>11:00 AM</span>

                              <>
                                {' '}
                                <ChevronRightIcon className="w-4 h-4" />
                                <span>12:00 PM</span>
                              </>
                            </Text>
                          </Flex>
                        </div>
                      </div>
                    </div>
                  </li>
                </ul>
              ))
            ) : (
              <Text fontSize={12} textAlign="center" color={'text.300'}>
                no upcoming events
              </Text>
            )}
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
        topic={selectedTopic}
        subject={topics ? `${getSubject(topics.course)}` : ''}
        // level={level.label || someBountyOpt?.level}
        // description={description}
      />
      {showNoteModal && (
        <SelectedNoteModal show={showNoteModal} setShow={setShowNoteModal} />
      )}
      <Modal isOpen={isOpenResource} onClose={onCloseResource} size="3xl">
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
            <Flex w="full" direction={'column'} gap={6}>
              {resourceData.map((table, index) => (
                <TableContainer key={index}>
                  <Text
                    fontSize={'17px'}
                    fontWeight="500"
                    px={4}
                    py={2}
                    color="#000"
                  >
                    {table.title}
                  </Text>
                  <Box
                    border={'2px solid #f9fbf9'}
                    borderRadius={8}
                    dropShadow="md"
                  >
                    <Table variant="striped" colorScheme="gray">
                      <Thead>
                        <Tr>
                          <Th>Title</Th>
                          <Th>Link</Th>
                          <Th isNumeric>Duration</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {table.items.map((item, itemIndex) => (
                          <Tr key={itemIndex}>
                            <Td>{item.title}</Td>
                            <Td>
                              <Tooltip
                                label={item.link}
                                hasArrow
                                placement="top"
                              >
                                <ChakraLink
                                  href={item.link}
                                  isExternal
                                  color={'#4d8df9'}
                                >
                                  {item.link.length > 40
                                    ? `${item.link.slice(0, 40)}...`
                                    : item.link}
                                </ChakraLink>
                              </Tooltip>
                            </Td>
                            <Td isNumeric>{item.duration} mins</Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </Box>
                </TableContainer>
              ))}
            </Flex>
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
                  selected={recurrenceStartDate}
                  dateFormat="MM/dd/yyyy"
                  onChange={(newDate) => {
                    setRecurrenceStartDate(newDate);
                  }}
                  minDate={new Date()}
                />
              </FormControl>
              <FormControl id="recurrenceEndDate" marginBottom="20px">
                <FormLabel>End Date</FormLabel>
                <DatePicker
                  name={'recurrenceEndDate'}
                  placeholder="Select End Date"
                  selected={recurrenceEndDate}
                  dateFormat="MM/dd/yyyy"
                  onChange={(newDate) => {
                    setRecurrenceEndDate(newDate);
                  }}
                  minDate={recurrenceStartDate}
                />
              </FormControl>
              <FormControl id="frequency" marginBottom="20px">
                <FormLabel>Frequency</FormLabel>
                <Select
                  defaultValue={frequencyOptions.find(
                    (option) => option.value === selectedRecurrence
                  )}
                  tagVariant="solid"
                  placeholder="Select Time"
                  options={frequencyOptions}
                  size={'md'}
                  onChange={(option) =>
                    setSelectedRecurrence((option as Option).value)
                  }
                />
              </FormControl>
              <FormControl id="time" marginBottom="20px">
                <FormLabel>Time</FormLabel>
                <Select
                  defaultValue={timeOptions.find(
                    (option) => option.value === selectedRecurrenceTime
                  )}
                  tagVariant="solid"
                  placeholder="Select Time"
                  options={timeOptions}
                  size={'md'}
                  onChange={(option) =>
                    setSelectedRecurrenceTime((option as Option).value)
                  }
                />
              </FormControl>
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button onClick={() => handleUpdatePlanCadence()}>Update</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default CoursePlan;
