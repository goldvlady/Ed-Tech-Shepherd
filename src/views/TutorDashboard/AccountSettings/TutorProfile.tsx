import FileAvi2 from '../../../assets/file-avi2.svg';
import CustomModal from '../../../components/CustomComponents/CustomModal';
import CustomToast from '../../../components/CustomComponents/CustomToast';
import { firebaseAuth, updatePassword } from '../../../firebase';
import ApiService from '../../../services/ApiService';
import resourceStore from '../../../state/resourceStore';
import userStore from '../../../state/userStore';
import AvailabilityTable from '../../Dashboard/components/AvailabilityTable';
import AvailabilityEditForm from './AvailabilityEditForm.tsx';
import {
  Avatar,
  AspectRatio,
  Editable,
  EditableInput,
  EditableTextarea,
  EditablePreview,
  Input,
  InputGroup,
  InputRightElement,
  useEditableControls,
  Switch,
  Spacer,
  Divider,
  Button,
  Box,
  Flex,
  Image,
  FormControl,
  FormLabel,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Text,
  Stack,
  useToast,
  useDisclosure,
  VStack,
  Center,
  Table,
  TableContainer,
  Tbody,
  Thead,
  Tr,
  Th,
  Td,
  IconButton,
  Textarea,
  InputLeftElement,
  HStack
} from '@chakra-ui/react';
import firebase from 'firebase/app';
import moment from 'moment';
// import { updatePassword } from 'firebase/auth';
import React, { useState, useEffect, useMemo } from 'react';
import { BiPlayCircle } from 'react-icons/bi';
import { IoIosAlert } from 'react-icons/io';
import { MdEdit } from 'react-icons/md';
import { RiArrowRightSLine } from 'react-icons/ri';

