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
import ShareModal from '../../../components/ShareModal';

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
  const [showNoteModal, setShowNoteModal] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const isTutor = window.location.pathname.includes(
    '/dashboard/tutordashboard'
  );
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
    { label: 'Once daily', value: 'once' },
    { label: 'Twice daily', value: 'twice' },
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

  useEffect(() => {
    // Fetch plans only if session storage is empty
    if (state.studyPlans.length === 0) {
      const fetchData = async () => {
        try {
          const shareable = params.get('shareable');
          let id = null;
          if (shareable) {
            const { pathname } = location;
            const planId = pathname.split('planId=')[1];
            id = planId;
          }
          await fetchPlans(
            state.page,
            state.limit,
            undefined,
            undefined,
            undefined,
            undefined,
            id
          );
          updateState({ studyPlans: storePlans });

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
    const baseUrl = isTutor ? '/dashboard/tutordashboard' : '/dashboard';
    navigate(`${baseUrl}/study-plans/planId=${planId}`);
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
          py={6}
          px={4}
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
                <HStack
                  width={'full'}
                  display="flex"
                  px={4}
                  justifyContent={'space-between'}
                >
                  <Box display={'flex'}>
                    <Tab>Topics</Tab>
                    <Tab>Analytics</Tab>
                  </Box>
                  <ShareModal type="studyPlan" />
                </HStack>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <Topics
                    planTopics={state.topics}
                    selectedPlan={state.selectedPlan}
                  />
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
    </>
  );
}

export default CoursePlan;
