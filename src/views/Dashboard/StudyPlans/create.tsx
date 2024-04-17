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
  HStack,
  Spinner,
  FormLabel
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
  FaFileMedical
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

  const [gradeLevel, setGradeLevel] = useState('');
  const [grade, setGrade] = useState('');
  const [timezone, setTimezone] = useState('');
  const [showSubjects, setShowSubjects] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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
  const [state, setState] = useState<ItemType[]>([
    { id: 1, name: 'shrek' },
    { id: 2, name: 'fiona' }
  ]);
  const [tzOptions, setTzOptions] = useState([]);
  const btnRef = useRef();
  const toast = useCustomToast();
  const navigate = useNavigate();
  const currentPath = window.location.pathname;

  const isTutor = currentPath.includes('/dashboard/tutordashboard');
  const subjectOptions = [
    { label: 'Eng', value: 'English' },
    { label: 'Maths', value: 'Maths' },
    { label: 'Bio', value: 'Biology' }
  ];
  const gradeOptions = [
    { label: 'Highschool', value: 'Highschool' },
    { label: 'College', value: 'College' }
  ];

  useEffect(() => {
    const getTimeZoneOptions = () => {
      const timezones = moment.tz.names();
      const formattedOptions = timezones.map((timezone) => ({
        value: timezone,
        label: timezone
      }));
      setTzOptions(formattedOptions);
    };

    getTimeZoneOptions();
  }, []);
  const [isDragOver, setIsDragOver] = useState(false);
  const [fileName, setFileName] = useState('');
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
    // Handle dropped files here

    // const fileChecked = doesTitleExist(files?.name);

    // if (fileChecked) {
    //   setAlreadyExist(true);
    // } else {
    //   setAlreadyExist(false);
    //   setLoading(true);
    //   try {
    //     setFileName(snip(files.name));
    //     await handleInputFreshUpload(files, user, files.name);
    //   } catch (error) {
    //     // Handle errors
    //   }
    // }
  };

  // const collectFileInput = async (e) => {
  //   const inputFile = e.target.files[0];
  //   const fileChecked = doesTitleExist(inputFile?.name);
  //   setProgress(0);
  //   setConfirmReady(false);

  //   if (fileChecked) {
  //     setAlreadyExist(true);
  //   } else {
  //     // Check if the file size exceeds the limit
  //     if (inputFile.size > fileSizeLimitBytes) {
  //       // Set the modal state and messages
  //       setPlansModalMessage(
  //         !hasActiveSubscription
  //           ? `Let's get you on a plan so you can upload larger files!`
  //           : `Oops! Your file is too big. Your current plan allows for files up to ${fileSizeLimitMB} MB.`
  //       );
  //       setPlansModalSubMessage(
  //         !hasActiveSubscription
  //           ? `You're currently limited to files under ${fileSizeLimitMB} MB.`
  //           : 'Consider upgrading to upload larger files.'
  //       );
  //       setTogglePlansModal(true);
  //       // setShow(false);
  //     } else {
  //       setAlreadyExist(false);
  //       setLoading(true);
  //       try {
  //         setFileName(snip(inputFile.name));
  //         await handleInputFreshUpload(inputFile, user, inputFile.name);
  //       } catch (error) {
  //         // Handle errors
  //       }
  //     }
  //   }
  // };

  const handleUploadInput = (file: File | null) => {
    if (!file) return;

    // Check if the file size exceeds the limit
    if (file.size > fileSizeLimitBytes) {
      toast({
        title: 'Please upload a file under 10MB',
        status: 'error',
        position: 'top',
        isClosable: true
      });
    } else {
      setLoading(true);

      const storageRef = ref(storage, `files/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      // setIsLoading(true);
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
        },
        (error) => {
          setIsLoading(false);

          toast({ title: error.message + error.cause, status: 'error' });
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setIsLoading(false);
            setSyllabusUrl(downloadURL);
            setFileName(snip(file.name));
          });
        }
      );
    }
  };

  const addTestDate = () => {
    const lastTestDate = testDate[testDate.length - 1];

    const today = moment().startOf('day');

    const newTestDate = lastTestDate
      ? moment(lastTestDate).add(1, 'days')
      : today;
    setTestDate([...testDate, '']);
  };
  const removeTestDate = (indexToRemove) => {
    const updatedTestDates = [...testDate];
    updatedTestDates.splice(indexToRemove, 1);
    setTestDate(updatedTestDates);
  };

  const handleToggleSubjects = () => {
    setShowSubjects(!showSubjects);
  };

  const handleGenerateSyllabus = async () => {
    setIsLoading(true);

    try {
      const payload = {};

      if (syllabusUrl && syllabusUrl.trim() !== '') {
        payload['syllabusUrl'] = syllabusUrl;
      } else {
        payload['syllabusData'] = {
          course: course,
          gradeLevel: gradeLevel,
          weekCount: 15
        };
      }

      const response = await generateStudyPlan(payload);

      if (response) {
        const jobId = response.jobId;

        getStudyPlanJob(jobId, (error, studyPlan) => {
          if (error) {
            toast({
              title: `Error fetching study plan: ${error.message}`,
              position: 'top-right',
              status: 'error',
              isClosable: true
            });
          } else if (studyPlan) {
            setSyllabusData(studyPlan);
            // setSelectedSubject(course);
          } else {
            toast({
              title: 'No study plan available yet. Please try again later.',
              position: 'top-right',
              status: 'warning',
              isClosable: true
            });
          }
          setIsLoading(false);
        });
      } else {
        toast({
          title: 'Unable to process this request. Please try again later.',
          position: 'top-right',
          status: 'error',
          isClosable: true
        });
        setIsLoading(false);
      }
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
  const handleCreateSyllabus = () => {
    createSyllabusWeek();
  };
  function createSyllabusWeek() {
    // Find the highest weekNumber currently in syllabusData
    const maxWeekNumber = syllabusData.reduce(
      (max, week) => Math.max(max, week.weekNumber),
      0
    );

    // Auto-increment weekNumber for the new week
    const weekNumber = maxWeekNumber + 1;

    // Create the new week object
    const week = {
      learningObjectives: [],
      readingMaterials: [],
      topics: [
        {
          mainTopic: `Topic ${weekNumber}`,
          subTopics: ['sub-topic']
        }
      ],
      weekNumber: weekNumber
    };
    setSyllabusData([...syllabusData, week]);

    return week;
  }

  function updateWeekProperties(weekNumber, updatedProperties) {
    const weekIndex = syllabusData.findIndex(
      (week) => week.weekNumber === weekNumber
    );
    if (weekIndex !== -1) {
      const weekToUpdate = syllabusData[weekIndex];
      // Update properties
      Object.keys(updatedProperties).forEach((key) => {
        if (key === 'topics') {
          weekToUpdate.topics[0].mainTopic =
            updatedProperties[key].mainTopic ||
            weekToUpdate.topics[0].mainTopic;
          weekToUpdate.topics[0].subTopics =
            updatedProperties[key].subTopics ||
            weekToUpdate.topics[0].subTopics;
        } else {
          weekToUpdate[key] = updatedProperties[key];
        }
      });
      syllabusData[weekIndex] = weekToUpdate;
    } else {
      // console.log(`Week ${weekNumber} not found.`);
    }
  }
  const updateMainTopic = (index, newMainTopic) => {
    const updatedSyllabusData = [...syllabusData];

    if (index >= 0 && index < updatedSyllabusData.length) {
      updatedSyllabusData[index] = {
        ...updatedSyllabusData[index],
        topics: [
          {
            ...updatedSyllabusData[index].topics[0],
            mainTopic: newMainTopic
          }
        ]
      };

      setSyllabusData(updatedSyllabusData);
    }
  };
  const deleteMainTopic = (index) => {
    // Delete the topic at the specified index
    const updatedSyllabusData = syllabusData.filter((_, i) => i !== index);

    // Reorder the week numbers
    const reorderedSyllabusData = updatedSyllabusData.map((week, i) => {
      // Increment the weekNumber for weeks after the deleted index
      if (week.weekNumber > index + 1) {
        return { ...week, weekNumber: i + 1 };
      }
      return week;
    });

    setSyllabusData(reorderedSyllabusData);
  };

  const addSubTopic = (weekIndex, newSubTopic) => {
    const updatedSyllabusData = [...syllabusData];
    if (weekIndex >= 0 && weekIndex <= updatedSyllabusData.length) {
      const mainTopic = updatedSyllabusData[weekIndex].topics[0];
      mainTopic.subTopics.push(newSubTopic);
      setSyllabusData(updatedSyllabusData);
    }
  };
  const updateSubTopic = (weekIndex, subTopicIndex, newSubTopic) => {
    const updatedSyllabusData = [...syllabusData];

    if (weekIndex >= 0 && weekIndex <= updatedSyllabusData.length) {
      const mainTopic = updatedSyllabusData[weekIndex].topics[0];

      if (subTopicIndex >= 0 && subTopicIndex < mainTopic.subTopics.length) {
        mainTopic.subTopics[subTopicIndex] = newSubTopic;
        setSyllabusData(updatedSyllabusData);
      }
    }
  };

  const deleteSubTopic = (weekIndex, subTopicIndex) => {
    const updatedSyllabusData = [...syllabusData];
    if (weekIndex >= 0 && weekIndex <= updatedSyllabusData.length) {
      const mainTopic = updatedSyllabusData[weekIndex].topics[0];

      if (subTopicIndex >= 0 && subTopicIndex < mainTopic.subTopics.length) {
        mainTopic.subTopics.splice(subTopicIndex, 1);
        setSyllabusData(updatedSyllabusData);
      }
    }
  };

  const moveTopic = (fromIndex, toIndex) => {
    const copiedSyllabusData = [...syllabusData];
    const [movedTopic] = copiedSyllabusData.splice(fromIndex, 1);
    copiedSyllabusData.splice(toIndex, 0, movedTopic);
    // Update the state with the new order
    setSyllabusData(copiedSyllabusData);
  };
  const topicRef = useRef(null);

  const getStudyPlanJob = (
    jobId: string,
    callback: (error: Error | null, studyPlan?: StudyPlanWeek[]) => void
  ) => {
    const jobRef = dbRef(database, `/syllabus-process-job/${jobId}`);

    const unsubscribe = onValue(
      jobRef,
      (snapshot: DataSnapshot) => {
        const job: StudyPlanJob | null = snapshot.val();

        // If the job exists and its status is 'success', pass the study plan to the callback.
        if (job && job.status === 'success' && job.studyPlan) {
          callback(null, job.studyPlan);
          off(jobRef); // Stop listening for changes once the job is successfully retrieved.
        } else if (job && job.status === 'failed') {
          callback(new Error('Job failed'));
          off(jobRef);
        }
      },
      (error) => {
        callback(error);
      }
    );

    return unsubscribe;
  };

  const getStudyPlan = async (startDate, testDates, syllabusData) => {
    const studyPlan = [];
    let currentStartDate = moment(startDate, 'MM/DD/YYYY');
    let topicsRemaining = syllabusData.slice();
    let i = 0;

    const getLastMoment = (date) =>
      moment.max(moment(date, 'MM/DD/YYYY'), moment());

    while (i < testDates.length) {
      const currentEndDate =
        i === testDates.length - 1
          ? getLastMoment(testDates[i])
          : moment(testDates[i], 'MM/DD/YYYY');

      const daysAvailable = currentEndDate.diff(currentStartDate, 'days') + 1;
      const daysUntilNextTest =
        i < testDates.length - 1
          ? moment(testDates[i + 1], 'MM/DD/YYYY').diff(currentEndDate, 'days')
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
            'MM/DD/YYYY'
          )} - ${currentEndDate.format('MM/DD/YYYY')}`,
          topics: []
        };

        studyPlan.push(studyWeek);
      } else if (topicsRemaining.length > 0) {
        const topics = topicsRemaining.slice(0, topicsThisPeriod);
        topicsRemaining = topicsRemaining.slice(topicsThisPeriod);

        const studyWeek = {
          weekRange: `${currentStartDate.format(
            'MM/DD/YYYY'
          )} - ${currentEndDate.format('MM/DD/YYYY')}`,
          topics: topics.map((topic) => ({
            mainTopic: topic.topics[0].mainTopic,
            subTopics: topic.topics[0].subTopics,
            topicUrls: topic.topics[0].topicUrls
              ? topic.topics[0].topicUrls
              : []
          }))
        };

        studyPlan.push(studyWeek);
      }

      currentStartDate = currentEndDate.clone().add(1, 'day');
      i++;
    }

    setStudyPlanData(studyPlan);
    return studyPlan;
  };

  const saveStudyPlan = async () => {
    setLoading(true);
    const convertedArr = await convertArrays(studyPlanData);

    const payload = {
      course: course,
      title: planName,
      tz: timezone,
      scheduleItems: convertedArr
    };

    try {
      const resp = await ApiService.createStudyPlan(payload);
      if (resp) {
        const response = await resp.json();
        if (resp.status === 201) {
          // setIsCompleted(true);
          setLoading(false);
          toast({
            title: 'Study Plan Created Successfully',
            position: 'top-right',
            status: 'success',
            isClosable: true
          });
          const baseUrl = isTutor ? '/dashboard/tutordashboard' : '/dashboard';
          navigate(`${baseUrl}/study-plans`);
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
    } catch (error: any) {
      setLoading(false);
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

  const uploadFilesAndGetUrls = async (files) => {
    const downloadUrls = [];

    // Create an array to hold upload promises
    const uploadPromises = [];

    // Iterate through the array of files
    for (const file of files) {
      if (!file) continue;

      // Check if the file size exceeds the limit
      if (file.size > fileSizeLimitBytes) {
        toast({
          title: 'Please upload a file under 10MB',
          status: 'error',
          position: 'top',
          isClosable: true
        });
        continue;
      }

      const readableFileName = file.name
        .toLowerCase()
        .replace(/\.pdf$/, '')
        .replace(/_/g, ' ');

      // Create a promise for each file upload
      const uploadPromise = new Promise((resolve, reject) => {
        const uploadEmitter = uploadFile(file, {
          studentID: user._id,
          documentID: readableFileName
        });

        uploadEmitter.on('complete', (uploadFile) => {
          // Assuming uploadFile contains the fileUrl and other necessary details.
          const documentURL = uploadFile.fileUrl;

          downloadUrls.push(documentURL);
          resolve(null); // Resolve the promise once the upload is complete
        });

        uploadEmitter.on('error', (error) => {
          reject(error); // Reject the promise if there is an error
        });
      });

      // Add the promise to the array
      uploadPromises.push(uploadPromise);
    }

    // Wait for all upload promises to resolve
    try {
      await Promise.all(uploadPromises);
      return downloadUrls;
    } catch (error) {
      // Handle any errors that occurred during uploads
      toast({ title: error.message + error.cause, status: 'error' });
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
        py={2}
        px={4}
        className="create-syllabus custom-scroll"
        bg="white"
        overflowY="auto"
      >
        <Box borderRadius={8} bg="#F7F7F7" p={18} mb={3}>
          {' '}
          <Flex alignItems="center" gap={1}>
            <Box boxSize={12} rounded="full" overflow="hidden" bg="#287ce6">
              {/* <Logo /> */}
            </Box>
            <Box>
              <Text fontWeight="500" fontSize={'16px'}>
                Shepherd
              </Text>
              <Text fontSize="sm" color="gray.600">
                Study Planner
              </Text>
            </Box>
          </Flex>
          <Text fontSize="13px" my={2}>
            Let's get you ready for test day. Just provide a subject or
            syllabus, and we'll create a tailored study schedule with resources
            and reminders to make your learning efficient and effective.{' '}
          </Text>
        </Box>
        {activeTab === 0 ? (
          <Box py={2}>
            <Box>
              <Text as="label" htmlFor="planName" mb={2} display="block">
                Name your Study Plan
              </Text>
              <Input
                type="text"
                id="planName"
                placeholder={'e.g. Chemistry, Spring 2023'}
                value={planName}
                onChange={(e) => setPlanName(e.target.value)}
                borderWidth="1px"
                rounded="md"
                py={2}
                px={3}
                mb={2}
              />
            </Box>
            <Box my={2}>
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
            <Box>
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
            </Box>
            <Center my={2}>or</Center>
            <Center
              w="full"
              minH="65px"
              mb={3}
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
              // onClick={clickInput}
            >
              <label htmlFor="file-upload">
                <Center flexDirection="column">
                  {fileName ? (
                    <Flex>
                      <AttachmentIcon /> <FileName>{fileName}</FileName>
                    </Flex>
                  ) : (
                    <Flex direction={'column'} alignItems={'center'}>
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
                      <PDFTextContainer>
                        <Text
                          fontSize="xs"
                          color={isDragOver ? 'white' : 'gray.500'}
                        >
                          DOC, TXT, or PDF (MAX: {fileSizeLimitMB}MB)
                        </Text>
                      </PDFTextContainer>
                    </Flex>
                  )}
                </Center>
              </label>
              <input
                type="file"
                accept=".doc, .txt, .pdf"
                // accept="application/pdf"
                className="hidden"
                id="file-upload"
                ref={inputRef}
                onChange={(e) => handleUploadInput(e.target.files[0])}
              />
            </Center>
            <Flex direction={'row'} gap={1}>
              <Button
                color="#207df7"
                variant="outline"
                borderColor={'#207df7'}
                py={2}
                px={4}
                mb={2}
                fontSize={13}
                rounded="md"
                display="inline-flex"
                alignItems="center"
                onClick={handleCreateSyllabus}
                isDisabled={!planName || !gradeLevel || !course || isLoading}
              >
                <Icon as={FaFileMedical} mr={2} />
                Manually Create Syllabus
              </Button>
              <Spacer />{' '}
              <Button
                colorScheme="blue"
                variant="solid"
                py={2}
                px={4}
                mb={2}
                fontSize={13}
                rounded="md"
                display="inline-flex"
                alignItems="center"
                onClick={handleGenerateSyllabus}
                isDisabled={!planName || !gradeLevel || !course || isLoading}
              >
                <Icon as={FaRocket} mr={2} />
                Auto-generate Syllabus
              </Button>
            </Flex>
          </Box>
        ) : (
          <Box>
            <Text
              as="label"
              htmlFor="subjects"
              mb={2}
              display="block"
              fontWeight={'semibold'}
            >
              Enter your test dates
            </Text>
            <Flex direction={'column'} gap={2}>
              {testDate &&
                testDate.map((date, index) => (
                  <Box key={index}>
                    <Text
                      as="label"
                      htmlFor="subjects"
                      mb={1}
                      display="block"
                      fontWeight={'semibold'}
                      color="#207df7"
                    >
                      Test {index + 1}
                    </Text>
                    <Flex align={'center'} gap={2}>
                      {/* <DatePicker
                          name={`testDate-${index}`}
                          placeholder="Select Test Date"
                          value={format(date, 'MM-dd-yyyy')}
                          onChange={(newDate) => {
                            const updatedTestDates = [...testDate];
                            updatedTestDates[index] = newDate;
                            setTestDate(updatedTestDates);
                          }}
                        /> */}
                      <CalendarDateInput
                        // disabledDate={{ before: today }}
                        inputProps={{
                          placeholder: 'Select Test Date'
                        }}
                        value={date}
                        onChange={(value) => {
                          const updatedTestDates = [...testDate];
                          updatedTestDates[index] = value;

                          if (
                            index > 0 &&
                            moment(value).isBefore(testDate[index - 1])
                          ) {
                            toast({
                              title:
                                'Test date cannot be before the previous test date',
                              status: 'error',
                              position: 'top',
                              isClosable: true
                            });

                            return;
                          }

                          setTestDate(updatedTestDates);
                        }}
                      />{' '}
                      <MdCancel
                        onClick={() => removeTestDate(index)}
                        color={'gray'}
                      />
                    </Flex>
                  </Box>
                ))}
            </Flex>
            <Button
              colorScheme="blue"
              variant="link"
              display="flex"
              alignItems="center"
              onClick={addTestDate}
              my={2}
            >
              <Icon as={FaPlus} mr={2} />
              Add Date
            </Button>{' '}
            <Select
              value={tzOptions.find((option) => option.value === timezone)}
              onChange={(selectedOption) => setTimezone(selectedOption.value)}
              options={tzOptions}
              placeholder={'Select Timezone'}
              getOptionLabel={(option) => option.label}
              getOptionValue={(option) => option.value}
              className="my-4"
              // styles={customStyles}
            />
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
                  moment().format('MM/DD/YYYY'),
                  testDate.map((date) => moment(date).format('MM/DD/YYYY')),
                  syllabusData
                )
              }
              my={4}
              isDisabled={
                testDate.length < 1 ||
                !testDate.every((date) =>
                  moment(date, 'MM/DD/YYYY', true).isValid()
                ) ||
                !timezone
              }
            >
              <Icon as={FaRocket} mr={2} />
              Generate Study Plan
            </Button>
          </Box>
        )}
      </Box>
      {/* <DndProvider backend={HTML5Backend}> */}{' '}
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
                ) : syllabusData.length > 0 ? (
                  <Box mb={6} position="relative">
                    <Text
                      fontSize="16px"
                      fontWeight="semibold"
                      mb={2}
                      color="text.200"
                    >
                      Review {course} syllabus
                    </Text>
                    <ReactSortable
                      filter=".addImageButtonContainer"
                      dragClass="sortableDrag"
                      ghostClass="draggedGhost"
                      list={syllabusData}
                      setList={setSyllabusData}
                      animation="500"
                      easing="ease-out"
                    >
                      {syllabusData.map((topic, topicIndex) => (
                        <Box
                          key={topicIndex}
                          bg="white"
                          p={4}
                          my={2}
                          rounded="md"
                          shadow="md"
                          className="draggableItem"
                        >
                          {topic.topics && (
                            <>
                              <Editable
                                value={topic?.topics[0]?.mainTopic}
                                fontSize="16px"
                                fontWeight="500"
                                mb={2}
                                color="text.300"
                                // onBlur={(e) => {
                                //   console.log(e);
                                //   updateMainTopic(index, e);
                                // }}

                                onChange={(e) => updateMainTopic(topicIndex, e)}
                              >
                                <EditablePreview />
                                <Input py={2} px={4} as={EditableInput} />
                              </Editable>
                              <UnorderedList
                                listStyleType="disc"
                                color="gray.700"
                                fontSize={14}
                              >
                                {topic?.topics[0]?.subTopics?.map(
                                  (item, subtopicindex) => (
                                    <>
                                      <Flex key={subtopicindex}>
                                        <ListItem>
                                          <Editable
                                            value={item}
                                            // onBlur={(e) => {
                                            //   console.log(e);
                                            //   updateMainTopic(index, e);
                                            // }}

                                            onChange={(e) => {
                                              updateSubTopic(
                                                topicIndex,
                                                subtopicindex,
                                                e
                                              );
                                            }}
                                          >
                                            <EditablePreview />
                                            <Input
                                              as={EditableInput}
                                              size="xs"
                                              // onBlur={(e) => {
                                              //   updateSubTopic(
                                              //     topicIndex,
                                              //     subtopicindex,
                                              //     e.target.value
                                              //   );
                                              //   // updateWeekProperties(topic.weekNumber, {
                                              //   //   topics: e.target.value
                                              //   // });
                                              // }}
                                            />
                                          </Editable>
                                        </ListItem>{' '}
                                        <Spacer />{' '}
                                        <SmallCloseIcon
                                          color={'gray.500'}
                                          onClick={() =>
                                            deleteSubTopic(
                                              topicIndex,
                                              subtopicindex
                                            )
                                          }
                                        />
                                      </Flex>
                                    </>
                                  )
                                )}
                              </UnorderedList>
                              <Flex justifyContent={'end'}>
                                <Button
                                  colorScheme="blue"
                                  variant="link"
                                  display="flex"
                                  alignItems="center"
                                  onClick={() =>
                                    addSubTopic(topicIndex, 'new sub topic')
                                  }
                                  my={2}
                                  fontSize={12}
                                >
                                  <Icon as={FaPlus} mr={2} />
                                  Add Subtopic
                                </Button>
                              </Flex>{' '}
                              <Divider my={2} />
                              <Flex justify="space-between" gap={1}>
                                {/* <Box color="green.500">
                                  <Icon as={FaCheckCircle} />
                                </Box> */}
                                <Flex
                                  direction="row"
                                  overflowX={'scroll'}
                                  className=""
                                  mr={'auto'}
                                >
                                  {topic?.topics[0]?.topicUrls &&
                                    topic?.topics[0]?.topicUrls.map(
                                      (file, index) => (
                                        <>
                                          <Flex
                                            fontSize={10}
                                            color="gray.700"
                                            alignItems={'center'}
                                            gap={1}
                                            whiteSpace="nowrap"
                                          >
                                            <Text>{`${
                                              file.name?.length > 10
                                                ? `${file.name.slice(0, 10)}...`
                                                : file.name
                                            } `}</Text>
                                            <CloseIcon
                                              boxSize={1.5}
                                              onClick={(e) =>
                                                handleRemoveFile(index, index)
                                              }
                                            />
                                            {index !== topicUrls.length - 1 &&
                                              `,`}
                                          </Flex>
                                        </>
                                      )
                                    )}
                                </Flex>
                                <HStack color="gray.500" spacing={3}>
                                  <label htmlFor={`fileInput-${topicIndex}`}>
                                    <Icon as={FaFileAlt} boxSize={3} />
                                  </label>
                                  <input
                                    type="file"
                                    id={`fileInput-${topicIndex}`}
                                    style={{ display: 'none' }}
                                    onChange={(e) =>
                                      handleUploadTopicFile(
                                        topicIndex,
                                        e.target.files[0]
                                      )
                                    }
                                  />

                                  <Icon
                                    as={FaTrashAlt}
                                    boxSize={3}
                                    onClick={() => deleteMainTopic(topicIndex)}
                                  />
                                </HStack>
                              </Flex>
                            </>
                          )}
                        </Box>
                      ))}
                    </ReactSortable>

                    <Flex alignItems={'center'} mt={7}>
                      <Button
                        color="gray"
                        variant="link"
                        display="flex"
                        alignItems="center"
                        onClick={() => createSyllabusWeek()}
                      >
                        <Icon as={FaPlus} mr={2} />
                        Add Topic
                      </Button>{' '}
                      <Spacer />
                      <Button
                        colorScheme="blue"
                        variant="solid"
                        display="flex"
                        justifyContent={'space-between'}
                        py={2}
                        px={14}
                        rounded="md"
                        alignItems="center"
                        textAlign={'center'}
                        ml={'auto'}
                        onClick={() => setActiveTab(1)}
                      >
                        Proceed
                      </Button>
                    </Flex>
                  </Box>
                ) : (
                  <section className="flex justify-center items-center mt-28 w-full">
                    <div className="text-center">
                      <img src="/images/notes.png" alt="" />
                      <Text color="#000000" fontSize={12}>
                        Looks like you haven't created a syllabus yet
                      </Text>
                    </div>
                  </section>
                )}
              </Box>
            </TabPanel>
            <TabPanel>
              <Box>
                <Flex direction="column" gap={2}>
                  {studyPlanData.length > 0 ? (
                    <>
                      {studyPlanData.map((topic, weekindex) => (
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
                      <Button
                        colorScheme="blue"
                        variant="solid"
                        display="flex"
                        justifyContent={'space-between'}
                        py={2}
                        px={14}
                        rounded="md"
                        alignItems="center"
                        textAlign={'center'}
                        mt={3}
                        ml={'auto'}
                        onClick={() => saveStudyPlan()}
                        isLoading={loading}
                      >
                        Save & Proceed
                      </Button>
                    </>
                  ) : (
                    <section className="flex justify-center items-center mt-28 w-full">
                      <div className="text-center">
                        <img src="/images/notes.png" alt="" />
                        <Text color="#000000" fontSize={12}>
                          Enter your test dates to generate a study plan!
                        </Text>
                      </div>
                    </section>
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
