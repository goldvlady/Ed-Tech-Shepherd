import {
  Box,
  Button,
  Flex,
  Spacer,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem
} from '@chakra-ui/react';
import CloudDay from '../../../../assets/day.svg';
import CloudNight from '../../../../assets/night.svg';
import React, { useState, useEffect } from 'react';
import { RiCalendar2Fill } from 'react-icons/ri';
import { BsChevronDown } from 'react-icons/bs';
import { RxDotFilled } from 'react-icons/rx';
import { numberToDayOfWeekName } from '../../../../util';
import moment from 'moment';
import userStore from '../../../../state/userStore';

function StudyPlanSummary(props) {
  const { user } = userStore();

  const { data, updateState } = props;
  const [eventPeriod, setEventPeriod] = useState('all');

  // Define state variables for filtered events
  const [eventsToday, setEventsToday] = useState([]);
  const [eventsThisWeek, setEventsThisWeek] = useState([]);
  const [eventsNextWeek, setEventsNextWeek] = useState([]);
  const [eventsThisMonth, setEventsThisMonth] = useState([]);
  const date = new Date();
  const weekday = numberToDayOfWeekName(date.getDay(), 'dddd');
  const month = moment().format('MMMM');
  const monthday = date.getDate();
  // console.log(studyPlanCourses);

  const hours = date.getHours();
  const isDayTime = hours > 6 && hours < 20;

  //SUMMARY FILTER BY PERIOD
  // Define the start and end dates for today
  const todayStart = moment().startOf('day');
  const todayEnd = moment().endOf('day');

  // Define the start and end dates for the current week
  const currentWeekStart = moment().startOf('week');
  const currentWeekEnd = moment().endOf('week');
  // Define the start and end dates for next week
  const nextWeekStart = moment().startOf('week').add(1, 'weeks');
  const nextWeekEnd = moment().endOf('week').add(1, 'weeks');

  // Define the start and end dates for the current month
  const currentMonthStart = moment().startOf('month');
  const currentMonthEnd = moment().endOf('month');
  console.log(currentMonthStart, currentMonthEnd);

  // Update filtered events whenever studyPlanUpcomingEvent changes
  useEffect(() => {
    if (!data) return; // Ensure data is not null or undefined

    // Filter events for today
    const filteredEventsToday = data.filter((event) => {
      const eventDate = moment(event.startDate);
      return eventDate.isBetween(todayStart, todayEnd, null, '[]');
    });
    setEventsToday(filteredEventsToday);

    // Filter events for this week
    const filteredEventsThisWeek = data.filter((event) => {
      const eventDate = moment(event.startDate);
      return eventDate.isBetween(currentWeekStart, currentWeekEnd, null, '[]');
    });
    setEventsThisWeek(filteredEventsThisWeek);

    // Filter events for next week
    const filteredEventsNextWeek = data.filter((event) => {
      const eventDate = moment(event.startDate);
      return eventDate.isBetween(nextWeekStart, nextWeekEnd, null, '[]');
    });
    setEventsNextWeek(filteredEventsNextWeek);

    // Filter events for this month
    const filteredEventsThisMonth = data.filter((event) => {
      const eventDate = moment(event.startDate);
      return eventDate.isBetween(
        currentMonthStart,
        currentMonthEnd,
        null,
        '[]'
      );
    });
    setEventsThisMonth(filteredEventsThisMonth);
  }, [
    data,
    todayStart,
    todayEnd,
    currentWeekStart,
    currentWeekEnd,
    nextWeekStart,
    nextWeekEnd,
    currentMonthStart,
    currentMonthEnd
  ]);

  const getEventList = (events, period) => {
    return (
      eventPeriod === period &&
      events.map((event) => (
        <li
          key={event._id} // Add a unique key
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
                  </Text>
                </Flex>
              </div>
            </div>
          </div>
        </li>
      ))
    );
  };

  return (
    <>
      {' '}
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
        ${data ? data.length : 0}
        topics to study before your big-day.`}
          </Text>
        </Box>
        <Box mt={4}>
          <Flex>
            {' '}
            <Text fontSize={12} p={3}>
              Summary
            </Text>
            <Spacer />{' '}
            <Menu>
              <MenuButton
                as={Button}
                leftIcon={<RiCalendar2Fill />}
                rightIcon={<BsChevronDown />}
                variant="outline"
                fontSize={14}
                fontWeight={500}
                color="#5C5F64"
                p={2}
                size="sm"
              >
                {eventPeriod}
              </MenuButton>
              <MenuList minWidth={'auto'}>
                <MenuItem onClick={() => setEventPeriod('all')}>All</MenuItem>
                <MenuItem onClick={() => setEventPeriod('today')}>
                  Today
                </MenuItem>
                <MenuItem onClick={() => setEventPeriod('week')}>
                  This week
                </MenuItem>
                <MenuItem onClick={() => setEventPeriod('nextWeek')}>
                  Next week
                </MenuItem>
                <MenuItem onClick={() => setEventPeriod('month')}>
                  This month
                </MenuItem>
              </MenuList>
            </Menu>
          </Flex>

          <ul className="space-y-3">
            {data?.length > 0 ? (
              <>
                {getEventList(eventsToday, 'today')}
                {getEventList(eventsThisWeek, 'week')}
                {getEventList(eventsNextWeek, 'nextWeek')}
                {getEventList(eventsThisMonth, 'month')}
                {getEventList(data, 'all')}
              </>
            ) : (
              <Text fontSize={12} textAlign="center" color={'text.300'}>
                no upcoming events
              </Text>
            )}
          </ul>
        </Box>
      </Box>
    </>
  );
}

export default StudyPlanSummary;
