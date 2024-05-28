import React, {
  useRef,
  useState,
  ChangeEvent,
  useEffect,
  RefObject
} from 'react';
import { useNavigate } from 'react-router';
import { database, storage } from '../../../firebase';
import { ref as dbRef, onValue, off, DataSnapshot } from 'firebase/database';
import { ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import timezones from '../../OnboardTutor/components/steps/timezones';
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
import Select from 'react-select';
import { format, isBefore } from 'date-fns';
import { StudyPlanJob, StudyPlanWeek } from '../../../types';
import Logo from '../../../components/Logo';
import {
  FaPlus,
  FaCheckCircle,
  FaPencilAlt,
  FaRocket,
  FaTrashAlt,
  FaFileAlt,
  FaFileMedical,
  FaFileVideo,
  FaVideo
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
import { AttachmentIcon, CloseIcon, SmallCloseIcon } from '@chakra-ui/icons';
import ApiService from '../../../services/ApiService';
import { RiUploadCloud2Fill } from 'react-icons/ri';
import userStore from '../../../state/userStore';
import styled from 'styled-components';
import { IoIosArrowRoundBack } from 'react-icons/io';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import uploadFile, { snip } from '../../../helpers/file.helpers';
import CalendarDateInput from '../../../components/CalendarDateInput';
import { ReactSortable } from 'react-sortablejs';
import { NullComponent } from 'stream-chat-react';
import CustomSelect from '../../../components/CustomSelect';
import SyllabusForm from './components/studyPlanner';
import StudyPlanner from './components/studyPlanner';
import PlanReviewer from './components/planReviewer';

const FileName = styled.span`
  font-size: 0.875rem;
  font-weight: 700;
  color: #585f68;
`;

const PDFTextContainer = styled.div`
  text-align: center;
  margin-bottom: 1.5rem;
`;
interface ItemType {
  id: number;
  name: string;
}
function CreateStudyPlans() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedSubject, setSelectedSubject] = useState('');
  const [course, setCourse] = useState('');
  const [planName, setPlanName] = useState('');
  const [syllabusUrl, setSyllabusUrl] = useState('');
  const [topicUrls, setTopicUrls] = useState([]);
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
  const today = moment();

  const [timezone, setTimezone] = useState('');
  const [showSubjects, setShowSubjects] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [docLoading, setDocLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [syllabusData, setSyllabusData] = useState([]);
  const [studyPlanData, setStudyPlanData] = useState([]);
  const { courses: courseList, levels: levelOptions } = resourceStore();

  const {
    user,
    fetchUserDocuments,
    hasActiveSubscription,
    fileSizeLimitMB,
    fileSizeLimitBytes
  } = userStore();

  const btnRef = useRef();
  const toast = useCustomToast();
  const navigate = useNavigate();
  const currentPath = window.location.pathname;

  const isTutor = currentPath.includes('/dashboard/tutordashboard');

  const handleToggleSubjects = () => {
    setShowSubjects(!showSubjects);
  };

  const saveStudyPlan = async () => {
    setLoading(true);
    const convertedArr = await convertArrays(studyPlanData);

    const payload = {
      course,
      title: planName,
      tz: timezone,
      scheduleItems: convertedArr
    };

    try {
      const resp = await ApiService.createStudyPlan(payload);
      if (resp) {
        const response = await resp.json();
        if (resp.status === 201) {
          setLoading(false);
          toast({
            title: 'Study Plan Created Successfully',
            position: 'top-right',
            status: 'success',
            isClosable: true
          });
          const baseUrl = isTutor ? '/dashboard/tutordashboard' : '/dashboard';
          navigate(`${baseUrl}/study-plans/planId=${response.studyPlan.id}`);
        } else {
          setLoading(false);
          toast({
            title: 'Failed to create study plan, try again',
            position: 'top-right',
            status: 'error',
            isClosable: true
          });
        }
      }
    } catch (error) {
      setLoading(false);
      toast({
        title: `Error: ${error.message}`,
        position: 'top-right',
        status: 'error',
        isClosable: true
      });
    }
  };
  const uploadFilesAndGetUrls = async (files) => {
    const downloadUrls = [];

    const uploadPromises = files.map((file) => {
      return new Promise((resolve, reject) => {
        if (!file) return resolve(null);

        if (file.size > fileSizeLimitBytes * 10) {
          toast({
            title: 'Please upload a file under 100MB',
            status: 'error',
            position: 'top',
            isClosable: true
          });
          return resolve(null);
        }

        const readableFileName = file.name
          .toLowerCase()
          .replace(/\.pdf$/, '')
          .replace(/_/g, ' ');

        const uploadEmitter = uploadFile(file, {
          studentID: user._id,
          documentID: readableFileName
        });

        uploadEmitter.on('progress', (progress) => {
          toast({ title: 'uploading documents', status: 'info' });
          setDocLoading(true);
        });

        uploadEmitter.on('complete', (uploadFile) => {
          const documentURL = uploadFile.fileUrl;
          downloadUrls.push(documentURL);
          toast({ title: 'documents uploaded', status: 'success' });
          setDocLoading(false);
          resolve(documentURL);
        });

        uploadEmitter.on('error', (error) => {
          setDocLoading(false);
          toast({ title: `Upload error: ${error.message}`, status: 'error' });
          reject(error);
        });
      });
    });

    try {
      await Promise.all(uploadPromises);
      return downloadUrls;
    } catch (error) {
      toast({
        title: `Error during upload: ${error.message}`,
        status: 'error'
      });
      return []; // Return an empty array in case of errors
    }
  };

  const convertArrays = async (A) => {
    function formatDate(dateString) {
      const [month, day, year] = dateString.split('/');
      return `${year}-${month}-${day}`;
    }

    const convertedTopics = await Promise.all(
      A.map(async (week, index) => {
        const dates = week.weekRange.split(' - ');
        const startDate = formatDate(dates[0]);
        const endDate = formatDate(dates[1]);
        const testDate = endDate;

        const topics = await Promise.all(
          week.topics.map(async (topic) => {
            const { mainTopic, subTopics, topicUrls } = topic;

            let subTopicDetails = [];
            if (subTopics) {
              subTopicDetails = subTopics.map((subTopic) => ({
                label: subTopic,
                description: `Description for ${subTopic}`
              }));
            } else {
              subTopicDetails.push({
                label: mainTopic,
                description: `Description for ${mainTopic}`
              });
            }

            const documentUrls = await uploadFilesAndGetUrls(topicUrls);

            return {
              topic: {
                label: mainTopic,
                subTopics: subTopicDetails,
                documentUrls,
                testDate
              },
              startDate,
              endDate,
              weekIndex: index + 1,
              status: 'notStarted'
            };
          })
        );

        return topics;
      })
    );

    return convertedTopics.flat();
  };

  const handleUploadTopicFile = (topicIndex, files) => {
    const updatedSyllabusData = [...syllabusData];

    // Check if the topic at the specified indices exists
    if (topicIndex >= 0 && topicIndex < updatedSyllabusData.length) {
      updatedSyllabusData[topicIndex] = {
        ...updatedSyllabusData[topicIndex],
        topics: [
          {
            ...updatedSyllabusData[topicIndex].topics[0],
            topicUrls: updatedSyllabusData[topicIndex].topics[0].topicUrls
              ? [...updatedSyllabusData[topicIndex].topics[0].topicUrls, files]
              : [files]
          }
        ]
      };

      // Update the state with the modified data
      setSyllabusData(updatedSyllabusData);
    }
  };

  const handleRemoveFile = (topicIndex, fileIndex) => {
    const updatedSyllabusData = [...syllabusData];

    // Check if the topic at the specified indices exists
    if (
      topicIndex >= 0 &&
      topicIndex < updatedSyllabusData.length &&
      updatedSyllabusData[topicIndex].topics[0].topicUrls &&
      fileIndex >= 0 &&
      fileIndex < updatedSyllabusData[topicIndex].topics[0].topicUrls.length
    ) {
      // Remove the file at the specified index from the 'topicUrls' array
      updatedSyllabusData[topicIndex].topics[0].topicUrls.splice(fileIndex, 1);

      // Update the state with the modified data
      setSyllabusData(updatedSyllabusData);
    }
  };

  useEffect(() => {
    const item = localStorage.getItem('create course');

    if (item) {
      setCourse(item);
      localStorage.removeItem('create course');
    }
  }, []);

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
      <StudyPlanner
        activeTab={activeTab}
        course={course}
        setCourse={setCourse}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        planName={planName}
        setPlanName={setPlanName}
        testDate={testDate}
        setTestDate={setTestDate}
        syllabusData={syllabusData}
        setSyllabusData={setSyllabusData}
        setStudyPlanData={setStudyPlanData}
        timezone={timezone}
        setTimezone={setTimezone}
      />
      {/* <DndProvider backend={HTML5Backend}> */}{' '}
      <PlanReviewer
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        syllabusData={syllabusData}
        studyPlanData={studyPlanData}
        saveStudyPlan={saveStudyPlan}
        loading={loading}
        docLoading={docLoading}
        setLoading={setLoading}
        course={course}
        setSyllabusData={setSyllabusData}
        setStudyPlanData={setStudyPlanData}
      />
      {/* </DndProvider> */}
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
            {planName}
          </Text>
          {/* <Spacer />
          <FiChevronDown /> */}
        </Flex>
        {/* <List spacing={3}>
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
        </List> */}
      </Box>
    </Grid>
  );
}

export default CreateStudyPlans;
