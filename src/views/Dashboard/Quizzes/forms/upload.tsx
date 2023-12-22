import { useCustomToast } from '../../../../components/CustomComponents/CustomToast/useCustomToast';
import SelectComponent, { Option } from '../../../../components/Select';
import { UploadIcon, WardIcon } from '../../../../components/icons';
import uploadFile from '../../../../helpers/file.helpers';
import FileProcessingService from '../../../../helpers/files.helpers/fileProcessing';
import ApiService from '../../../../services/ApiService';
import documentStore from '../../../../state/documentStore';
import quizStore from '../../../../state/quizStore';
import userStore from '../../../../state/userStore';
import useQuizzesQuestionsJob from '../../../../hooks/useQuizzesQuestionsJob';
import {
  MIXED,
  MULTIPLE_CHOICE_MULTI,
  MULTIPLE_CHOICE_SINGLE,
  OPEN_ENDED,
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
  isArray,
  toString
} from 'lodash';
import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';

// DownloadIcon

const UploadQuizForm = ({
  quizId,
  handleCreateQuiz,
  handleUpdateQuiz,
  handleSetTitle,
  title,
  handleSetUploadingState,
  isLoadingButton
}) => {
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
  const { handleIsLoadingQuizzes, fetchQuizzes, isLoading } = quizStore();

  const { user } = userStore();

  const { watchJobs, clearJobs } = useQuizzesQuestionsJob(user?._id);

  const { saveDocument } = documentStore();

  const [file, setFile] = useState<any>();
  const [isUploadingFile, setIsUploadingFile] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    setFile(acceptedFiles[0]);
  }, []);

  const handleGenerateQuestions = async ({
    name
  }: {
    name: string;
    documentId?: string;
  }) => {
    try {
      // handleSetUploadingState(true);
      await ApiService.generateQuizQuestionFromDocs({
        ...localData,
        count: toNumber(localData.count),
        documentId: name,
        studentId: user?._id,
        topic: title
      });

      setLocalData(dummyData);
      // toast({
      //   position: 'top-right',
      //   title: `quizzes generated`,
      //   status: 'success'
      // });
    } catch (error) {
      toast({
        position: 'top-right',
        title: `failed to generate quizzes job `,
        status: 'error'
      });
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
    handleSetUploadingState(true);

    const uploadEmitter = uploadFile(file, null, true);
    uploadEmitter.on('progress', (progress: number) => {
      if (!isUploadingFile) {
        setIsUploadingFile(true);
      }
    });
    uploadEmitter.on('complete', async (document: any) => {
      try {
        const title = decodeURIComponent(
          (document?.fileUrl?.match(/\/([^/]+)(?=\.\w+\?)/) || [])[1] || ''
        )?.replace('uploads/', '');

        const response = await saveDocument(
          { title, documentUrl: document?.fileUrl },
          true
        );

        if (response) {
          const fileProcessor = new FileProcessingService(
            { ...(response as any), student: user?._id },
            true
          );
          await fileProcessor.process();

          // const {
          //   data: { documentId }
          // } = processData;

          await handleGenerateQuestions({
            name: document?.name
          });

          watchJobs(document?.name as string, async (error, quizQuestions) => {
            if (error) {
              toast({
                position: 'top-right',
                title: `failed to generate quizzes `,
                status: 'error'
              });
              return;
            }
            // toast({
            //   position: 'top-right',
            //   title: `generate quizzes successful`,
            //   status: 'success'
            // });

            if (isArray(quizQuestions) && !isEmpty(quizQuestions)) {
              (async () => {
                const questions = map([...quizQuestions], (quiz) => {
                  let type = quiz?.type;
                  let options = [];
                  if (
                    !isNil(quiz?.options) ||
                    (isArray(quiz?.options) && isEmpty(quiz?.options))
                  ) {
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
                      includes(toLower(type), 'multiple answers') ||
                      includes(toLower(type), 'multipleanswers') ||
                      includes(toLower(type), 'multipleanswer') ||
                      toLower(type) === 'multiplechoice'
                    ) {
                      type = MULTIPLE_CHOICE_MULTI;
                    }
                    if (
                      includes(toLower(type), 'single answer') ||
                      includes(toLower(type), 'singleanswer')
                    ) {
                      type = MULTIPLE_CHOICE_SINGLE;
                    }
                    if (
                      includes(toLower(type), 'true') ||
                      includes(toLower(type), 'false')
                    ) {
                      type = TRUE_FALSE;
                    }
                    if (
                      includes(toLower(type), 'open') ||
                      includes(toLower(type), 'ended')
                    ) {
                      type = OPEN_ENDED;
                      if (!isEmpty(options)) {
                        if (options.length < 3) {
                          type = TRUE_FALSE;
                        } else {
                          type = MULTIPLE_CHOICE_SINGLE;
                        }
                        const arrOptions = [...options];
                        options = map(arrOptions, (option, idx) => ({
                          content: option,
                          isCorrect: toNumber(quiz?.answer) === idx + 1
                        }));
                      }
                    }
                  }

                  return {
                    ...omit(quiz, ['explanation']),
                    options,
                    type,
                    answer: toString(quiz?.answer)
                  };
                });

                if (isNil(quizId) && isEmpty(quizId)) {
                  await handleCreateQuiz(questions);
                } else {
                  await handleUpdateQuiz(quizId, { quizQuestions: questions });
                }

                setIsUploadingFile(false);
                handleIsLoadingQuizzes(false);
                handleSetUploadingState(false);
                await fetchQuizzes();
              })();
            }

            setTimeout(() => clearJobs(document?.name as string), 5000);
          });
        } else {
          toast({
            title: 'Failed to save document',
            status: 'error',
            position: 'top-right'
          });
        }
      } catch (error) {
        console.log('uploadEmitter catch =======>> error ', error);
        toast({
          title: 'Failed to save document',
          status: 'error',
          position: 'top-right'
        });
      } finally {
        // setIsUploadingFile(false);
        // handleIsLoadingQuizzes(false);
        // handleSetUploadingState(false);
      }
    });
    uploadEmitter.on('error', (error) => {
      console.log('uploadEmitter =======>> error ', error);
      toast({
        title: 'Failed to save document',
        status: 'error',
        position: 'top-right'
      });
      setIsUploadingFile(false);
    });
  };

  // useEffect(() => {
  //   console.log('this ran !!! =======>>> ');

  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [quizQuestions]);

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
          type="number"
          value={localData.count}
          color={'text.200'}
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
          isDisabled={
            isEmpty(title) || isNil(title) || isNil(file) || localData.count < 1
          }
          isLoading={isUploadingFile}
        >
          <WardIcon className={'h-[20px] w-[20px] mx-2'} onClick={() => ''} />
          Generate
        </Button>
      </HStack>
    </Box>
  );
};

export default UploadQuizForm;
