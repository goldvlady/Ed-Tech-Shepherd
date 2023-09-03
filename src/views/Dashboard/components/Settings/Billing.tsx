import CustomToast from '../../../../components/CustomComponents/CustomToast';
import PaymentDialog, {
  PaymentDialogRef
} from '../../../../components/PaymentDialog';
import ApiService from '../../../../services/ApiService';
import userStore from '../../../../state/userStore';
import theme from '../../../../theme';
import { PaymentMethod } from '../../../../types';
import {
  Box,
  Button,
  Alert,
  AlertDescription,
  AlertIcon,
  Image,
  Radio,
  RadioGroup,
  Text,
  Spacer,
  Stack,
  Avatar,
  Center,
  Flex,
  Divider,
  VStack,
  useToast,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalFooter,
  ModalHeader
} from '@chakra-ui/react';
import { loadStripe } from '@stripe/stripe-js';
import React, { useState, useRef, useEffect } from 'react';
import { IoIosAlert } from 'react-icons/io';
import { MdInfo } from 'react-icons/md';
import { RiArrowRightSLine } from 'react-icons/ri';
import styled from 'styled-components';

function Billing(props) {
  const { username, email } = props;
  const { user, fetchUser } = userStore();
  const currentPath = window.location.pathname;
  const toast = useToast();

  const isTutor = currentPath.includes('/dashboard/tutordashboard/');

  const CardBrand = styled.img`
    height: 30px;
    width: 30px;
  `;

  const CardMeta = styled(Box)`
    flex-grow: 1;
    p {
      margin: 0;
    }
  `;

  const CardRoot = styled(Box)`
    border: 1px solid ${theme.colors.gray[300]};
    border-radius: 10px;
    padding-inline: 16px;
    padding-block: 10px;
    width: 100%;
    display: flex;
    align-items: center;
    gap: 16px;
    cursor: pointer;

    &:hover {
      border-color: ${theme.colors.gray[400]};
    }
  `;

  const getBrandLogo = (brand: string) => {
    if (brand === 'mastercard') {
      return <CardBrand src="/images/mastercard.svg" />;
    }
    if (brand === 'amex') {
      return <CardBrand src="/images/amex.svg" />;
    }
    if (brand === 'discover') {
      return <CardBrand src="/images/discover.svg" />;
    }
    if (brand === 'diners') {
      return <CardBrand src="/images/diners.svg" />;
    }
    if (brand === 'jcb') {
      return <CardBrand src="/images/jcb.svg" />;
    }
    if (brand === 'unionpay') {
      return <CardBrand src="/images/unionpay.svg" />;
    }
    if (brand === 'visa') {
      return <CardBrand src="/images/visa.svg" />;
    }

    return <CardBrand src="/images/generic-card-brand.svg" />;
  };

  const [currentPaymentMethod, setCurrentPaymentMethod] = useState<any>(null);
  const [settingUpPaymentMethod, setSettingUpPaymentMethod] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');

  const paymentDialogRef = useRef<PaymentDialogRef>(null);

  const handleRemovePayMethod = async (id: string) => {
    const resp = await ApiService.deletePaymentMethod(id);
    closeDeleteConfirmModal();
    if (resp.status === 200) {
      toast({
        render: () => (
          <CustomToast
            title="Payment Method Removed Successfully"
            status="success"
          />
        ),
        position: 'top-right',
        isClosable: true
      });
      fetchUser();
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
  const setupPaymentMethod = async () => {
    try {
      setSettingUpPaymentMethod(true);
      const paymentIntent = await ApiService.createStripeSetupPaymentIntent();

      const { data } = await paymentIntent.json();
      console.log(data, 'intent');

      paymentDialogRef.current?.startPayment(
        data.clientSecret,
        `${window.location.href}`
      );

      setSettingUpPaymentMethod(false);
    } catch (error) {
      console.log(error);
    }
  };
  const url: URL = new URL(window.location.href);
  const params: URLSearchParams = url.searchParams;
  const clientSecret = params.get('setup_intent_client_secret');
  const stripePromise = loadStripe(
    process.env.REACT_APP_STRIPE_PUBLIC_KEY as string
  );
  useEffect(() => {
    if (clientSecret) {
      (async () => {
        setSettingUpPaymentMethod(true);
        toast({
          title: 'Your Payment Method has been saved',
          status: 'success',
          position: 'top',
          isClosable: true
        });
        const stripe = await stripePromise;
        const setupIntent = await stripe?.retrieveSetupIntent(clientSecret);
        await ApiService.addPaymentMethod(
          setupIntent?.setupIntent?.payment_method as string
        );
        await fetchUser();
        switch (setupIntent?.setupIntent?.status) {
          case 'succeeded':
            toast({
              title: 'Your payment method has been saved.',
              status: 'success',
              position: 'top',
              isClosable: true
            });
            break;
          case 'processing':
            toast({
              title:
                "Processing payment details. We'll update you when processing is complete.",
              status: 'loading',
              position: 'top',
              isClosable: true
            });
            break;
          case 'requires_payment_method':
            toast({
              title:
                'Failed to process payment details. Please try another payment method.',
              status: 'error',
              position: 'top',
              isClosable: true
            });
            break;
          default:
            toast({
              title: 'Something went wrong.',
              status: 'error',
              position: 'top',
              isClosable: true
            });
            break;
        }
        setSettingUpPaymentMethod(false);
      })();
    }
    /* eslint-disable */
  }, [clientSecret]);

  const {
    isOpen: isDeleteConfirmModalOpen,
    onOpen: openDeleteConfirmModal,
    onClose: closeDeleteConfirmModal
  } = useDisclosure();
  return (
    <>
      {' '}
      <Box>
        <PaymentDialog
          ref={paymentDialogRef}
          prefix={
            <Alert status="info" mb="22px">
              <AlertIcon>
                <MdInfo color={theme.colors.primary[500]} />
              </AlertIcon>
              <AlertDescription>
                Payment will not be deducted until after your first lesson, You
                may decide to cancel after your initial lesson.
              </AlertDescription>
            </Alert>
          }
        />
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
          px={4}
          alignItems="center"
          border="1px solid #EEEFF1"
          borderRadius="10px"
          my={4}
        >
          <Flex alignItems="center" my={2}>
            <Text
              fontSize={'12px'}
              color="text.400"
              textTransform={'uppercase'}
            >
              {isTutor ? 'Payment' : 'Manage Billing Methods'}
            </Text>
            <Spacer />
            {!isTutor && (
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
                onClick={setupPaymentMethod}
              >
                Add new
              </Button>
            )}
          </Flex>

          <Divider />
          <Flex gap={5} direction="column" py={2} mb={8}>
            {!isTutor ? (
              <>
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
                      Primary
                    </Text>
                    <Text fontSize={12} color="text.300">
                      Your primary billing method is used for all recurring
                      payments
                    </Text>
                  </Stack>
                </Flex>
                <Divider />
                <RadioGroup
                  onChange={(value) => setCurrentPaymentMethod(value)}
                >
                  {user?.paymentMethods.map((pm) => (
                    <Flex width="100%" alignItems="center" my={3}>
                      <Flex gap={2} alignItems="center" flex="1">
                        {getBrandLogo(pm.brand)}
                        <Text fontSize={14} color="text.300" fontWeight={500}>
                          Ending in •••• {pm.last4}
                        </Text>
                      </Flex>

                      <Spacer />
                      <Flex gap={2}>
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
                          onClick={() => {
                            setSelectedPaymentMethod(pm._id);
                            openDeleteConfirmModal();
                          }}
                        >
                          Remove
                        </Button>
                        {/* <Radio value={pm._id} key={pm._id} /> */}
                      </Flex>
                    </Flex>
                  ))}
                </RadioGroup>

                <Flex width={'100%'} alignItems="center">
                  <Stack spacing={'2px'}>
                    <Text fontSize={12} color="text.300">
                      You need a primary billing method when you have an active
                      contract due. To remove this, set a new primary billing
                      method first
                    </Text>
                  </Stack>
                </Flex>
              </>
            ) : (
              <>
                {' '}
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
                      Account name
                    </Text>{' '}
                    <Text fontSize={12} color="text.300">
                      {user?.tutor?.bankInfo?.accountName}
                    </Text>
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
                      color="text.200"
                      display={{
                        base: 'block',
                        sm: 'none',
                        md: 'block'
                      }}
                    >
                      Account number
                    </Text>{' '}
                    <Text fontSize={12} color="text.300">
                      {user?.tutor?.bankInfo?.accountNumber}
                    </Text>
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
                      color="text.200"
                      display={{
                        base: 'block',
                        sm: 'none',
                        md: 'block'
                      }}
                    >
                      Bank name
                    </Text>{' '}
                    <Text fontSize={12} color="text.300">
                      {user?.tutor?.bankInfo?.bankName}
                    </Text>
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
                      height: '29px'
                    }}
                  >
                    Change
                  </Button>
                </Flex>
              </>
            )}
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
              <Spacer /> <RiArrowRightSLine size="24px" color="#969CA6" />
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
                  Need help? Please reach out to our support team.
                </Text>
              </Stack>
              <Spacer />
              <Text fontSize={12} color="text.300">
                help@shepherd.learn{' '}
              </Text>
            </Flex>
          </Flex>
        </Box>
      </Box>
      {/* CONFIRM DELETE PAY METHOD */}
      <Modal
        isOpen={isDeleteConfirmModalOpen}
        onClose={closeDeleteConfirmModal}
        size="md"
      >
        <ModalOverlay />
        <ModalContent>
          {/* <ModalHeader
            textAlign={'center'}
            fontSize={14}
          >{`dropped a feedback for you`}</ModalHeader> 
          <Divider />*/}
          <Box py={3} textAlign="center">
            <Center>
              <VStack spacing={3}>
                <IoIosAlert size={'24px'} color="#F53535" />
                <Text fontSize={16} fontWeight={500}>
                  Delete Payment Method?
                </Text>
                <Text fontSize={14} color="#6E7682" my={2}>
                  This will permanently delete this payment method
                </Text>
              </VStack>
            </Center>
          </Box>
          <ModalFooter>
            <Flex gap={2}>
              <Button onClick={closeDeleteConfirmModal} variant="outline">
                Cancel
              </Button>
              <Button
                onClick={() => handleRemovePayMethod(selectedPaymentMethod)}
                variant="outline"
              >
                Delete
              </Button>
            </Flex>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default Billing;
