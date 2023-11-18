// CircularProgress for loader.
import CustomModal from '../../components/CustomComponents/CustomModal';
import { useCustomToast } from '../../components/CustomComponents/CustomToast/useCustomToast';
import Header from '../../components/Header';
import ApiService from '../../services/ApiService';
import userStore from '../../state/userStore';
// For making API calls.
import {
  Box,
  CircularProgress,
  Text,
  Button,
  useDisclosure,
  FormControl,
  FormLabel,
  Input,
  Link
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';

const Root = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 100vw;
  width: 100%;
  height: calc(100vh - 70px);
`;

const VerificationSuccess = () => {
  const navigate = useNavigate();
  const toast = useCustomToast();
  const { setUserData, user } = userStore();
  const location = useLocation();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const [email, setEmail] = useState('');
  const navigateToDashboard = () =>
    navigate(
      user?.signedUpAsTutor ? '/dashboard/tutordashboard/' : '/dashboard'
    );

  const {
    isOpen: isEmailModalOpen,
    onOpen: openEmailModal,
    onClose: closeEmailModal
  } = useDisclosure();

  async function verifyToken(token: string) {
    try {
      setLoading(true);
      const response = await ApiService.verifyToken(token);
      if (response.status === 200) {
        setUserData({ isVerified: true });
        setVerified(true);
        if (user) {
          toast({
            title: 'Email verification was successful',
            status: 'success',
            position: 'top-right'
          });
          if (user.isVerified) {
            navigateToDashboard();
          }
        }
      } else {
        const data = await response.json();
        setError(data.message);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
    } finally {
      setLoading(false);
    }
  }

  const handleResendLink = async (email) => {
    try {
      const response = await ApiService.resendUserEmail(email);
      if (response.status === 200) {
        toast({
          title: 'Email has been resent',
          position: 'top-right',
          status: 'success',
          isClosable: true
        });
        closeEmailModal();
      } else {
        toast({
          title: 'Something went wrong',
          position: 'top-right',
          status: 'error',
          isClosable: true
        });
      }
    } catch (e) {
      toast({
        title: 'Something went wrong',
        position: 'top-right',
        status: 'error',
        isClosable: true
      });
    }
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get('token');
    if (token) {
      verifyToken(token);
    }
    if (!token && user?.isVerified) {
      navigateToDashboard();
    }
  }, [location.search]);

  return (
    <>
      <Header />
      <Root>
        {loading ? (
          <CircularProgress isIndeterminate />
        ) : (
          <Box
            display={'flex'}
            maxWidth={'55%'}
            flexDirection={'column'}
            justifyContent={'center'}
            alignItems={'center'}
            width="100%"
            margin="150px"
            paddingY="100px"
            paddingX="50px"
            border="2px solid #EBECF0"
            borderRadius="12px"
          >
            <Box width="96px" height="96px" margin="30px auto">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                width="97"
                height="96"
                fill="none"
                viewBox="0 0 97 96"
              >
                <path fill="url(#pattern0)" d="M0.5 0H96.5V96H0.5z"></path>
                <defs>
                  <pattern
                    id="pattern0"
                    width="1"
                    height="1"
                    patternContentUnits="objectBoundingBox"
                  >
                    <use
                      transform="scale(.00195)"
                      xlinkHref="#image0_978_13894"
                    ></use>
                  </pattern>
                  <image
                    id="image0_978_13894"
                    width="512"
                    height="512"
                    xlinkHref="data:image/png;base64,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"
                  ></image>
                </defs>
              </svg>
            </Box>
            <Text fontSize="2xl" fontWeight="600" textAlign="center">
              {verified
                ? 'Your account has been Verified'
                : `Your account verification failed`}
            </Text>
            <Text
              fontSize="md"
              fontWeight={'400'}
              width={'65%'}
              color="#585F68"
              textAlign="center"
              mt={1}
              lineHeight="1.5"
            >
              {verified
                ? 'You can now finish setting up your profile and use the full functionality of Shepherd'
                : 'Invalid or expired token'}
            </Text>

            {verified ? (
              <Button
                onClick={() =>
                  navigate(
                    !user?.type?.includes('tutor') && user?.signedUpAsTutor
                      ? '/complete_profile'
                      : '/dashboard'
                  )
                }
                display="flex"
                flexDirection="row"
                justifyContent="center"
                alignItems="center"
                padding="14px 178px"
                marginTop="10px"
                width="343px"
                height="48px"
                background="#207DF7"
                borderRadius="8px"
              >
                {user?.type?.includes('tutor')
                  ? 'Complete Profile'
                  : 'Go To Your Dashboard'}
              </Button>
            ) : (
              <Link
                // target="_blank"
                // rel="noopener noreferrer"
                // href="mailto:help@shepherd.study"
                display="flex"
                flexDirection="row"
                color="white"
                justifyContent="center"
                alignItems="center"
                padding="14px 100px"
                marginTop="30px"
                height="48px"
                background="#207DF7"
                borderRadius="8px"
                onClick={openEmailModal}
              >
                Resend Verification Link
              </Link>
            )}
          </Box>
        )}
      </Root>
      <CustomModal
        isOpen={isEmailModalOpen}
        modalTitle="Enter Email"
        isModalCloseButton
        style={{
          maxWidth: '400px',
          height: 'fit-content'
        }}
        footerContent={
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button isDisabled={!email} onClick={() => handleResendLink(email)}>
              Send
            </Button>
          </div>
        }
        onClose={closeEmailModal}
      >
        {' '}
        <FormControl p={3} alignItems="center">
          <FormLabel fontSize="14px" fontWeight="medium" htmlFor="description">
            Email
          </FormLabel>
          <Input
            fontSize="0.875rem"
            fontFamily="Inter"
            fontWeight="400"
            type="text"
            name="topic"
            color=" #212224"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            _placeholder={{ fontSize: '0.875rem', color: '#9A9DA2' }}
          />
        </FormControl>
      </CustomModal>
    </>
  );
};
export default VerificationSuccess;
