import Star4 from '../../assets/4star.svg';
import Check from '../../assets/check.svg';
import Day from '../../assets/day.svg';
import FileAvi2 from '../../assets/file-avi2.svg';
import FileAvi from '../../assets/file-avi.svg';
import Star from '../../assets/littleStar.svg';
import Ribbon2 from '../../assets/ribbon-blue.svg';
import Ribbon from '../../assets/ribbon-grey.svg';
import TutorAvi from '../../assets/tutoravi.svg';
import vidHolder from '../../assets/vid-holder.png';
import LinedList from '../../components/LinedList';
import ApiService from '../../services/ApiService';
import bookmarkedTutorsStore from '../../state/bookmarkedTutorsStore';
import {
  calculateTimeDifference,
  convertTimeStringToISOString
} from '../../util';
import HowItWorks from './components/HowItWorks';
import { CustomButton } from './layout';
import {
  AspectRatio,
  Avatar,
  Badge,
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  Card,
  CardBody,
  CardHeader,
  Center,
  Container,
  Divider,
  Flex,
  Grid,
  GridItem,
  Heading,
  Image,
  Link,
  LinkOverlay,
  Spacer,
  Spinner,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Table,
  TableCaption,
  TableContainer,
  Tabs,
  Tbody,
  Td,
  Text,
  Tfoot,
  Th,
  Thead,
  Tr,
  VStack,
  useColorModeValue,
  useToast
} from '@chakra-ui/react';
import moment from 'moment';
import { toNamespacedPath } from 'path';
import React, { useCallback, useEffect, useState } from 'react';
import { BiPlayCircle } from 'react-icons/bi';
import { FiChevronRight } from 'react-icons/fi';
import { RiQuestionFill } from 'react-icons/ri';
import { RxDotFilled } from 'react-icons/rx';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';

