import { useCustomToast } from '../../../../components/CustomComponents/CustomToast/useCustomToast';
import SelectComponent, { Option } from '../../../../components/Select';
import { WardIcon } from '../../../../components/icons';
import FileProcessingService from '../../../../helpers/files.helpers/fileProcessing';
import ApiService from '../../../../services/ApiService';
import documentStore from '../../../../state/documentStore';
import quizStore from '../../../../state/quizStore';
import userStore from '../../../../state/userStore';
import useQuizzesQuestionsJob from '../../../../hooks/useQuizzesQuestionsJob';
import {
  MIXED,
  MULTIPLE_CHOICE_SINGLE,
  OPEN_ENDED,
  QuizQuestion,
  TRUE_FALSE
} from '../../../../types';
import { QuestionIcon } from '@chakra-ui/icons';
import {
  Box,
  FormControl,
  FormLabel,
  FormHelperText,
  Input,
  HStack,
  Button,
  Tooltip
} from '@chakra-ui/react';
import _, { isEmpty, isNil, toNumber, merge, omit } from 'lodash';
import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import PlansModal from '../../../../components/PlansModal';
import FileUpload from '../components/fileUpload';
import { useToggle } from 'usehooks-ts';

type LocalDummyData = {
  subject: string;
  topic: string;
  difficulty: QuizQuestion['difficulty'];
  count: number;
  type: QuizQuestion['type'];
  documentId: string;
  studentId: string;
  start_page?: number;
  end_page?: number;
  ingestDoc?: boolean;
};

