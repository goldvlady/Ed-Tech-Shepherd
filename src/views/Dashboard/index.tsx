import cloudDay from '../../assets/day.svg';
import { ReactComponent as DocIcon } from '../../assets/doc.svg';
import { ReactComponent as NewNoteIcon } from '../../assets/newnote.svg';
import cloudNight from '../../assets/night.svg';
import EmptyFeeds from '../../assets/no-activity.svg';
import EmptyFlashcard from '../../assets/no-flashcard.svg';
import ribbon2 from '../../assets/ribbon1.svg';
import ribbon1 from '../../assets/ribbon2.svg';
import summary from '../../assets/summary.svg';
import DropdownMenu from '../../components/CustomComponents/CustomDropdownMenu';
import SessionPrefaceDialog, {
  SessionPrefaceDialogRef
} from '../../components/SessionPrefaceDialog';
import ApiService from '../../services/ApiService';
import feedsStore from '../../state/feedsStore';
import userStore from '../../state/userStore';
import { numberToDayOfWeekName, twoDigitFormat } from '../../util';
import { Section, SectionNewList, NewList } from './Notes/styles';
import ActivityFeeds from './components/ActivityFeeds';
import Carousel from './components/Carousel';
import HourReminder from './components/HourReminder';
import { PerformanceChart } from './components/PerformanceChart';
import Schedule from './components/Schedule';
import WeeklySummary from './components/WeeklySummary';
import { CustomButton } from './layout';
import { AddIcon } from '@chakra-ui/icons';
import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Container,
  Flex,
  Grid,
  GridItem,
  HStack,
  Heading,
  IconButton,
  Image,
  Spacer,
  Stack,
  Text,
  useBreakpointValue,
  useDisclosure,
  Center,
  VStack,
  Spinner
} from '@chakra-ui/react';
import { signInWithPopup, signOut, getAuth } from 'firebase/auth';
import { capitalize } from 'lodash';
import moment from 'moment';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { BiLeftArrowAlt, BiRightArrowAlt } from 'react-icons/bi';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { RxDotFilled } from 'react-icons/rx';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';