function MyProfile(props) {
  const { tutorData } = props;
  const { user } = userStore();
  const { rate } = resourceStore();

  const toast = useToast();
  const [newEmail, setNewEmail] = useState<string>(tutorData.email);

  const [isOpenTandC, setIsOpenTandC] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [oldPassword, setOldPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const handleClickOld = () => setShowOldPassword(!showOldPassword);
  const handleClickNew = () => setShowNewPassword(!showNewPassword);
  const [vidOverlay, setVidOverlay] = useState<boolean>(true);
  const [description, setDescription] = useState(tutorData.tutor.description);
  const [hourlyRate, setHourlyRate] = useState(tutorData.tutor.description);
  // const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);

  const {
    isOpen: isUpdateHourlyRateModalOpen,
    onOpen: openUpdateHourlyRateModal,
    onClose: closeUpdateHourlyRateModal
  } = useDisclosure();

  const {
    isOpen: isUpdateAvailabilityModalOpen,
    onOpen: openUpdateAvailabilityModal,
    onClose: closeUpdateAvailabilityModal
  } = useDisclosure();
  const {
    isOpen: isUpdateDescriptionModalOpen,
    onOpen: openUpdateDescriptionModal,
    onClose: closeUpdateDescriptionModal
  } = useDisclosure();
  console.log(tutorData);

  const handleHourlyRateChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const rate = event.target.value;
    // onboardTutorStore.set.rate(parseInt(rate));
  };

  const tutorEarnings = useMemo(() => {
    const baseEarning = 0;
    if (!hourlyRate) return baseEarning.toFixed(2);
    const rateNumber = hourlyRate;
    const earnings = rateNumber * (1 - rate);

    return earnings.toFixed(2);
  }, [hourlyRate, rate]);

  const cost = useMemo(
    () => parseInt(tutorEarnings) * rate,
    [tutorEarnings, rate]
  );

  const handleUpdateTutor = async () => {
    const formData = {
      email: newEmail,
      ottp: otp,
      coursesAndLevels: [],
      schedule: {},
      tz: moment.tz.guess(),
      qualifications: [],
      rate: 0,
      cv: '',
      bankInfo: {},
      avatar: '',
      reviewCount: 0,
      rating: 0,
      description: '',
      country: '',
      identityDocument: '',
      introVideo: ''
    };
    const response = await ApiService.updateTutor(formData);
    const resp: any = await response.json();
    // closeUpdateEmailModal();
    if (response.status === 200) {
      toast({
        render: () => (
          <CustomToast title="Email Updated successfully" status="success" />
        ),
        position: 'top-right',
        isClosable: true
      });
    } else {
      toast({
        render: () => (
          <CustomToast title="Something went wrong.." status="error" />
        ),
        position: 'top-right',
        isClosable: true
      });
    }
  };

  return (
    <Box>
      {tutorData && (
        <>
          <Box
            p={4}
            alignItems="center"
            border="1px solid #EEEFF1"
            borderRadius="10px"
            mt={2}
            mb={4}
          >
            {' '}
            <Flex gap={3} py={2}>
              <Avatar
                boxSize="64px"
                color="white"
                name={`${tutorData.name?.first} ${tutorData.name?.last}`}
                bg="#4CAF50;"
              />
              <Stack spacing={'2px'}>
                <Text
                  fontSize="16px"
                  fontWeight={500}
                  color="text.200"
                  display={{ base: 'block', sm: 'none', md: 'block' }}
                >
                  {`${tutorData.name?.first} ${tutorData.name?.last}`}
                </Text>{' '}
                <Text fontSize={14} color="text.400">
                  {tutorData.email}
                </Text>
              </Stack>
            </Flex>
            <Divider />
            <Flex alignItems="center" gap={2} py={4}>
              <Text
                color="#6E7682"
                fontSize="12px"
                fontWeight="400"
                wordBreak={'break-word'}
                textTransform="uppercase"
              >
                Hourly Rate
              </Text>
              <Text
                color="neutral.800"
                fontSize="base"
                fontWeight="medium"
                fontFamily="Inter"
                lineHeight="21px"
                letterSpacing="tight"
              >
                {`$${tutorData.tutor.rate}.00/hr`}
              </Text>
              <Spacer />
              <Box
                w="30px"
                h="30px"
                borderRadius="full"
                borderWidth="1px"
                borderColor="gray.200"
                position="relative"
                cursor={'pointer'}
                onClick={openUpdateHourlyRateModal}
              >
                <Center w="100%" h="100%" position="absolute">
                  <MdEdit />
                </Center>
              </Box>
            </Flex>
          </Box>
          <Box
            p={4}
            bg="white"
            borderRadius={10}
            borderWidth="1px"
            borderColor="#EEEFF1"
            justifyContent="center"
            alignItems="center"
            my={4}
          >
            {' '}
            <Center position="relative" borderRadius={10}>
              <AspectRatio
                h={{ base: '170px', md: '170px' }}
                w={{ base: 'full', md: 'full' }}
                ratio={1}
                objectFit={'cover'}
              >
                <iframe
                  title="naruto"
                  // src={'https://samplelib.com/lib/preview/mp4/sample-5s.mp4'}
                  src={tutorData.tutor.introVideo}
                  allowFullScreen
                  style={{ borderRadius: 10 }}
                />
              </AspectRatio>
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
                  <Text display={'inline'}> update intro video</Text>
                </VStack>
              </Center>
            </Center>
          </Box>

          <Box
            p={4}
            bg="white"
            borderRadius={10}
            borderWidth="1px"
            borderColor="#EEEFF1"
            justifyContent="center"
            alignItems="center"
            my={4}
          >
            <Flex alignItems="center">
              <Text
                color="#6E7682"
                fontSize="12px"
                fontWeight="400"
                wordBreak={'break-word'}
                textTransform="uppercase"
              >
                About Me
              </Text>
              <Spacer />
              <Box
                w="30px"
                h="30px"
                borderRadius="full"
                borderWidth="1px"
                borderColor="gray.200"
                position="relative"
                cursor={'pointer'}
                onClick={openUpdateDescriptionModal}
              >
                <Center w="100%" h="100%" position="absolute">
                  <MdEdit />
                </Center>
              </Box>
            </Flex>
            <Text
              color="#212224"
              fontSize="14px"
              fontWeight="400"
              // lineHeight="24"
              my={2}
              wordBreak={'break-word'}
            >
              {tutorData.tutor?.description}
            </Text>
          </Box>
          <Box
            p={4}
            bg="white"
            borderRadius={10}
            borderWidth="1px"
            borderColor="#EEEFF1"
            justifyContent="center"
            alignItems="center"
            my={4}
          >
            <Flex>
              <Text
                color="#6E7682"
                fontSize="12px"
                fontWeight="400"
                wordBreak={'break-word'}
                textTransform="uppercase"
              >
                Subject Offered
              </Text>
              <Spacer />
              <MdEdit />
            </Flex>
            <TableContainer my={4}>
              <Box border={'1px solid #EEEFF2'} borderRadius={8} py={3}>
                <Table variant="simple">
                  {/* <TableCaption>Imperial to metric conversion factors</TableCaption> */}
                  <Thead>
                    <Tr>
                      <Th></Th>
                      <Th>Level</Th>
                      <Th>Price</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {tutorData.tutor.coursesAndLevels.map((cl) => (
                      <Tr>
                        <Td bgColor={'#FAFAFA'}>{cl.course.label}</Td>
                        <Td>{cl.level?.label}</Td>
                        <Td>${tutorData.tutor.rate}/hr</Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Box>
            </TableContainer>
          </Box>
          <Box
            p={4}
            bg="white"
            borderRadius={10}
            borderWidth="1px"
            borderColor="#EEEFF1"
            justifyContent="center"
            alignItems="center"
            my={4}
          >
            <Flex alignItems="center">
              <Text
                color="#6E7682"
                fontSize="12px"
                fontWeight="400"
                wordBreak={'break-word'}
                textTransform="uppercase"
              >
                Qualifications
              </Text>
              <Spacer />
              <Box
                w="30px"
                h="30px"
                borderRadius="full"
                borderWidth="1px"
                borderColor="gray.200"
                position="relative"
                cursor={'pointer'}
                onClick={openUpdateAvailabilityModal}
              >
                <Center w="100%" h="100%" position="absolute">
                  <MdEdit />
                </Center>
              </Box>
            </Flex>
            {tutorData.tutor.qualifications.map((q) => (
              <>
                <Flex px={3} gap={0} direction={'row'} my={2}>
                  <Image src={FileAvi2} alt="qualification" mb={4} />
                  <Stack direction={'column'} px={4} spacing={1}>
                    <Text fontSize={'16px'} fontWeight={'500'} mb={0}>
                      {q.institution}
                    </Text>
                    <Text
                      fontWeight={400}
                      color={'#585F68'}
                      fontSize="14px"
                      mb={'2px'}
                    >
                      {q.degree}
                    </Text>

                    <Spacer />
                    <Text fontSize={12} fontWeight={400} color="#6E7682">
                      {new Date(q.startDate).getFullYear()} -{' '}
                      {new Date(q.endDate).getFullYear()}
                    </Text>
                  </Stack>
                </Flex>
                <Divider />
              </>
            ))}
          </Box>
          <Box
            p={4}
            bg="white"
            borderRadius={10}
            borderWidth="1px"
            borderColor="#EEEFF1"
            justifyContent="center"
            alignItems="center"
            my={4}
          >
            <Flex alignItems="center">
              <Text
                color="#6E7682"
                fontSize="12px"
                fontWeight="400"
                wordBreak={'break-word'}
                textTransform="uppercase"
              >
                Availability
              </Text>
              <Spacer />
              <Box
                w="30px"
                h="30px"
                borderRadius="full"
                borderWidth="1px"
                borderColor="gray.200"
                position="relative"
                cursor={'pointer'}
                onClick={openUpdateAvailabilityModal}
              >
                <Center w="100%" h="100%" position="absolute">
                  <MdEdit />
                </Center>
              </Box>
            </Flex>
            <AvailabilityTable data={tutorData.tutor} />
          </Box>
        </>
      )}

      <CustomModal
        isOpen={isUpdateAvailabilityModalOpen}
        modalTitle="Update Availability"
        isModalCloseButton
        style={{
          maxWidth: '400px',
          height: 'fit-content'
        }}
        // footerContent={
        //   <div style={{ display: 'flex', gap: '8px' }}>
        //     <Button>Update</Button>
        //   </div>
        // }
        onClose={closeUpdateAvailabilityModal}
      >
        <Box overflowY={'scroll'}>
          <AvailabilityEditForm />
        </Box>
      </CustomModal>
      <CustomModal
        isOpen={isUpdateDescriptionModalOpen}
        modalTitle="Update Description"
        isModalCloseButton
        style={{
          maxWidth: '400px',
          height: 'fit-content'
        }}
        footerContent={
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button isDisabled={description === tutorData.tutor.description}>
              Update
            </Button>
          </div>
        }
        onClose={closeUpdateDescriptionModal}
      >
        {' '}
        <FormControl p={3} alignItems="center">
          <FormLabel fontSize="14px" fontWeight="medium" htmlFor="description">
            Description
          </FormLabel>
          <Textarea
            id="description"
            placeholder="Enter description"
            defaultValue={description}
            // value={description}
            onChange={(e) => setDescription(e.target.value)}
            size="sm" // Adjust the size as needed
            borderRadius="8px"
            borderColor="gray.300"
            _hover={{ borderColor: 'gray.400' }}
            _focus={{ borderColor: 'blue.500', boxShadow: 'none' }}
            h="200px"
          />
        </FormControl>
      </CustomModal>
      <CustomModal
        isOpen={isUpdateHourlyRateModalOpen}
        modalTitle="Update Hourly Rate"
        isModalCloseButton
        style={{
          maxWidth: '400px',
          height: 'fit-content'
        }}
        footerContent={
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button isDisabled={description === tutorData.tutor.description}>
              Update
            </Button>
          </div>
        }
        onClose={closeUpdateHourlyRateModal}
      >
        <Box p={4} alignContent="center" alignItems={'center'} w="full">
          {' '}
          <Stack spacing={4}>
            <FormControl>
              <FormLabel
                fontStyle="normal"
                fontWeight={500}
                fontSize={14}
                lineHeight="20px"
                letterSpacing="-0.001em"
                color="#5C5F64"
              >
                Hourly Rate
              </FormLabel>
              <InputGroup
                bg="#FFFFFF"
                _active={{
                  border: '1px solid #207df7'
                }}
                border="1px solid #E4E5E7"
                boxShadow="0px 2px 6px rgba(136, 139, 143, 0.1)"
                borderRadius="6px"
              >
                <InputLeftElement
                  pointerEvents="none"
                  color="black"
                  fontSize="14px"
                  children="$"
                />
                <Input
                  type="number"
                  value={hourlyRate}
                  marginLeft={'30px'}
                  onChange={(e) => setHourlyRate(parseInt(e.target.value))}
                  placeholder="0.00"
                  bg="transparent"
                  border="none"
                  boxShadow="none"
                  borderRadius="none"
                  _active={{
                    border: 'none'
                  }}
                  _placeholder={{
                    fontStyle: 'normal',
                    fontWeight: 400,
                    fontSize: 14,
                    lineHeight: '20px',
                    letterSpacing: '-0.003em',
                    color: '#9A9DA2'
                  }}
                />{' '}
                <InputRightElement
                  pointerEvents="none"
                  color="gray.300"
                  fontSize="1.2em"
                >
                  <Box
                    fontSize={'sm'}
                    color={'black'}
                    padding="2px 6px"
                    background="#F1F2F3"
                    borderRadius="5px"
                  >
                    /hr
                  </Box>
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <HStack
              display={'flex'}
              fontSize="sm"
              alignItems="baseline"
              fontWeight="500"
            >
              <Text color={'#6E7682'}>Shepherd charges a</Text>
              <Text color="#207DF7">
                {rate}% service fee (-${cost.toFixed(2)}/hr)
              </Text>
            </HStack>
            <FormControl>
              <FormLabel
                fontStyle="normal"
                fontWeight={500}
                fontSize={14}
                lineHeight="20px"
                letterSpacing="-0.001em"
                color="#5C5F64"
              >
                You'll get
              </FormLabel>
              <InputGroup
                bg="#F1F2F3"
                _active={{
                  border: '1px solid #207df7'
                }}
                border="1px solid #E4E5E7"
                boxShadow="0px 2px 6px rgba(136, 139, 143, 0.1)"
                borderRadius="6px"
              >
                <InputLeftElement
                  pointerEvents="none"
                  color="black"
                  fontSize="14px"
                  children="$"
                />
                <Input
                  type="text"
                  value={tutorEarnings}
                  isDisabled
                  bg="#F5F6F7"
                  marginLeft={'30px'}
                  border="1px solid #E4E5E7"
                  borderRadius="6px"
                  _placeholder={{
                    fontStyle: 'normal',
                    fontWeight: 400,
                    fontSize: 14,
                    lineHeight: '20px',
                    letterSpacing: '-0.003em',
                    color: '#9A9DA2'
                  }}
                />
                <InputRightElement
                  pointerEvents="none"
                  color="gray.300"
                  fontSize="1.2em"
                >
                  <Box
                    fontSize={'sm'}
                    color={'black'}
                    padding="2px 6px"
                    background="#F1F2F3"
                    borderRadius="5px"
                  >
                    /hr
                  </Box>
                </InputRightElement>
              </InputGroup>
            </FormControl>
          </Stack>
        </Box>
      </CustomModal>
    </Box>
  );
}

export default MyProfile;
