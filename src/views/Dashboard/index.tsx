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
  const timeStudied = (totalWeeklyStudyTime) => {
    const [hours, minutes] = totalWeeklyStudyTime.split(':');
    return { hour: hours, minute: minutes };
  };

  const { user } = userStore();
  const { feeds, fetchFeeds } = feedsStore();

  const [studentReport, setStudentReport] = useState<any>('');
  const [chartData, setChartData] = useState<any>('');
  const [calendarEventData, setCalendarEventData] = useState<any>([]);

  const [isLoading, setIsLoading] = useState<boolean>(true);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const fetchData = useCallback(async () => {
    try {
      const [studentReportResponse, calendarResponse, feedsResponse] =
        await Promise.all([
          ApiService.getStudentReport(),
          ApiService.getCalendarEvents(),
          fetchFeeds()
        ]);

      const studentReportData = await studentReportResponse.json();
      const calendarData = await calendarResponse.json();

      setStudentReport(studentReportData);
      setChartData(studentReportData.chartData);
      setCalendarEventData(calendarData.data);
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

      <Box p={5} maxWidth="80em" margin="auto">
        <Box
          bgColor={'#FFF5F0'}
          py={2}
          px={7}
          pb={2}
          borderRadius={8}
          mb={4}
          textAlign="center"
        >
          {/* <Flex alignItems={'center'}>
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
          </Flex> */}
          <Flex
            alignItems={'center'}
            direction={{ base: 'column', md: 'row' }}
            justifyContent={{ base: 'center', md: 'space-between' }}
          >
            <Box
              display="flex"
              flexDirection={{ base: 'column', md: 'row' }}
              alignItems={{ base: 'center', md: 'flex-start' }}
              mb={{ base: 4, md: 0 }}
            >
              <Text
                textTransform={'uppercase'}
                color="#4CAF50"
                fontSize={{ base: 'sm', md: 'md' }}
                bgColor="rgba(191, 227, 193, 0.4)"
                borderRadius="3px"
                px={2}
                py={1}
                mr={{ base: 0, md: 10 }}
                mb={{ base: 2, md: 0 }}
                textAlign={{ base: 'center', md: 'left' }}
              >
                Chemistry Lesson
              </Text>
              <Text
                color="text.400"
                fontSize={{ base: 'sm', md: 'md' }}
                textAlign={{ base: 'center', md: 'left' }}
              >
                Upcoming class with Leslie Peters starts
              </Text>
              <Text
                fontSize={{ base: 'sm', md: 'md' }}
                fontWeight={500}
                color="#F53535"
                ml={{ base: 0, md: 10 }}
                mt={{ base: 2, md: 0 }}
                textAlign={{ base: 'center', md: 'left' }}
              >
                03:30 pm
              </Text>
            </Box>

            <Box>
              <Button
                variant="unstyled"
                bgColor="#fff"
                color="#5C5F64"
                fontSize={{ base: 'sm', md: 'md' }}
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
            <Card
              // bg={"#207DF7"}
              // bgImage={briefCase}
              // bgRepeat={"no-repeat"}
              // bgSize={"160px"}
              // bgPosition={"right -10px bottom 10px"}
              height={{ base: 'auto', md: '379px' }}
              borderRadius={{ base: '5px', md: '10px' }}
              border="1px solid #eeeff2"
              position={'relative'}
              marginBottom={{ base: '26px', md: 'none' }}
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
                    h={{ base: 'auto', md: '70px' }}
                    px={3}
                    templateRows="repeat(1, 1fr)"
                    templateColumns={{
                      base: 'repeat(1, 1fr)',
                      md: 'repeat(2, 1fr)'
                    }}
                    gap={1}
                  >
                    <GridItem
                      borderBottom={'1px solid #eeeff2'}
                      position="relative"
                      p={3}
                    >
                      <Box>
                        <Text
                          fontSize={{ base: 'md', md: 'lg' }}
                          fontWeight={500}
                          color="text.400"
                        >
                          Cards studied
                        </Text>
                        <Text
                          fontSize={{ base: 'xl', md: '2xl' }}
                          fontWeight={600}
                        >
                          {studentReport.studiedFlashcards}
                          <span
                            style={{
                              fontSize: 14,
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
                      borderBottom={'1px solid #eeeff2'}
                      position="relative"
                      p={3}
                    >
                      <Box>
                        <Text
                          fontSize={{ base: 'md', md: 'lg' }}
                          fontWeight={500}
                          color="text.400"
                        >
                          Time studied
                        </Text>
                        <Flex gap={1}>
                          <Text
                            fontSize={{ base: 'xl', md: '2xl' }}
                            fontWeight={600}
                          >
                            05
                            <span
                              style={{
                                fontSize: 12,
                                fontWeight: '400',
                                color: '#6e7682'
                              }}
                            >
                              {' '}
                              hrs
                            </span>
                          </Text>{' '}
                          <Text
                            fontSize={{ base: 'xl', md: '2xl' }}
                            fontWeight={600}
                          >
                            30
                            <span
                              style={{
                                fontSize: 14,
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
                    h={{ base: 'auto', md: '190px' }}
                    templateRows={{
                      base: 'repeat(2, 1fr)',
                      md: 'repeat(1, 1fr)'
                    }}
                    templateColumns={{
                      base: 'repeat(1, 1fr)',
                      md: 'repeat(2, 1fr)'
                    }}
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
                        <Text fontWeight={600}>
                          {studentReport.notRemembered}%
                        </Text>
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
                          {Math.floor(
                            100 -
                              studentReport.passPercentage -
                              studentReport.notRemembered
                          )}
                          %
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
                    <Flex h="16px" alignItems={'center'} gap={1}>
                      <img src={Flash} alt="feed-icon" />
                      <Text fontSize={14} fontWeight={400} color="text.300">
                        Current streak:
                      </Text>
                      <Text fontSize="14px" fontWeight="500" color="#000">
                        {studentReport.streak < 2
                          ? `${studentReport.streak} day `
                          : `${studentReport.streak} days `}
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
              marginBottom={{ base: '26px', md: '0' }}
            >
              <Text fontSize={'20px'} fontWeight={600}>
                Quiz Performance
              </Text>
              {chartData && chartData.length > 0 ? (
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
              marginBottom={{ base: '26px', md: ' 0' }}
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
              <Schedule events={calendarEventData} />
            </Box>
          </GridItem>
        </Grid>
      </Box>
    </>
  );
}
