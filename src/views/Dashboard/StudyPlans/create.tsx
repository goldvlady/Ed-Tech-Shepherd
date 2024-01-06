import React, { useRef, useState, ChangeEvent, useEffect } from 'react';
import {
  Grid,
  Box,
  Divider,
  Editable,
  EditableInput,
  EditableTextarea,
  EditablePreview,
  Flex,
  FormControl,
  Image,
  Text,
  Input,
  Button,
  Heading,
  UnorderedList,
  ListItem,
  Icon,
  useToast,
  useDisclosure,
  Spacer,
  List,
  VStack,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Center,
  Link,
  HStack
} from '@chakra-ui/react';
import { format, isBefore } from 'date-fns';

import {
  FaPlus,
  FaCheckCircle,
  FaPencilAlt,
  FaRocket,
  FaTrashAlt
} from 'react-icons/fa';
import SelectComponent, { Option } from '../../../components/Select';
import { MdCancel, MdOutlineKeyboardArrowDown } from 'react-icons/md';
import { FiChevronDown } from 'react-icons/fi';
import { generateStudyPlan } from '../../../services/AI';
import { useCustomToast } from '../../../components/CustomComponents/CustomToast/useCustomToast';
import LoaderScreen from '../FlashCards/forms/flashcard_setup/loader_page';
import LoaderPage from '../../../components/LoaderPage';
import DatePicker from '../../../components/DatePicker';
import resourceStore from '../../../state/resourceStore';
import StudyPlans from '.';
import moment from 'moment';
import { GiCancel } from 'react-icons/gi';
import { SmallCloseIcon } from '@chakra-ui/icons';
import ApiService from '../../../services/ApiService';

