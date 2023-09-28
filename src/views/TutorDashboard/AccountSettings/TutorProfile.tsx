import CustomModal from '../../../components/CustomComponents/CustomModal';
import CustomToast from '../../../components/CustomComponents/CustomToast';
import { firebaseAuth, updatePassword } from '../../../firebase';
import ApiService from '../../../services/ApiService';
import userStore from '../../../state/userStore';
import AvailabilityEditForm from './AvailabilityEditForm.tsx';
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

  //   const {
  //     isOpen: isUpdateEmailModalOpen,
  //     onOpen: openUpdateEmailModal,
  //     onClose: closeUpdateEmailModal
  //   } = useDisclosure();

  const {
    isOpen: isUpdateAvailabilityModalOpen,
    onOpen: openUpdateAvailabilityModal,
    onClose: closeUpdateAvailabilityModal
  } = useDisclosure();

  //   const handleSaveEmail = async () => {
  //     const formData = { email: newEmail, ottp: otp };
  //     const response = await ApiService.updateProfile(formData);
  //     const resp: any = await response.json();
  //     closeUpdateEmailModal();
  //     if (response.status === 200) {
  //       toast({
  //         render: () => (
  //           <CustomToast title="Email Updated successfully" status="success" />
  //         ),
  //         position: 'top-right',
  //         isClosable: true
  //       });
  //     } else {
  //       toast({
  //         render: () => (
  //           <CustomToast title="Something went wrong.." status="error" />
  //         ),
  //         position: 'top-right',
  //         isClosable: true
  //       });
  //     }
  //   };

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
          <Button onClick={openUpdateAvailabilityModal}>Availability</Button>
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
    </Box>
  );
}

export default MyProfile;
