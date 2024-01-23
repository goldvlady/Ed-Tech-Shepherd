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
  FormLabel
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
import { ArrowLeftIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { IoIosArrowRoundBack } from 'react-icons/io';
import SubjectCard from '../../../components/SubjectCard';
import Events from '../../../components/Events';
import ResourceIcon from '../../../assets/resources-plan.svg';
import QuizIcon from '../../../assets/quiz-plan.svg';
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
  const { courses: courseList, levels: levelOptions } = resourceStore();
  const { fetchSingleFlashcard } = flashcardStore();
  const { studyPlans, fetchPlans, fetchPlanResources, studyPlanResources } =
    studyPlanStore();

  const [selectedStatus, setSelectedStatus] = useState('To Do');
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [selectedRecurrence, setSelectedRecurrence] = useState('daily');
  const [selectedRecurrenceTime, setSelectedRecurrenceTime] = useState(null);
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

  const handleUpdateTopicStatus = (status, topicId) => {
    // Update the status for the specific topic by topicId
    const updatedTopics = topics.map((topic) =>
      topic._id === topicId ? { ...topic, status } : topic
    );

    setTopics(updatedTopics);
  };

  const selectedPlanRef = useRef(null);
  const fetchResources = async (id) => {
    try {
      const response = await fetchPlanResources(id);

      setPlanResource(response);
    } catch (error) {}
  };
  useEffect(() => {
    if (selectedPlan) {
      fetchResources(selectedPlan);
    }
  }, [selectedPlan]);

  function getSubject(id) {
    const filteredSubjects = courseList
      .map((course) => (course._id === id ? course.label : null))
      .filter((label) => label !== null);

    return filteredSubjects.length > 0 ? filteredSubjects[0] : null;
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
  return (
    <>
      {' '}
      <Flex
        alignItems={'center'}
        onClick={() => navigate('/dashboard/study-plans')}
        _hover={{ cursor: 'pointer' }}
      >
        <IoIosArrowRoundBack />
        <Text fontSize={12}>Back</Text>
      </Flex>
      <Grid
        templateColumns={[
          '35% 45% 20%',
          '35% 45% 20%',
          '35% 45% 20%',
          '35% 45% 20%'
        ]}
        h="90vh"
        w="100%"
        maxW="100vw"
        overflowX="hidden"
      >
        <Box
          py={10}
          px={4}
          className="create-syllabus"
          bg="white"
          overflowY="auto"
        >
          <Box borderRadius={8} bg="#F7F7F7" p={18} mb={3}>
            <Box>
              <Text fontWeight="500" fontSize={'16px'}>
                Schedule study session
              </Text>
              <Text fontSize="sm" color="gray.600">
                Set your preferred study plan to meet your goal
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
                  <Text mb={1}>{getSubject(plan.course)}</Text>
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

        <Box p={6} className="topics" bg="#F9F9FB" overflowY="scroll">
          <Tabs colorScheme={'blue.400'}>
            <TabList mb="1em">
              <Tab>Topics</Tab>
              <Tab>Analytics</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Box>
                  <Box mb={6}>
                    <Flex direction="column" gap={2}>
                      {topics &&
                        topics.schedules.map((topic) => (
                          <>
                            {' '}
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
                                <Menu>
                                  <MenuButton
                                    as={Button}
                                    rightIcon={<FiChevronDown />}
                                    bg="#f1f9f1"
                                    color={'#4CAF50'}
                                    _hover={{ bg: '#f1f9f1' }}
                                    px={2}
                                    size="xs"
                                  >
                                    {/* {topic.status == 'notStarted'
                                    ? 'To Do'
                                    : topic.status} */}
                                    {getTopicStatus(topic.topicDetails._id)}
                                  </MenuButton>
                                  <MenuList>
                                    <MenuItem
                                      onClick={() =>
                                        handleUpdateTopicStatus(
                                          'Done',
                                          topic._id
                                        )
                                      }
                                    >
                                      Done
                                    </MenuItem>
                                    <MenuItem
                                      onClick={() =>
                                        handleUpdateTopicStatus(
                                          'In progress',
                                          topic._id
                                        )
                                      }
                                    >
                                      In progress
                                    </MenuItem>
                                    <MenuItem
                                      onClick={() =>
                                        handleUpdateTopicStatus(
                                          'notStarted',
                                          topic._id
                                        )
                                      }
                                    >
                                      To Do
                                    </MenuItem>
                                  </MenuList>
                                </Menu>
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
                                        <Text fontSize={12} fontWeight={500}>
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
                                        <Text fontSize={12} fontWeight={500}>
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
                                              fetchSingleFlashcard(flashcard.id)
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
                                      navigate(`/dashboard/ace-homework`)
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
                                <Flex alignItems={'center'} px={3}>
                                  <Badge
                                    variant="subtle"
                                    colorScheme="blue"
                                    p={1}
                                    letterSpacing="wide"
                                    textTransform="none"
                                    borderRadius={8}
                                    onClick={onOpenCadence}
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
                                    m={4}
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
                  </Box>
                </Box>
              </TabPanel>
              <TabPanel>
                <p>Study Plan!</p>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>

        <Box py={8} className="schedule" bg="white" overflowY="auto">
          {/* <Events key={2} event={} /> */}
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
            <Box width="100%" paddingBottom={'50px'}>
              <FormControl id="day" marginBottom="20px">
                <FormLabel>Start Date</FormLabel>
                <CalendarDateInput
                  // disabledDate={{ before: today }}
                  inputProps={{
                    placeholder: 'Select Day'
                  }}
                  value={new Date()}
                  onChange={() => console.log('date')}
                />
              </FormControl>
              <FormControl id="day" marginBottom="20px">
                <FormLabel>End Date</FormLabel>
                <CalendarDateInput
                  // disabledDate={{ before: today }}
                  inputProps={{
                    placeholder: 'Select Day'
                  }}
                  value={new Date()}
                  onChange={() => console.log('date')}
                />
              </FormControl>
              <FormControl id="time" marginBottom="20px">
                <FormLabel>Frequency</FormLabel>
                <Select
                  defaultValue={frequencyOptions.find(
                    (option) => option.value === selectedRecurrence
                  )}
                  tagVariant="solid"
                  placeholder="Select Time"
                  options={frequencyOptions}
                  size={'md'}
                  onChange={(option) => console.log((option as Option).value)}
                />
              </FormControl>
              <FormControl id="time" marginBottom="20px">
                <FormLabel>Time</FormLabel>
                <Select
                  defaultValue={timeOptions.find(
                    (option) => option.value === selectedRecurrence
                  )}
                  tagVariant="solid"
                  placeholder="Select Time"
                  options={timeOptions}
                  size={'md'}
                  onChange={(option) => console.log((option as Option).value)}
                />
              </FormControl>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

export default CoursePlan;
