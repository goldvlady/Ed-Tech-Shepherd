import CustomToast from '../../../../components/CustomComponents/CustomToast';
import { firebaseAuth, updatePassword } from '../../../../firebase';
import ApiService from '../../../../services/ApiService';
import userStore from '../../../../state/userStore';
import {
  Avatar,
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
  Center
} from '@chakra-ui/react';
import firebase from 'firebase/app';
// import { updatePassword } from 'firebase/auth';
import React, { useState, useEffect } from 'react';
import { IoIosAlert } from 'react-icons/io';
import { RiArrowRightSLine } from 'react-icons/ri';

function MyProfile(props) {
  const { id, username, email } = props;
  const { user } = userStore();

  const toast = useToast();
  const [newEmail, setNewEmail] = useState<string>(email);

  const [isOpenTandC, setIsOpenTandC] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [oldPassword, setOldPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const handleClickOld = () => setShowOldPassword(!showOldPassword);
  const handleClickNew = () => setShowNewPassword(!showNewPassword);

  // const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);

  const {
    isOpen: isUpdateEmailModalOpen,
    onOpen: openUpdateEmailModal,
    onClose: closeUpdateEmailModal
  } = useDisclosure();

  const {
    isOpen: isUpdatePasswordModalOpen,
    onOpen: openUpdatePasswordModal,
    onClose: closeUpdatePasswordModal
  } = useDisclosure();

  useEffect(() => {
    // Simulate sending OTP to the provided email address when the component mounts.
    // In a real application, this would be done through a backend API.
    // For this example, we'll just set isEmailSent to true.
    setIsEmailSent(true);
    if (isUpdatePasswordModalOpen || isUpdateEmailModalOpen) {
      const response = ApiService.sendOtp();
    }

    // Simulate receiving the OTP after a delay (e.g., 2 seconds).
    // In a real application, you would receive the OTP through email or SMS.
    // const timeoutId = setTimeout(() => {
    //   const receivedOtp = '123456'; // Replace with the actual OTP from the server
    //   setOtp(receivedOtp);
    //   setIsOtpVerified(true); // Automatically verify OTP
    // }, 2000); // Simulated delay

    // return () => clearTimeout(timeoutId);
  }, [isUpdateEmailModalOpen, isUpdatePasswordModalOpen]);

  const handleChangeEmail = (e) => {
    setNewEmail(e.target.value);
  };
  const handleChangePassword = (e) => {
    setNewPassword(e.target.value);
  };

  const handleOpenTandCModal = () => {
    setIsOpenTandC(true);
  };

  const handleCloseTandCModal = () => {
    setIsOpenTandC(false);
  };
  const handleSaveEmail = async () => {
    const formData = { email: newEmail, ottp: otp };
    const response = await ApiService.updateProfile(formData);
    const resp: any = await response.json();
    closeUpdateEmailModal();
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
  const handleUpdatePassword = async () => {
    const formData = { password: newPassword, ottp: otp };
    const response = await ApiService.updateProfile(formData);
    const resp: any = await response.json();
    closeUpdatePasswordModal();
    if (response.status === 200) {
      toast({
        render: () => (
          <CustomToast title="Password Updated successfully" status="success" />
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

  // const handleUpdatePassword = async (e) => {
  //   e.preventDefault();
  //   const users = await firebaseAuth.currentUser;
  //   // const credentials = await firebaseAuth.EmailAuthProvider.credential(
  //   //   users.email,
  //   //   oldPassword
  //   // );
  //   if (users) {
  //     await updatePassword(users, newPassword)
  //       .then(() => {
  //         toast({
  //           render: () => (
  //             <CustomToast
  //               title="Password Updated successfully"
  //               status="success"
  //             />
  //           ),
  //           position: 'top-right',
  //           isClosable: true
  //         });
  //       })
  //       .catch((error) => {
  //         toast({
  //           render: () => (
  //             <CustomToast title="Something went wrong.." status="error" />
  //           ),
  //           position: 'top-right',
  //           isClosable: true
  //         });
  //       });
  //   }
  // };
  return (
    <Box>
      {id && username && email && (
        <>
          {' '}
          <Flex
            gap={3}
            p={4}
            alignItems="center"
            border="1px solid #EEEFF1"
            borderRadius="10px"
            mt={2}
            mb={4}
          >
            <Avatar
              boxSize="64px"
              color="white"
              name={username}
              bg="#4CAF50;"
            />
            <Stack spacing={'2px'}>
              <Text
                fontSize="16px"
                fontWeight={500}
                color="text.200"
                display={{ base: 'block', sm: 'none', md: 'block' }}
              >
                {username}
              </Text>{' '}
              <Text fontSize={14} color="text.400">
                {email}
              </Text>
            </Stack>
          </Flex>
          <Box
            p={4}
            alignItems="center"
            border="1px solid #EEEFF1"
            borderRadius="10px"
          >
            <Text fontSize={'12px'} color="text.400" mb={2}>
              ACCOUNT SECURITY
            </Text>

            <Divider />
            <Flex gap={5} direction="column" py={2}>
              <Flex width={'100%'} alignItems="center">
                <Stack spacing={'2px'}>
                  <Text
                    fontSize="14px"
                    fontWeight={500}
                    color="text.200"
                    display={{
                      base: 'block',
                      sm: 'none',
                      md: 'block'
                    }}
                  >
                    Email
                  </Text>{' '}
                  {email && (
                    <Editable
                      defaultValue={email}
                      onChange={(e: any) => setNewEmail(e)}
                    >
                      <EditablePreview fontSize={12} color="text.300" />
                      <EditableInput />
                    </Editable>
                  )}
                </Stack>
                <Spacer />{' '}
                <Button
                  variant="unstyled"
                  sx={{
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: '500',
                    px: 4,
                    border: '1px solid #E7E8E9',
                    color: '#5C5F64',
                    height: '29px',
                    _hover: {
                      color: '#207df7',
                      backgroundColor: '#F0F6FE'
                    }
                  }}
                  // isDisabled={!newEmail || email === newEmail}
                  // onClick={handleSaveEmail}
                  onClick={openUpdateEmailModal}
                >
                  Change
                </Button>
              </Flex>
              <Flex width={'100%'} alignItems="center">
                <Stack spacing={'2px'}>
                  <Text
                    fontSize="14px"
                    fontWeight={500}
                    color="text.200"
                    display={{
                      base: 'block',
                      sm: 'none',
                      md: 'block'
                    }}
                  >
                    Password
                  </Text>{' '}
                  {/* <Text fontSize={12} color="text.200">
                verify old password
              </Text> */}
                  {/* <InputGroup size="xs" fontSize={12}>
                <Input
                  pr="4.5rem"
                  type={showOldPassword ? 'text' : 'password'}
                  placeholder="Enter old password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                />
                <InputRightElement width="4.5rem">
                  <Button
                    variant="unstyled"
                    onClick={handleClickOld}
                    fontSize={10}
                    color="text.300"
                    mt={1}
                  >
                    {showOldPassword ? 'Hide' : 'Show'}
                  </Button>
                </InputRightElement>
              </InputGroup>
              <InputGroup size="xs" fontSize={12}>
                <Input
                  pr="4.5rem"
                  type={showNewPassword ? 'text' : 'password'}
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <InputRightElement width="4.5rem">
                  <Button
                    variant="unstyled"
                    onClick={handleClickNew}
                    fontSize={10}
                    color="text.300"
                    mt={1}
                  >
                    {showNewPassword ? 'Hide' : 'Show'}
                  </Button>
                </InputRightElement>
              </InputGroup> */}
                  <Editable
                    defaultValue={newPassword}
                    onChange={(e: any) => setNewPassword(e)}
                  >
                    <EditablePreview fontSize={12} color="text.300" />
                    <EditableInput />
                  </Editable>
                </Stack>
                <Spacer />
                <Button
                  variant="unstyled"
                  sx={{
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: '500',
                    px: 4,
                    border: '1px solid #E7E8E9',
                    color: '#5C5F64',
                    height: '29px',
                    _hover: {
                      color: '#207df7',
                      backgroundColor: '#F0F6FE'
                    }
                  }}
                  onClick={openUpdatePasswordModal}
                >
                  Change
                </Button>
              </Flex>
              <Flex width={'100%'} alignItems="center">
                <Stack spacing={'2px'}>
                  <Text
                    fontSize="14px"
                    fontWeight={500}
                    color="#F53535"
                    display={{
                      base: 'block',
                      sm: 'none',
                      md: 'block'
                    }}
                  >
                    Log out of all devices
                  </Text>{' '}
                  <Text fontSize={12} color="text.300">
                    Log out of all other active sessions on other devices
                    besides this one.
                  </Text>
                </Stack>
                <Spacer /> <RiArrowRightSLine size="24px" color="#969CA6" />
              </Flex>
            </Flex>
          </Box>
          <Box
            p={4}
            alignItems="center"
            border="1px solid #EEEFF1"
            borderRadius="10px"
            my={4}
          >
            <Text fontSize={'12px'} color="text.400" mb={2}>
              MANAGE ALERTS
            </Text>

            <Divider />
            <Flex gap={4} direction="column" py={2}>
              <Flex width={'100%'} alignItems="center">
                <Stack spacing={'2px'}>
                  <Text
                    fontSize="14px"
                    fontWeight={500}
                    color="text.200"
                    display={{
                      base: 'block',
                      sm: 'none',
                      md: 'block'
                    }}
                  >
                    Email Notifications
                  </Text>{' '}
                  <Text fontSize={12} color="text.300">
                    Receive email updates, including schedule alerts
                  </Text>
                </Stack>
                <Spacer /> <Switch colorScheme={'whatsapp'} size="lg" />
              </Flex>
              <Flex width={'100%'} alignItems="center">
                <Stack spacing={'2px'}>
                  <Text
                    fontSize="14px"
                    fontWeight={500}
                    color="text.200"
                    display={{
                      base: 'block',
                      sm: 'none',
                      md: 'block'
                    }}
                  >
                    Mobile Notifications
                  </Text>{' '}
                  <Text fontSize={12} color="text.300">
                    Receive email updates, including schedule alerts
                  </Text>
                </Stack>
                <Spacer />
                <Switch colorScheme={'whatsapp'} size="lg" />
              </Flex>
            </Flex>
          </Box>
          <Box
            p={4}
            alignItems="center"
            border="1px solid #EEEFF1"
            borderRadius="10px"
          >
            <Text fontSize={'12px'} color="text.400" mb={2}>
              SUPPORT
            </Text>

            <Divider />
            <Flex gap={4} direction="column" py={2}>
              <Flex width={'100%'} alignItems="center">
                <Stack spacing={'2px'}>
                  <Text
                    fontSize="14px"
                    fontWeight={500}
                    color="text.200"
                    display={{
                      base: 'block',
                      sm: 'none',
                      md: 'block'
                    }}
                  >
                    Terms and conditions
                  </Text>{' '}
                  <Text fontSize={12} color="text.300">
                    Read Sherperd’s terms & conditions
                  </Text>
                </Stack>
                <Spacer />{' '}
                <Box _hover={{ cursor: 'pointer' }}>
                  <RiArrowRightSLine
                    size="24px"
                    color="#969CA6"
                    onClick={handleOpenTandCModal}
                  />
                </Box>
                <Modal
                  isOpen={isOpenTandC}
                  onClose={handleCloseTandCModal}
                  size="xl"
                >
                  <ModalOverlay />
                  <ModalContent>
                    <ModalHeader>PDF Viewer</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                      <iframe
                        title="PDF Viewer"
                        src={
                          'https://unec.edu.az/application/uploads/2014/12/pdf-sample.pdf'
                        }
                        width="100%"
                        height="500px"
                      />
                    </ModalBody>
                    <ModalFooter>
                      <Button
                        colorScheme="blue"
                        onClick={handleCloseTandCModal}
                      >
                        Close
                      </Button>
                    </ModalFooter>
                  </ModalContent>
                </Modal>
              </Flex>
              <Flex width={'100%'} alignItems="center">
                <Stack spacing={'2px'}>
                  <Text
                    fontSize="14px"
                    fontWeight={500}
                    color="text.200"
                    display={{
                      base: 'block',
                      sm: 'none',
                      md: 'block'
                    }}
                  >
                    Contact support
                  </Text>{' '}
                  <Text fontSize={12} color="text.300">
                    Need help? Kindly reach out to our support team via mail
                  </Text>
                </Stack>
                <Spacer />
                <Text fontSize={12} color="text.300">
                  support@shepherd.mail
                </Text>
              </Flex>
              <Flex width={'100%'} alignItems="center">
                <Stack spacing={'2px'}>
                  <Text
                    fontSize="14px"
                    fontWeight={500}
                    color="#F53535"
                    display={{
                      base: 'block',
                      sm: 'none',
                      md: 'block'
                    }}
                  >
                    Delete my account
                  </Text>{' '}
                  <Text fontSize={12} color="text.300">
                    Permanently delete your Sherpherd account
                  </Text>
                </Stack>
                <Spacer /> <RiArrowRightSLine size="24px" color="#969CA6" />
              </Flex>
            </Flex>
          </Box>
        </>
      )}

      <Modal
        isOpen={isUpdateEmailModalOpen}
        onClose={closeUpdateEmailModal}
        size="md"
      >
        <ModalOverlay />
        <ModalContent>
          <Box p={4} borderWidth="1px" borderRadius="lg">
            <VStack spacing={4}>
              <Text fontSize="xl" fontWeight="bold">
                Update Email Address
              </Text>
              <Text>An OTP has been sent to your existing email address.</Text>

              {isEmailSent ? (
                <>
                  <FormControl>
                    <FormLabel> New Email</FormLabel>
                    <Input
                      type="email"
                      value={newEmail}
                      onChange={handleChangeEmail}
                      placeholder="Enter your new email"
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>OTP (One-Time Password)</FormLabel>
                    <Input
                      type="text"
                      value={otp}
                      // isReadOnly={isOtpVerified}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="Enter OTP"
                    />
                  </FormControl>
                  {/* <Button
                    colorScheme="teal"
                    // onClick={handleVerifyOtp}
                    isDisabled={isOtpVerified}
                  >
                    Submit
                  </Button>
                  {isOtpVerified && (
                    <Text color="green.500">Email updated successfully!</Text>
                  )} */}
                </>
              ) : (
                <Text>Waiting for OTP...</Text>
              )}
            </VStack>
          </Box>
          <ModalFooter>
            <Flex gap={2}>
              <Button onClick={closeUpdateEmailModal} variant="outline">
                Cancel
              </Button>
              <Button onClick={handleSaveEmail} variant="outline">
                Update
              </Button>
            </Flex>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal
        isOpen={isUpdatePasswordModalOpen}
        onClose={closeUpdatePasswordModal}
        size="md"
      >
        <ModalOverlay />
        <ModalContent>
          <Box p={4} borderWidth="1px" borderRadius="lg">
            <VStack spacing={4}>
              <Text fontSize="xl" fontWeight="bold">
                Update Password
              </Text>
              <Text>An OTP has been sent to your Email address.</Text>

              {isEmailSent ? (
                <>
                  <FormControl>
                    <FormLabel> New Password</FormLabel>
                    <Input
                      type="Password"
                      value={newPassword}
                      onChange={handleChangePassword}
                      placeholder="Enter your new Password"
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>OTP (One-Time Password)</FormLabel>
                    <Input
                      type="text"
                      value={otp}
                      // isReadOnly={isOtpVerified}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="Enter OTP"
                    />
                  </FormControl>
                  {/* <Button
                    colorScheme="teal"
                    // onClick={handleVerifyOtp}
                    isDisabled={isOtpVerified}
                  >
                    Submit
                  </Button>
                  {isOtpVerified && (
                    <Text color="green.500">Email updated successfully!</Text>
                  )} */}
                </>
              ) : (
                <Text>Waiting for OTP...</Text>
              )}
            </VStack>
          </Box>
          <ModalFooter>
            <Flex gap={2}>
              <Button onClick={closeUpdatePasswordModal} variant="outline">
                Cancel
              </Button>
              <Button onClick={handleUpdatePassword} variant="outline">
                Update
              </Button>
            </Flex>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default MyProfile;
