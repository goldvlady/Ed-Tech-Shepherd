import React, { useEffect, useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Box,
  Flex,
  Text,
  Center,
  VStack,
  SimpleGrid,
  Spacer,
  Spinner,
  Icon,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Button
} from '@chakra-ui/react';
import { BiPlayCircle } from 'react-icons/bi';
import ResourceIcon from '../../../../assets/resources-plan.svg';
import { RepeatIcon } from '@chakra-ui/icons';
import { FaPlus, FaVideo } from 'react-icons/fa';
import StudySessionLogger from '../../../../helpers/sessionLogger';
import { SessionType } from '../../../../types';

const ResourceModal = ({
  isOpen,
  onClose,
  state,
  updateState,

  findVideoDocumentsByTopic,
  getTopicResource
}) => {
  const [topicId, setTopicId] = useState(false);
  const [vidOverlay, setVidOverlay] = useState<boolean>(true);
  const [isLectureStarted, setIsLectureStarted] = useState(false);
  const [isLectureFinished, setIsLectureFinished] = useState(false);
  let studySessionLogger: StudySessionLogger | undefined = undefined;

  const isTutor = window.location.pathname.includes(
    '/dashboard/tutordashboard'
  );
  const startLecture = (id) => {
    setIsLectureStarted(!isLectureStarted);
    studySessionLogger = new StudySessionLogger(SessionType.LECTURES, id);
    studySessionLogger.start();
  };
  const stopLecture = (id) => {
    setIsLectureStarted(!isLectureStarted);
    studySessionLogger = new StudySessionLogger(SessionType.LECTURES, id);
    studySessionLogger.end();
  };
  useEffect(() => {
    return () => {
      if (studySessionLogger && studySessionLogger.currentState !== 'ENDED') {
        studySessionLogger.end();
      }
    };
  }, []);
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="3xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Flex alignItems="center">
            <ResourceIcon />
            <Text fontSize="16px" fontWeight="500">
              Extra Resources
            </Text>
          </Flex>
        </ModalHeader>
        <ModalCloseButton />
        {/* <ModalBody overflowY={'auto'} maxH="600px" flexDirection="column"> */}
        <Tabs px={3}>
          <TabList>
            <Tab>Lecture</Tab>
            <Tab>Articles</Tab>
            <Tab>Notebooks</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <>
                <Box
                  w="full"
                  p={4}
                  bg="white"
                  borderRadius={10}
                  borderWidth="1px"
                  borderColor="#EEEFF1"
                  justifyContent="center"
                  alignItems="center"
                  my={4}
                  overflowY={'auto'}
                >
                  <Flex>
                    {' '}
                    <Text
                      color="#6E7682"
                      fontSize="12px"
                      fontWeight="400"
                      wordBreak={'break-word'}
                      textTransform="uppercase"
                    >
                      Lecture
                    </Text>
                    <Spacer />{' '}
                    {isTutor && (
                      <Box
                        display={'flex'}
                        alignItems={'center'}
                        gap={1}
                        _hover={{ cursor: 'pointer' }}
                        cursor="pointer"
                      >
                        <label htmlFor={`videoInput`}>
                          <Icon as={FaVideo} boxSize={3} mx={2} />
                          Update Video
                        </label>
                        <input
                          type="file"
                          id={`videoInput`}
                          accept="video/*"
                          style={{ display: 'none' }}
                          // onChange={(e) =>
                          //   handleUploadTopicFile(topicIndex, e.target.files[0])
                          // }
                        />
                      </Box>
                    )}
                  </Flex>

                  <Center position="relative" borderRadius={10} my={2}>
                    <Box
                      h={{ base: '350px', md: '350px' }}
                      w={{ base: 'full', md: 'full' }}
                    >
                      <video
                        title="tutor-video"
                        controls
                        onPlay={() => startLecture(topicId)}
                        onEnded={() => {
                          console.log('ended');
                          stopLecture(topicId);
                        }}
                        style={{
                          borderRadius: 10,
                          width: '100%',
                          height: '100%'
                        }}
                      >
                        <source
                          src={
                            findVideoDocumentsByTopic(state.selectedTopic)[0]
                              ?.documentUrl
                          }
                          type="video/mp4"
                        />
                        Your browser does not support the video tag.
                      </video>
                    </Box>
                    {/* </AspectRatio> */}
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
                        <Text display={'inline'}> play video</Text>
                      </VStack>
                    </Center>
                  </Center>
                </Box>
                {!state.isLoading ? (
                  state.topicResource ? (
                    <Box w="full">
                      <Flex alignItems={'center'} my={2}>
                        <Text
                          fontSize={'17px'}
                          fontWeight="500"
                          px={1}
                          color="#000"
                        >
                          Summary
                        </Text>
                      </Flex>

                      <Box
                        p={4}
                        maxH="350px"
                        overflowY="auto"
                        // borderWidth="1px"
                        // borderRadius="md"
                        // borderColor="gray.200"
                        // boxShadow="md"
                        className="custom-scroll"
                      >
                        <Text lineHeight="6">
                          {state.topicResource?.completion.choices[0].message.content.replace(
                            /\[.*?\]/g,
                            ''
                          )}
                        </Text>
                      </Box>
                      <Text
                        fontSize={'17px'}
                        fontWeight="500"
                        px={1}
                        color="#000"
                        my={4}
                      >
                        Sources
                      </Text>
                      <SimpleGrid minChildWidth="150px" spacing="10px">
                        {state.topicResource?.search_results
                          .filter((item) => item.title)
                          .map((source, index) => (
                            <a
                              key={index}
                              href={`${source.link}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Box
                                bg="#F3F5F6"
                                p={4}
                                borderRadius="md"
                                boxShadow="md"
                                borderWidth="1px"
                                borderColor="gray.200"
                                cursor="pointer"
                                transition="transform 0.3s"
                                _hover={{ transform: 'scale(1.05)' }}
                              >
                                <Flex
                                  direction="column"
                                  textAlign="left"
                                  gap={2}
                                >
                                  <Text fontWeight={600} fontSize="sm">
                                    {source.title?.length > 15
                                      ? source.title?.substring(0, 15) + '...'
                                      : source.title}
                                  </Text>
                                  <Flex alignItems="center">
                                    <Text color="gray.500" fontSize="xs">
                                      {source.link?.length > 19
                                        ? source.link?.substring(0, 19) + '...'
                                        : source.link}
                                    </Text>
                                    <Spacer />
                                    <img
                                      className="h-3 w-3"
                                      alt={source.link}
                                      src={`https://www.google.com/s2/favicons?domain=${
                                        source.link
                                      }&sz=${16}`}
                                    />
                                  </Flex>
                                </Flex>
                              </Box>
                            </a>
                          ))}
                      </SimpleGrid>
                    </Box>
                  ) : (
                    <VStack>
                      <Text>No resource, Please try again</Text>
                      <RepeatIcon
                        boxSize={6}
                        onClick={() => getTopicResource(state.selectedTopic)}
                      />
                    </VStack>
                  )
                ) : (
                  <Spinner />
                )}
              </>
            </TabPanel>
            <TabPanel>
              <Box
                w="full"
                p={4}
                bg="white"
                justifyContent="center"
                alignItems="center"
                my={4}
              >
                <Center>
                  {' '}
                  <Button
                    color="gray"
                    size={'sm'}
                    variant="ghost"
                    alignItems="center"
                    float={'right'}
                    fontSize={12}
                  >
                    <Icon as={FaPlus} mr={2} />
                    Add New
                  </Button>
                </Center>
              </Box>
            </TabPanel>
            <TabPanel>
              <Box
                w="full"
                p={4}
                bg="white"
                justifyContent="center"
                alignItems="center"
                my={4}
              >
                <Center>
                  {' '}
                  <Button
                    color="gray"
                    size={'sm'}
                    variant="ghost"
                    alignItems="center"
                    float={'right'}
                    fontSize={12}
                  >
                    <Icon as={FaPlus} mr={2} />
                    Add New
                  </Button>
                </Center>
              </Box>
            </TabPanel>
          </TabPanels>
        </Tabs>
        {/* </ModalBody> */}
      </ModalContent>
    </Modal>
  );
};

export default ResourceModal;
