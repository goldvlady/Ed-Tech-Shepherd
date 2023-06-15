import {
  Box,
  Button,
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
} from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid';
import React, { useState } from 'react';

import calendarDrop from '../../../assets/calendar-drop.svg';
import ScheduleIcon from '../../../assets/timer.svg';
import Events from '../../../components/Events';

const events = [
  {
    id: 1,
    name: 'Chemistry Lesson with Leslie Peters',
    lastSeen: '03:30 pm',
    time: '04:30 pm',
    color: 'bg-orange-500',
    backgroundColor: 'bg-orange-50',
    commenters: [
      {
        id: 12,
        name: 'Emma Dorsey',
        imageUrl:
          'https://images.unsplash.com/photo-1505840717430-882ce147ef2d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      },
      {
        id: 6,
        name: 'Tom Cook',
        imageUrl:
          'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      },
      {
        id: 4,
        name: 'Lindsay Walton',
        imageUrl: '/svgs/feather.svg',
        backgroundColor: 'bg-blue-500',
      },
    ],
  },
  {
    id: 2,
    name: 'Chemistry Lesson with Leslie Peters',
    lastSeen: '03:30 pm',
    time: '04:30 pm',
    color: 'bg-green-500',
    backgroundColor: 'bg-lightGreen',
    commenters: [
      {
        id: 12,
        name: 'Emma Dorsey',
        imageUrl:
          'https://images.unsplash.com/photo-1505840717430-882ce147ef2d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      },
      {
        id: 6,
        name: 'Tom Cook',
        imageUrl:
          'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      },
    ],
  },
];

export default function Schedule() {
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
      <section className="space-y-3">
        {/* <h3 className="text-gray-400 text-sm mt-4 ml-8">May</h3> */}
        <Text fontSize={12} color="#6E7682" ml={4} my={2} fontWeight={400}>
          May
        </Text>
        <div className="mt-2 text-center lg:col-start-8 lg:col-end-13 lg:row-start-1 lg:mt-9 xl:col-start-9">
          <div className="flex items-center text-gray-900">
            <button
              type="button"
              className="-m-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500">
              <span className="sr-only">Previous month</span>
              <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
            </button>
            <section className="flex-auto text-sm font-semibold">
              <div className="flex justify-between">
                <div className="text-gray-400">
                  <span className="block text-lg text-2xl font-normal">19</span>
                  <span className="text-uppercase block text-xs font-normal">SUN</span>
                </div>
                <div className="text-gray-400">
                  <span className="block text-blue-500 text-2xl font-normal">20</span>
                  <span className="text-uppercase block text-xs font-normal">MON</span>
                </div>
                <div className="text-gray-400">
                  <span className="block text-lg text-2xl font-normal">21</span>
                  <span className="text-uppercase block text-xs font-normal">Tue</span>
                </div>
                <div className="text-gray-400">
                  <span className="block text-lg text-2xl font-normal">22</span>
                  <span className="text-uppercase block text-xs font-normal">Wed</span>
                </div>
                <div className="text-gray-400">
                  <span className="block text-lg text-2xl font-normal">23</span>
                  <span className="text-uppercase block text-xs font-normal">Thur</span>
                </div>
                <div className="text-gray-400">
                  <span className="block text-lg text-2xl font-normal">24</span>
                  <span className="text-uppercase block text-xs font-normal">Fri</span>
                </div>
              </div>
            </section>
            <button
              type="button"
              className="-m-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500">
              <span className="sr-only">Next month</span>
              <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
        <Box>
          <Text fontSize={12} fontWeight={400} color="text.400" my={5} px={4}>
            Upcoming Events
          </Text>
          <ul className="space-y-3">
            {events.map((event) => (
              <Events key={event.id} event={event} />
            ))}
          </ul>
        </Box>
      </section>
    </>
  );
}