function CreateStudyPlans() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedSubject, setSelectedSubject] = useState('');
  const [course, setCourse] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [testDate, setTestDate] = useState<any[]>([]);
  const [unassignedTopics, setUnassignedTopics] = useState<any[]>([
    // {
    //   mainTopic: 'Introduction to Music Fundamentals',
    //   subTopics: ['Notation', 'Rhythms', 'Scales', 'Intervals']
    // },
    // {
    //   mainTopic: 'Music Theory: Basics',
    //   subTopics: ['Major and Minor Scales', 'Circle of Fifths']
    // },
    // {
    //   mainTopic: 'Ear Training',
    //   subTopics: ['Interval Recognition', 'Solfège']
    // }
  ]);
  const [gradeLevel, setGradeLevel] = useState('');
  const [showSubjects, setShowSubjects] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [syllabusData, setSyllabusData] = useState([]);
  const [studyPlanData, setStudyPlanData] = useState([]);
  const { courses: courseList, levels: levelOptions } = resourceStore();

  const btnRef = useRef();
  const toast = useCustomToast();

  const subjectOptions = [
    { label: 'Eng', value: 'English' },
    { label: 'Maths', value: 'Maths' },
    { label: 'Bio', value: 'Biology' }
  ];

  // Function to add a new test date to the list
  const addTestDate = () => {
    const newTestDates = [...testDate, new Date()];
    setTestDate(newTestDates);
  };
  const removeTestDate = (indexToRemove) => {
    const updatedTestDates = [...testDate];
    updatedTestDates.splice(indexToRemove, 1);
    setTestDate(updatedTestDates);
  };

  const handleToggleSubjects = () => {
    setShowSubjects(!showSubjects);
  };
  const test = ['05/01/2024', '24/02/2024', '15/03/2024'];
  const dataa = [
    {
      topics: [
        {
          mainTopic: 'Introduction to Music Fundamentals',
          subTopics: ['Notation', 'Rhythms', 'Scales', 'Intervals']
        }
      ]
    },
    {
      topics: [
        {
          mainTopic: 'Music Theory: Basics',
          subTopics: ['Major and Minor Scales', 'Circle of Fifths']
        }
      ]
    },
    {
      topics: [
        {
          mainTopic: 'Ear Training',
          subTopics: ['Interval Recognition', 'Solfège']
        }
      ]
    },
    {
      topics: [
        {
          mainTopic: 'Rhythm and Meter',
          subTopics: ['Time Signatures', 'Note Values', 'Syncopation']
        }
      ]
    },
    {
      topics: [
        {
          mainTopic: 'Harmony and Chords',
          subTopics: ['Triads', 'Seventh Chords', 'Chord Progressions']
        }
      ]
    },
    {
      topics: [
        {
          mainTopic: 'Melody',
          subTopics: ['Motifs', 'Phrases', 'Cadences']
        }
      ]
    },
    {
      topics: [
        {
          mainTopic: 'Musical Forms',
          subTopics: ['Binary', 'Ternary', 'Rondo']
        }
      ]
    },
    {
      topics: [
        {
          mainTopic: 'Music History Overview',
          subTopics: ['Medieval', 'Renaissance']
        }
      ]
    },
    {
      topics: [
        {
          mainTopic: 'Baroque and Classical Periods',
          subTopics: []
        }
      ]
    },
    {
      topics: [
        {
          mainTopic: 'Romantic Period and 20th Century',
          subTopics: []
        }
      ]
    },
    {
      topics: [
        {
          mainTopic: 'Introduction to World Music',
          subTopics: ['African', 'Asian', 'Latin American']
        }
      ]
    }
  ];
  console.log(syllabusData);

  const handleGenerateSyllabus = async () => {
    setIsLoading(true);

    try {
      const response = await generateStudyPlan({
        syllabusData: {
          course: course,
          gradeLevel: gradeLevel,
          weekCount: 15
        }
      });

      if (response) {
        const result = response.studyPlan.map(({ topics }) => ({ topics }));
        setSyllabusData(result);

        setSelectedSubject(course);
      } else {
        toast({
          title: 'Unable to process this request.Please try again later',
          position: 'top-right',
          status: 'error',
          isClosable: true
        });
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      toast({
        title: `${error}`,
        position: 'top-right',
        status: 'error',
        isClosable: true
      });
    }
  };
  const updateMainTopic = (index, newMainTopic) => {
    const updatedSyllabusData = [...syllabusData];

    if (index >= 0 && index < updatedSyllabusData.length) {
      updatedSyllabusData[index] = {
        topics: [
          {
            mainTopic: newMainTopic,
            subTopics: updatedSyllabusData[index].topics[0].subTopics
          }
        ]
      };

      setSyllabusData(updatedSyllabusData);
    }
  };
  const deleteMainTopic = (index) => {
    const updatedSyllabusData = syllabusData.filter((_, i) => i !== index);
    setSyllabusData(updatedSyllabusData);
  };

  const getStudyPlan = async (startDate, testDates, syllabusData) => {
    const studyPlan = [];
    let currentStartDate = moment(startDate, 'DD/MM/YYYY');
    let topicsRemaining = syllabusData.slice();
    let i = 0;

    const getLastMoment = (date) =>
      moment.max(moment(date, 'DD/MM/YYYY'), moment());

    while (i < testDates.length) {
      const currentEndDate =
        i === testDates.length - 1
          ? getLastMoment(testDates[i])
          : moment(testDates[i], 'DD/MM/YYYY');

      const daysAvailable = currentEndDate.diff(currentStartDate, 'days') + 1;
      const daysUntilNextTest =
        i < testDates.length - 1
          ? moment(testDates[i + 1], 'DD/MM/YYYY').diff(currentEndDate, 'days')
          : 0;

      let topicsThisPeriod = Math.floor(
        (daysAvailable / (daysAvailable + daysUntilNextTest)) *
          topicsRemaining.length
      );
      topicsThisPeriod = Math.max(topicsThisPeriod, 1); // Ensure at least 1 topic per period

      if (topicsRemaining.length === 0 && i < testDates.length - 1) {
        // If no more topics and still have test dates, create an empty study week
        const studyWeek = {
          weekRange: `${currentStartDate.format(
            'DD/MM/YYYY'
          )} - ${currentEndDate.format('DD/MM/YYYY')}`,
          topics: []
        };

        studyPlan.push(studyWeek);
      } else if (topicsRemaining.length > 0) {
        const topics = topicsRemaining.slice(0, topicsThisPeriod);
        topicsRemaining = topicsRemaining.slice(topicsThisPeriod);

        const studyWeek = {
          weekRange: `${currentStartDate.format(
            'DD/MM/YYYY'
          )} - ${currentEndDate.format('DD/MM/YYYY')}`,
          topics: topics.map((topic) => ({
            mainTopic: topic.topics[0].mainTopic,
            subTopics: topic.topics[0].subTopics
          }))
        };

        studyPlan.push(studyWeek);
      }

      currentStartDate = currentEndDate.clone().add(1, 'day');
      i++;
    }

    console.log(studyPlan);
    setStudyPlanData(studyPlan);
    return studyPlan;
  };
  const saveStudyPlan = async () => {
    const payload = {
      course: selectedSubject,
      scheduleItems: convertArrays(studyPlanData)
    };
    try {
      const resp = await ApiService.createStudyPlan(payload);
      if (resp) {
        const response = await resp.json();
        console.log(response);
        if (resp.status === 201) {
          // setIsCompleted(true);
          toast({
            title: 'Study Plan Created Successfully',
            position: 'top-right',
            status: 'success',
            isClosable: true
          });
        } else {
          toast({
            title: 'Failed to create study plan, try again',
            position: 'top-right',
            status: 'error',
            isClosable: true
          });
        }
      }
    } catch (error: any) {
      return { error: error.message, message: error.message };
    }
  };
  const addTopicToWeek = (weekIndex, newTopic) => {
    const updatedStudyPlan = [...studyPlanData];
    if (weekIndex >= 0 && weekIndex < updatedStudyPlan.length) {
      updatedStudyPlan[weekIndex].topics.push(newTopic);

      setStudyPlanData(updatedStudyPlan); // Update studyPlanData state

      // Remove the added topic from unassignedTopics state, if present
      setUnassignedTopics((prevUnassignedTopics) => {
        const updatedUnassignedTopics = prevUnassignedTopics.filter((topic) => {
          // Your logic to compare the added topic and remove it if found
          // This comparison logic should depend on your topic structure and what uniquely identifies a topic
          // For example, assuming 'mainTopic' is unique, you can compare it:
          return topic.mainTopic !== newTopic.mainTopic;
        });

        return updatedUnassignedTopics;
      });
    }
  };

  const deleteTopicFromWeek = (weekIndex, topicIndex) => {
    const updatedStudyPlan = [...studyPlanData];
    if (
      weekIndex >= 0 &&
      weekIndex < updatedStudyPlan.length &&
      topicIndex >= 0 &&
      topicIndex < updatedStudyPlan[weekIndex].topics.length
    ) {
      const deletedTopic = updatedStudyPlan[weekIndex].topics.splice(
        topicIndex,
        1
      )[0]; // Extract deleted topic

      setStudyPlanData(updatedStudyPlan); // Update studyPlanData state

      setUnassignedTopics((prevUnassignedTopics) => [
        ...prevUnassignedTopics,
        deletedTopic
      ]); // Add deleted topic to unassignedTopics state
    }
  };
  // useEffect(() => {
  //   const resp = getStudyPlan(new Date(), test, syllabusData);

  //   if (syllabusData.length > 0) {
  //     console.log(resp);
  //   }
  // }, [syllabusData]);

  function convertArrays(A) {
    function formatDate(dateString) {
      const [day, month, year] = dateString.split('/');
      return `${year}-${month}-${day}`;
    }

    return A.map((week, index) => {
      const dates = week.weekRange.split(' - ');
      const startDate = formatDate(dates[0]);
      const endDate = formatDate(dates[1]);
      const topics = week.topics.map((topic) => {
        const { mainTopic, subTopics } = topic;
        const subTopicDetails = subTopics.map((subTopic) => ({
          label: subTopic,
          description: `Description for ${subTopic}`
        }));
        return {
          topic: {
            label: mainTopic,
            subTopics: subTopicDetails
          },
          startDate,
          endDate,
          weekIndex: index + 1,
          status: 'notStarted'
        };
      });
      return topics;
    }).flat();
  }

  return (
    <Grid
      templateColumns={[
        '35% 45% 20%',
        '35% 45% 20%',
        '35% 45% 20%',
        '35% 45% 20%'
      ]}
      h="90vh"
      w="100%"
      maxW="100vw"
      overflowX="hidden"
      //   p={10}
    >
      <Box
        py={10}
        px={4}
        className="create-syllabus"
        bg="white"
        overflowY="auto"
      >
        <Box borderRadius={8} bg="#F7F7F7" p={18} mb={3}>
          {' '}
          <Flex alignItems="center">
            <Image
              src="https://placehold.co/50x50"
              alt="Avatar of Bot Name"
              rounded="full"
              mr={4}
            />
            <Box>
              <Text fontWeight="500" fontSize={'16px'}>
                Bot Name
              </Text>
              <Text fontSize="sm" color="gray.600">
                Just starting school
              </Text>
            </Box>
          </Flex>
          <Text fontSize="13px" my={2}>
            Nibh augue arcu congue gravida risus diam. Turpis nulla ac urna
            elementum est dolales volutpat ullamcorper, limora tun dun kabash
            yato.
          </Text>
        </Box>
        {activeTab === 0 ? (
          <Box>
            {' '}
            <Box mb={6}>
              <Text as="label" htmlFor="gradeLevel" mb={2} display="block">
                Enter your grade level
              </Text>

              <FormControl mb={4}>
                <Menu>
                  <MenuButton
                    as={Button}
                    variant="outline"
                    rightIcon={<FiChevronDown />}
                    borderRadius="8px"
                    fontSize="0.875rem"
                    fontFamily="Inter"
                    color="#212224"
                    fontWeight="400"
                    width="100%"
                    height="42px"
                    textAlign="left"
                  >
                    {gradeLevel}
                  </MenuButton>
                  <MenuList minWidth={'auto'}>
                    {levelOptions.map((level) => (
                      <MenuItem
                        fontSize="0.875rem"
                        key={level._id}
                        _hover={{ bgColor: '#F2F4F7' }}
                        onClick={() => setGradeLevel(level.label)}
                      >
                        {level.label}
                      </MenuItem>
                    ))}
                  </MenuList>
                </Menu>
              </FormControl>
            </Box>
            <Box mb={6}>
              <Text as="label" htmlFor="subjects" mb={2} display="block">
                What subject would you like to generate a plan for
              </Text>
              <Input
                type="text"
                id="subjects"
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                borderWidth="1px"
                rounded="md"
                py={2}
                px={3}
                mb={2}
              />

              {/* <Button
            colorScheme="blue"
            variant="link"
            display="flex"
            alignItems="center"
          >
            <Icon as={FaPlus} mr={2} />
            Additional subject
          </Button> */}
            </Box>
            <Button
              colorScheme="blue"
              variant="solid"
              py={2}
              px={4}
              rounded="md"
              display="inline-flex"
              alignItems="center"
              onClick={handleGenerateSyllabus}
            >
              <Icon as={FaRocket} mr={2} />
              Generate Syllabi
            </Button>
          </Box>
        ) : (
          <Box>
            <Text as="label" htmlFor="subjects" mb={2} display="block">
              Please enter your test dates
            </Text>
            {/* <DatePicker
              name="endDate"
              placeholder="Select Test Date"
              value={testDate ? format(testDate, 'dd-MM-yyyy') : ''}
              onChange={(date) => setTestDate(date)}
            /> */}
            <Flex direction={'column'} gap={2}>
              {testDate &&
                testDate.map((date, index) => (
                  <>
                    <Flex key={index} align={'center'} gap={2}>
                      <Box width="100%">
                        <DatePicker
                          name={`testDate-${index}`}
                          placeholder="Select Test Date"
                          value={format(date, 'dd-MM-yyyy')}
                          onChange={(newDate) => {
                            const updatedTestDates = [...testDate];
                            updatedTestDates[index] = newDate;
                            setTestDate(updatedTestDates);
                          }}
                        />
                      </Box>

                      <MdCancel
                        onClick={() => removeTestDate(index)}
                        color={'gray'}
                      />
                    </Flex>
                  </>
                ))}
            </Flex>
            <Button
              colorScheme="blue"
              variant="link"
              display="flex"
              alignItems="center"
              onClick={addTestDate}
            >
              <Icon as={FaPlus} mr={2} />
              Additional Dates
            </Button>{' '}
            <Button
              colorScheme="blue"
              variant="solid"
              py={2}
              px={4}
              rounded="md"
              // display="inline-flex"
              float={'right'}
              alignItems="center"
              onClick={() =>
                getStudyPlan(
                  '01/01/2024',
                  testDate.map((date) => moment(date).format('DD/MM/YYYY')),
                  syllabusData
                )
              }
              my={4}
            >
              <Icon as={FaRocket} mr={2} />
              Generate Study Plan
            </Button>
          </Box>
        )}
      </Box>

      <Box p={10} className="review-syllabus" bg="#F9F9FB" overflowY={'scroll'}>
        <Tabs
          variant="soft-rounded"
          color="#F9F9FB"
          index={activeTab}
          onChange={(index) => setActiveTab(index)}
        >
          <TabList mb="1em">
            <Tab>Syllabus</Tab>
            <Tab>Study Plan</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Box>
                {isLoading ? (
                  <LoaderPage
                    module={'Syllabus'}
                    handleCancel={() => setIsLoading(false)}
                  />
                ) : (
                  <Box mb={6}>
                    <Text
                      fontSize="16px"
                      fontWeight="semibold"
                      mb={2}
                      color="text.200"
                    >
                      Review {selectedSubject} syllabus
                    </Text>

                    <Flex direction="column" gap={2}>
                      {syllabusData.map((topic, index) => (
                        <>
                          <Box
                            bg="white"
                            p={4}
                            rounded="md"
                            shadow="md"
                            key={index}
                          >
                            <Editable
                              value={topic.topics[0].mainTopic}
                              fontSize="16px"
                              fontWeight="500"
                              mb={2}
                              color="text.300"
                              onChange={(newMainTopic) =>
                                updateMainTopic(index, newMainTopic)
                              }
                            >
                              <EditablePreview />
                              <EditableInput />
                            </Editable>

                            <UnorderedList
                              listStyleType="disc"
                              listStylePosition="inside"
                              color="gray.700"
                              fontSize={14}
                            >
                              {topic.topics[0].subTopics.map((item, index) => (
                                <ListItem key={index}>{item}</ListItem>
                              ))}
                            </UnorderedList>
                            <Divider my={2} />
                            <Flex justify="space-between" alignItems="center">
                              <Box color="green.500">
                                <Icon as={FaCheckCircle} />
                              </Box>
                              <HStack color="gray.500" spacing={3}>
                                {/* <Icon as={FaPencilAlt} boxSize={3} /> */}
                                <Icon
                                  as={FaTrashAlt}
                                  boxSize={3}
                                  onClick={() => deleteMainTopic(index)}
                                />
                              </HStack>
                            </Flex>
                          </Box>
                          <Button
                            colorScheme="blue"
                            variant="solid"
                            py={2}
                            px={14}
                            rounded="md"
                            alignItems="center"
                            textAlign={'center'}
                            position={'fixed'}
                            bottom={2}
                            my="auto"
                            ml={120}
                            onClick={() => setActiveTab(1)}
                          >
                            Proceed
                          </Button>
                        </>
                      ))}
                    </Flex>
                  </Box>
                )}
              </Box>
            </TabPanel>
            <TabPanel>
              <Box>
                <Flex direction="column" gap={2}>
                  {' '}
                  {studyPlanData.length > 0 &&
                    studyPlanData.map((topic, weekindex) => (
                      <>
                        <Box bg="white" p={4} rounded="md" shadow="md">
                          <Text
                            fontSize="14px"
                            fontWeight="500"
                            mb={2}
                            color="text.300"
                          >
                            {topic.weekRange}
                          </Text>
                          <UnorderedList
                            listStyleType="circle"
                            listStylePosition="inside"
                            color="gray.700"
                            fontSize={14}
                            // h={'100px'}
                          >
                            {topic.topics.map((item, index) => (
                              <Flex>
                                {' '}
                                <ListItem key={index}>
                                  {item.mainTopic}
                                </ListItem>
                                <Spacer />
                                <SmallCloseIcon
                                  color={'gray.500'}
                                  onClick={() =>
                                    deleteTopicFromWeek(weekindex, index)
                                  }
                                />
                              </Flex>
                            ))}
                          </UnorderedList>
                          <Divider my={2} />
                          <Flex>
                            <Menu>
                              <MenuButton
                                as={Link}
                                color="gray.500"
                                _hover={{ textDecoration: 'none' }}
                                fontSize={14}
                              >
                                <Icon as={FaPlus} mr={2} />
                                Add Topic
                              </MenuButton>
                              <MenuList color={'gray.500'}>
                                {unassignedTopics.map((item, index) => (
                                  <MenuItem
                                    onClick={() =>
                                      addTopicToWeek(weekindex, item)
                                    }
                                  >
                                    {item.mainTopic}
                                  </MenuItem>
                                ))}
                              </MenuList>
                            </Menu>

                            <Spacer />
                            <Box color="gray.500">
                              <Icon as={FaPencilAlt} />
                            </Box>
                          </Flex>
                        </Box>{' '}
                      </>
                    ))}
                  {studyPlanData.length > 0 && (
                    <Button
                      colorScheme="blue"
                      variant="solid"
                      py={2}
                      px={14}
                      rounded="md"
                      alignItems="center"
                      position={'fixed'}
                      bottom={2}
                      my="auto"
                      ml={100}
                      onClick={() => saveStudyPlan()}
                    >
                      Save & Proceed
                    </Button>
                  )}
                </Flex>
              </Box>
            </TabPanel>
          </TabPanels>
        </Tabs>
        {/* <Center>
          {' '}
          <Button
            colorScheme="blue"
            variant="solid"
            py={2}
            px={4}
            rounded="md"
            alignItems="center"
            position={'sticky'}
            bottom={0}
          >
            Confirm & Proceed
          </Button>
        </Center> */}
      </Box>

      <Box py={8} className="select-syllabus" bg="white" overflowY="auto">
        <Flex
          align="center"
          mb={2}
          onClick={handleToggleSubjects}
          color="text.400"
          cursor="pointer"
          py={2}
          px={5}
          _hover={{ bg: 'gray.100' }}
        >
          <Text fontSize={'16px'} fontWeight="500">
            Syllabi
          </Text>
          <Spacer />
          <FiChevronDown />
        </Flex>
        <List spacing={3}>
          {showSubjects &&
            subjectOptions.map((subject, index) => (
              <ListItem
                key={index}
                onClick={() => {
                  setSelectedSubject(subject.value);
                  onClose();
                }}
                cursor="pointer"
                py={2}
                fontSize="14px"
                color="text.400"
                _hover={{ bg: '#F2F2F3', color: 'text.200' }}
                bg={selectedSubject === subject.value ? 'gray.200' : 'inherit'}
              >
                <Text px={5}>{subject.value}</Text>
              </ListItem>
            ))}
        </List>
      </Box>
    </Grid>
  );
}

export default CreateStudyPlans;
