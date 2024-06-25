import React from 'react';
import CloudDay from '../../assets/day.svg';
import DocIcon from '../../assets/doc.svg?react';
import NewNoteIcon from '../../assets/newnote.svg?react';
import CloudNight from '../../assets/night.svg';
import SessionPrefaceDialog, {
  SessionPrefaceDialogRef
} from '../../components/SessionPrefaceDialog';
import ApiService from '../../services/ApiService';
import feedsStore from '../../state/feedsStore';
import userStore from '../../state/userStore';
import { numberToDayOfWeekName, twoDigitFormat } from '../../util';
import ActivityFeeds from './components/ActivityFeeds';
import HourReminder from './components/HourReminder';
import {
  PerformanceChart,
  PerformanceChartSkeleton
} from './components/PerformanceChart';
import Schedule from './components/Schedule';
import WeeklySummary, {
  WeeklySummarySkeleton
} from './components/WeeklySummary';
import { CustomButton } from './layout';
import {
  Box,
  Flex,
  Grid,
  GridItem,
  Image,
  Text,
  useBreakpointValue,
  useDisclosure,
  Center,
  VStack
} from '@chakra-ui/react';
import { signOut, getAuth } from 'firebase/auth';
import { capitalize } from 'lodash';
import moment from 'moment';
import { useCallback, useEffect, useRef, useState } from 'react';
import { RxDotFilled } from 'react-icons/rx';
import { Link } from 'react-router-dom';
import ShepherdSpinner from './components/shepherd-spinner';
import eventsStore from '../../state/eventsStore';
import { useQuery } from '@tanstack/react-query';

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

  const { user } = userStore();

  const [chartData, setChartData] = useState<any>('');
  const [calendarEventData, setCalendarEventData] = useState<any>([]);

  const [isWithinOneHour, setIsWithinOneHour] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const {
    data: feeds,
    isLoading: isFeedsLoading,
    isError: isFeedsError,
    failureCount: feedsFailureCount
  } = useQuery({
    queryKey: ['feeds', user.userRole === 'both' ? 'student' : 'student'],
    queryFn: async () => {
      const response = await ApiService.getActivityFeeds();
      if (response.status === 401) {
        signOut(auth).then(() => {
          sessionStorage.clear();
          localStorage.clear();
          window.location.href = '/login';
        });
      }
      if (!response.ok) throw new Error('Something went wrong fetching');
      const feeds = await response.json();
      return feeds;
    },
    retry: 3
  });
  const {
    data: events,
    isLoading: isEventsLoading,
    isError: isEventsError,
    failureCount
  } = useQuery({
    queryKey: ['events', user.userRole === 'both' ? 'student' : 'student'],
    queryFn: async () => {
      const response = await ApiService.getCalendarEvents();
      if (response.status === 401) {
        signOut(auth).then(() => {
          sessionStorage.clear();
          localStorage.clear();
          window.location.href = '/login';
        });
      }
      if (!response.ok) throw new Error('Something went wrong fetching');
      const { data } = await response.json();
      return data;
    },
    retry: 3
  });
  const {
    data: studentReport,
    isLoading: isStudentReportLoading,
    isError: isStudentReportError,
    failureCount: studentReportFailurCount
  } = useQuery({
    queryKey: ['studentReport'],
    queryFn: async () => {
      const response = await ApiService.getStudentReport();
      if (response.status === 401) {
        signOut(auth).then(() => {
          sessionStorage.clear();
          localStorage.clear();
          window.location.href = '/login';
        });
      }
      if (!response.ok)
        throw new Error('Something went wrong fetching student reports');
      const studentReport = await response.json();
      return studentReport;
    },
    retry: 3
  });
  const {
    data: upcomingEvent,
    isLoading: isUpcomingEventLoading,
    isError: isUpcomingEventError,
    failureCount: upcomingEventFailureCount
  } = useQuery({
    queryKey: [
      'upcomingEvent',
      user.userRole === 'both' ? 'student' : 'student'
    ],
    queryFn: async () => {
      const response = await ApiService.getUpcomingEvent();
      if (response.status === 401) {
        signOut(auth).then(() => {
          sessionStorage.clear();
          localStorage.clear();
          window.location.href = '/login';
        });
      }
      if (!response.ok)
        throw new Error('Something went wrong fetching student reports');
      const upcomingEvent = await response.json();
      return upcomingEvent;
    },
    retry: 3
  });

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
            <Box>{isDayTime ? <CloudDay /> : <CloudNight />}</Box>
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
            {studentReport &&
            !isStudentReportLoading &&
            !isStudentReportError ? (
              <WeeklySummary data={studentReport} />
            ) : (
              <WeeklySummarySkeleton />
            )}
          </GridItem>

          <GridItem
            colSpan={3}
            rowSpan={1}
            _hover={{
              boxShadow: '2xl',
              transition: 'box-shadow 0.2s ease-in-out'
            }}
          >
            {!studentReport && isStudentReportLoading ? (
              <Box
                border="1px solid #eeeff2"
                borderRadius={'10px'}
                bgColor={'#EEEFF2'}
                height={'380px'}
                p={2}
                position="relative"
                marginBottom={{ base: '26px', md: '0' }}
              ></Box>
            ) : (
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
                  Quiz Performance
                </Text>
                {studentReport && studentReport.topQuizzes.length > 0 ? (
                  <Center p={2} h={'350px'}>
                    <PerformanceChart chartData={studentReport.topQuizzes} />
                  </Center>
                ) : studentReport && studentReport.topQuizzes.length === 0 ? (
                  <Box textAlign={'center'} px={20} mt={14}>
                    <VStack spacing={5}>
                      <Image
                        src="/images/notes.png"
                        alt="empty-note"
                        width={'200px'}
                      />
                      <Text fontSize={13} fontWeight={500} color="text.400">
                        {/* You have no quizzes at this moment. */}
                        You have no quizzes yet
                      </Text>
                      <Link to="/dashboard/quizzes/create">
                        <CustomButton buttonText="Create a Quiz" width="100%" />
                      </Link>
                    </VStack>
                  </Box>
                ) : null}
              </Box>
            )}
          </GridItem>
          <GridItem
            colSpan={3}
            _hover={{
              boxShadow: '2xl',
              transition: 'box-shadow 0.2s ease-in-out'
            }}
          >
            {feeds && !isFeedsLoading ? (
              <Box
                border="1px solid #eeeff2"
                borderRadius={'14px'}
                p={3}
                height="450px"
                marginBottom={{ base: '26px', md: ' 0' }}
              >
                <ActivityFeeds feeds={feeds} userType="Student" />
              </Box>
            ) : (
              <Box
                border="1px solid #eeeff2"
                borderRadius={'14px'}
                p={3}
                height="450px"
                className="animate-pulse"
                marginBottom={{ base: '26px', md: ' 0' }}
              ></Box>
            )}
          </GridItem>
          <GridItem
            colSpan={2}
            _hover={{
              boxShadow: '2xl',
              transition: 'box-shadow 0.2s ease-in-out'
            }}
          >
            {events && !isEventsLoading ? (
              <Box
                border="1px solid #eeeff2"
                borderRadius={'14px'}
                px={3}
                py={2}
                height="450px"
              >
                <Schedule events={events} />
              </Box>
            ) : (
              <Box
                border="1px solid #eeeff2"
                borderRadius={'14px'}
                px={3}
                py={2}
                height="450px"
                className="animate-pulse"
              ></Box>
            )}
          </GridItem>
        </Grid>
      </Box>
    </>
  );
}
