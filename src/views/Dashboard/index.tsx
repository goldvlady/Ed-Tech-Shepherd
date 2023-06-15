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
  SimpleGrid,
  Spacer,
  Stack,
  Text,
  useBreakpointValue,
} from '@chakra-ui/react';
import { capitalize } from 'lodash';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { BiLeftArrowAlt, BiRightArrowAlt } from 'react-icons/bi';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { RxDotFilled } from 'react-icons/rx';
import Slider from 'react-slick';

import timer from '../../assets/big-timer.svg';
import briefCase from '../../assets/briefcase.svg';
import cloudDay from '../../assets/day.svg';
import magicStar from '../../assets/magic-star.svg';
import cloudNight from '../../assets/night.svg';
import ribbon2 from '../../assets/ribbon1.svg';
import ribbon1 from '../../assets/ribbon2.svg';
import SessionPrefaceDialog, {
  SessionPrefaceDialogRef,
} from '../../components/SessionPrefaceDialog';
import userStore from '../../state/userStore';
import { numberToDayOfWeekName, twoDigitFormat } from '../../util';
import ActivityFeeds from './components/ActivityFeeds';
import Carousel from './components/Carousel';
import Schedule from './components/Schedule';

export default function Index() {
  const [slider, setSlider] = useState<Slider | null>(null);
  const [firstname, setFirstname] = useState('');

  const top = useBreakpointValue({ base: '90%', md: '50%' });
  const side = useBreakpointValue({ base: '30%', md: '40px' });

  //Date
  const date = new Date();
  const weekday = numberToDayOfWeekName(date.getDay(), 'dddd');
  const month = moment().format('MMMM');
  const monthday = date.getDate();
  const time = twoDigitFormat(date.getHours()) + ':' + twoDigitFormat(date.getMinutes());
  const hours = date.getHours();
  const isDayTime = hours > 6 && hours < 20;

  const { user } = userStore();

  const cards = [
    {
      title: 'Design Projects 1',
      text: "The project board is an exclusive resource for contract work. It's perfect for freelancers, agencies, and moonlighters.",
      image:
        'https://images.unsplash.com/photo-1516796181074-bf453fbfa3e6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1yZWxhdGVkfDV8fHxlbnwwfHx8fA%3D%3D&auto=format&fit=crop&w=900&q=60',
    },
    {
      title: 'Design Projects 2',
      text: "The project board is an exclusive resource for contract work. It's perfect for freelancers, agencies, and moonlighters.",
      image:
        'https://images.unsplash.com/photo-1438183972690-6d4658e3290e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2274&q=80',
    },
    {
      title: 'Design Projects 3',
      text: "The project board is an exclusive resource for contract work. It's perfect for freelancers, agencies, and moonlighters.",
      image:
        'https://images.unsplash.com/photo-1507237998874-b4d52d1dd655?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1yZWxhdGVkfDR8fHxlbnwwfHx8fA%3D%3D&auto=format&fit=crop&w=900&q=60',
    },
  ];
  // Settings for the slider
  const settings = {
    dots: true,
    arrows: false,
    fade: true,
    infinite: true,
    autoplay: true,
    speed: 500,
    autoplaySpeed: 5000,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const CarouselData = [
    {
      headerText: null,
      subText: 'Sub Text One',
      image: 'https://picsum.photos/300/300',
    },
    {
      headerText: 'Header Text Two',
      subText: null,
      image: 'https://picsum.photos/1200/800',
    },
    {
      headerText: null,
      subText: null,
      image: 'https://picsum.photos/720/720',
    },
  ];

  const sessionPrefaceDialogRef = useRef<SessionPrefaceDialogRef>(null);

  return (
    <>
      <SessionPrefaceDialog
        ref={sessionPrefaceDialogRef}
        title={`Hey ${capitalize(user?.name.first)}, get ready for your lesson`}
        initial={user?.name.first.substring(0, 1)}
      />
      <Box bgColor={'#FFF5F0'} py={2} px={7} pb={2} borderRadius={8} mb={4} textAlign="center">
        <Flex alignItems={'center'}>
          <Box display="flex">
            <Text
              textTransform={'uppercase'}
              color="#4CAF50"
              fontSize={10}
              bgColor="rgba(191, 227, 193, 0.4)"
              borderRadius="3px"
              px={2}
              py={1}
              mr={10}>
              Chemistry Lesson
            </Text>
            <Text color="text.400" fontSize={14}>
              Upcoming class with Leslie Peters starts
            </Text>
            <Text fontSize={14} fontWeight={500} color="#F53535" ml={10}>
              03:30 pm
            </Text>
          </Box>

          <Spacer />
          <Box>
            {' '}
            <Button
              variant="unstyled"
              bgColor="#fff"
              color="#5C5F64"
              fontSize={12}
              px={2}
              py={0}
              onClick={() => sessionPrefaceDialogRef.current?.open('http://google.com')}>
              Join Lesson
            </Button>
          </Box>
        </Flex>
      </Box>

      <Box mb={8}>
        <Text fontSize={24} fontWeight="bold" mb={1}>
          Hi {user?.name.first}, Welcome back!
        </Text>

        <Flex
          color="text.300"
          fontSize={14}
          fontWeight={400}
          alignItems="center"
          height="fit-content">
          <Box>{isDayTime ? <Image src={cloudDay} /> : <Image src={cloudNight} />}</Box>
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
      <Grid h="200px" templateRows="repeat(2, 1fr)" templateColumns="repeat(5, 1fr)" gap={4}>
        <GridItem rowSpan={1} colSpan={1}>
          <Card
            bg={'#207DF7'}
            bgImage={briefCase}
            bgRepeat={'no-repeat'}
            bgSize={'160px'}
            bgPosition={'right -10px bottom 10px'}
            height={'250px'}>
            <CardHeader>
              <img src={ribbon1} width={'40px'} />
            </CardHeader>

            <CardBody>{/* <Text>30</Text> */}</CardBody>
            <CardFooter display={'inline-block'} color="white">
              <Text fontSize={'32px '} fontWeight={600}>
                30
              </Text>
              <Text fontSize={'14px'} fontWeight={400}>
                All Subjects
              </Text>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem rowSpan={1} colSpan={1}>
          <Card
            bg={'#E7EAEE'}
            bgImage={magicStar}
            bgRepeat={'no-repeat'}
            bgSize={'160px'}
            bgPosition={'right -10px bottom 10px'}
            height={'250px'}>
            <CardHeader>
              <img src={ribbon2} width={'40px'} />
            </CardHeader>

            <CardBody>{/* <Text>30</Text> */}</CardBody>
            <CardFooter display={'inline-block'} color="#000">
              <Text fontSize={'32px '} fontWeight={600}>
                20
              </Text>
              <Text fontSize={'14px'} fontWeight={400}>
                Completed Subjects
              </Text>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem rowSpan={1} colSpan={1}>
          <Card
            bg={'#E7EAEE'}
            bgImage={timer}
            bgRepeat={'no-repeat'}
            bgSize={'160px'}
            bgPosition={'right -10px bottom 10px'}
            height={'250px'}>
            <CardHeader>
              <img src={ribbon2} width={'40px'} />
            </CardHeader>

            <CardBody>{/* <Text>30</Text> */}</CardBody>
            <CardFooter display={'inline-block'} color="#000">
              <Text fontSize={'32px'} fontWeight={600}>
                40 <span style={{ fontSize: '16px' }}>hours</span>
              </Text>
              <Text fontSize={'14px'} fontWeight={400}>
                Time spent learning{' '}
              </Text>
            </CardFooter>
          </Card>
        </GridItem>

        <GridItem colSpan={2}>
          <Box height={'250px'} border="1px solid #eeeff2" borderRadius={'10px'}>
            <Carousel />
          </Box>
        </GridItem>
        <GridItem colSpan={3}>
          <Box border="1px solid #eeeff2" borderRadius={'14px'} p={3}>
            <ActivityFeeds />
          </Box>
        </GridItem>
        <GridItem colSpan={2}>
          <Box border="1px solid #eeeff2" borderRadius={'14px'} px={3} py={2}>
            <Schedule />
          </Box>
        </GridItem>
      </Grid>
    </>
  );
}
