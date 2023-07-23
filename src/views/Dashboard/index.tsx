import cloudDay from '../../assets/day.svg';
import { ReactComponent as DocIcon } from '../../assets/doc.svg';
import EnergyUp from '../../assets/energy-up.svg';
import OnFire from '../../assets/fire.svg';
import Flash from '../../assets/flash.svg';
import magicStar from '../../assets/magic-star.svg';
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
import { PerformanceChart } from './components/PerformanceChart';
import Schedule from './components/Schedule';
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
  const { feeds, fetchFeeds } = feedsStore();

  const [studentReport, setStudentReport] = useState<any>('');
  const [chartData, setChartData] = useState<any>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const fetchData = useCallback(async () => {
    try {
      const [studentReportResponse, feedsResponse] = await Promise.all([
        ApiService.getStudentReport(),
        fetchFeeds()
      ]);

      const studentReportData = await studentReportResponse.json();

      setStudentReport(studentReportData);
      setChartData(studentReportData.chartData);
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

  const cards = [
    {
      title: 'Design Projects 1',
      text: "The project board is an exclusive resource for contract work. It's perfect for freelancers, agencies, and moonlighters.",
      image:
        'https://images.unsplash.com/photo-1516796181074-bf453fbfa3e6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1yZWxhdGVkfDV8fHxlbnwwfHx8fA%3D%3D&auto=format&fit=crop&w=900&q=60'
    },
    {
      title: 'Design Projects 2',
      text: "The project board is an exclusive resource for contract work. It's perfect for freelancers, agencies, and moonlighters.",
      image:
        'https://images.unsplash.com/photo-1438183972690-6d4658e3290e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2274&q=80'
    },
    {
      title: 'Design Projects 3',
      text: "The project board is an exclusive resource for contract work. It's perfect for freelancers, agencies, and moonlighters.",
      image:
        'https://images.unsplash.com/photo-1507237998874-b4d52d1dd655?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1yZWxhdGVkfDR8fHxlbnwwfHx8fA%3D%3D&auto=format&fit=crop&w=900&q=60'
    }
  ];
  // Settings for the slider
  const settings = {
    dots: false,
    arrows: false,
    fade: true,
    infinite: true,
    autoplay: true,
    centerMode: true,
    speed: 500,
    autoplaySpeed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1
  };

  const slides = [
    {
      //   img: OnFire,
      //   description: "spend a little extra time learning",
      label: 'You’ve scored a total of 65% in all quizzes this week!'
    },
    {
      img: EnergyUp,
      description: 'Complete a flash deck to make it 4',
      label: 'You’re on a 3 day streak!'
    },
    {
      img: OnFire,
      description: 'spend a little extra time learning',
      label: 'You spent 5 hours learning this week'
    }
  ];
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
        title={`Hey ${capitalize(user?.name.first)}, get ready for your lesson`}
        initial={user?.name.first.substring(0, 1)}
      />

      <Box p={5}>
        <Box
          bgColor={'#FFF5F0'}
          py={2}
          px={7}
          pb={2}
          borderRadius={8}
          mb={4}
          textAlign="center"
        >
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
                mr={10}
              >
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
                onClick={() =>
                  sessionPrefaceDialogRef.current?.open('http://google.com')
                }
              >
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
          templateColumns="repeat(5, 1fr)"
          gap={6}
        >
          <GridItem
            rowSpan={1}
            colSpan={2}
            h="200px"
            _hover={{
              boxShadow: '2xl',
              transition: 'box-shadow 0.2s ease-in-out'
            }}
          >
            <Card
              // bg={"#207DF7"}
              // bgImage={briefCase}
              // bgRepeat={"no-repeat"}
              // bgSize={"160px"}
              // bgPosition={"right -10px bottom 10px"}
              height={'379px'}
              borderRadius={'10px'}
              border="1px solid #eeeff2"
              position={'relative'}
            >
              <Flex gap={1} p={3} h="60px">
                <Image src={summary} />
                <Text fontSize={'20px'} fontWeight={600}>
                  Weekly Summary
                </Text>
              </Flex>
              {studentReport.studiedFlashcards > 0 ? (
                <>
                  <Grid
                    h="70px"
                    px={3}
                    templateRows="repeat(1, 1fr)"
                    templateColumns="repeat(2, 1fr)"
                    gap={1}
                  >
                    {/* <GridItem rowSpan={1} colSpan={2} position="relative">
                  <Flex gap={1}>
                    <Image src={summary} />
                    <Text fontSize={'20px'} fontWeight={600}>
                      Weekly Summary
                    </Text>
                  </Flex>
                </GridItem> */}

                    <GridItem
                      rowSpan={1}
                      colSpan={1}
                      // p={3}
                      borderBottom={'1px solid #eeeff2'}
                      position="relative"
                    >
                      <Box position="absolute" bottom={2}>
                        <Text fontSize={14} fontWeight={500} color="text.400">
                          Cards studied
                        </Text>
                        <Text fontSize={'24px'} fontWeight={600}>
                          {studentReport.studiedFlashcards}
                          <span
                            style={{
                              fontSize: '14px',
                              fontWeight: '400',
                              color: '#6e7682'
                            }}
                          >
                            {' '}
                            cards
                          </span>
                        </Text>
                      </Box>
                    </GridItem>

                    <GridItem
                      rowSpan={1}
                      colSpan={1}
                      // p={3}
                      borderBottom={'1px solid #eeeff2'}
                      position="relative"
                    >
                      <Box position="absolute" bottom={2}>
                        <Text fontSize={14} fontWeight={500} color="text.400">
                          Time studied
                        </Text>

                        <Flex gap={1}>
                          <Text fontSize={'24px'} fontWeight={600}>
                            05
                            <span
                              style={{
                                fontSize: '14px',
                                fontWeight: '400',
                                color: '#6e7682'
                              }}
                            >
                              {' '}
                              hrs
                            </span>
                          </Text>{' '}
                          <Text fontSize={'24px'} fontWeight={600}>
                            30
                            <span
                              style={{
                                fontSize: '14px',
                                fontWeight: '400',
                                color: '#6e7682'
                              }}
                            >
                              {' '}
                              mins
                            </span>
                          </Text>
                        </Flex>
                      </Box>
                    </GridItem>
                  </Grid>
                  <Grid
                    h="190px"
                    templateRows="repeat(1, 1fr)"
                    templateColumns="repeat(2, 1fr)"
                    gap={0}
                  >
                    <GridItem rowSpan={1} colSpan={1} p={3}>
                      <Text
                        fontSize={14}
                        fontWeight={500}
                        color="text.400"
                        my={3}
                      >
                        Flashcard performance
                      </Text>
                      <Flex alignItems={'center'} fontSize={12} my={2}>
                        <Box
                          boxSize="12px"
                          bg="#4caf50"
                          borderRadius={'3px'}
                          mr={2}
                        />
                        <Text color="text.300">Got it right</Text>
                        <Spacer />
                        <Text fontWeight={600}>
                          {Math.ceil(studentReport.passPercentage)}%
                        </Text>
                      </Flex>
                      <Flex alignItems={'center'} fontSize={12} my={2}>
                        <Box
                          boxSize="12px"
                          bg="#fb8441"
                          borderRadius={'3px'}
                          mr={2}
                        />
                        <Text color="text.300">Didn't remember</Text>
                        <Spacer />
                        <Text fontWeight={600}>0%</Text>
                      </Flex>
                      <Flex alignItems={'center'} fontSize={12} my={2}>
                        <Box
                          boxSize="12px"
                          bg="red"
                          borderRadius={'3px'}
                          mr={2}
                        />
                        <Text color="text.300">Got it wrong</Text>
                        <Spacer />
                        <Text fontWeight={600}>
                          {Math.floor(100 - studentReport.passPercentage)}%
                        </Text>
                      </Flex>
                    </GridItem>
                    <GridItem
                      rowSpan={1}
                      colSpan={1}
                      position="relative"
                      borderLeft="1px solid #eeeff2"
                    >
                      <Box h={'full'} position="absolute" width={'full'}>
                        <Slider {...settings}>
                          <div>
                            <Center px={2} py={4}>
                              <VStack>
                                <Image src={OnFire} />
                                <Text
                                  fontSize="12px"
                                  fontWeight={400}
                                  color="text.300"
                                  textAlign="center"
                                >
                                  You spent 5 hours learning this week
                                </Text>
                              </VStack>

                              {/* <Text fontSize="12px" fontWeight={400}>
                          {slide.description}
                        </Text> */}
                            </Center>
                          </div>
                          <div>
                            <Center px={2} py={4}>
                              <VStack>
                                <Image src={EnergyUp} />
                                <Text
                                  fontSize="12px"
                                  fontWeight={400}
                                  color="text.300"
                                  textAlign="center"
                                >
                                  You spent 5 hours learning this week
                                </Text>
                              </VStack>
                            </Center>
                          </div>
                          <div>
                            <Center px={2} py={4}>
                              <VStack>
                                <Image src={OnFire} />
                                <Text
                                  fontSize="12px"
                                  fontWeight={400}
                                  color="text.300"
                                  textAlign="center"
                                >
                                  You’ve studied 10m/1hr today
                                </Text>
                              </VStack>
                            </Center>
                          </div>
                        </Slider>
                      </Box>
                    </GridItem>
                  </Grid>
                  <CardFooter
                    bg="#f0f2f4"
                    // h={"45px"}
                    borderBottom="1px solid #eeeff2"
                    borderBottomRadius={'10px'}
                  >
                    <Flex h="16px" alignItems={'center'}>
                      <img src={Flash} alt="feed-icon" />{' '}
                      <Text fontSize={14} fontWeight={400} color="text.300">
                        Current streak:{' '}
                        <span
                          style={{
                            fontSize: '14px',
                            fontWeight: '500',
                            color: '#000'
                          }}
                        >
                          {studentReport.streak < 2
                            ? `${studentReport.streak} day `
                            : `${studentReport.streak} days `}
                        </span>
                      </Text>
                    </Flex>
                  </CardFooter>
                </>
              ) : (
                <Box textAlign={'center'} px={20} mt={5}>
                  <VStack spacing={5}>
                    <Image src={EmptyFlashcard} />
                    <Text fontSize={13} fontWeight={500} color="text.400">
                      Monitor your flashcard performance, you’re yet to create a
                      flashcard
                    </Text>
                    <Link to="/dashboard/flashcards">
                      <CustomButton buttonText="Create Flashcard" />
                    </Link>
                  </VStack>
                </Box>
              )}
            </Card>
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
            >
              <Text fontSize={'20px'} fontWeight={600}>
                Quiz Performance
              </Text>
              {chartData.length > 0 ? (
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
                      You’re yet to create a quiz
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
              <Schedule />
            </Box>
          </GridItem>
        </Grid>
      </Box>
    </>
  );
}
