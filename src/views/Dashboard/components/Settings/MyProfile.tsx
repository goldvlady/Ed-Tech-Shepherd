import CustomToast from '../../../../components/CustomComponents/CustomToast';
import ApiService from '../../../../services/ApiService';
import {
  Avatar,
  Editable,
  EditableInput,
  EditableTextarea,
  EditablePreview,
  useEditableControls,
  Switch,
  Spacer,
  Divider,
  Button,
  Box,
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Text,
  Stack,
  useToast
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { RiArrowRightSLine } from 'react-icons/ri';

function MyProfile(props) {
  const { id, username, email } = props;
  // const {
  //   isEditing,
  //   getSubmitButtonProps,
  //   getCancelButtonProps,
  //   getEditButtonProps
  // } = useEditableControls();
  const toast = useToast();
  const [newEmail, setNewEmail] = useState(email);
  const [isOpenTandC, setIsOpenTandC] = useState(false);

  const handleOpenTandCModal = () => {
    setIsOpenTandC(true);
  };

  const handleCloseTandCModal = () => {
    setIsOpenTandC(false);
  };
  const handleSaveEmail = async () => {
    const formData = { userId: id, email: newEmail };
    const response = await ApiService.updateProfile(formData);
    const resp: any = await response.json();
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

    console.log('Edited Value:', response.status);
  };
  return (
    <Box>
      <Flex
        gap={3}
        p={4}
        alignItems="center"
        border="1px solid #EEEFF1"
        borderRadius="10px"
        mt={2}
        mb={4}
      >
        <Avatar boxSize="64px" color="white" name={username} bg="#4CAF50;" />
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
              <Editable
                defaultValue={email}
                onChange={(e: any) => setNewEmail(e)}
              >
                <EditablePreview fontSize={12} color="text.300" />
                <EditableInput />
              </Editable>
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
                  backgroundColor: '#F0F6FE' // Custom background color on hover
                }
              }}
              isDisabled={email === newEmail} // Disable the button if the input value is not changed
              onClick={handleSaveEmail}
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
              <Text fontSize={12} color="text.200">
                xxxxxxxxxx
              </Text>
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
                height: '29px'
              }}
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
                Log out of all other active sessions on other devices besides
                this one.
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
                  <Button colorScheme="blue" onClick={handleCloseTandCModal}>
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
    </Box>
  );
}

export default MyProfile;