const UploadQuizForm = ({
  handleSetTitle,
  title,
  handleSetUploadingState,
  handleFormatQuizQuestionCallback,
  uploadingState
}) => {
  const dummyData: LocalDummyData = {
    subject: '',
    topic: '',
    difficulty: 'kindergarten',
    count: 1,
    type: MIXED,
    documentId: '',
    studentId: '',
    ingestDoc: false
  };

  const levelOptions = [
    { label: 'Very Easy', value: 'kindergarten' },
    { label: 'Medium', value: 'high school' },
    { label: 'Hard', value: 'college' },
    { label: 'Very Hard', value: 'PhD' }
  ];

  const typeOptions = [
    { label: 'Multiple Single Choice', value: MULTIPLE_CHOICE_SINGLE },
    { label: 'True/False', value: TRUE_FALSE },
    { label: 'Open Ended', value: OPEN_ENDED },
    { label: 'Mixed', value: MIXED }
  ];

  const [localData, setLocalData] = useState<any>(dummyData);
  const toast = useCustomToast();
  const { handleIsLoadingQuizzes } = quizStore();

  const { user } = userStore();
  const { watchJobs, clearJobs } = useQuizzesQuestionsJob(user?._id);

  const { saveDocument } = documentStore();

  const [file, setFile] = useState<any>();
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const [togglePlansModal, setTogglePlansModal] = useState(false);
  const [plansModalMessage, setPlansModalMessage] = useState('');
  const [plansModalSubMessage, setPlansModalSubMessage] = useState('');
  const [openModal, _, setOpenModal] = useToggle(false);
  const [ingestedDocument, setIngestedDocument] = useState(null);

  const handleGenerateQuestions = async (data: LocalDummyData) => {
    try {
      const result = await ApiService.generateQuizQuestionFromDocs({
        ...data,
        count: toNumber(data?.count),
        subscriptionTier: user.subscription?.tier
      });

      const resultJson = await result.json();

      if (resultJson.statusCode > 399) {
        throw new Error(resultJson.body);
      }
    } catch (error) {
      toast({
        position: 'top-right',
        title: `failed to generate quizzes job `,
        status: 'error'
      });
      setIsUploadingFile(false);
      handleIsLoadingQuizzes(false);
      handleSetUploadingState(false);
    }
  };

  const handleChange = useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >
    ) => {
      const { name, value, type } = e.target;
      if (
        name === 'count' &&
        localData.end_page &&
        localData.end_page <= 40 &&
        Number(value) > 50
      ) {
        setLocalData((prevState) => ({
          ...prevState,
          [name]: Number(50)
        }));
      } else if (
        (name === 'count' && !localData.end_page && Number(value) > 100) ||
        (name === 'count' &&
          localData.end_page &&
          localData.end_page > 40 &&
          Number(value) > 100)
      ) {
        setLocalData((prevState) => ({
          ...prevState,
          [name]: Number(100)
        }));
      } else if (
        name === 'count' &&
        !localData.end_page &&
        !localData.start_page &&
        localData.count > 100
      ) {
        setLocalData((prevState) => ({
          ...prevState,
          [name]: Number(100)
        }));
      }
      setLocalData((prevState) => ({
        ...prevState,
        [name]:
          type === 'number' ||
          name === 'count' ||
          name === 'start_page' ||
          name === 'end_page'
            ? Number(value)
            : value
      }));
    },
    [localData.end_page]
  );

  const isError =
    localData.count < 1 ||
    (localData.end_page && localData.end_page <= 40 && localData.count > 50) ||
    (localData.end_page && localData.end_page > 40 && localData.count > 100) ||
    (!localData.end_page && !localData.start_page && localData.count > 100);

  function getFileNameFromUrl(url) {
    let fileName = '';

    // Use the URL constructor for parsing the URL if it's an absolute URL
    try {
      const pathname = new URL(url).pathname;
      fileName = pathname.split('/').pop(); // Get the last part of the path
    } catch (error) {
      // If the URL is not absolute, fallback to a simple string manipulation approach
      fileName = url.substring(url.lastIndexOf('/') + 1);
    }

    // Decode URI component to handle encoded file names
    return decodeURIComponent(fileName);
  }

  const handleOnSubmit = async () => {
    try {
      setIsUploadingFile(true);
      handleSetUploadingState(true);

      const { hasActiveSubscription } = userStore.getState();
      const quizCountResponse = await ApiService.checkQuizCount(user._id);
      const userQuizCount = await quizCountResponse.json();

      if (
        (!hasActiveSubscription && userQuizCount.count >= 40) ||
        (user.subscription?.subscriptionMetadata?.quiz_limit &&
          userQuizCount.count >=
            user.subscription.subscriptionMetadata.quiz_limit)
      ) {
        setPlansModalMessage(
          !hasActiveSubscription
            ? "Let's get you on a plan so you can generate quizzes! "
            : "Looks like you've filled up your quiz store! 🚀"
        );
        setPlansModalSubMessage(
          !hasActiveSubscription
            ? 'Get started today for free!'
            : "Let's upgrade your plan so you can keep generating more."
        );
        setTogglePlansModal(true); // Show the PlansModal
        return;
      }

      if (isNil(ingestedDocument)) {
        const title = getFileNameFromUrl(localData?.fileUrl);
        const response = await saveDocument(
          {
            title: isNil(title) || isEmpty(title) ? localData?.fileUrl : title,
            documentUrl: localData?.fileUrl
          },
          true
        );

        setIngestedDocument(response);

        const fileProcessor = new FileProcessingService(
          merge({}, response, {
            student: localData?.studentID || user?._id,
            studentId: localData?.studentID || user?._id
          }),
          true
        );
        await fileProcessor.process();

        await handleGenerateQuestions({
          ...(omit(localData, [
            'studentID',
            'fileUrl',
            'contentType',
            'documentID',
            'ingestDoc'
          ]) as any)
        });
      } else {
        await handleGenerateQuestions({
          ...(omit(localData, [
            'studentID',
            'fileUrl',
            'contentType',
            'documentID',
            'ingestDoc'
          ]) as any),
          studentId: user._id,
          documentId: ingestedDocument?.value
        });
      }

      watchJobs(
        isNil(ingestedDocument)
          ? localData?.documentId
          : ingestedDocument?.keywords,
        async (error, quizQuestions) => {
          if (error) {
            toast({
              position: 'top-right',
              title: `failed to generate quizzes `,
              status: 'error'
            });

            return;
          }

          await handleFormatQuizQuestionCallback(
            quizQuestions,
            localData,
            () => {
              setIsUploadingFile(false);
              handleIsLoadingQuizzes(false);
              handleSetUploadingState(false);
              setTimeout(
                () =>
                  clearJobs(
                    isNil(ingestedDocument)
                      ? localData?.documentId
                      : (ingestedDocument?.keywords as string)
                  ),
                5000
              );
            }
          );
        }
      );
    } catch (error) {
      toast({
        position: 'top-right',
        title: `failed to generate quizzes `,
        status: 'error'
      });
    }
  };

  const disabledByFileOrDocument =
    isNil(file) && isNil(ingestedDocument) ? true : false;

  const disabledByTitle = isEmpty(title) ? true : isNil(title) ? true : false;

  return (
    <Box width={'100%'} mt="20px">
      <FormControl mb={4}>
        <FormLabel textColor={'text.600'}>Enter a title</FormLabel>
        <Input
          value={title}
          type="text"
          _placeholder={{
            color: 'text.200',
            fontSize: '14px'
          }}
          height={'48px'}
          onChange={(e) => handleSetTitle(e.target.value)}
          autoComplete="off"
          defaultValue={title}
        />
      </FormControl>
      <FormControl mb={7}>
        <FormLabel textColor={'text.600'}>Upload a document</FormLabel>

        <FileUpload
          show={openModal}
          setShow={setOpenModal}
          acceptString="JPEG, JPG, PNG, TIFF and PDF"
          accept={{
            'image/jpeg': ['.jpg', '.jpeg'],
            'application/pdf': ['.pdf'],
            'image/png': ['.png'],
            'image/tiff': ['.tiff', '.tif']
          }}
          onIngestedDocument={(ingestedDocument) =>
            setIngestedDocument(ingestedDocument)
          }
          onDocumentSelect={(documnet) => {
            setLocalData((prev) => ({
              ...prev,
              ...documnet,
              documentId: documnet?.documentID || documnet?.fileUrl,
              studentId: documnet?.studentID || user?._id
            }));
          }}
          onFileSelect={(file) => setFile(file)}
          showUploadTrigger={true}
          useUploadModal={true}
        />

        <FormHelperText textColor={'text.300'}>
          Shepherd supports .pdf, .tiff, .png & .jpg document formats
        </FormHelperText>
      </FormControl>

      <FormControl mb={7}>
        <FormLabel textColor={'text.600'}>Question type:</FormLabel>

        <SelectComponent
          name="type"
          defaultValue={typeOptions.find(
            (option) => option.value === localData.type
          )}
          placeholder="Select Type"
          options={typeOptions}
          size={'md'}
          onChange={(option) => {
            const event = {
              target: {
                name: 'type',
                value: (option as Option).value
              }
            } as ChangeEvent<HTMLSelectElement>;
            handleChange(event);
          }}
        />
      </FormControl>

      <FormControl mb={7}>
        <FormLabel textColor={'text.600'}>
          Number of questions
          <Tooltip
            hasArrow
            label="Quick tip! For docs under 40 pages, request a max 50 quizzes. For longer ones, double it up to 100 quizzes! Let's ace those tests!
            "
            placement="right-end"
          >
            <QuestionIcon mx={2} w={3} h={3} />
          </Tooltip>
        </FormLabel>
        <Input
          textColor={'text.700'}
          height={'48px'}
          className={isError && '!border-red-600 !border-spacing-2'}
          name="count"
          onChange={handleChange}
          type="text"
          value={localData.count}
          color={'text.200'}
          min="1"
          max={localData.end_page && localData.end_page <= 40 ? 50 : 100}
        />
      </FormControl>

      <FormControl mb={8}>
        <FormLabel textColor={'text.600'}>Level (optional): </FormLabel>
        <SelectComponent
          name="difficulty"
          placeholder="Select Level"
          defaultValue={levelOptions.find(
            (option) => option.value === localData.difficulty
          )}
          options={levelOptions}
          size={'md'}
          onChange={(option) => {
            const event = {
              target: {
                name: 'difficulty',
                value: (option as Option).value
              }
            } as ChangeEvent<HTMLSelectElement>;
            handleChange(event);
          }}
        />
      </FormControl>

      <FormControl mb={7}>
        <FormLabel textColor={'text.600'}>Start Page (Optional)</FormLabel>
        <Input
          type="text"
          name="start_page"
          placeholder="Start Page Number"
          value={localData.start_page}
          onChange={handleChange}
        />
      </FormControl>
      <FormControl mb={7}>
        <FormLabel textColor={'text.600'}>End Page (Optional)</FormLabel>
        <Input
          type="text"
          name="end_page"
          placeholder="End Page Number"
          value={localData.end_page}
          onChange={handleChange}
        />
      </FormControl>

      <HStack
        w="100%"
        marginBottom={4}
        alignItems={'center'}
        justifyContent={'end'}
        marginTop="40px"
        align={'flex-end'}
      >
        <Button
          width={'180px'}
          borderRadius="8px"
          p="10px 20px"
          fontSize="14px"
          lineHeight="20px"
          variant="solid"
          colorScheme="primary"
          onClick={handleOnSubmit}
          ml={5}
          isDisabled={
            // uploadingState ||
            // disabledByFileOrDocument ||
            // localData.count < 1 ||
            // disabledByTitle
            disabledByFileOrDocument || disabledByTitle || isError
          }
          isLoading={isUploadingFile}
        >
          <WardIcon className={'h-[20px] w-[20px] mx-2'} onClick={() => ''} />
          Generate
        </Button>
      </HStack>
      {togglePlansModal && (
        <PlansModal
          togglePlansModal={togglePlansModal}
          setTogglePlansModal={setTogglePlansModal}
          message={plansModalMessage} // Pass the message to the modal
          subMessage={plansModalSubMessage}
        />
      )}
    </Box>
  );
};

export default UploadQuizForm;
