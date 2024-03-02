import React, {
  useRef,
  useState,
  ChangeEvent,
  useCallback,
  useEffect,
  useMemo
} from 'react';
import axios from 'axios';
import {
  Grid,
  Box,
  Divider,
  Flex,
  Image,
  Link as ChakraLink,
  Text,
  Input,
  Button,
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
  FormControl,
  FormLabel,
  SimpleGrid,
  Spinner,
  Center
} from '@chakra-ui/react';

import SelectComponent, { Option } from '../../../components/Select';
import { MdInfo, MdOutlineKeyboardArrowDown } from 'react-icons/md';
import ResourceIcon from '../../../assets/resources-plan.svg';
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
import StudyPlanSummary from './components/summary';
import userStore from '../../../state/userStore';
import ShepherdSpinner from '../components/shepherd-spinner';
import Analytics from './components/analytics';
import Topics from './components/topics';

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
  const [showNoteModal, setShowNoteModal] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const {
    courses: courseList,
    levels: levelOptions,
    studyPlanCourses
  } = resourceStore();
  const {
    studyPlans: storePlans,
    fetchPlans,
    fetchPlanResources,
    studyPlanResources,
    fetchPlanReport,
    studyPlanReport,
    fetchUpcomingPlanEvent,
    studyPlanUpcomingEvent,
    isLoading: studyPlanStoreLoading
  } = studyPlanStore();
  const { user } = userStore();
  const plansFromStorage = sessionStorage.getItem('studyPlans');
  const storedStudyPlans = plansFromStorage ? JSON.parse(plansFromStorage) : [];

  // Combine related state variables into a single state object
  const [state, setState] = useState({
    studyPlans: storePlans,
    isPageLoading: false,
    selectedTopic: '',
    topics: null,
    topicResource: null,
    selectedPlan: null,
    planResource: studyPlanResources,
    planReport: studyPlanReport,
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
  const frequencyOptions = [
    { label: 'Daily', value: 'daily' },
    { label: 'Weekly', value: 'weekly' },
    { label: 'Monthly', value: 'monthly' },
    { label: "Doesn't Repeat", value: 'none' }
  ];

  // const handleUpdateTopicStatus = (status, topicId) => {
  //   // Update the status for the specific topic by topicId
  //   const updatedTopics = state.topics.map((topic) =>
  //     topic._id === topicId ? { ...topic, status } : topic
  //   );

  //   updateState({ topics: updatedTopics });
  // };

  const selectedPlanRef = useRef(null);
  const selectedTopicRef = useRef(null);

  const fetchResources = async (id) => {
    try {
      await fetchPlanResources(id);

      updateState({ planResource: studyPlanResources });
    } catch (error) {}
  };

  useEffect(() => {
    // Fetch plans only if session storage is empty
    if (state.studyPlans.length === 0) {
      const fetchData = async () => {
        try {
          await fetchPlans(state.page, state.limit);
          updateState({ studyPlans: storePlans });
          console.log(storePlans);

          // Update session storage only if storePlans are different from the plans in storage
          if (JSON.stringify(storePlans) !== plansFromStorage) {
            sessionStorage.setItem('studyPlans', JSON.stringify(storePlans));
          }
        } catch (error) {
          console.error('Error fetching plans:', error);
        }
      };

      fetchData();
    }
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      updateState({ isPageLoading: true });
      try {
        if (state.selectedPlan) {
          const [resourcesResponse, reportResponse] = await Promise.all([
            // fetchPlans(state.page, state.limit),
            fetchPlanResources(state.selectedPlan),
            fetchPlanReport(state.selectedPlan)
          ]);
          updateState({
            planResource: studyPlanResources,
            planReport: studyPlanReport
          });
          updateState({ isPageLoading: false });
        }
      } catch (error) {}
    };
    fetchData();
  }, [state.selectedPlan]);
  console.log(state.studyPlans);
  console.log(state.topics);
  console.log(storePlans);

  useEffect(() => {
    sessionStorage.setItem('studyPlans', JSON.stringify(state.studyPlans));
  }, [state.studyPlans]);

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
  console.log(state.topics);

  const doFetchTopics = useCallback(async () => {
    if (state.selectedPlan) {
      const selectedPlanData = await storePlans.find(
        (plan) => plan._id === state.selectedPlan
      );

      updateState({ topics: selectedPlanData });
    }
  }, [state.selectedPlan, storePlans]);

  useEffect(() => {
    doFetchTopics();
  }, [doFetchTopics]);
  useEffect(() => {
    const events = async () => {
      await fetchUpcomingPlanEvent();
    };
    events();
  }, []);

  const clearIdFromURL = () => {
    const { pathname } = location;
    const updatedPathname = pathname.split('planId=')[0];

    navigate(updatedPathname, { replace: true });
  };
  const handlePlanSelection = (planId) => {
    updateState({ selectedPlan: planId });
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

  return (
    <>
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
            {storePlans.map((plan) => (
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
          {state.isPageLoading ? (
            <Center h="full">
              <Flex direction="column" alignItems="center">
                <ShepherdSpinner />

                <Text>Loading up your study stash...</Text>
              </Flex>
            </Center>
          ) : (
            <Tabs variant="soft-rounded" color="#F9F9FB">
              <TabList mb="1em">
                <Tab>Topics</Tab>
                <Tab>Analytics</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <Topics planTopics={state.topics} />
                </TabPanel>
                <TabPanel>
                  <Analytics studyPlanReport={studyPlanReport} />
                </TabPanel>
              </TabPanels>
            </Tabs>
          )}
        </Box>

        <StudyPlanSummary
          data={studyPlanUpcomingEvent}
          updateState={updateState}
        />
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
                {/* <DatePicker
                  name={'recurrenceStartDate'}
                  placeholder="Select Start Date"
                  selected={state.recurrenceStartDate}
                  dateFormat="MM/dd/yyyy"
                  onChange={(newDate) => {
                    updateState({ recurrenceStartDate: newDate });
                  }}
                  minDate={new Date()}
                /> */}
                <CalendarDateInput
                  // disabledDate={{ before: today }}
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
