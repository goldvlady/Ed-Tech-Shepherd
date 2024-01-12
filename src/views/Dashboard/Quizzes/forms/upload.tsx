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
  const [plansModalMessage] = useState('');
  const [PlansModalSubMessage] = useState('');
  const [openModal, _, setOpenModal] = useToggle(false);
  const [ingestedDocument, setIngestedDocument] = useState(null);

  const handleGenerateQuestions = async (data: LocalDummyData) => {
    try {
      const result = await ApiService.generateQuizQuestionFromDocs({
        ...data,
        count: toNumber(data?.count)
      });

      const resultJson = await result.json();

      if (resultJson.statusCode > 399) {
        throw new Error(resultJson.body);
      }
    } catch (error) {
      console.log(
        'handleGenerateQuestions ---------->>> error =============>>> ',
        error
      );
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
      const { name, value } = e.target;
      setLocalData((prevState) => ({ ...prevState, [name]: value }));
    },
    []
  );

  const handleOnSubmit = async () => {
    try {
      setIsUploadingFile(true);
      handleSetUploadingState(true);

      if (isNil(ingestedDocument)) {
        const title = decodeURIComponent(
          (localData?.fileUrl?.match(/\/([^/]+)(?=\.\w+\?)/) || [])[1] || ''
        )?.replace('uploads/', '');
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
      }

      await handleGenerateQuestions({
        ...(omit(localData, [
          'studentID',
          'fileUrl',
          'contentType',
          'documentID',
          'ingestDoc'
        ]) as any),
        studentId: user._id,
        documentId: ingestedDocument?.keywords
      });

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

  useEffect(() => {
    console.log(
      'disabledByFileOrDocument ==========>>>> ',
      disabledByFileOrDocument
    );
    console.log('disabledByTitle ==========>>>> ', disabledByTitle);
  }, [disabledByFileOrDocument, disabledByTitle]);

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
          Shepherd supports .pdf, .ppt, .jpg & .txt document formats
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
            label="Number of questions to create"
            placement="right-end"
          >
            <QuestionIcon mx={2} w={3} h={3} />
          </Tooltip>
        </FormLabel>
        <Input
          textColor={'text.700'}
          height={'48px'}
          name="count"
          onChange={handleChange}
          type="text"
          value={localData.count}
          color={'text.200'}
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
          type="number"
          name="start_page"
          placeholder="Start Page Number"
          value={localData.startPage}
          onChange={handleChange}
        />
      </FormControl>
      <FormControl mb={7}>
        <FormLabel textColor={'text.600'}>End Page (Optional)</FormLabel>
        <Input
          type="number"
          name="end_page"
          placeholder="End Page Number"
          value={localData.endPage}
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
            disabledByFileOrDocument || disabledByTitle
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
          subMessage={PlansModalSubMessage}
        />
      )}
    </Box>
  );
};

export default UploadQuizForm;
