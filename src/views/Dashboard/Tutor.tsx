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
  useToast,
} from '@chakra-ui/react';
import { toNamespacedPath } from 'path';
import React, { useCallback, useEffect, useState } from 'react';
import { FiChevronRight } from 'react-icons/fi';
import { RiQuestionFill } from 'react-icons/ri';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';

import Star4 from '../../assets/4star.svg';
import Check from '../../assets/check.svg';
import Day from '../../assets/day.svg';
import FileAvi2 from '../../assets/file-avi2.svg';
import FileAvi from '../../assets/file-avi.svg';
import Star from '../../assets/littleStar.svg';
import Ribbon from '../../assets/ribbon-grey.svg';
import TutorAvi from '../../assets/tutoravi.svg';
import LinedList from '../../components/LinedList';
import ApiService from '../../services/ApiService';
import bookmarkedTutorsStore from '../../state/bookmarkedTutorsStore';
import HowItWorks from './components/HowItWorks';
import { CustomButton } from './layout';

export default function Tutor() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [loadingData, setLoadingData] = useState(false);
  const [tutorData, setTutorData] = useState<any>({});
  const [fullname, setFullname] = useState('');
  const [rateReview, setRateReview] = useState('');
  const tutorId: any = searchParams.get('id');
  const navigate = useNavigate();
  const toast = useToast();

  const getData = useCallback(async () => {
    setLoadingData(true);
    try {
      const resp = await ApiService.getTutor(tutorId);
      const data = await resp.json();
      setTutorData(data);
    } catch (e) {}
    setLoadingData(false);
  }, []);

  useEffect(() => {
    getData();
  }, []);

  const { fetchBookmarkedTutors, tutors: bookmarkedTutors } = bookmarkedTutorsStore();
  const doFetchBookmarkedTutors = useCallback(async () => {
    await fetchBookmarkedTutors();
  }, []);
  const checkBookmarks = (id: string) => {
    for (var i = 0; i < bookmarkedTutors.length; i++) {
      if (bookmarkedTutors[i].tutor._id == id) {
        return true;
        break;
      } else {
        return false;
      }
    }
  };
  console.log('BOOK', checkBookmarks(tutorId));

  const toggleBookmarkTutor = async (id: string) => {
    try {
      const resp = await ApiService.toggleBookmarkedTutor(id);
      console.log(resp);
      if (checkBookmarks(id)) {
        toast({
          title: 'Tutor removed from Bookmarks successfully',
          position: 'top-right',
          status: 'success',
          isClosable: true,
        });
      } else {
        toast({
          title: 'Tutor saved successfully',
          position: 'top-right',
          status: 'success',
          isClosable: true,
        });
      }
      fetchBookmarkedTutors();
    } catch (e) {
      toast({
        title: 'An unknown error occured',
        position: 'top-right',
        status: 'error',
        isClosable: true,
      });
    }
  };

  if (Object.keys(tutorData).length == 0) {
    return (
      <Box p={5} textAlign="center">
        <Spinner />
      </Box>
    );
  }

  return (
    <>
      <Box>
        <Breadcrumb spacing="8px" separator={<FiChevronRight size={10} color="gray.500" />}>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard/find-tutor">Find a tutor</BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbItem isCurrentPage>
            <BreadcrumbLink href="#">
              {tutorData.name?.first} {tutorData.name?.last}
            </BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
        <Grid h="870px" templateRows="repeat(2, 1fr)" templateColumns="repeat(3, 1fr)" gap={3}>
          <GridItem rowSpan={2} colSpan={2}>
            <Center py={3}>
              <Box
                maxW={'100%'}
                w={'full'}
                bg={'white'}
                boxShadow={'2xl'}
                rounded={'md'}
                overflow={'hidden'}>
                <AspectRatio h={'173px'} w={'full'} ratio={1} objectFit={'cover'}>
                  <iframe
                    title="naruto"
                    src="https://www.youtube.com/embed/QhBnZ6NPOY0"
                    allowFullScreen
                  />
                </AspectRatio>
                {/* <Image
                h={"120px"}
                w={"full"}
                src={
                  "https://images.unsplash.com/photo-1612865547334-09cb8cb455da?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80"
                }
                
              /> */}
                <Flex justify={'left'} mt={-12}>
                  <Avatar
                    size={'xl'}
                    src={tutorData.avatar}
                    ml={6}
                    //   alt={"Author"}
                    css={{
                      border: '4px solid white',
                    }}
                  />
                </Flex>

                <Box p={6}>
                  <VStack spacing={0} align={'left'} mb={5} gap={2}>
                    <Text fontSize={'16px'} fontWeight={'semibold'} mb={0}>
                      {`${tutorData.name.first} ${tutorData.name.last}`}
                    </Text>
                    <Text fontWeight={400} color={'#212224'} fontSize="14px" mb={'2px'}>
                      {tutorData.highestLevelOfEducation}
                    </Text>
                    <Flex>
                      {' '}
                      <Image src={Star} boxSize={4} />
                      <Text fontSize={12} fontWeight={400} color="#6E7682">
                        {` ${tutorData.rating}(${tutorData.reviewCount})`}
                      </Text>
                    </Flex>

                    <Button
                      variant="unstyled"
                      color="#585F68"
                      border="1px solid #E7E8E9"
                      borderRadius="6px"
                      fontSize="12px"
                      leftIcon={<img src={Ribbon} alt="save" />}
                      p={'7px 10px'}
                      w={'110px'}
                      display="flex"
                      _hover={{ bg: '#F0F6FE' }}
                      my={5}
                      onClick={() => toggleBookmarkTutor(tutorId)}>
                      Save Profile
                    </Button>
                    <Spacer />
                    <Box my={14}>
                      <Text fontSize={'12px'} color="text.400" my={3}>
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
                            <Flex px={3} gap={0} direction={'row'} my={2}>
                              <Avatar
                                name="Kola Tioluwani"
                                src="https://bit.ly/tioluwani-kolawole"
                              />

                              <Stack direction={'column'} px={4} spacing={1}>
                                <Box>
                                  <Image src={Star4} height="14px" />{' '}
                                  <Text fontSize={'16px'} fontWeight={'500'} mb={0}>
                                    Jennifer A. Peters
                                  </Text>
                                  <Text
                                    fontWeight={400}
                                    color={'#585F68'}
                                    fontSize="14px"
                                    mb={'2px'}>
                                    Quam eros suspendisse a pulvinar sagittis mauris. Vel duis
                                    adipiscing id faucibuseltu consectetur amet. Tempor dui quam
                                    scelerisque at tempor aliquam. Vivamus aenean hendrerit turpis
                                    velit pretium.
                                  </Text>
                                </Box>

                                <Divider />
                              </Stack>
                            </Flex>
                          </TabPanel>
                          <TabPanel>
                            <Flex px={3} gap={0} direction={'row'} my={2}>
                              <Image src={FileAvi2} alt="qualification" mb={4} />
                              <Stack direction={'column'} px={4} spacing={1}>
                                <Text fontSize={'16px'} fontWeight={'500'} mb={0}>
                                  Indian Institute of Management (IIM), Bangalore
                                </Text>
                                <Text fontWeight={400} color={'#585F68'} fontSize="14px" mb={'2px'}>
                                  Master of Business Administration (MBA), Information System
                                </Text>

                                <Spacer />
                                <Text fontSize={12} fontWeight={400} color="#6E7682">
                                  2008-2010
                                </Text>
                                <Divider />
                              </Stack>
                            </Flex>
                          </TabPanel>
                          <TabPanel>
                            <TableContainer my={2}>
                              <Box
                                border={'1px solid #EEEFF2'}
                                borderRadius={8}
                                // width="700px"
                              >
                                <Table
                                  sx={{
                                    tableLayout: 'fixed',
                                    width: 'full',
                                  }}
                                  variant="simple">
                                  {/* <TableCaption>Imperial to metric conversion factors</TableCaption> */}
                                  <Thead>
                                    <Tr
                                      sx={{
                                        th: {
                                          fontSize: '11px',
                                          fontWeight: 500,
                                          textTransform: 'none',
                                          color: '#000',
                                          textAlign: 'center',
                                          letterSpacing: '0px',
                                        },
                                      }}>
                                      <Th width={'150px'}></Th>
                                      <Th px={1}>Mon </Th>
                                      <Th>Tue </Th>
                                      <Th>Wed </Th>
                                      <Th>Thur </Th>
                                      <Th>Fri </Th>
                                      <Th>Sat </Th>
                                      <Th>Sun </Th>
                                    </Tr>
                                  </Thead>
                                  <Tbody>
                                    <Tr
                                      sx={{
                                        td: {
                                          textAlign: 'center',
                                          color: 'text.300',
                                        },
                                      }}>
                                      <Td bgColor={'#FAFAFA'} px={2}>
                                        <Text
                                          color="text.300"
                                          fontSize={14}
                                          fontWeight={500}
                                          display="flex">
                                          <Image src={Day} mr={3} /> 8AM {'->'} 12PM
                                        </Text>
                                      </Td>
                                      <Td className="stripeBox"></Td>
                                      <Td className="stripeBox"></Td>
                                      <Td className="stripeBox"></Td>{' '}
                                      <Td className="stripeBox"></Td>{' '}
                                      <Td className="stripeBox"></Td>{' '}
                                      <Td className="stripeBox"></Td>{' '}
                                      <Td className="stripeBox"></Td>
                                    </Tr>

                                    <Tr
                                      sx={{
                                        td: {
                                          textAlign: 'center',
                                          color: 'text.300',
                                        },
                                      }}>
                                      <Td bgColor={'#FAFAFA'} px={1}>
                                        {' '}
                                        <Text
                                          color="text.300"
                                          fontSize={14}
                                          fontWeight={500}
                                          display="flex">
                                          <Image src={Day} mr={3} /> 12PM {'->'} 5PM
                                        </Text>
                                      </Td>
                                      <Td>
                                        <Image src={Check} mr={3} />{' '}
                                      </Td>
                                      <Td>
                                        <Image src={Check} mr={3} />{' '}
                                      </Td>
                                      <Td className="stripeBox"></Td>{' '}
                                      <Td className="stripeBox"></Td>
                                      <Td>
                                        <Image src={Check} mr={3} />{' '}
                                      </Td>{' '}
                                      <Td>
                                        <Image src={Check} mr={3} />{' '}
                                      </Td>{' '}
                                      <Td>
                                        <Image src={Check} mr={3} />{' '}
                                      </Td>
                                    </Tr>
                                    <Tr
                                      sx={{
                                        td: {
                                          textAlign: 'center',
                                          color: 'text.300',
                                        },
                                      }}>
                                      <Td bgColor={'#FAFAFA'} px={1}>
                                        {' '}
                                        <Text
                                          color="text.300"
                                          fontSize={14}
                                          fontWeight={500}
                                          display="flex">
                                          <Image src={Day} mr={3} /> 5PM {'->'} 9PM
                                        </Text>
                                      </Td>
                                      <Td>
                                        <Image src={Check} mr={3} />{' '}
                                      </Td>
                                      <Td>
                                        <Image src={Check} mr={3} />{' '}
                                      </Td>
                                      <Td className="stripeBox"></Td>{' '}
                                      <Td className="stripeBox"></Td>
                                      <Td>
                                        <Image src={Check} mr={3} />{' '}
                                      </Td>{' '}
                                      <Td>
                                        <Image src={Check} mr={3} />{' '}
                                      </Td>{' '}
                                      <Td>
                                        <Image src={Check} mr={3} />{' '}
                                      </Td>
                                    </Tr>
                                  </Tbody>
                                </Table>
                              </Box>
                            </TableContainer>
                          </TabPanel>
                          <TabPanel>
                            <TableContainer my={4}>
                              <Box border={'1px solid #EEEFF2'} borderRadius={8} py={3}>
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
                                    <Tr>
                                      <Td bgColor={'#FAFAFA'}>Economics</Td>
                                      <Td>GCSE</Td>
                                      <Td>$10.00/hr</Td>
                                    </Tr>
                                    <Tr>
                                      <Td bgColor={'#FAFAFA'}>Maths</Td>
                                      <Td>A-level</Td>
                                      <Td>$10.00/hr</Td>
                                    </Tr>
                                    <Tr>
                                      <Td bgColor={'#FAFAFA'}>Yoruba</Td>
                                      <Td>Grade 12</Td>
                                      <Td>$10.00/hr</Td>
                                    </Tr>
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
          <GridItem h={305}>
            <Card py={8} mt={3}>
              <CardBody>
                <Stack
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
                </Stack>
              </CardBody>
            </Card>

            <Text fontSize={14} mt={8}>
              <Link color="#207DF7" href="/dashboard/find-tutor" textDecoration="underline">
                More Economics tutors
              </Link>
            </Text>
          </GridItem>

          <GridItem>
            <Card>
              <Box px={4} pt={3} fontSize={16} fontWeight={'semibold'} display="flex">
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
                        'Find your desired tutor and prepare an offer on your terms and send to the tutor',
                    },
                    {
                      title: 'Get a Response',
                      subtitle:
                        'Proceed to provide your payment details once the tutor accepts your offer',
                    },
                    {
                      title: 'A Test-Run',
                      subtitle:
                        'You won’t be charged until after your first session, you may cancel after the first lesson.',
                    },
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
