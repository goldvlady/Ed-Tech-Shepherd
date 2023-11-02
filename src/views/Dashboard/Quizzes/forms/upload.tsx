import { useCustomToast } from '../../../../components/CustomComponents/CustomToast/useCustomToast';
import SelectComponent, { Option } from '../../../../components/Select';
import { UploadIcon, WardIcon } from '../../../../components/icons';
import uploadFile from '../../../../helpers/file.helpers';
import FileProcessingService from '../../../../helpers/files.helpers/fileProcessing';
import ApiService from '../../../../services/ApiService';
import documentStore from '../../../../state/documentStore';
import quizStore from '../../../../state/quizStore';
import userStore from '../../../../state/userStore';
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
  Select,
  Input,
  HStack,
  Button,
  InputGroup,
  InputLeftElement,
  Tooltip,
  Text
} from '@chakra-ui/react';
import {
  includes,
  isEmpty,
  isNil,
  last,
  map,
  split,
  toLower,
  toNumber,
  truncate,
  omit,
  isArray
} from 'lodash';
import { ChangeEvent, useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

// DownloadIcon

const UploadQuizForm = ({ addQuestion, handleSetTitle }) => {
  const dummyData = {
    subject: '',
    topic: '',
    difficulty: 'kindergarten',
    count: 1,
    type: MIXED,
    documentId: ''
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

  const { saveDocument } = documentStore();

  // const fileRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<any>();
  const [isUploadingFile, setIsUploadingFile] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    setFile(acceptedFiles[0]);
  }, []);

  const handleGenerateQuestions = async (documentId: string) => {
    try {
      const result = await ApiService.generateQuizQuestion(user._id, {
        ...localData,
        count: toNumber(localData.count),
        documentId
      });
      const { quizzes } = await result.json();

      addQuestion(
        map([...quizzes], (quiz) => {
          let type = quiz?.type;
          let options = [];
          if (!isNil(quiz?.options) && isArray(quiz?.options)) {
            options = quiz?.options;
          }

          if (isNil(type) || isEmpty(type)) {
            if (!isNil(options) || !isEmpty(options)) {
              if (options.length < 3) {
                type = TRUE_FALSE;
              } else {
                type = MULTIPLE_CHOICE_SINGLE;
              }
            } else {
              if (!isEmpty(quiz?.answer) || !isNil(quiz?.answer)) {
                type = OPEN_ENDED;
              }
            }
          } else {
            if (
              includes(toLower(type), 'multiple') ||
              includes(toLower(type), 'choice')
            ) {
              type = MULTIPLE_CHOICE_SINGLE;
            }
            if (includes(toLower(type), 'true')) {
              type = TRUE_FALSE;
            }
            if (
              includes(toLower(type), 'open') ||
              includes(toLower(type), 'ended')
            ) {
              type = OPEN_ENDED;
            }
          }

          return {
            ...omit(quiz, ['explanation']),
            options,
            type
          };
        }),
        'multiple'
      );

      // addQuestion(
      //   map([...quizzes], (quiz) => {
      //     let type = quiz?.type;

      //     if (isNil(type) || isEmpty(type)) {
      //       if (!isNil(quiz?.options) || !isEmpty(quiz?.options)) {
      //         if (quiz?.options?.length < 3) {
      //           type = TRUE_FALSE;
      //         } else {
      //           type = MULTIPLE_CHOICE_SINGLE;
      //         }
      //       } else {
      //         if (!isEmpty(quiz?.answer) || !isNil(quiz?.answer)) {
      //           type = OPEN_ENDED;
      //         }
      //       }
      //     } else {
      //       if (
      //         includes(toLower(type), 'multiple') ||
      //         includes(toLower(type), 'choice')
      //       ) {
      //         type = MULTIPLE_CHOICE_SINGLE;
      //       }
      //       if (includes(toLower(type), 'true')) {
      //         type = TRUE_FALSE;
      //       }
      //       if (
      //         includes(toLower(type), 'open') ||
      //         includes(toLower(type), 'ended')
      //       ) {
      //         type = OPEN_ENDED;
      //       }
      //     }

      //     return {
      //       options: [],
      //       ...quiz,
      //       type
      //     };
      //   }),
      //   'multiple'
      // );

      handleSetTitle(localData?.topic);

      setLocalData(dummyData);
      toast({
        position: 'top-right',
        title: `quizzes generated`,
        status: 'success'
      });
    } catch (error) {
      console.log('error =======>> ', error);
      toast({
        position: 'top-right',
        title: `failed to generate quizzes `,
        status: 'error'
      });
    } finally {
      // setIsLoading(false);
      handleIsLoadingQuizzes(false);
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
    handleIsLoadingQuizzes(true);

    const uploadEmitter = uploadFile(file);
    uploadEmitter.on('progress', (progress: number) => {
      if (!isUploadingFile) {
        setIsUploadingFile(true);
      }
    });
    uploadEmitter.on('complete', async (documentUrl: string) => {
      try {
        const title = decodeURIComponent(
          (documentUrl.match(/\/([^/]+)(?=\.\w+\?)/) || [])[1] || ''
        ).replace('uploads/', '');

        const response = await saveDocument({ title, documentUrl }, true);
        if (response) {
          // console.log('response =========>> ', response);

          const fileProcessor = new FileProcessingService(
            { ...(response as any), student: user?._id },
            true
          );
          const processData = await fileProcessor.process();

          const {
            data: [{ documentId }]
          } = processData;
          // setOpenUploadModal(false);

          console.log('processData =========>>> ', processData);

          console.log('documentId =========>>> ', documentId);

          await handleGenerateQuestions(documentId);

          handleIsLoadingQuizzes(false);
          // toast({
          //   title: 'Document saved',
          //   status: 'success',
          //   position: 'top-right'
          // });
        } else {
          handleIsLoadingQuizzes(false);
          toast({
            title: 'Failed to save document',
            status: 'error',
            position: 'top-right'
          });
        }
        setIsUploadingFile(false);
      } catch (error) {
        handleIsLoadingQuizzes(false);
        toast({
          title: 'Failed to save document',
          status: 'error',
          position: 'top-right'
        });
      } finally {
        setIsUploadingFile(false);
        handleIsLoadingQuizzes(false);
      }
    });
    uploadEmitter.on('error', (error) => {
      toast({
        title: 'Failed to save document',
        status: 'error',
        position: 'top-right'
      });
      setIsUploadingFile(false);
    });
    // }
  };

  const { getRootProps, getInputProps, acceptedFiles } = useDropzone({
    onDrop,
    accept: {
      'text/plain': ['.txt'],
      'application/pdf': ['.pdf'],
      'image/jpeg': ['.jpeg', '.jpg'],
      'application/vnd.ms-powerpoint': ['.ppt']
    },
    maxSize: 1000000 * 5
  });

  return (
    <Box width={'100%'} mt="20px" padding="0 10px">
      <FormControl mb={7}>
        <FormLabel color={'text.500'}>Enter a topic</FormLabel>
        <HStack
          alignItems={'center'}
          p={'14px 16px'}
          textColor={'text-200'}
          fontSize={'14px'}
          fontFamily={'Inter'}
          fontWeight={'500'}
          border={'1px solid #E4E5E7'}
          borderRadius={'6px'}
          boxShadow={'box-shadow: 0px 2px 6px 0px rgba(136, 139, 143, 0.10);'}
          cursor={'pointer'}
          {...getRootProps()}
        >
          <UploadIcon
            className={'h-[20px] text-gray-500'}
            onClick={() => {
              ('');
            }}
          />
          <Box>
            {isEmpty(acceptedFiles) ? (
              <Text>Upload doc</Text>
            ) : (
              <Text>
                {truncate(acceptedFiles[0]?.name, {
                  length: 25
                })}{' '}
                - .{last(split(acceptedFiles[0]?.name, '.'))}
              </Text>
            )}
          </Box>
        </HStack>
        <input id="upload" name="upload" type="file" {...getInputProps()} />
        <FormHelperText textColor={'text.300'}>
          Shepherd supports .pdf, .ppt, .jpg & .txt document formats
        </FormHelperText>
      </FormControl>

      <FormControl mb={7}>
        <FormLabel color={'text.500'}>Question type:</FormLabel>

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

      <FormControl mb={8}>
        <FormLabel color={'text.500'}>Level (optional): </FormLabel>
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
        <FormLabel color={'text.500'}>
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
          type="number"
          value={localData.count}
        />
      </FormControl>

      <HStack
        w="100%"
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
          isDisabled={isNil(file) || localData.count < 1}
        >
          <WardIcon className={'h-[20px] w-[20px] mx-2'} onClick={() => ''} />
          Generate
        </Button>
      </HStack>
    </Box>
  );
};

export default UploadQuizForm;
