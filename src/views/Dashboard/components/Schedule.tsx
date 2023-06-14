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

// function Schedule() {
//   return (
//     <>
//       <Box>
//         <Flex>
//           <HStack>
//             <img src={ScheduleIcon} alt="feed-icon" width={18} />

//             <Text fontSize={16} fontWeight={500} mx={2}>
//               Schedule
//             </Text>
//           </HStack>
//           <Spacer />
//           <img src={calendarDrop} alt="schedule-icon" width={45} />
//         </Flex>
//         <Divider />
//       </Box>
//       <Box>
//         <Text>Upcoming Events</Text>
//       </Box>
//     </>
//   );
// }

// export default Schedule;

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
        <div
          id="carouselExampleIndicators"
          className="relative"
          data-te-carousel-init
          data-te-carousel-slide>
          <div
            className="absolute bottom-0 left-0 right-0 z-[2] mx-[15%] mb-4 flex list-none justify-center p-0"
            data-te-carousel-indicators>
            <button
              type="button"
              data-te-target="#carouselExampleIndicators"
              data-te-slide-to="0"
              data-te-carousel-active
              className="mx-[3px] box-content h-[3px] w-[30px] flex-initial cursor-pointer border-0 border-y-[10px] border-solid border-transparent bg-white bg-clip-padding p-0 -indent-[999px] opacity-50 transition-opacity duration-[600ms] ease-[cubic-bezier(0.25,0.1,0.25,1.0)] motion-reduce:transition-none"
              aria-current="true"
              aria-label="Slide 1"></button>
            <button
              type="button"
              data-te-target="#carouselExampleIndicators"
              data-te-slide-to="1"
              className="mx-[3px] box-content h-[3px] w-[30px] flex-initial cursor-pointer border-0 border-y-[10px] border-solid border-transparent bg-white bg-clip-padding p-0 -indent-[999px] opacity-50 transition-opacity duration-[600ms] ease-[cubic-bezier(0.25,0.1,0.25,1.0)] motion-reduce:transition-none"
              aria-label="Slide 2"></button>
            <button
              type="button"
              data-te-target="#carouselExampleIndicators"
              data-te-slide-to="2"
              className="mx-[3px] box-content h-[3px] w-[30px] flex-initial cursor-pointer border-0 border-y-[10px] border-solid border-transparent bg-white bg-clip-padding p-0 -indent-[999px] opacity-50 transition-opacity duration-[600ms] ease-[cubic-bezier(0.25,0.1,0.25,1.0)] motion-reduce:transition-none"
              aria-label="Slide 3"></button>
          </div>

          <div className="relative w-full overflow-hidden after:clear-both after:block after:content-['']">
            <div
              className="relative float-left -mr-[100%] w-full transition-transform duration-[600ms] ease-in-out motion-reduce:transition-none"
              data-te-carousel-item
              data-te-carousel-active>
              <img
                src="https://mdbcdn.b-cdn.net/img/new/slides/041.webp"
                className="block w-full"
                alt="Wild Landscape"
              />
            </div>
            <div
              className="relative float-left -mr-[100%] hidden w-full transition-transform duration-[600ms] ease-in-out motion-reduce:transition-none"
              data-te-carousel-item>
              <img
                src="https://mdbcdn.b-cdn.net/img/new/slides/042.webp"
                className="block w-full"
                alt="Camera"
              />
            </div>
            <div
              className="relative float-left -mr-[100%] hidden w-full transition-transform duration-[600ms] ease-in-out motion-reduce:transition-none"
              data-te-carousel-item>
              <img
                src="https://mdbcdn.b-cdn.net/img/new/slides/043.webp"
                className="block w-full"
                alt="Exotic Fruits"
              />
            </div>
          </div>

          <button
            className="absolute bottom-0 left-0 top-0 z-[1] flex w-[15%] items-center justify-center border-0 bg-none p-0 text-center text-white opacity-50 transition-opacity duration-150 ease-[cubic-bezier(0.25,0.1,0.25,1.0)] hover:text-white hover:no-underline hover:opacity-90 hover:outline-none focus:text-white focus:no-underline focus:opacity-90 focus:outline-none motion-reduce:transition-none"
            type="button"
            data-te-target="#carouselExampleIndicators"
            data-te-slide="prev">
            <span className="inline-block h-8 w-8">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="h-6 w-6">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 19.5L8.25 12l7.5-7.5"
                />
              </svg>
            </span>
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
              Previous
            </span>
          </button>
          <button
            className="absolute bottom-0 right-0 top-0 z-[1] flex w-[15%] items-center justify-center border-0 bg-none p-0 text-center text-white opacity-50 transition-opacity duration-150 ease-[cubic-bezier(0.25,0.1,0.25,1.0)] hover:text-white hover:no-underline hover:opacity-90 hover:outline-none focus:text-white focus:no-underline focus:opacity-90 focus:outline-none motion-reduce:transition-none"
            type="button"
            data-te-target="#carouselExampleIndicators"
            data-te-slide="next">
            <span className="inline-block h-8 w-8">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="h-6 w-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </span>
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
              Next
            </span>
          </button>
        </div>
      </section>
    </>
  );
}