export default function Tutor() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [loadingData, setLoadingData] = useState(false);
  const [tutorData, setTutorData] = useState<any>({});
  const [vidOverlay, setVidOverlay] = useState<boolean>(true);
  const [switchStyle, setSwitchStyle] = useState<boolean>(false);
  const tutorId: any = searchParams.get('id');

  const navigate = useNavigate();
  const toast = useToast();

  const getData = useCallback(async () => {
    setLoadingData(true);
    const resp = await ApiService.getTutor(tutorId);
    const data = await resp.json();
    setTutorData(data);
    setLoadingData(false);
  }, [tutorId]);

  useEffect(() => {
    getData();
  }, [getData]);

  const { fetchBookmarkedTutors, tutors: bookmarkedTutors } =
    bookmarkedTutorsStore();
  const doFetchBookmarkedTutors = useCallback(async () => {
    await fetchBookmarkedTutors();
  }, [fetchBookmarkedTutors]);
  const checkBookmarks = () => {
    const found = bookmarkedTutors?.some((el) => el.tutor?._id === tutorId);
    if (!found) {
      return false;
    } else {
      return true;
    }
  };

  useEffect(() => {
    doFetchBookmarkedTutors();
  }, [doFetchBookmarkedTutors]);

  const toggleBookmarkTutor = async (id: string) => {
    try {
      const resp = await ApiService.toggleBookmarkedTutor(id);
      if (checkBookmarks()) {
        toast({
          title: 'Tutor removed from Bookmarks successfully',
          position: 'top-right',
          status: 'success',
          isClosable: true
        });
      } else {
        toast({
          title: 'Tutor saved successfully',
          position: 'top-right',
          status: 'success',
          isClosable: true
        });
      }
      fetchBookmarkedTutors();
    } catch (e) {
      toast({
        title: 'An unknown error occured',
        position: 'top-right',
        status: 'error',
        isClosable: true
      });
    }
  };

  if (Object.keys(tutorData).length === 0) {
    return (
      <Box p={5} textAlign="center">
        <Spinner />
      </Box>
    );
  }

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'];
  const fixedTimeSlots = [
    '8AM -> 12PM',
    '12PM -> 5PM',
    '5PM -> 9PM',
    '9PM -> 12AM'
  ];

  const timeSlotsInUserTimezone = fixedTimeSlots.map((timeSlot) => {
    const [startTime, endTime] = timeSlot.split(' -> ');

    const startTimeInUserTimezone = calculateTimeDifference(
      convertTimeStringToISOString(startTime),
      tutorData.tz
    );

    const endTimeInUserTimezone = calculateTimeDifference(
      convertTimeStringToISOString(endTime),
      tutorData.tz
    );

    let timeSlotInUserTimezone = `${startTimeInUserTimezone} -> ${endTimeInUserTimezone}`;
    console.log('tz', timeSlotInUserTimezone);

    timeSlotInUserTimezone = timeSlotInUserTimezone.replace(/:\d+\s/g, '');

    return timeSlotInUserTimezone;
  });
  const fixedTimeSlotswithTimezone = timeSlotsInUserTimezone;
  return (
    <>
      <Box>
        <Breadcrumb
          spacing="8px"
          separator={<FiChevronRight size={10} color="gray.500" />}
          padding={{ base: '18px' }}
        >
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard/find-tutor">
              Shepherds
            </BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbItem isCurrentPage>
            <BreadcrumbLink href="#">
              {tutorData.user.name?.first} {tutorData.user.name?.last}
            </BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
        <Grid
          display={{ base: 'auto', md: 'grid' }}
          // minHeight="100vh"
          templateRows={{ base: 'repeat(3, 1fr)', sm: 'repeat(2, 1fr)' }}
          templateColumns={{ base: '1fr', sm: 'repeat(3, 1fr)' }}
          gap={4}
          height="120vh"
          padding={{ base: '18px' }}
        >
          <GridItem rowSpan={{ base: 1, sm: 2 }} colSpan={{ base: 1, sm: 2 }}>
            <Center>
              <Box
                maxW={'100%'}
                w={'full'}
                bg={'white'}
                boxShadow={'2xl'}
                rounded={'md'}
                overflow={'hidden'}
              >
                <Flex justify={'left'} p={6}>
                  <Box boxSize={106}>
                    <Image src={tutorData.user.avatar} borderRadius={8} />
                  </Box>
                </Flex>

                <Box px={6}>
                  <VStack spacing={0} align={'left'} mb={5} gap={2}>
                    <Flex alignItems="center" gap={1}>
                      <Text fontSize={'16px'} fontWeight={'500'} mb={0}>
                        {`${tutorData.user.name.first} ${tutorData.user.name.last}`}
                      </Text>
                      <RxDotFilled color="#DBDEE1" />
                      <Text fontSize={16} fontWeight={'500'}>
                        ${`${tutorData.rate}.00 / hr`}
                      </Text>
                    </Flex>

                    <Text
                      fontWeight={400}
                      color={'#212224'}
                      fontSize="14px"
                      mb={'2px'}
                    >
                      {tutorData.highestLevelOfEducation}
                    </Text>
                    <Flex>
                      {' '}
                      <Image src={Star} boxSize={4} />
                      <Text fontSize={12} fontWeight={400} color="#6E7682">
                        {` ${tutorData.rating}(${tutorData.reviewCount})`}
                      </Text>
                    </Flex>
                    <Flex alignItems={'center'} gap={2} mt={-20}>
                      <CustomButton
                        buttonText="Send Offer"
                        padding="10px 21px"
                        ml={-2}
                        onClick={() =>
                          navigate(`/dashboard/tutor/${tutorId}/offer`)
                        }
                      />
                      <Button
                        variant="unstyled"
                        color={'#585F68'}
                        bgColor={checkBookmarks() ? '#F0F6FE' : '#fff'}
                        border="1px solid #E7E8E9"
                        borderRadius="6px"
                        fontSize="12px"
                        leftIcon={
                          <img
                            src={checkBookmarks() ? Ribbon2 : Ribbon}
                            alt="save"
                          />
                        }
                        p={'7px 14px'}
                        display="flex"
                        _hover={{
                          boxShadow: 'lg',
                          transform: 'translateY(-2px)'
                        }}
                        my={3}
                        onClick={() => toggleBookmarkTutor(tutorId)}
                      >
                        {checkBookmarks() ? 'Unsave Profile' : 'Save Profile'}
                      </Button>
                    </Flex>

                    <Spacer />
                    <Box my={14}>
                      <Text
                        fontSize={'12px'}
                        color="text.400"
                        my={3}
                        fontWeight="semibold"
                      >
                        ABOUT ME
                      </Text>
                      <Text fontSize={'14px'} my={2}>
                        {tutorData.description}
                      </Text>
                    </Box>

                    <Box my={10} zIndex={2}>
                      <Tabs>
                        <TabList className="tab-list">
                          <Tab>REVIEWS</Tab>
                          <Tab>QUALIFICATIONS</Tab>
                          <Tab>AVAILABILITY</Tab>
                          <Tab>SUBJECT OFFERED</Tab>
                        </TabList>

                        <TabPanels>
                          <TabPanel>
                            {/* <Flex px={3} gap={0} direction={'row'} my={2}>
                              <Avatar
                                name="Kola Tioluwani"
                                src="https://bit.ly/tioluwani-kolawole"
                              />

                              <Stack direction={'column'} px={4} spacing={1}>
                                <Box>
                                  <Image src={Star4} height="14px" />{' '}
                                  <Text
                                    fontSize={'16px'}
                                    fontWeight={'500'}
                                    mb={0}
                                  >
                                    Jennifer A. Peters
                                  </Text>
                                  <Text
                                    fontWeight={400}
                                    color={'#585F68'}
                                    fontSize="14px"
                                    mb={'2px'}
                                  >
                                    Quam eros suspendisse a pulvinar sagittis
                                    mauris. Vel duis adipiscing id faucibuseltu
                                    consectetur amet. Tempor dui quam
                                    scelerisque at tempor aliquam. Vivamus
                                    aenean hendrerit turpis velit pretium.
                                  </Text>
                                </Box>

                                <Divider />
                              </Stack>
                            </Flex> */}
                            <Text
                              fontWeight={400}
                              color={'#585F68'}
                              fontSize="14px"
                              mb={'2px'}
                            >
                              You have no reviews yet
                            </Text>
                          </TabPanel>
                          <TabPanel>
                            {tutorData.qualifications.map((q) => (
                              <>
                                <Flex px={3} gap={0} direction={'row'} my={2}>
                                  <Image
                                    src={FileAvi2}
                                    alt="qualification"
                                    mb={4}
                                  />
                                  <Stack
                                    direction={'column'}
                                    px={4}
                                    spacing={1}
                                  >
                                    <Text
                                      fontSize={'16px'}
                                      fontWeight={'500'}
                                      mb={0}
                                    >
                                      {q.institution}
                                    </Text>
                                    <Text
                                      fontWeight={400}
                                      color={'#585F68'}
                                      fontSize="14px"
                                      mb={'2px'}
                                    >
                                      {q.degree}
                                    </Text>

                                    <Spacer />
                                    <Text
                                      fontSize={12}
                                      fontWeight={400}
                                      color="#6E7682"
                                    >
                                      {new Date(q.startDate).getFullYear()} -{' '}
                                      {new Date(q.endDate).getFullYear()}
                                    </Text>
                                  </Stack>
                                </Flex>
                                <Divider />
                              </>
                            ))}
                          </TabPanel>
                          <TabPanel>
                            <TableContainer my={2}>
                              <Box
                                border={'1px solid #EEEFF2'}
                                borderRadius={8}
                                // width="700px"
                              >
                                <Table variant="simple">
                                  <Thead>
                                    <Tr>
                                      <Th width={'155px'}></Th>
                                      {daysOfWeek.map((day, index) => (
                                        <Th key={index}>{day}</Th>
                                      ))}
                                    </Tr>
                                  </Thead>
                                  <Tbody>
                                    {fixedTimeSlotswithTimezone.map(
                                      (timeSlot, timeIndex) => (
                                        <Tr key={timeIndex}>
                                          <Td fontSize={12}>
                                            <Flex>
                                              <Image src={Day} ml={-15} />{' '}
                                              {timeSlot}
                                            </Flex>
                                          </Td>
                                          {daysOfWeek.map((day, dayIndex) => (
                                            <Td
                                              key={dayIndex}
                                              className={
                                                tutorData.schedule[
                                                  dayIndex.toString()
                                                ] &&
                                                tutorData.schedule[
                                                  dayIndex.toString()
                                                ].some(
                                                  (slot) =>
                                                    calculateTimeDifference(
                                                      convertTimeStringToISOString(
                                                        slot.begin
                                                      ),
                                                      tutorData.tz
                                                    ) ===
                                                      timeSlot.split(' ')[0] &&
                                                    calculateTimeDifference(
                                                      convertTimeStringToISOString(
                                                        slot.end
                                                      ),
                                                      tutorData.tz
                                                    ) === timeSlot.split(' ')[2]
                                                )
                                                  ? ''
                                                  : 'stripeBox'
                                              }
                                            >
                                              {tutorData.schedule[
                                                dayIndex.toString()
                                              ] &&
                                              tutorData.schedule[
                                                dayIndex.toString()
                                              ].some(
                                                (slot) =>
                                                  calculateTimeDifference(
                                                    convertTimeStringToISOString(
                                                      slot.begin
                                                    ),
                                                    tutorData.tz
                                                  ) ===
                                                    timeSlot.split(' ')[0] &&
                                                  calculateTimeDifference(
                                                    convertTimeStringToISOString(
                                                      slot.end
                                                    ),
                                                    tutorData.tz
                                                  ) === timeSlot.split(' ')[2]
                                              ) ? (
                                                <Image src={Check} mr={3} />
                                              ) : null}
                                            </Td>
                                          ))}
                                        </Tr>
                                      )
                                    )}
                                  </Tbody>
                                </Table>
                              </Box>
                            </TableContainer>
                          </TabPanel>
                          <TabPanel>
                            <TableContainer my={4}>
                              <Box
                                border={'1px solid #EEEFF2'}
                                borderRadius={8}
                                py={3}
                              >
                                <Table variant="simple">
                                  {/* <TableCaption>Imperial to metric conversion factors</TableCaption> */}
                                  <Thead>
                                    <Tr>
                                      <Th></Th>
                                      <Th>Qualification</Th>
                                      <Th>Price</Th>
                                    </Tr>
                                  </Thead>
                                  <Tbody>
                                    {tutorData.coursesAndLevels.map((cl) => (
                                      <Tr>
                                        <Td bgColor={'#FAFAFA'}>
                                          {cl.course.label}
                                        </Td>
                                        <Td>{cl.level?.label}</Td>
                                        <Td>${tutorData.rate}/hr</Td>
                                      </Tr>
                                    ))}

                                    {/* <Tr>
                                      <Td bgColor={"#FAFAFA"}>Maths</Td>
                                      <Td>A-level</Td>
                                      <Td>$10.00/hr</Td>
                                    </Tr>
                                    <Tr>
                                      <Td bgColor={"#FAFAFA"}>Yoruba</Td>
                                      <Td>Grade 12</Td>
                                      <Td>$10.00/hr</Td>
                                    </Tr> */}
                                  </Tbody>
                                </Table>
                              </Box>
                            </TableContainer>
                          </TabPanel>
                        </TabPanels>
                      </Tabs>
                    </Box>
                  </VStack>
                </Box>
              </Box>
            </Center>
          </GridItem>
          <GridItem h={{ base: 'auto', md: 305 }} position="relative">
            <Center position="relative" borderRadius={10}>
              <AspectRatio
                h={{ base: '50vh', md: '305px' }}
                w={{ base: 'full', md: 'full' }}
                ratio={1}
                objectFit={'cover'}
              >
                <iframe
                  title="naruto"
                  // src={'https://samplelib.com/lib/preview/mp4/sample-5s.mp4'}
                  src={tutorData.introVideo}
                  allowFullScreen
                  style={{ borderRadius: 10 }}
                />
              </AspectRatio>
              <Center
                color="white"
                display={vidOverlay ? 'flex' : 'none'}
                position={'absolute'}
                bg="#0D1926"
                opacity={'75%'}
                boxSize="full"
              >
                <VStack>
                  <BiPlayCircle
                    onClick={() => setVidOverlay(false)}
                    size={'50px'}
                  />
                  <Text display={'inline'}> watch intro video</Text>
                </VStack>
              </Center>
            </Center>
            {/* </Box> */}

            {/* <Stack
                  flex={1}
                  flexDirection="column"
                  justifyContent="center"
                  alignItems="center"
                  textAlign="center"
                  spacing={3}
                  p={1}
                  pt={2}>
                  <img src={FileAvi} alt="send-offer-img" />
                  <Text fontSize={16} fontWeight="semibold">
                    Send an offer to {tutorData.name?.first}
                  </Text>
                  <Text fontSize={14} fontWeight={400} color="#6E7682" maxWidth={'85%'}>
                    You’ll be notified once they respond to your offer
                  </Text>
                  <CustomButton
                    buttonText="Send Offer"
                    padding="9px 105px"
                    onClick={() => navigate(`/dashboard/tutor/${tutorId}/offer`)}
                  />
                </Stack> */}

            <Text fontSize={14} mt={8}>
              <Link
                color="#207DF7"
                href="/dashboard/find-tutor"
                textDecoration="underline"
              >
                More Economics tutors
              </Link>
            </Text>
          </GridItem>

          <GridItem>
            <Card>
              <Box
                px={4}
                pt={3}
                fontSize={16}
                fontWeight={'semibold'}
                display="flex"
              >
                <RiQuestionFill color="#969ca6" fontSize={'22px'} />
                <Text mx={2}>How this Works</Text>
              </Box>
              <CardBody>
                <LinedList
                  // mt={"30px"}
                  items={[
                    {
                      title: 'Send a Proposal',
                      subtitle:
                        'Find your desired tutor and prepare an offer on your terms and send to the tutor'
                    },
                    {
                      title: 'Get a Response',
                      subtitle:
                        'Proceed to provide your payment details once the tutor accepts your offer'
                    },
                    {
                      title: 'A Test-Run',
                      subtitle:
                        'You won’t be charged until after your first session, you may cancel after the first lesson.'
                    }
                  ]}
                />
              </CardBody>
            </Card>
          </GridItem>
        </Grid>
      </Box>
    </>
  );
}