export default function Index() {
  const top = useBreakpointValue({ base: '90%', md: '50%' });
  const side = useBreakpointValue({ base: '30%', md: '40px' });
  const auth = getAuth();
  //Date
  const date = new Date();
  const weekday = numberToDayOfWeekName(date.getDay(), 'dddd');
  const month = moment().format('MMMM');
  const monthday = date.getDate();
  const time =
    twoDigitFormat(date.getHours()) + ':' + twoDigitFormat(date.getMinutes());
  const hours = date.getHours();
  const isDayTime = hours > 6 && hours < 20;

  const { user, logoutUser } = userStore();
  const { feeds, fetchFeeds } = feedsStore();

  const [studentReport, setStudentReport] = useState<any>('');
  const [chartData, setChartData] = useState<any>('');
  const [calendarEventData, setCalendarEventData] = useState<any>([]);
  const [upcomingEvent, setUpcomingEvent] = useState<any>(null);
  const [isWithinOneHour, setIsWithinOneHour] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useState<boolean>(true);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const fetchData = useCallback(async () => {
    try {
      const [
        studentReportResponse,
        calendarResponse,
        upcomingEventResponse,
        feedsResponse
      ] = await Promise.all([
        ApiService.getStudentReport(),
        ApiService.getCalendarEvents(),
        ApiService.getUpcomingEvent(),
        fetchFeeds()
      ]);

      // Check for 401 status code in each response and log the user out if found
      if (
        studentReportResponse.status === 401 ||
        calendarResponse.status === 401 ||
        upcomingEventResponse.status === 401
      ) {
        signOut(auth).then(() => {
          sessionStorage.clear();
          localStorage.clear();
          logoutUser();
          window.location.href = '/login';
        });
        return; // Exit the function to prevent further processing
      }

      const studentReportData = await studentReportResponse.json();
      const calendarData = await calendarResponse.json();
      const nextEvent = await upcomingEventResponse.json();

      setStudentReport(studentReportData);
      setChartData(studentReportData.chartData);
      setCalendarEventData(calendarData.data);
      setUpcomingEvent(nextEvent);
      // setFeeds(feedsResponse);
    } catch (error) {
      /* empty */
    } finally {
      setIsLoading(false);
    }
  }, [fetchFeeds]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const checkTimeDifference = () => {
    const currentTime = new Date().getTime();
    const startTime = new Date(upcomingEvent.data?.data?.startDate).getTime();
    const oneHourInMilliseconds = 60 * 60 * 1000;

    if (startTime - currentTime <= oneHourInMilliseconds) {
      setIsWithinOneHour(true);
    } else {
      setIsWithinOneHour(false);
    }
  };
  useEffect(() => {
    if (upcomingEvent) {
      checkTimeDifference();
      const timeout = setTimeout(checkTimeDifference, 60 * 1000);

      return () => clearTimeout(timeout);
    }
    // eslint-disable-next-line
  }, [upcomingEvent]);

  const createNewLists = [
    {
      id: 1,
      iconName: <NewNoteIcon />,
      labelText: 'New note'
      // onClick: () => navigate('/dashboard/new-note')
    },
    {
      id: 2,
      iconName: <DocIcon />,
      labelText: 'Upload document'
      // onClick: activateHelpModal
    }
  ];

  const sessionPrefaceDialogRef = useRef<SessionPrefaceDialogRef>(null);

  if (isLoading) {
    return (
      <Box
        p={5}
        textAlign="center"
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh'
        }}
      >
        <Spinner />
      </Box>
    );
  }

  return (
    <>
      <SessionPrefaceDialog
        ref={sessionPrefaceDialogRef}
        title={`Hey ${capitalize(
          user?.name?.first
        )}, get ready for your lesson`}
        initial={user?.name?.first.substring(0, 1)}
      />

      <Box p={5} maxWidth="80em" margin="auto">
        {upcomingEvent && isWithinOneHour && (
          <HourReminder
            data={upcomingEvent}
            sessionPrefaceDialogRef={sessionPrefaceDialogRef}
          />
        )}

        <Box mb={8}>
          <Text fontSize={24} fontWeight="bold" mb={1}>
            Hi {user?.name?.first}, Welcome back!
          </Text>

          <Flex
            color="text.300"
            fontSize={14}
            fontWeight={400}
            alignItems="center"
            height="fit-content"
          >
            <Box>
              {isDayTime ? (
                <Image src={cloudDay} />
              ) : (
                <Image src={cloudNight} />
              )}
            </Box>
            <Box mt={1}>
              <RxDotFilled />
            </Box>
            <Text mb={0}>{`${weekday}, ${month} ${monthday}`}</Text>{' '}
            <Box mt={1}>
              <RxDotFilled />
            </Box>
            <Text mb={0}>{time}</Text>
          </Flex>
        </Box>
        <Grid
          // templateRows="repeat(2, 1fr)"
          templateColumns={{
            base: 'repeat(1, 1fr)',
            md: 'repeat(2, 1fr)',
            lg: 'repeat(5, 1fr)'
          }}
          gap={{ base: 'none', md: 6 }}
        >
          <GridItem
            rowSpan={{ base: 1, md: 1 }}
            colSpan={{ base: 1, md: 2 }}
            h={{ base: 'auto', md: '200px' }}
            _hover={{
              boxShadow: '2xl',
              transition: 'box-shadow 0.2s ease-in-out'
            }}
          >
            <WeeklySummary data={studentReport} />
          </GridItem>

          <GridItem
            colSpan={3}
            rowSpan={1}
            _hover={{
              boxShadow: '2xl',
              transition: 'box-shadow 0.2s ease-in-out'
            }}
          >
            <Box
              border="1px solid #eeeff2"
              borderRadius={'10px'}
              bgColor={'#EEEFF2'}
              height={'380px'}
              p={2}
              position="relative"
              marginBottom={{ base: '26px', md: '0' }}
            >
              <Text fontSize={'20px'} fontWeight={600}>
                Create Flashcards
              </Text>
              {chartData && chartData.length > 0 ? (
                <Center p={2} h={'350px'}>
                  <PerformanceChart chartData={chartData} />
                </Center>
              ) : (
                <Box textAlign={'center'} px={20} mt={14}>
                  <VStack spacing={5}>
                    <Image
                      src="/images/notes.png"
                      alt="empty-note"
                      width={'200px'}
                    />
                    <Text fontSize={13} fontWeight={500} color="text.400">
                      You have no quizzes at this moment.
                    </Text>
                    <Link to="/dashboard/flashcards">
                      <CustomButton buttonText="Create Quiz" width="165px" />
                    </Link>
                  </VStack>
                </Box>
              )}
            </Box>
          </GridItem>
          <GridItem
            colSpan={3}
            _hover={{
              boxShadow: '2xl',
              transition: 'box-shadow 0.2s ease-in-out'
            }}
          >
            <Box
              border="1px solid #eeeff2"
              borderRadius={'14px'}
              p={3}
              height="450px"
              marginBottom={{ base: '26px', md: ' 0' }}
            >
              <ActivityFeeds feeds={feeds} userType="Student" />
            </Box>
          </GridItem>
          <GridItem
            colSpan={2}
            _hover={{
              boxShadow: '2xl',
              transition: 'box-shadow 0.2s ease-in-out'
            }}
          >
            <Box
              border="1px solid #eeeff2"
              borderRadius={'14px'}
              px={3}
              py={2}
              height="450px"
            >
              <Schedule events={calendarEventData} />
            </Box>
          </GridItem>
        </Grid>
      </Box>
    </>
  );
}
