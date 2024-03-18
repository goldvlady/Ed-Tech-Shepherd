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
import { AiOutlineDown, AiOutlineUp } from 'react-icons/ai';

function StudyPlanSummary(props) {
  const { user } = userStore();

  const { data, updateState } = props;
  const [eventPeriod, setEventPeriod] = useState('all');

  // Define state variables for filtered events
  const [eventsToday, setEventsToday] = useState([]);
  const [eventsTomorrow, setEventsTomorrow] = useState([]);
  const [eventsRestOfWeek, setEventsRestOfWeek] = useState([]);
  const [eventsNextWeek, setEventsNextWeek] = useState([]);
  const [eventsNextMonth, setEventsNextMonth] = useState([]);
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

  // Define the start and end dates for next week
  const nextWeekStart = moment().startOf('week').add(1, 'weeks');
  const nextWeekEnd = moment().endOf('week').add(1, 'weeks');

  // Define the start and end dates for the current month
  const currentMonthStart = moment().startOf('month');
  const currentDate = moment();
  const tomorrowDate = moment().add(1, 'day');
  const endOfWeekDate = moment().endOf('week');
  const endOfNextWeekDate = moment().add(1, 'week').endOf('week');
  const endOfMonthDate = moment().endOf('month');
  const nextMonthDate = moment().add(1, 'month').endOf('month');

  // Update filtered events whenever studyPlanUpcomingEvent changes
  useEffect(() => {
    if (!data) return; // Ensure data is not null or undefined

    // Filter events for today
    const filteredEventsToday = data.filter((event) => {
      const eventDate = moment(event.startDate);
      return eventDate.isSame(currentDate, 'day');
    });
    setEventsToday(filteredEventsToday);

    // Filter events for tomorrow
    const filteredEventsTomorrow = data.filter((event) => {
      const eventDate = moment(event.startDate);
      return eventDate.isSame(tomorrowDate, 'day');
    });
    setEventsTomorrow(filteredEventsTomorrow);

    // Filter events for rest of the week
    const filteredEventsRestOfWeek = data.filter((event) => {
      const eventDate = moment(event.startDate);
      return eventDate.isBetween(currentDate, endOfWeekDate, null, '[]');
    });
    setEventsRestOfWeek(filteredEventsRestOfWeek);

    // Filter events for next week
    const filteredEventsNextWeek = data.filter((event) => {
      const eventDate = moment(event.startDate);
      return eventDate.isBetween(endOfWeekDate, endOfNextWeekDate, null, '[]');
    });
    setEventsNextWeek(filteredEventsNextWeek);

    // Filter events for next month
    const filteredEventsNextMonth = data.filter((event) => {
      const eventDate = moment(event.startDate);
      return eventDate.isBetween(endOfMonthDate, nextMonthDate, null, '[]');
    });
    setEventsNextMonth(filteredEventsNextMonth);
  }, [data]);

  const getEventList = (events) => {
    return events.map((event) => (
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
    ));
  };

  const SummaryPeriod = ({ data, period }) => {
    const [visible, setVisible] = useState(period === 'Today' ? true : false);
    const toggleVisibility = () => {
      setVisible(!visible);
    };
    return (
      <>
        <Flex alignItems={'center'}>
          {' '}
          <Text
            className="text-[#585F68] font-normal text-xs mb-4"
            textTransform={'uppercase'}
            my={2}
          >
            {period}
          </Text>
          <Spacer />
          {visible ? (
            <AiOutlineDown size="12px" onClick={() => toggleVisibility()} />
          ) : (
            <AiOutlineUp size="12px" onClick={() => toggleVisibility()} />
          )}
        </Flex>
        {visible &&
          (data.length > 0 ? (
            getEventList(data)
          ) : (
            <Text fontSize={12} textAlign="center" color={'text.300'}>
              no events
            </Text>
          ))}
      </>
    );
  };
  return (
    <>
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
        <Box my={4} fontSize={16}>
          <Text fontWeight={500}>Hey {user?.name?.first || 'User'}</Text>
          <Text color={'text.300'} fontSize={13}>
            {` You have
        ${data ? data.length : 0}
        topics to study before your big-day.`}
          </Text>
        </Box>
        <Box mt={4}>
          <Flex>
            {' '}
            <Text fontSize={12} p={3} fontWeight={500}>
              Summary
            </Text>
            <Spacer />{' '}
            {/* <Menu>
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
                <MenuItem onClick={() => setEventPeriod('All')}>All</MenuItem>
                <MenuItem onClick={() => setEventPeriod('Today')}>
                  Today
                </MenuItem>
                <MenuItem onClick={() => setEventPeriod('This week')}>
                  This week
                </MenuItem>
                <MenuItem onClick={() => setEventPeriod('Next week')}>
                  Next week
                </MenuItem>
                <MenuItem onClick={() => setEventPeriod('This month')}>
                  This month
                </MenuItem>
              </MenuList>
            </Menu> */}
          </Flex>

          <ul className="space-y-3">
            {data?.length > 0 ? (
              <>
                <SummaryPeriod data={eventsToday} period={'Today'} />
                <SummaryPeriod data={eventsTomorrow} period={'Tomorrow'} />
                <SummaryPeriod
                  data={eventsRestOfWeek}
                  period="Rest of the week"
                />
                <SummaryPeriod data={eventsNextWeek} period={'Next Week'} />
                <SummaryPeriod data={eventsNextMonth} period={'Next Month'} />

                {/* {getEventList(eventsThisMonth)} */}
                {/* {getEventList(data, 'all')} */}
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
