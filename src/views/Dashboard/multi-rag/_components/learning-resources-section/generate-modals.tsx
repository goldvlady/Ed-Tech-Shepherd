import {
  Box,
  Button,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Radio,
  RadioGroup,
  Text
} from '@chakra-ui/react';
import { FiChevronDown } from 'react-icons/fi';
import SelectComponent, { Option } from '../../../../../components/Select';
import React from 'react';
import { languages } from '../../../../../helpers';
import { useCustomToast } from '../../../../../components/CustomComponents/CustomToast/useCustomToast';
import { useMutation } from '@tanstack/react-query';
import { GenerateFlashcardFromMultiBody } from '../../../../../types';
import ApiService from '../../../../../services/ApiService';
import useUserStore from '../../../../../state/userStore';

type GenerateFlashcardModalProps = {
  isOpen: boolean;
  onClose: VoidFunction;
  docNames: Array<string>;
};
export const GenerateFlashcardModal = ({
  isOpen,
  onClose,
  docNames
}: GenerateFlashcardModalProps) => {
  const [searchValue, setSearchValue] = React.useState('');
  const [preferredLanguage, setPreferredLanguage] = React.useState<
    (typeof languages)[number]
  >(languages[0]);
  const [localData, setLocalData] = React.useState({
    deckname: '',
    studyType: '',
    studyPeriod: '',
    numQuestions: 0,
    timerDuration: '',
    hasSubmitted: false,
    documentId: '',
    topic: '',
    subject: '',
    grade: ''
  });
  const toast = useCustomToast();

  const {user} = useUserStore()
  
  const { mutate } = useMutation({
    mutationKey: ["generateFlashcardFromMultirag", docNames],
    mutationFn: (data: GenerateFlashcardFromMultiBody) => ApiService.multiGenerateFlashcardsFromDocs(data),
    onSuccess() {
      console.log("SUFFERING FROM SUCCESS")
        setLocalData({
          deckname: '',
          studyType: '',
          studyPeriod: '',
          numQuestions: 0,
          timerDuration: '',
          hasSubmitted: false,
          documentId: '',
          topic: '',
          subject: '',
          grade: ''
        })
      setSearchValue('')
      setPreferredLanguage(languages[0])
    },
  })

  const studyPeriodOptions = [
    { label: 'Daily', value: 'daily' },
    { label: 'Once a week', value: 'weekly' },
    { label: 'Twice a week', value: 'biweekly' },
    {
      label:
        localData.studyType && localData.studyType === 'quickPractice'
          ? "Doesn't repeat"
          : 'Spaced repetition',
      value:
        localData.studyType && localData.studyType === 'quickPractice'
          ? 'noRepeat'
          : 'spacedRepetition'
    }
  ];
  const isValid = React.useMemo(() => {
    const { timerDuration, hasSubmitted, subject, topic, documentId, ...data } = localData;
      const payload: { [key: string]: any } = { ...data };
      console.log(payload)
    return Object.values(payload).every(Boolean);
  }, [localData]);
    console.log(isValid)
  const handleChange = React.useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >
    ) => {
      const { name, value } = e.target;
      setLocalData((prevState) => ({ ...prevState, [name]: value }));
    },
    [setLocalData]
  );
 
  const handleSubmit = async () => {

    const data = {
      ...localData,
      lang: preferredLanguage,
      docNames,
      numQuestions: parseInt(localData.numQuestions as unknown as string),
      user_id: user._id
    };
    delete data["timerDuration"]
    delete data["hasSubmitted"]
    delete data["documentId"]
    console.log(data);
    mutate(data);
  };
  const closeModalOnSubmit = async() => {
      onClose();
      toast({
          title: "Creating Flashcards",
          description: "Hang tight we're creating your flashcards",
          status: "success"
      })
      handleSubmit()
  };
  return (
    <Modal size={"md"} isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Text
            fontSize={{ md: '24px', base: '1.1rem' }}
            fontWeight="500"
            marginBottom="5px"
          >
            Set up flashcard
          </Text>
              </ModalHeader>
              <ModalCloseButton/>
        <ModalBody>
          <Box bg="white" width="100%" mt="10px">
            <FormControl my={4}>
              <FormLabel
                fontSize="12px"
                lineHeight="17px"
                color="#5C5F64"
                mb={3}
              >
                Preferred Language
              </FormLabel>
              <Menu>
                <MenuButton
                  as={Button}
                  variant="outline"
                  rightIcon={<FiChevronDown />}
                  borderRadius="8px"
                  width="100%"
                  height="42px"
                  fontSize="0.875rem"
                  fontFamily="Inter"
                  color=" #212224"
                  fontWeight="400"
                  textAlign="left"
                >
                  {preferredLanguage || 'Select a language...'}
                </MenuButton>
                <MenuList zIndex={3} width="100%">
                  <Input
                    size="sm"
                    onChange={(e) => setSearchValue(e.target.value)}
                    placeholder="Search Language"
                    value={searchValue}
                  />
                  <div
                    style={{
                      maxHeight: '200px',
                      overflowY: 'auto'
                    }}
                  >
                    {languages
                      .filter((lang) =>
                        lang.toLowerCase().includes(searchValue.toLowerCase())
                      )
                      .map((lang) => (
                        <MenuItem
                          fontSize="0.875rem"
                          width="100%"
                          key={lang}
                          _hover={{ bgColor: '#F2F4F7' }}
                          onClick={() =>
                            setPreferredLanguage(
                              lang as typeof preferredLanguage
                            )
                          }
                        >
                          {lang}
                        </MenuItem>
                      ))}
                  </div>
                </MenuList>
              </Menu>
            </FormControl>
            {/* <FormControl my={8}>
        <FormLabel fontSize="12px" lineHeight="17px" color="#5C5F64" mb={3}>
          Upload a source document
        </FormLabel>
        <FileUpload
          accept=".jpg,.jpeg,.pdf,.png,.tiff,.tif"
          isLoading={isLoading}
          onFileSelect={onHandleFile}
        />
        <FormLabel fontSize="12px" lineHeight="17px" color="#5C5F64" mt={3}>
          Shepherd supports .pdf, .tiff, .png & .jpg document formats
        </FormLabel>
      </FormControl> */}
            <Box
              display="flex"
              flexDir={'column'}
              bg="white"
              borderRadius="6px"
              border="1px solid #E4E6E7"
              py={'10px'}
                          px={'20px'}
                          mb={3}
              className="w-full"
              _hover={{ bg: '' }}
              cursor="pointer"
            >
              {docNames.map((doc) => (
                <Box
                  boxShadow="0px 2px 6px rgba(136, 139, 143, 0.1)"
                  justifyContent={'center'}
                  alignItems={'center'}
                  display={'flex'}
                  key={doc}
                  w="full"
                >
                  <Text ml="10px" color="#9A9DA2" fontSize={'14px'}>
                    {doc}
                  </Text>
                </Box>
              ))}
            </Box>
            <FormControl mb={8}>
              <FormLabel
                fontSize="12px"
                lineHeight="17px"
                color="#5C5F64"
                mb={3}
              >
                Deckname
              </FormLabel>
              <Input
                fontSize="0.875rem"
                type="text"
                name="deckname"
                placeholder="e.g. Deckname"
                value={localData.deckname}
                onChange={handleChange}
                _placeholder={{ fontSize: '14px', color: '#9A9DA2' }}
              />
            </FormControl>
            <FormControl mb={8}>
              <FormLabel
                fontSize="12px"
                lineHeight="17px"
                color="#5C5F64"
                mb={3}
              >
                Topic
              </FormLabel>
              <Input
                fontSize="0.875rem"
                type="text"
                name="topic"
                placeholder="e.g. Covalent bonds"
                value={localData.topic}
                onChange={handleChange}
                _placeholder={{ fontSize: '14px', color: '#9A9DA2' }}
              />
            </FormControl>
            <FormControl mb={8}>
              <FormLabel
                fontSize="12px"
                lineHeight="17px"
                color="#5C5F64"
                mb={3}
              >
                Subject
              </FormLabel>
              <Input
                fontSize="0.875rem"
                type="text"
                name="subject"
                placeholder="e.g. Chemistry"
                value={localData.subject}
                onChange={handleChange}
                _placeholder={{ fontSize: '14px', color: '#9A9DA2' }}
              />
            </FormControl>
            <FormControl mb={8}>
              <FormLabel
                fontSize="12px"
                lineHeight="17px"
                color="#5C5F64"
                mb={3}
              >
                Grade
              </FormLabel>
              <Input
                fontSize="0.875rem"
                type="text"
                name="grade"
                placeholder="e.g. Sophomore"
                value={localData.grade}
                onChange={handleChange}
                _placeholder={{ fontSize: '14px', color: '#9A9DA2' }}
              />
            </FormControl>
            <FormControl mb={8}>
              <FormLabel
                fontSize="12px"
                lineHeight="17px"
                color="#5C5F64"
                mb={3}
              >
                Select study type
              </FormLabel>
              <RadioGroup
                name="studyType"
                value={localData.studyType}
                onChange={(value) => {
                  if (value === 'longTermRetention') {
                    handleChange({
                      target: { name: 'studyPeriod', value: 'spacedRepetition' }
                    } as React.ChangeEvent<HTMLInputElement>);
                  }
                  handleChange({
                    target: { name: 'studyType', value }
                  } as React.ChangeEvent<HTMLInputElement>);
                }}
              >
                <Radio value="longTermRetention">
                  <Text fontSize="14px" marginRight="15px">
                    Long term retention
                  </Text>
                </Radio>
                <Radio ml={0} value="quickPractice">
                  <Text fontSize="14px"> Quick Practice</Text>
                </Radio>
              </RadioGroup>
            </FormControl>
            <FormControl mb={8}>
              <FormLabel
                fontSize="12px"
                lineHeight="17px"
                color="#5C5F64"
                mb={3}
              >
                How often would you like to study?
              </FormLabel>
              <SelectComponent
                name="studyPeriod"
                placeholder="Select study period"
                defaultValue={studyPeriodOptions.find(
                  (option) => option.value === localData.studyPeriod
                )}
                tagVariant="solid"
                options={studyPeriodOptions}
                size={'md'}
                onChange={(option) => {
                  const event = {
                    target: {
                      name: 'studyPeriod',
                      value: (option as Option).value
                    }
                  } as React.ChangeEvent<HTMLSelectElement>;
                  handleChange(event);
                }}
              />
            </FormControl>
            <FormControl mb={8}>
              <FormLabel
                fontSize="12px"
                lineHeight="17px"
                color="#5C5F64"
                mb={3}
              >
                Number of questions
              </FormLabel>
              <Input
                type="number"
                min={1}
                fontSize="0.875rem"
                name="numQuestions"
                placeholder="Number of questions"
                value={localData.numQuestions}
                onChange={handleChange}
                _placeholder={{ fontSize: '14px', color: '#9A9DA2' }}
              />
            </FormControl>

          
            <HStack w="full" align={'flex-end'}>
              <Button
                variant="solid"
                isDisabled={!isValid}
                colorScheme="primary"
                size="sm"
                ml="auto"
                fontSize={'14px'}
                mt={4}
                padding="20px 25px"
                onClick={closeModalOnSubmit}
              >
                <svg
                  style={{ marginRight: '4px' }}
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12.6862 12.9228L10.8423 16.7979C10.7236 17.0473 10.4253 17.1533 10.1759 17.0346C10.1203 17.0082 10.0701 16.9717 10.0278 16.9269L7.07658 13.8113C6.99758 13.7279 6.89228 13.6743 6.77838 13.6594L2.52314 13.1032C2.24932 13.0673 2.05637 12.8164 2.09216 12.5426C2.10014 12.4815 2.11933 12.4225 2.14876 12.3684L4.19993 8.59893C4.25484 8.49801 4.27333 8.38126 4.25229 8.26835L3.46634 4.0495C3.41576 3.77803 3.59484 3.51696 3.86631 3.46638C3.92684 3.45511 3.98893 3.45511 4.04946 3.46638L8.26831 4.25233C8.38126 4.27337 8.49801 4.25488 8.59884 4.19998L12.3683 2.1488C12.6109 2.01681 12.9146 2.10644 13.0465 2.349C13.076 2.40308 13.0952 2.46213 13.1031 2.52318L13.6593 6.77842C13.6743 6.89233 13.7279 6.99763 13.8113 7.07662L16.9269 10.0278C17.1274 10.2177 17.136 10.5342 16.9461 10.7346C16.9038 10.7793 16.8535 10.8158 16.7979 10.8423L12.9228 12.6862C12.8191 12.7356 12.7355 12.8191 12.6862 12.9228ZM13.3502 14.5288L14.5287 13.3503L18.0643 16.8858L16.8858 18.0643L13.3502 14.5288Z"
                    fill="white"
                  />
                </svg>
                Generate Flashcard
              </Button>
            </HStack>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
