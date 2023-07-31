import calendarDrop from '../../../assets/calendar-drop.svg';
import NoEvent from '../../../assets/no-event.svg';
import ScheduleIcon from '../../../assets/timer.svg';
import Events from '../../../components/Events';
import Calendar from './Calendar';
import './Scheduler/index.css';
import {
  Box,
  Button,
  Center,
  Divider,
  Flex,
  HStack,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Select,
  Spacer,
  Text,
  VStack,
  Image,
  ChakraProvider,
  extendTheme
} from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';

// const events = [
//   {
//     id: 1,
//     name: 'Chemistruy Lesson with Leslie Peters',
//     fromTime: '2023-07-26T23:00:00.000Z',
//     toTime: '2023-07-26T01:30:00.000Z',
//     color: 'bg-orange-500',
//     type: 'study',
//     date: '2023-07-09T00:30:00.000Z',
//     backgroundColor: 'bg-orange-50',
//     commenters: [
//       {
//         id: 12,
//         name: 'Emma Dorsey',
//         imageUrl:
//           'https://images.unsplash.com/photo-1505840717430-882ce147ef2d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
//       },
//       {
//         id: 6,
//         name: 'Tom Cook',
//         imageUrl:
//           'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
//       },
//       {
//         id: 4,
//         name: 'Lindsay Walton',
//         imageUrl: '/svgs/feather.svg',
//         backgroundColor: 'bg-blue-500'
//       }
//     ]
//   },
//   {
//     id: 2,
//     name: 'Chemistry Lesson with Leslie Peters',
//     fromTime: '2023-07-26T23:00:00.000Z',
//     toTime: '2023-07-26T01:30:00.000Z',
//     color: 'bg-green-500',
//     type: 'class',
//     date: '2023-07-26T00:30:00.000Z',
//     backgroundColor: 'bg-green-50',
//     commenters: [
//       {
//         id: 12,
//         name: 'Emma Dorsey',
//         imageUrl:
//           'https://images.unsplash.com/photo-1505840717430-882ce147ef2d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
//       },
//       {
//         id: 6,
//         name: 'Tom Cook',
//         imageUrl:
//           'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
//       }
//     ]
//   },
//   {
//     id: 3,
//     name: 'Chemistry Lesson with Leslie Peters',
//     fromTime: '2023-07-26T20:00:00.000Z',
//     toTime: '2023-07-26T01:30:00.000Z',
//     color: 'bg-green-500',
//     type: 'study',
//     date: '2023-07-26T00:30:00.000Z',
//     backgroundColor: 'bg-orange-50',
//     commenters: [
//       {
//         id: 12,
//         name: 'Emma Dorsey',
//         imageUrl:
//           'https://images.unsplash.com/photo-1505840717430-882ce147ef2d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
//       },
//       {
//         id: 6,
//         name: 'Tom Cook',
//         imageUrl:
//           'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
//       }
//     ]
//   }
// ];

export default function Schedule({ events }) {
  const [selectedDate, setSelectedDate] = useState<number | null>(
    new Date().getDate()
  );

  const handleDateClick = (date: any) => {
    if (date) {
      setSelectedDate(date);
    }
  };

  const filteredEvents = selectedDate
    ? events.filter(
        (event) =>
          new Date(event.date).toDateString() ===
          new Date(selectedDate).toDateString()
      )
    : events;

  const getTomorrowsDate = () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
  };

  const filterTomorrowsEvents = () => {
    const tomorrow = getTomorrowsDate();
    return events.filter(
      (event) => new Date(event.date).toDateString() === tomorrow.toDateString()
    );
  };

  return (
    <>
      <Box>
        {' '}
        <Flex>
          {' '}
          <HStack>
            <img src={ScheduleIcon} alt="feed-icon" width={18} />{' '}
            <Text fontSize={16} fontWeight={500} mx={2}>
              Schedule{' '}
            </Text>{' '}
          </HStack>
          <Spacer />
          <img src={calendarDrop} alt="schedule-icon" width={45} />{' '}
        </Flex>
        <Divider />{' '}
      </Box>{' '}
      <section className="space-y-2">
        <Calendar year={2023} month={6} onDayClick={handleDateClick} />
        <Box>
          <Text fontSize={12} fontWeight={400} color="text.400" mb={2} px={4}>
            Upcoming Events
          </Text>
          <Box h="165px" overflowY="auto">
            {' '}
            <ul className="space-y-3">
              {filteredEvents.length > 0 ? (
                filteredEvents.map((event) => (
                  <Events key={event.id} event={event} />
                ))
              ) : (
                <Center>
                  <VStack py={3}>
                    <Image src={NoEvent} />
                    <Text fontSize={12} fontWeight={500} color="text.400">
                      No Events Scheduled
                    </Text>
                  </VStack>
                </Center>
              )}
            </ul>
          </Box>
        </Box>
        <Box h="85px" overflowY="auto">
          <Text fontSize={12} fontWeight={400} color="text.400" mb={1} px={4}>
            Tomorrow
          </Text>
          <Box>
            {' '}
            <ul className="space-y-3">
              {filterTomorrowsEvents().length > 0 ? (
                filterTomorrowsEvents().map((event) => (
                  <Events key={event.id} event={event} />
                ))
              ) : (
                <Center>
                  <VStack>
                    <Image src={NoEvent} />
                    <Text fontSize={12} fontWeight={500} color="text.400">
                      No Events Scheduled for tomorrow
                    </Text>
                  </VStack>
                </Center>
              )}
            </ul>
          </Box>
        </Box>
      </section>
    </>
  );
}
