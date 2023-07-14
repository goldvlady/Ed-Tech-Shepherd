import calendarDrop from '../../../assets/calendar-drop.svg';
import ScheduleIcon from '../../../assets/timer.svg';
import Events from '../../../components/Events';
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
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid';
import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';

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
          'https://images.unsplash.com/photo-1505840717430-882ce147ef2d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
      },
      {
        id: 6,
        name: 'Tom Cook',
        imageUrl:
          'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
      },
      {
        id: 4,
        name: 'Lindsay Walton',
        imageUrl: '/svgs/feather.svg',
        backgroundColor: 'bg-blue-500'
      }
    ]
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
          'https://images.unsplash.com/photo-1505840717430-882ce147ef2d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
      },
      {
        id: 6,
        name: 'Tom Cook',
        imageUrl:
          'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
      }
    ]
  }
];

type CalendarProps = {
  year: number;
  month: number;
};
const Calendar: React.FC<CalendarProps> = ({ year, month }) => {
  const [selectedDay, setSelectedDay] = useState<number | null>(
    new Date().getDate()
  );
  const [initialSlide, setInitialSlide] = useState<number>(0);

  const handleDayClick = (day: number) => {
    setSelectedDay(day);
  };

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const daysInMonth = Array.from(
    { length: getDaysInMonth(year, month) },
    (_, index) => index + 1
  );
  const getDayOfWeek = (day: number) => {
    const date = new Date(year, month, day);
    const dayOfWeek = date.getDay(); // Sunday: 0, Monday: 1, ...
    const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    return dayNames[dayOfWeek];
  };
  const getMonthName = (month: number) => {
    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
    ];
    return monthNames[month];
  };

  const PrevArrow = (props: any) => {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{ ...style, color: '#9ca3af' }}
        onClick={onClick}
      >
        <ChevronLeftIcon className="arrow-icon " />
      </div>
    );
  };

  const NextArrow = (props: any) => {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{ ...style, color: '#9ca3af' }}
        onClick={onClick}
      >
        <ChevronRightIcon className="arrow-icon" />
      </div>
    );
  };
  // Settings for the slider
  // const settings = {
  //   dots: false,
  //   arrows: true,
  //   fade: true,
  //   infinite: true,
  //   autoplay: true,
  //   speed: 500,
  //   autoplaySpeed: 4000,
  //   slidesToShow: 6,
  //   slidesToScroll: 3,
  //   centerMode: true,
  //   initialSlide: daysInMonth.indexOf(1),
  //   responsive: [
  //     {
  //       breakpoint: 768,
  //       settings: {
  //         slidesToShow: 3
  //       }
  //     },
  //     {
  //       breakpoint: 480,
  //       settings: {
  //         slidesToShow: 3
  //       }
  //     }
  //   ]
  // };
  const settings = {
    dots: false,
    arrows: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    infinite: true,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 6,
    initialSlide: selectedDay ? selectedDay - 1 : 0,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 3
        }
      }
    ]
  };

  return (
    <>
      <Text fontSize={12} color="#6E7682" ml={4} my={2} fontWeight={400}>
        {getMonthName(month)}
      </Text>
      <Box px={6}>
        {' '}
        <Slider {...settings}>
          {daysInMonth.map((day) => (
            <div
              className={`day ${
                selectedDay === day ? 'selected' : ''
              } text-gray-400 `}
              key={day}
              onClick={() => handleDayClick(day)}
            >
              <span className="block text-2xl font-normal ">{day}</span>
              <span className="date text-uppercase block text-sm font-normal">
                {getDayOfWeek(day)}
              </span>
            </div>
          ))}
        </Slider>
      </Box>
    </>
  );
};

export default function Schedule() {
  const [selectedDate, setSelectedDate] = useState(null);

  const handleDateClick = (date) => {
    setSelectedDate(date);
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
      <section className="space-y-3">
        <Calendar year={2023} month={6} />
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
