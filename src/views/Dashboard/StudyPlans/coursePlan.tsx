import React, { useRef, useState, ChangeEvent } from 'react';
import {
  Grid,
  Box,
  Divider,
  Flex,
  Image,
  Text,
  Input,
  Button,
  Heading,
  UnorderedList,
  ListItem,
  Icon,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Spacer,
  List,
  VStack,
  IconButton,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel
} from '@chakra-ui/react';
import { FaPlus, FaCheckCircle, FaPencilAlt, FaRocket } from 'react-icons/fa';
import SelectComponent, { Option } from '../../../components/Select';
import { MdOutlineKeyboardArrowDown } from 'react-icons/md';
import { FiChevronDown } from 'react-icons/fi';
import { ArrowLeftIcon } from '@chakra-ui/icons';
import { IoIosArrowRoundBack } from 'react-icons/io';
import SubjectCard from '../../../components/SubjectCard';
import Events from '../../../components/Events';

function CoursePlan() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedSubject, setSelectedSubject] = useState('');
  const [showSubjects, setShowSubjects] = useState(false);
  const btnRef = useRef();

  const subjectOptions = [
    { label: 'Eng', value: 'English' },
    { label: 'Maths', value: 'Maths' },
    { label: 'Bio', value: 'Biology' }
  ];
  const syllabusData = [
    {
      id: 1,
      topic: 'Course Introduction',
      subtopics: [
        { id: 1, label: 'Introduction to technical communication' },
        { id: 1, label: 'Features of effective technical communication' }
      ]
    }
  ];
  const handleChangeSubject = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setSelectedSubject(value);
    onClose();
  };

  const handleToggleSubjects = () => {
    setShowSubjects(!showSubjects);
  };

  return (
    // <Grid templateColumns="1fr 1fr" gap={4} p={10}>
    //   <Box p={10}>
    //     <Flex alignItems="center" mb={6}>
    //       <Image
    //         src="https://placehold.co/50x50"
    //         alt="Avatar of Bot Name"
    //         rounded="full"
    //         mr={4}
    //       />
    //       <Box>
    //         <Text fontWeight="semibold">Bot Name</Text>
    //         <Text fontSize="sm" color="gray.600">
    //           Just starting school
    //         </Text>
    //       </Box>
    //     </Flex>
    //     <Text fontSize="sm" mb={6}>
    //       Nibh augue arcu congue gravida risus diam. Turpis nulla ac urna
    //       elementum est dolales volutpat ullamcorper, limora tun dun kabash
    //       yato.
    //     </Text>
    //     <Box mb={6}>
    //       <Text as="label" htmlFor="gradeLevel" mb={2} display="block">
    //         Enter your grade level
    //       </Text>
    //       <Input
    //         type="text"
    //         id="gradeLevel"
    //         placeholder="e.g college year 1"
    //         borderWidth="1px"
    //         rounded="md"
    //         py={2}
    //         px={3}
    //       />
    //     </Box>
    //     <Box mb={6}>
    //       <Text as="label" htmlFor="subjects" mb={2} display="block">
    //         What subject(s) are you taking
    //       </Text>
    //       <Input
    //         type="text"
    //         id="subjects"
    //         value="Physics"
    //         borderWidth="1px"
    //         rounded="md"
    //         py={2}
    //         px={3}
    //         mb={2}
    //       />
    //       <Input
    //         type="text"
    //         value="Biology"
    //         borderWidth="1px"
    //         rounded="md"
    //         py={2}
    //         px={3}
    //         mb={2}
    //       />
    //       <Button
    //         colorScheme="blue"
    //         variant="link"
    //         display="flex"
    //         alignItems="center"
    //       >
    //         <Icon as={FaPlus} mr={2} />
    //         Additional subject
    //       </Button>
    //     </Box>
    //     <Button
    //       colorScheme="blue"
    //       variant="solid"
    //       py={2}
    //       px={4}
    //       rounded="md"
    //       display="inline-flex"
    //       alignItems="center"
    //     >
    //       <Icon as={FaRocket} mr={2} />
    //       Generate Syllabi
    //     </Button>
    //   </Box>

    //   <Box p={10} bg="gray.100">
    //     <Box mb={6}>
    //       <Heading as="h2" fontSize="lg" fontWeight="semibold" mb={2}>
    //         Review syllabus
    //       </Heading>
    //       <Box bg="white" p={4} rounded="md" shadow="md">
    //         <Heading as="h3" fontSize="md" fontWeight="semibold" mb={2}>
    //           Course Introduction
    //         </Heading>
    //         <UnorderedList
    //           listStyleType="disc"
    //           listStylePosition="inside"
    //           color="gray.700"
    //         >
    //           <ListItem>Introduction to Physics</ListItem>
    //           <ListItem>Features of effective technical communication</ListItem>
    //           <ListItem>Features of effective technical communication</ListItem>
    //           <ListItem>Features of effective technical communication</ListItem>
    //         </UnorderedList>
    //         <Flex justify="space-between" alignItems="center" mt={4}>
    //           <Box color="green.500">
    //             <Icon as={FaCheckCircle} />
    //           </Box>
    //           <Box color="gray.500">
    //             <Icon as={FaPencilAlt} />
    //           </Box>
    //         </Flex>
    //       </Box>
    //     </Box>
    //     {/* Repeat similar structure for other course introductions */}
    //   </Box>
    // </Grid>
    <>
      {' '}
      <Flex alignItems={'center'}>
        <IoIosArrowRoundBack />
        <Text fontSize={12}>Back</Text>
      </Flex>
      <Grid
        templateColumns={[
          '35% 45% 20%',
          '35% 45% 20%',
          '35% 45% 20%',
          '35% 45% 20%'
        ]}
        h="100vh"
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
            <Box>
              <Text fontWeight="500" fontSize={'16px'}>
                Schedule study session
              </Text>
              <Text fontSize="sm" color="gray.600">
                Set your preferred study plan to meet your goal
              </Text>
            </Box>
          </Box>

          <SubjectCard
            title="Chemistry CS23"
            score={75}
            scoreColor="green"
            date="24 Apr, 2023"
          />
        </Box>

        <Box p={10} className="review-syllabus" bg="#F9F9FB">
          <Tabs>
            <TabList mb="1em">
              <Tab>Topics</Tab>
              <Tab>Analytics</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Box>
                  <Box mb={6}>
                    <Text
                      fontSize="16px"
                      fontWeight="semibold"
                      mb={2}
                      color="text.200"
                    >
                      Review syllabus
                    </Text>

                    {/* <Drawer
            isOpen={isOpen}
            placement="right"
            onClose={onClose}
            finalFocusRef={btnRef}
          >
            <DrawerOverlay />
            <DrawerContent>
              <DrawerCloseButton />
              <DrawerHeader>Select Subject</DrawerHeader>

              <DrawerBody>
               
              </DrawerBody>

           
            </DrawerContent>
          </Drawer> */}
                    <Flex direction="column" gap={2}>
                      {syllabusData.map((topic, index) => (
                        <>
                          <Box bg="white" p={4} rounded="md" shadow="md">
                            <Text
                              fontSize="16px"
                              fontWeight="500"
                              mb={2}
                              color="text.300"
                            >
                              Course Introduction
                            </Text>
                            <UnorderedList
                              listStyleType="disc"
                              listStylePosition="inside"
                              color="gray.700"
                              fontSize={14}
                            >
                              <ListItem>Introduction to Physics</ListItem>
                              <ListItem>
                                Features of effective technical communication
                              </ListItem>
                              <ListItem>
                                Features of effective technical communication
                              </ListItem>
                              <ListItem>
                                Features of effective technical communication
                              </ListItem>
                            </UnorderedList>
                            <Divider my={2} />
                            <Flex justify="space-between" alignItems="center">
                              <Box color="green.500">
                                <Icon as={FaCheckCircle} />
                              </Box>
                              <Box color="gray.500">
                                <Icon as={FaPencilAlt} />
                              </Box>
                            </Flex>
                          </Box>
                        </>
                      ))}
                    </Flex>
                  </Box>
                </Box>
              </TabPanel>
              <TabPanel>
                <p>Study Plan!</p>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>

        <Box py={8} className="select-syllabus" bg="white" overflowY="auto">
          {/* <Events key={2} event={} /> */}
        </Box>
      </Grid>
    </>
  );
}

export default CoursePlan;
