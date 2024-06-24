import { GridList, Proceed, WelcomePage } from '../../components';
import ApiService from '../../services/ApiService';
import feedsStore from '../../state/feedsStore';
import userStore from '../../state/userStore';
import ActivityFeeds from '../Dashboard/components/ActivityFeeds';
import Schedule from '../Dashboard/components/Schedule';
import { Box, Grid, GridItem } from '@chakra-ui/react';
import React, { useState, useEffect, useCallback } from 'react';
import ShepherdSpinner from '../Dashboard/components/shepherd-spinner';
import { useQuery } from '@tanstack/react-query';

export default function Dashboard() {
  const { user } = userStore();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [calendarEventData, setCalendarEventData] = useState<any>([]);

  const {
    data: tutorReport,
    isLoading: isTutorReportLoading,
    isError: isTutorReportError,
    failureCount: tutorReportFailureCount
  } = useQuery({
    queryKey: ['tutorReport'],
    queryFn: async () => {
      const response = await ApiService.getTutorReport();
      if (!response.ok)
        throw new Error('Something went wrong fetching student reports');
      const { data } = await response.json();
      return data;
    },
    retry: 3
  });
  const {
    data: feeds,
    isLoading: isFeedsLoading,
    isError: isFeedsError,
    failureCount: feedsFailureCount
  } = useQuery({
    queryKey: ['feeds', user.userRole === 'both' ? 'student' : user.userRole],
    queryFn: async () => {
      const response = await ApiService.getActivityFeeds();

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
    queryKey: ['events', user.userRole === 'both' ? 'student' : user.userRole],
    queryFn: async () => {
      const response = await ApiService.getCalendarEvents();
      if (!response.ok) throw new Error('Something went wrong fetching');
      const { data } = await response.json();
      return data;
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
      user.userRole === 'both' ? 'student' : user.userRole
    ],
    queryFn: async () => {
      const response = await ApiService.getUpcomingEvent();

      if (!response.ok)
        throw new Error('Something went wrong fetching student reports');
      const upcomingEvent = await response.json();
      return upcomingEvent;
    },
    retry: 3
  });

  const isEmptyObject = (obj) => {
    for (const key in obj) {
      if (obj[key].length > 0) {
        return false;
      }
    }
    return true;
  };
  console.log(user);

  return (
    <>
      <WelcomePage user={user} />
      {!user?.tutor?.calendlyLink && <Proceed user={user} />}

      <GridList data={tutorReport} />
      <Box my={3} p={6}>
        <Grid
          templateRows="repeat(1, 1fr)"
          templateColumns="repeat(3, 1fr)"
          gap={6}
        >
          <GridItem colSpan={2}>
            {feeds && !isFeedsLoading ? (
              <Box
                border="1px solid #eeeff2"
                borderRadius={'14px'}
                p={3}
                height="450px"
              >
                <ActivityFeeds feeds={feeds} userType="Tutor" />
              </Box>
            ) : (
              <Box
                border="1px solid #eeeff2"
                borderRadius={'14px'}
                p={3}
                height="450px"
                className="animate-pulse"
              ></Box>
            )}
          </GridItem>
          <GridItem colSpan={1}>
            {events && !isEventsLoading ? (
              <Box
                border="1px solid #eeeff2"
                borderRadius={'14px'}
                width="400px"
                px={3}
                py={2}
                height="450px"
              >
                {' '}
                <Schedule events={events} />
              </Box>
            ) : (
              <Box
                border="1px solid #eeeff2"
                borderRadius={'14px'}
                width="400px"
                px={3}
                py={2}
                height="450px"
                className="animate-pulse"
              ></Box>
            )}
          </GridItem>
        </Grid>
      </Box>
      {/* <RecentTransactions /> */}
    </>
  );
}
