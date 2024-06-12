import React, { RefObject, useEffect, useMemo, useRef, useState } from 'react';
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
  Button,
  Input,
  FormLabel,
  InputGroup,
  InputLeftAddon,
  InputRightAddon,
  Grid,
  IconButton
} from '@chakra-ui/react';
import { BiPlayCircle, BiTrash } from 'react-icons/bi';
import ResourceIcon from '../../../../assets/resources-plan.svg';
import { AttachmentIcon, DeleteIcon, RepeatIcon } from '@chakra-ui/icons';
import { FaPlus, FaTrash, FaTrashAlt, FaVideo } from 'react-icons/fa';
import StudySessionLogger from '../../../../helpers/sessionLogger';
import { SessionType } from '../../../../types';
import theme from '../../../../theme';
import userStore from '../../../../state/userStore';
import ApiService from '../../../../services/ApiService';
import { useCustomToast } from '../../../../components/CustomComponents/CustomToast/useCustomToast';
import uploadFile from '../../../../helpers/file.helpers';
import { RiUploadCloud2Fill } from 'react-icons/ri';
import styled from 'styled-components';
import { textTruncate } from '../../../../util';
import documentStore from '../../../../state/documentStore';

const FileName = styled.span`
  font-size: 0.875rem;
  font-weight: 700;
  color: #585f68;
`;
const PDFTextContainer = styled.div`
  text-align: center;
  margin-bottom: 1.5rem;
`;
const ResourceModal = ({
  isOpen,
  onClose,
  state,
  updateState,
  selectedPlanId,
  topicId,
  fetchPlanResources,
  findLectureByTopic,
  findArticlesByTopic,
  findNotebooksByTopic,
  getTopicResource
}) => {
  const [vidOverlay, setVidOverlay] = useState<boolean>(true);
  const [isLectureStarted, setIsLectureStarted] = useState(false);
  const [isLectureFinished, setIsLectureFinished] = useState(false);
  const [isAddNewOpened, setIsAddNewOpened] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [tabIndex, setTabIndex] = useState(0);
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [articleTitle, setArticleTitle] = useState('');
  const [articleUrl, setArticleUrl] = useState('');
  const [notebookTitle, setNotebookTitle] = useState('');
  const [notebookUrl, setNotebookUrl] = useState('');
  const [articles, setArticles] = useState(() =>
    findArticlesByTopic(state.selectedTopic)
  );
  const [notebooks, setNotebooks] = useState(() =>
    findNotebooksByTopic(state.selectedTopic)
  );
  const [isDragOver, setIsDragOver] = useState(false);
  const [docLoading, setDocLoading] = useState(false);
  const [fileName, setFileName] = useState('');

  const { user } = userStore();
  const { deleteStudentDocument, isLoading: isDocLoading } = documentStore();
  const toast = useCustomToast();
  let studySessionLogger: StudySessionLogger | undefined = undefined;
  console.log(selectedPlanId);

  const isTutor = window.location.pathname.includes(
    '/dashboard/tutordashboard'
  );

  const [selectedVideo, setSelectedVideo] = useState(
    findLectureByTopic(state.selectedTopic)[0] || {}
  );

  useEffect(() => {
    const lectures = findLectureByTopic(state.selectedTopic);
    console.log(lectures);

    if (lectures.length > 0) {
      setSelectedVideo(lectures[0]);
    }
  }, [findLectureByTopic]);

  const handleVideoSelect = (video) => {
    setSelectedVideo(video);
    setVidOverlay(true);
  };

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

  const storeStudyPlanTopicDoc = async (documentId) => {
    try {
      const payload = {
        studyPlanId: selectedPlanId,
        topicId: topicId,
        documentId: documentId
      };
      const response = await ApiService.storeStudyPlanTopicDocument(payload);
      if (response.ok) {
        setIsLoading(false);

        toast({
          title: 'Resource stored successfully',
          position: 'top-right',
          status: 'success',
          isClosable: true
        });
        fetchPlanResources(selectedPlanId);
        resetFields();

        setIsAddNewOpened(false);
      }
    } catch (error) {
      setIsLoading(false);

      toast({
        title: 'Failed to store resource. Please try again later.',
        position: 'top-right',
        status: 'error',
        isClosable: true
      });

      // console.error('Error storing document:', error);
    }
  };

  async function saveDocumentAndStoreStudyPlan(url, title, type) {
    setIsLoading(true);
    try {
      // Save the student document
      const documentResponse: any = await ApiService.saveStudentDocument({
        documentUrl: url,
        title,
        type
      });

      const docResponse = await documentResponse.json();
      // Extract the document ID from the response
      const documentId = docResponse.data.id;

      // Store study plan topic doc
      await storeStudyPlanTopicDoc(documentId);

      // Return the document ID if needed
      return documentId;
    } catch (error) {
      // Handle errors appropriately
      setIsLoading(false);

      console.error(
        'Error saving document and storing study plan topic:',
        error
      );
      throw error; // Re-throw the error for the caller to handle
    }
  }
  const handleUploadInput = (file: File | null) => {
    if (!file) return;
    if (file?.size > 500000000) {
      toast({
        title: 'Please upload a file under 500MB',
        status: 'error',
        position: 'top',
        isClosable: true
      });
      return;
    } else {
      setDocLoading(true);
      const readableFileName = file.name
        .toLowerCase()
        .replace(/\.pdf$/, '')
        .replace(/_/g, ' ');
      const uploadEmitter = uploadFile(file, {
        studentID: user._id, // Assuming user._id is always defined
        documentID: readableFileName // Assuming readableFileName is the file's name
      });

      uploadEmitter.on('progress', (progress: number) => {
        // Update the progress. Assuming progress is a percentage (0 to 100)

        setDocLoading(true);
      });

      uploadEmitter.on('complete', async (uploadFile) => {
        // Assuming uploadFile contains the fileUrl and other necessary details.
        const documentURL = uploadFile.fileUrl;
        setDocLoading(false);
        setFileName(readableFileName);
        setNewTitle(readableFileName);
        setNewUrl(documentURL);
      });
      uploadEmitter.on('error', (error) => {
        setDocLoading(false);
        // setCvUploadPercent(0);
        toast({ title: error.message + error.cause, status: 'error' });
      });
    }
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };
  const inputRef = useRef(null) as RefObject<HTMLInputElement>;

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files[0];
    handleUploadInput(files);
  };
  const handleDeleteResource = async (id: string) => {
    const isDeleted = await deleteStudentDocument(id);

    if (isDeleted) {
      toast({
        position: 'top-right',
        title: `item deleted successfully`,
        status: 'success'
      });
      fetchPlanResources(selectedPlanId);
    } else {
      toast({
        position: 'top-right',
        title: `Failed to delete item`,
        status: 'error'
      });
    }
  };

  const isYouTubeLink = (url) => {
    const youtubeRegex =
      /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;
    return youtubeRegex.test(url);
  };
  const convertToEmbedLink = (url) => {
    const videoIdMatch = url.match(
      /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/
    );
    return videoIdMatch
      ? `https://www.youtube.com/embed/${videoIdMatch[1]}`
      : null;
  };
  const getYouTubeThumbnail = (url) => {
    const videoId = url.split('v=')[1];
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  };
  const resetFields = () => {
    setNewTitle('');
    setYoutubeUrl('');
    setSelectedVideo('');
  };

  useEffect(() => {
    resetFields();
  }, []);
  console.log(selectedVideo);

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        setSelectedVideo('');
        onClose();
      }}
      size="3xl"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Flex alignItems="center" gap={1}>
            <ResourceIcon />
            <Text fontSize="16px" fontWeight="500">
              {user.school ? 'Resources' : 'Extra Resources'}
            </Text>
          </Flex>
        </ModalHeader>
        <ModalCloseButton />
        {user.school ? (
          <Tabs px={3} onChange={(index) => setTabIndex(index)}>
            <TabList>
              <Flex w="full" alignItems={'center'} color="gray">
                <Tab _selected={{ color: '#207df7', borderColor: '#207df7' }}>
                  Lecture
                </Tab>
                <Tab _selected={{ color: '#207df7', borderColor: '#207df7' }}>
                  Articles
                </Tab>
                <Tab _selected={{ color: '#207df7', borderColor: '#207df7' }}>
                  Notebooks
                </Tab>
                <Spacer />
                {isTutor &&
                  (tabIndex === 0 ? (
                    <>
                      {/* <label htmlFor={`videoInput`}> */}
                      <Button
                        color="gray"
                        _hover={{
                          borderRadius: 4,
                          cursor: 'pointer'
                        }}
                        bg="#edf2f7"
                        px={3}
                        py={1}
                        float={'right'}
                        fontSize={12}
                        onClick={() => setIsAddNewOpened(!isAddNewOpened)}
                      >
                        <Icon as={FaVideo} mr={2} /> Update Video
                      </Button>
                      {/* </label> */}
                      {/* <input
                        type="file"
                        id={`videoInput`}
                        accept="video/*"
                        style={{ display: 'none' }}
                        // onChange={(e) =>
                        //   handleUploadTopicFile(topicIndex, e.target.files[0])
                        // }
                      /> */}
                    </>
                  ) : (
                    <>
                      <Button
                        color="gray"
                        size={'sm'}
                        variant="ghost"
                        float={'right'}
                        fontSize={12}
                        onClick={() => setIsAddNewOpened(true)}
                      >
                        <Icon as={FaPlus} mr={2} /> Add New
                      </Button>
                    </>
                  ))}
              </Flex>
            </TabList>

            <TabPanels>
              <TabPanel>
                <Box
                  w="full"
                  p={4}
                  bg="white"
                  borderRadius={10}
                  borderWidth="1px"
                  borderColor="#EEEFF1"
                  my={4}
                >
                  <Box
                    p={2}
                    // borderWidth="1px"
                    // borderRadius={10}
                    overflowY={'auto'}
                    mb={6}
                  >
                    {!isAddNewOpened && (
                      <Flex>
                        <Text
                          color="#6E7682"
                          fontSize="12px"
                          fontWeight="400"
                          wordBreak={'break-word'}
                          textTransform="uppercase"
                        >
                          {selectedVideo?.title}
                        </Text>
                        <Spacer />
                      </Flex>
                    )}

                    <Center position="relative" borderRadius={10} my={2}>
                      {!isAddNewOpened ? (
                        <>
                          <Box
                            h={{ base: '350px', md: '350px' }}
                            w={{ base: 'full', md: 'full' }}
                          >
                            {isYouTubeLink(selectedVideo?.documentUrl) ? (
                              <div
                                style={{
                                  position: 'relative',
                                  width: '100%',
                                  height: '0',
                                  paddingBottom: '56.25%'
                                }}
                              >
                                <iframe
                                  key={selectedVideo?._id}
                                  title="YouTube Video"
                                  src={convertToEmbedLink(
                                    selectedVideo?.documentUrl
                                  )}
                                  frameBorder="0"
                                  allowFullScreen
                                  style={{
                                    position: 'absolute',
                                    width: '100%',
                                    height: '100%',
                                    top: '0',
                                    left: '0'
                                  }}
                                ></iframe>
                              </div>
                            ) : (
                              <video
                                key={selectedVideo?._id}
                                title="tutor-video"
                                controls
                                onPlay={() => startLecture(topicId)}
                                onEnded={() => stopLecture(topicId)}
                                style={{
                                  borderRadius: 10,
                                  width: '100%',
                                  height: '100%'
                                }}
                              >
                                <source
                                  src={selectedVideo?.documentUrl}
                                  type="video/mp4"
                                />
                                Your browser does not support the video tag.
                              </video>
                            )}
                          </Box>
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
                              <Text display={'inline'}>play video</Text>
                            </VStack>
                          </Center>
                        </>
                      ) : (
                        <div className="flex flex-col gap-4 w-full">
                          <Input
                            placeholder="video title"
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                          />
                          <InputGroup>
                            <InputLeftAddon>
                              https://youtube.com/
                            </InputLeftAddon>
                            <Input
                              placeholder="watch?v=abcdefghjj"
                              value={youtubeUrl}
                              onChange={(e) => setYoutubeUrl(e.target.value)}
                            />
                          </InputGroup>
                          <p className="text-center">or</p>
                          <Center
                            w="full"
                            minH="65px"
                            my={3}
                            p={2}
                            border="2px"
                            borderColor={isDragOver ? 'gray.600' : 'gray.300'}
                            borderStyle="dashed"
                            rounded="lg"
                            cursor="pointer"
                            bg={isDragOver ? 'gray.600' : 'gray.50'}
                            color={isDragOver ? 'white' : 'inherit'}
                            onDragOver={(e) => handleDragEnter(e)}
                            onDragEnter={(e) => handleDragEnter(e)}
                            onDragLeave={(e) => handleDragLeave(e)}
                            onDrop={(e) => handleDrop(e)}
                          >
                            <label htmlFor="file-upload">
                              <Center flexDirection="column">
                                {docLoading ? (
                                  <>
                                    <Spinner /> Uploading..
                                  </>
                                ) : fileName ? (
                                  <Flex>
                                    <AttachmentIcon /> <span>{fileName}</span>
                                  </Flex>
                                ) : (
                                  <Flex
                                    direction={'column'}
                                    alignItems={'center'}
                                  >
                                    <RiUploadCloud2Fill
                                      className="h-8 w-8"
                                      color="gray.500"
                                    />
                                    <Text
                                      mb="2"
                                      fontSize="sm"
                                      color={isDragOver ? 'white' : 'gray.500'}
                                      fontWeight="semibold"
                                    >
                                      Click to upload or drag and drop
                                    </Text>
                                    <Text
                                      fontSize="xs"
                                      color={isDragOver ? 'white' : 'gray.500'}
                                    >
                                      Video (MAX: 500 MB)
                                    </Text>
                                  </Flex>
                                )}
                              </Center>
                            </label>
                            <input
                              type="file"
                              accept="video/*"
                              className="hidden"
                              id="file-upload"
                              ref={inputRef}
                              onChange={(e) =>
                                handleUploadInput(e.target.files[0])
                              }
                            />
                          </Center>
                          <Flex className="gap-2 justify-end">
                            <Button onClick={() => setIsAddNewOpened(false)}>
                              Cancel
                            </Button>
                            <Button
                              isDisabled={
                                docLoading ||
                                !newTitle ||
                                (!newUrl && !youtubeUrl)
                              }
                              isLoading={isLoading}
                              onClick={() =>
                                saveDocumentAndStoreStudyPlan(
                                  newUrl
                                    ? newUrl
                                    : `https://www.youtube.com/${youtubeUrl}`,
                                  newTitle,
                                  'lecture'
                                )
                              }
                            >
                              Update
                            </Button>
                          </Flex>
                        </div>
                      )}
                    </Center>
                  </Box>

                  <Grid
                    templateColumns="repeat(auto-fill, minmax(200px, 1fr))"
                    gap={4}
                  >
                    {findLectureByTopic(state.selectedTopic).map(
                      (lecture, index) => (
                        <Box
                          key={lecture._id}
                          cursor="pointer"
                          onClick={() => handleVideoSelect(lecture)}
                          borderWidth={
                            selectedVideo === lecture ? '2px' : '1px'
                          }
                          borderColor={
                            selectedVideo === lecture ? 'blue.500' : '#EEEFF1'
                          }
                          p={2}
                          borderRadius={10}
                        >
                          <Flex
                            justifyContent="space-between"
                            alignItems="center"
                            alignContent={'center'}
                            color="#6E7682"
                          >
                            <Text
                              fontSize="12px"
                              fontWeight="400"
                              wordBreak={'break-word'}
                              textTransform="uppercase"
                            >
                              {textTruncate(lecture.title, 28)}
                            </Text>
                            <IconButton
                              aria-label="Delete video"
                              cursor={'pointer'}
                              icon={<BiTrash />}
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteResource(lecture._id);
                              }}
                            />
                          </Flex>
                          {isYouTubeLink(lecture?.documentUrl) ? (
                            <>
                              <img
                                title="lecture-thumbnail"
                                style={{ borderRadius: 10, width: '100%' }}
                                src={getYouTubeThumbnail(lecture?.documentUrl)}
                                alt="lecture-thumbnail"
                              />
                            </>
                          ) : (
                            <video
                              title="lecture-thumbnail"
                              style={{ borderRadius: 10, width: '100%' }}
                              src={lecture?.documentUrl}
                              // type="video/mp4"
                              muted
                            />
                          )}
                        </Box>
                      )
                    )}
                  </Grid>
                </Box>
              </TabPanel>
              <TabPanel>
                {isAddNewOpened && (
                  <Box
                    w="full"
                    px={2}
                    bg="white"
                    borderRadius={10}
                    borderWidth="1px"
                    borderColor="#EEEFF1"
                    justifyContent="center"
                    alignItems="center"
                    my={4}
                  >
                    <VStack alignItems={'left'} spacing={2} p={2}>
                      <FormLabel>Url</FormLabel>
                      <Input
                        value={articleUrl}
                        onChange={(e) => setArticleUrl(e.target.value)}
                      />
                      <FormLabel>Title</FormLabel>
                      <Input
                        value={articleTitle}
                        onChange={(e) => setArticleTitle(e.target.value)}
                      />
                    </VStack>
                    <Flex justifyContent={'flex-end'} m={1}>
                      <Button
                        variant="ghost"
                        fontSize={'xs'}
                        isLoading={isLoading}
                        color="gray"
                        display={'flex'}
                        gap={1}
                        onClick={() =>
                          saveDocumentAndStoreStudyPlan(
                            articleUrl,
                            articleTitle,
                            'article'
                          )
                        }
                      >
                        <Icon as={FaPlus} /> Add
                      </Button>
                      <Button
                        variant="ghost"
                        fontSize={'xs'}
                        color="gray"
                        display={'flex'}
                        gap={1}
                        onClick={() => setIsAddNewOpened(false)}
                      >
                        <Icon as={FaTrashAlt} /> Delete
                      </Button>
                    </Flex>
                  </Box>
                )}

                <Box
                  w="full"
                  p={4}
                  bg="white"
                  justifyContent="center"
                  alignItems="center"
                  my={4}
                >
                  {findArticlesByTopic(state.selectedTopic).length > 0 ? (
                    <SimpleGrid minChildWidth="150px" spacing="10px">
                      {findArticlesByTopic(state.selectedTopic).map(
                        (source, index) => (
                          <a
                            key={index}
                            href={`${source.documentUrl}`}
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
                              <Flex direction="column" textAlign="left" gap={2}>
                                <Text fontWeight={600} fontSize="sm">
                                  {source.title?.length > 15
                                    ? source.title?.substring(0, 15) + '...'
                                    : source.title}
                                </Text>
                                <Flex alignItems="center">
                                  <Text color="gray.500" fontSize="xs">
                                    {source.documentUrl?.length > 19
                                      ? source.documentUrl?.substring(0, 19) +
                                        '...'
                                      : source.documentUrl}
                                  </Text>
                                  <Spacer />
                                  <img
                                    className="h-3 w-3"
                                    alt={source.documentUrl}
                                    src={`https://www.google.com/s2/favicons?domain=${
                                      source.documentUrl
                                    }&sz=${16}`}
                                  />
                                </Flex>
                              </Flex>
                            </Box>
                          </a>
                        )
                      )}
                    </SimpleGrid>
                  ) : (
                    <section className="flex justify-center items-center  w-full">
                      <div className="text-center">
                        <img src="/images/notes.png" alt="" />
                        <Text color="#000000" fontSize={12}>
                          Looks like you haven't added an article yet
                        </Text>
                      </div>
                    </section>
                  )}
                </Box>
              </TabPanel>
              <TabPanel>
                {isAddNewOpened && (
                  <Box
                    w="full"
                    px={2}
                    bg="white"
                    borderRadius={10}
                    borderWidth="1px"
                    borderColor="#EEEFF1"
                    justifyContent="center"
                    alignItems="center"
                    my={4}
                  >
                    <VStack alignItems={'left'} spacing={2} p={2}>
                      <FormLabel>Url</FormLabel>
                      <Input
                        value={notebookUrl}
                        onChange={(e) => setNotebookUrl(e.target.value)}
                      />
                      <FormLabel>Title</FormLabel>
                      <Input
                        value={notebookTitle}
                        onChange={(e) => setNotebookTitle(e.target.value)}
                      />
                    </VStack>
                    <Flex justifyContent={'flex-end'} m={1}>
                      <Button
                        variant="ghost"
                        fontSize={'xs'}
                        color="gray"
                        display={'flex'}
                        gap={1}
                        isLoading={isLoading}
                        onClick={() =>
                          saveDocumentAndStoreStudyPlan(
                            notebookUrl,
                            notebookTitle,
                            'text'
                          )
                        }
                      >
                        <Icon as={FaPlus} /> Add
                      </Button>
                      <Button
                        variant="ghost"
                        fontSize={'xs'}
                        color="gray"
                        display={'flex'}
                        gap={1}
                        onClick={() => setIsAddNewOpened(false)}
                      >
                        <Icon as={FaTrashAlt} /> Delete
                      </Button>
                    </Flex>
                  </Box>
                )}

                <Box
                  w="full"
                  p={4}
                  bg="white"
                  justifyContent="center"
                  alignItems="center"
                  my={4}
                >
                  {findNotebooksByTopic(state.selectedTopic).length > 0 ? (
                    <SimpleGrid minChildWidth="150px" spacing="10px">
                      {findNotebooksByTopic(state.selectedTopic).map(
                        (source, index) => (
                          <a
                            key={index}
                            href={`${source.documentUrl}`}
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
                              <Flex direction="column" textAlign="left" gap={2}>
                                <Text fontWeight={600} fontSize="sm">
                                  {source.title?.length > 15
                                    ? source.title?.substring(0, 15) + '...'
                                    : source.title}
                                </Text>
                                <Flex alignItems="center">
                                  <Text color="gray.500" fontSize="xs">
                                    {source.documentUrl?.length > 19
                                      ? source.documentUrl?.substring(0, 19) +
                                        '...'
                                      : source.documentUrl}
                                  </Text>
                                  <Spacer />
                                  <img
                                    className="h-5 w-5"
                                    alt={source.documentUrl}
                                    src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAADyElEQVR4nO2YyW5cRRSGP7KIWIQwiDEMQeIJEOIV2DOFAA8ACmzY22k7kqPEU7sb2xBFIQwSKN5gV1kGiSGCgEBAWMASwo4oSIBslG7f67j7oFO+bfdU1fd29yKL+0tHV5ZLp/6/6gx1GnLkyJEjR44cNzlkmdtkhSNi+EAsl8VwVQxbYrkmhl/Fcl4sL8saB/vyZYmT72WxvC+rPK/rBif+KXeJZUoMm2KRnmbYcOvXuGdgX5aqGE7LKnf2R37nlP5NuVm7/SWrPDMUX4Z/xPJceuIF9onhhBjqfZJvWEmEW8QyPrAvQ10MBfXXU0BU5Mu4NBBx3fCqfMbtjvxghyAN234XiYp8HiQfl5itjCKVESQuOyL9Cng2CZv6sMhXlNcoEpeY7kp+8y0erRSoK/mGxfN9bbimiZfE7sDkb7yzx8dZgfrmGR7rDJ0ZfmhZmNjWQsvJfi2GF2SZQ7LEfve1HBXLpeT/12WVw67a9L6lVl+WB1t8KflznXzUomm+a03c89xfOd59sbuJt6mJ4dVg8hteE8Mbrs6HSqXhRgpfx7bOUmuEc4cdR+Qs97XGvoe8U1zio2DyNG+usR8++SD5BqIiF0KcWnIhmuKKb2F1gnUyIOmwPvJfZfFVPcmG91Cn+H1v4QQVr9IyxUwCLD97BaxwJIuvuEw5cLDXdxdWxtj2Cljk8UwCdt403QUscyiLr61FnvCG0RjbewJ8yTKCyDwHMgnQh5lPwBL7M/kqcdArYBTZEzBO7aa8gTM8meoGeuRAOaOAnwJV6GgWX9Eci6lyIDrNH96FJ9kYWhWyXErtp8C+6gT/papCcZmZYB8ociH1xjqMhPvAsTR+4hJLwT4wx1T6TrzgOrF34+TZ/LoYXnGdWIeR7uS1KdZ6HUis5AOFpaMTK6IZvveQbybxjazwoqzxkHu/6Nfwkhi+TQiuyyc84CapLuTjudbQjIu8qYmqlU6/UZn5UNjsRsRs21tIUZ3ncNfXaPYn9YfyMXeI5W8f+YFsjFp1gYd9Vze9Ow/0R75B+CkdA908sOJObDjkR11VPBVMnmiWiwMNMzv2m1zkVlnmRDQzJPIjrph8ESTfNBMXhjBNjWty6xgYTMiRdCev5JVbTwG7QnQsbI7jbHZNLE83heZke36ltgL1nmHjFaHJaDjlLYudsb8ulkkx3N3uqzrHIzpJhcp1pa1UarXxJmwmIUscSJLyPTH8KJY/m36Z+0UM51w5TfPL3CL3arGIJrmizwH3EtYQG2Nb/9YOq02qo87nyJEjR44cOXIwdPwP3P16q2mQhk0AAAAASUVORK5CYII="
                                  />
                                </Flex>
                              </Flex>
                            </Box>
                          </a>
                        )
                      )}
                    </SimpleGrid>
                  ) : (
                    <section className="flex justify-center items-center  w-full">
                      <div className="text-center">
                        <img src="/images/notes.png" alt="" />
                        <Text color="#000000" fontSize={12}>
                          Looks like you haven't added a notebook yet
                        </Text>
                      </div>
                    </section>
                  )}
                </Box>
              </TabPanel>
            </TabPanels>
          </Tabs>
        ) : (
          <ModalBody overflowY={'auto'} maxH="600px" flexDirection="column">
            {' '}
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
                            <Flex direction="column" textAlign="left" gap={2}>
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
          </ModalBody>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ResourceModal;
