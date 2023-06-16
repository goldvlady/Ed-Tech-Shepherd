import {
  Alert,
  AlertDescription,
  AlertIcon,
  Avatar,
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  Divider,
  Flex,
  FormLabel,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  SimpleGrid,
  Spinner,
  Text,
  Textarea,
  VStack,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { capitalize, isEmpty } from 'lodash';
import moment from 'moment';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { BsQuestionCircleFill } from 'react-icons/bs';
import { FiArrowRight, FiChevronRight } from 'react-icons/fi';
import { MdInfo } from 'react-icons/md';
import { useNavigate, useParams } from 'react-router';
import styled from 'styled-components';

import { PaymentMethod } from '../../netlify/database/models/PaymentMethod';
import ChoosePaymentMethodDialog, {
  ChoosePaymentMethodDialogRef,
} from '../components/ChoosePaymentMethodDialog';
import LinedList from '../components/LinedList';
import PageTitle from '../components/PageTitle';
import Panel from '../components/Panel';
import PaymentDialog, { PaymentDialogRef } from '../components/PaymentDialog';
import StripeCheckoutForm from '../components/StripeCheckoutForm';
import TutorCard from '../components/TutorCard';
import { useTitle } from '../hooks';
import ApiService from '../services/ApiService';
import userStore from '../state/userStore';
import theme from '../theme';
import { Course, Offer as OfferType } from '../types';
import { ServiceFeePercentage, numberToDayOfWeekName } from '../util';

const LeftCol = styled(Box)`
  min-height: 100vh;
`;

const OfferValueText = styled(Text)`
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  letter-spacing: -0.001em;
  color: ${theme.colors.text[200]};
  margin-bottom: 0;
`;

const RightCol = styled(Box)``;

const Root = styled(Box)``;

export const scheduleOptions = [
  {
    label: 'Weekly',
    value: 'weekly',
  },
  {
    label: 'Twice a week',
    value: 'twice-a-week',
  },
  {
    label: 'Fortnightly',
    value: 'fortnightly',
  },
  {
    label: 'Monthly',
    value: 'monthly',
  },
];

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY as string);

const Offer = () => {
  const { user } = userStore();
  useTitle('Offer');

  const toast = useToast();

  const { offerId } = useParams() as { offerId: string };

  const { fetchUser } = userStore();
  const navigate = useNavigate();
  const paymentDialogRef = useRef<PaymentDialogRef>(null);
  const choosePaymentDialogRef = useRef<ChoosePaymentMethodDialogRef>(null);
  const [loadingOffer, setLoadingOffer] = useState(false);
  const [settingUpPaymentMethod, setSettingUpPaymentMethod] = useState(false);
  const [offer, setOffer] = useState<OfferType | null>(null);
  const [acceptingOffer, setAcceptingOffer] = useState(false);
  const [declineNote, setDeclineNote] = useState('');
  const [decliningOffer, setDecliningOffer] = useState(false);
  const [withdrawingOffer, setWithdrawingOffer] = useState(false);
  const [bookingOffer, setBookingOffer] = useState(false);

  const {
    isOpen: isOfferAcceptedModalOpen,
    onOpen: onOfferAcceptedModalOpen,
    onClose: onOfferAcceptedModalClose,
  } = useDisclosure();
  const {
    isOpen: isDeclineOfferModalOpen,
    onOpen: onDeclineOfferModalOpen,
    onClose: onDeclineOfferModalClose,
  } = useDisclosure();
  const {
    isOpen: isWithdrawOfferModalOpen,
    onOpen: onWithdrawOfferModalOpen,
    onClose: onWithdrawOfferModalClose,
  } = useDisclosure();

  const url: URL = new URL(window.location.href);
  const params: URLSearchParams = url.searchParams;
  const clientSecret = params.get('setup_intent_client_secret');

  const setupPaymentMethod = async () => {
    setSettingUpPaymentMethod(true);
    try {
      const paymentIntent = await ApiService.createStripeSetupPaymentIntent({
        offerId: offer?._id,
      });

      const data = await paymentIntent.json();

      paymentDialogRef.current?.startPayment(data.clientSecret, `${window.location.href}`);
    } catch (e) {}

    setSettingUpPaymentMethod(false);
  };

  const loadOffer = useCallback(async () => {
    setLoadingOffer(true);

    try {
      const resp = await ApiService.getOffer(offerId);
      setOffer(await resp.json());
    } catch (e) {}

    setLoadingOffer(false);
  }, []);

  const bookOffer = async () => {
    setBookingOffer(true);
    try {
      const chosenPaymentMethod =
        (await choosePaymentDialogRef.current?.choosePaymentMethod()) as PaymentMethod;
      const resp = await ApiService.bookOffer(offer?._id as string, chosenPaymentMethod?._id);
      // setOffer(await resp.json());
    } catch (e) {}
    setBookingOffer(false);
  };

  const acceptOffer = async () => {
    setAcceptingOffer(true);
    try {
      const resp = await ApiService.acceptOffer(offer?._id as string);
      setOffer(await resp.json());
      onOfferAcceptedModalOpen();
    } catch (e) {}
    setAcceptingOffer(false);
  };

  const declineOffer = async () => {
    setDecliningOffer(true);
    try {
      const resp = await ApiService.declineOffer(offer?._id as string, declineNote);
      setOffer(await resp.json());
      onDeclineOfferModalClose();
    } catch (e) {}
    setDecliningOffer(false);
  };

  const withdrawOffer = async () => {
    setWithdrawingOffer(true);
    try {
      const resp = await ApiService.withdrawOffer(offer?._id as string);
      setOffer(await resp.json());
      onWithdrawOfferModalClose();
    } catch (e) {}
    setWithdrawingOffer(false);
  };

  useEffect(() => {
    loadOffer();
  }, []);

  useEffect(() => {
    if (clientSecret) {
      (async () => {
        setSettingUpPaymentMethod(true);
        let stripe = await stripePromise;
        const setupIntent = await stripe?.retrieveSetupIntent(clientSecret);
        await ApiService.addPaymentMethod(setupIntent?.setupIntent?.payment_method as string);
        await fetchUser();
        switch (setupIntent?.setupIntent?.status) {
          case 'succeeded':
            bookOffer();
            toast({
              title: 'Your payment method has been saved.',
              status: 'success',
              position: 'top',
              isClosable: true,
            });
            break;
          case 'processing':
            toast({
              // TODO: Handle setup intent processing state
              title: "Processing payment details. We'll update you when processing is complete.",
              status: 'loading',
              position: 'top',
              isClosable: true,
            });
            break;
          case 'requires_payment_method':
            toast({
              title: 'Failed to process payment details. Please try another payment method.',
              status: 'error',
              position: 'top',
              isClosable: true,
            });
            break;
          default:
            toast({
              title: 'Something went wrong.',
              status: 'error',
              position: 'top',
              isClosable: true,
            });
            break;
        }
        setSettingUpPaymentMethod(false);

        bookOffer();
      })();
    }
  }, [clientSecret]);

  const loading = loadingOffer;

  return (
    <Root className="container-fluid">
      <PaymentDialog
        ref={paymentDialogRef}
        prefix={
          <Alert status="info" mb="22px">
            <AlertIcon>
              <MdInfo color={theme.colors.primary[500]} />
            </AlertIcon>
            <AlertDescription>
              Payment will not be deducted until after your first lesson, You may decide to cancel
              after your initial lesson.
            </AlertDescription>
          </Alert>
        }
      />
      <ChoosePaymentMethodDialog
        ref={choosePaymentDialogRef}
        prefix={
          <Alert status="info" mb="22px">
            <AlertIcon>
              <MdInfo color={theme.colors.primary[500]} />
            </AlertIcon>
            <AlertDescription>
              Payment will not be deducted until after your first lesson, You may decide to cancel
              after your initial lesson.
            </AlertDescription>
          </Alert>
        }
      />
      <Box className="row">
        <LeftCol mb="32px" className="col-lg-8">
          {loading && (
            <Box textAlign={'center'}>
              <Spinner />
            </Box>
          )}
          {!!offer && (
            <Box>
              <Modal isOpen={isOfferAcceptedModalOpen} onClose={onOfferAcceptedModalClose}>
                <ModalOverlay />
                <ModalContent>
                  <ModalCloseButton />
                  <ModalBody>
                    <Box w={'100%'} mt={5} textAlign="center">
                      <Box display={'flex'} justifyContent="center">
                        <img alt="offer accepted" src="/images/offer-accepted-confetti.svg" />
                      </Box>
                      <Box marginTop={0}>
                        <Text className="modal-title">Offer Accepted</Text>
                        <div
                          style={{
                            color: theme.colors.text[400],
                          }}>
                          {offer.student.name.first} {offer.student.name.last} has been added to
                          your message list
                        </div>
                      </Box>
                    </Box>
                  </ModalBody>

                  <ModalFooter>
                    <Button onClick={() => navigate('/dashboard')}>Send a message</Button>
                  </ModalFooter>
                </ModalContent>
              </Modal>
              <Modal isOpen={isWithdrawOfferModalOpen} onClose={onWithdrawOfferModalClose}>
                <ModalOverlay />
                <ModalContent>
                  <ModalCloseButton />
                  <ModalBody>
                    <Box w={'100%'} mt={5} textAlign="center">
                      <Box display={'flex'} justifyContent="center">
                        <img alt="withdraw offer" src="/images/file-shadow.svg" />
                      </Box>
                      <Box marginTop={0}>
                        <Text className="modal-title">Withdraw offer</Text>
                        <div
                          style={{
                            color: theme.colors.text[400],
                          }}>
                          Are you sure you want to withdraw your offer to {offer.tutor.user.name.first}?
                        </div>
                      </Box>
                    </Box>
                  </ModalBody>

                  <ModalFooter>
                    <HStack gap="20px">
                      <Button variant={'floating'} onClick={onWithdrawOfferModalClose}>
                        Cancel
                      </Button>
                      <Button
                        isLoading={withdrawingOffer}
                        margin={'0 !important'}
                        variant={'destructiveSolid'}
                        onClick={withdrawOffer}>
                        Withdraw
                      </Button>
                    </HStack>
                  </ModalFooter>
                </ModalContent>
              </Modal>
              <Modal
                onOverlayClick={onDeclineOfferModalClose}
                isOpen={isDeclineOfferModalOpen}
                onClose={onDeclineOfferModalOpen}>
                <ModalOverlay />
                <ModalContent>
                  <ModalBody padding={0} flexDirection="column">
                    <Box w={'100%'} mt={5} textAlign="center">
                      <Text className="sub3" color="text.200">
                        Decline Offer
                      </Text>
                      <Divider mb={0} orientation="horizontal" />
                    </Box>
                    <Box w={'100%'} p={6}>
                      <FormLabel color={'#5C5F64'}>
                        Add a note{' '}
                        <Box color="text.500" as="span">
                          (Optional)
                        </Box>
                      </FormLabel>
                      <Textarea
                        placeholder="Let the client know what your terms are"
                        onChange={(e) => setDeclineNote(e.target.value)}
                        value={declineNote}
                      />
                    </Box>
                  </ModalBody>

                  <ModalFooter>
                    <Button
                      isLoading={decliningOffer}
                      variant={'destructiveSolid'}
                      onClick={() => declineOffer()}>
                      Confirm
                    </Button>
                  </ModalFooter>
                </ModalContent>
              </Modal>

              <Breadcrumb spacing="8px" separator={<FiChevronRight size={10} color="gray.500" />}>
                <BreadcrumbItem>
                  <BreadcrumbLink href="#">Offers</BreadcrumbLink>
                </BreadcrumbItem>

                <BreadcrumbItem isCurrentPage>
                  <BreadcrumbLink href="#">Review offer</BreadcrumbLink>
                </BreadcrumbItem>
              </Breadcrumb>
              {user?.type === 'tutor' && (
                <PageTitle
                  marginTop={'28px'}
                  mb={10}
                  title="Review Offer"
                  subtitle={`Respond to offer from clients, you may also choose to renegotiate`}
                />
              )}
              {user?.type === 'student' && offer.status === 'accepted' && (
                <PageTitle
                  marginTop={'28px'}
                  mb={10}
                  title={offer.completed ? 'Offer' : 'Confirm Offer'}
                  subtitle={
                    offer.completed
                      ? `Your offer has been completed`
                      : `Your offer has been accepted, proceed to make payment`
                  }
                />
              )}
              {user?.type === 'student' && offer.status === 'declined' && (
                <PageTitle
                  marginTop={'28px'}
                  mb={10}
                  title="Offer Declined"
                  subtitle={`Your offer has been declined, choose to update or cancel offer`}
                />
              )}
              {user?.type === 'student' && offer.status === 'draft' && (
                <PageTitle
                  marginTop={'28px'}
                  mb={10}
                  title="Offer"
                  subtitle={`You made an offer to ${offer.tutor.user.name.first}`}
                />
              )}
              {user?.type === 'student' && offer.status === 'withdrawn' && (
                <PageTitle marginTop={'28px'} mb={10} title="Offer Withdrawn" subtitle={``} />
              )}
              <VStack spacing="32px" alignItems={'stretch'}>
                {user?.type === 'tutor' && (
                  <Panel display={'flex'}>
                    <Box width={'100%'} display={'flex'} flexDirection="row" gap="20px">
                      <Box>
                        <Avatar
                          width={'45px'}
                          height="45px"
                          name={`${offer.student.name.first} ${offer.student.name.last}`}
                        />
                      </Box>
                      <Box flexGrow={1}>
                        <HStack justifyContent={'space-between'}>
                          <Text className="sub2" color={'text.200'} mb={0}>
                            {capitalize(offer.student.name.first)}{' '}
                            {capitalize(offer.student.name.last)}
                          </Text>
                        </HStack>
                        <Text
                          noOfLines={2}
                          whiteSpace={'normal'}
                          mt={1}
                          mb={0}
                          className="body2"
                          color={'text.200'}>
                          {!offer.expired ? 'Offer expires in' : 'Offer expired'}{' '}
                          <Box as="span" color={'red.400'}>
                            {moment(offer.expirationDate).fromNow()}
                          </Box>
                        </Text>
                      </Box>
                      <Box
                        alignSelf={'flex-start'}
                        background={'#F4F5F6'}
                        padding="3px 8px"
                        borderRadius={'4px'}
                        color="text.400"
                        fontSize={'12px'}
                        fontWeight="500"
                        lineHeight={'17px'}>
                        {moment(offer.createdAt).format('D.MM.YYYY')}
                      </Box>
                    </Box>
                  </Panel>
                )}
                {user?.type === 'student' && <TutorCard tutor={offer.tutor} />}
                <Panel>
                  <Text className="sub1" mb={0}>
                    Offer Settings
                  </Text>
                  <Box mt={8}>
                    <VStack spacing={'24px'} alignItems="flex-start">
                      <Box>
                        <FormLabel>Offer expiration date</FormLabel>
                        <OfferValueText>
                          {moment(offer.expirationDate).format('MMMM Do YYYY')}
                        </OfferValueText>
                      </Box>
                      <SimpleGrid width={'100%'} columns={{ base: 1, sm: 2 }} spacing="15px">
                        <Box>
                          <FormLabel>Contract starts</FormLabel>
                          <OfferValueText>
                            {moment(offer.contractStartDate).format('MMMM Do YYYY')}
                          </OfferValueText>
                        </Box>
                        <Box>
                          <FormLabel>Contract ends</FormLabel>
                          <OfferValueText>
                            {moment(offer.contractEndDate).format('MMMM Do YYYY')}
                          </OfferValueText>
                        </Box>
                      </SimpleGrid>
                    </VStack>
                  </Box>
                </Panel>
                <Panel>
                  <Text className="sub1" mb={0}>
                    Offer Details
                  </Text>
                  <Box mt={8}>
                    <VStack spacing={'24px'} alignItems="flex-start">
                      <Box>
                        <FormLabel>Course</FormLabel>
                        <OfferValueText>{offer.course.label}</OfferValueText>
                      </Box>
                      <Box>
                        <FormLabel>Level</FormLabel>
                        <OfferValueText>{offer.level}</OfferValueText>
                      </Box>
                      <Box>
                        <FormLabel>What days would you like to have your classes</FormLabel>
                        <OfferValueText>
                          {Object.keys(offer.schedule)
                            .map((d) => numberToDayOfWeekName(parseInt(d), 'ddd'))
                            .join(', ')}
                        </OfferValueText>
                      </Box>
                      {Object.keys(offer.schedule).map((d) => {
                        const n = parseInt(d);
                        return (
                          <Box key={d}>
                            <FormLabel>Time ({numberToDayOfWeekName(n, 'ddd')})</FormLabel>
                            <Flex gap="1px" alignItems="center">
                              <OfferValueText>{offer.schedule[n].begin}</OfferValueText>
                              <FiArrowRight color="#6E7682" size={'15px'} />
                              <OfferValueText>{offer.schedule[n].end}</OfferValueText>
                            </Flex>
                          </Box>
                        );
                      })}
                      <Box>
                        <FormLabel>Note</FormLabel>
                        <OfferValueText>{offer.note || '-'}</OfferValueText>
                      </Box>
                    </VStack>
                  </Box>
                </Panel>
                <Panel>
                  <Text className="sub1" mb={0}>
                    Payment Details
                  </Text>
                  <Box mt={8}>
                    <VStack spacing={'24px'} alignItems="flex-start">
                      <Box>
                        <FormLabel>Hourly rate</FormLabel>
                        <OfferValueText>${offer.rate}/hr</OfferValueText>
                        <Text
                          color="text.300"
                          mt={'10px'}
                          mb={0}
                          fontSize="12px"
                          fontWeight={'500'}>
                          Shepherd charges a{' '}
                          <Box color="primary.400" as={'span'}>
                            {ServiceFeePercentage * 100}% service fee (-$
                            {(offer.rate * ServiceFeePercentage).toFixed(2)}
                            /hr)
                          </Box>
                        </Text>
                      </Box>
                      <Box>
                        <FormLabel>You’ll receive</FormLabel>
                        <OfferValueText>
                          ${offer.rate - offer.rate * ServiceFeePercentage}
                          /hr
                        </OfferValueText>
                      </Box>
                      <Box>
                        <FormLabel>Total amount</FormLabel>
                        <OfferValueText>${offer.rate}</OfferValueText>
                        <Text
                          color="text.300"
                          mt={'10px'}
                          mb={0}
                          fontSize="12px"
                          fontWeight={'500'}>
                          This will be paid in full at the end of a month after the start of the
                          contract
                        </Text>
                      </Box>
                    </VStack>
                  </Box>
                  {user?.type === 'tutor' && (
                    <Alert status="info" mt="22px">
                      <AlertIcon>
                        <MdInfo color={theme.colors.primary[500]} />
                      </AlertIcon>
                      <AlertDescription>
                        Initial payment will not be made until after the client reviews the offer
                        after the first session. The client may decide to continue with you or
                        withdraw the offer
                      </AlertDescription>
                    </Alert>
                  )}
                  {user?.type === 'student' && (
                    <Alert status="info" mt="22px">
                      <AlertIcon>
                        <MdInfo color={theme.colors.primary[500]} />
                      </AlertIcon>
                      <AlertDescription>
                        Payment will not be deducted until after your first lesson, You may decide
                        to cancel after your initial lesson.
                      </AlertDescription>
                    </Alert>
                  )}
                  <HStack
                    justifyContent={'flex-end'}
                    gap={'19px'}
                    marginTop={'48px'}
                    textAlign="right">
                    {offer?.status === 'draft' && (
                      <Button
                        onClick={() => onWithdrawOfferModalOpen()}
                        size="md"
                        variant="destructiveSolidLight">
                        Withdraw Offer
                      </Button>
                    )}
                    {offer?.status === 'accepted' &&
                      !offer?.completed &&
                      isEmpty(user?.paymentMethods) && (
                        <Button
                          isLoading={settingUpPaymentMethod}
                          onClick={setupPaymentMethod}
                          size="md">
                          Book
                        </Button>
                      )}
                    {offer?.status === 'accepted' &&
                      !offer?.completed &&
                      !isEmpty(user?.paymentMethods) && (
                        <Button isLoading={bookingOffer} onClick={bookOffer} size="md">
                          Book
                        </Button>
                      )}
                  </HStack>
                </Panel>
              </VStack>
            </Box>
          )}
        </LeftCol>
        <div className="col-lg-4">
          <RightCol height="100%">
            {user?.type === 'tutor' && (
              <VStack gap={'32px'} alignItems="stretch" position={'sticky'} top="90px">
                {offer?.status === 'draft' && !offer.expired && (
                  <Panel borderRadius={'10px'} position={'sticky'} top="90px">
                    <Box display={'flex'} justifyContent="center">
                      <img alt="file" src="/images/file.svg" width={'80px'} height={'80px'} />
                    </Box>
                    <Text mt={5} mb={0} textAlign="center" className="body2">
                      Respond to the offer before it expires
                    </Text>
                    <VStack mt={8} spacing={'16px'}>
                      <Button
                        isLoading={acceptingOffer}
                        onClick={acceptOffer}
                        w={'100%'}
                        variant="solid">
                        Accept Offer
                      </Button>
                      <Button
                        onClick={onDeclineOfferModalOpen}
                        w={'100%'}
                        variant="destructiveSolidLight">
                        Decline Offer
                      </Button>
                    </VStack>
                  </Panel>
                )}
              </VStack>
            )}
            {user?.type === 'student' && (
              <VStack gap={'32px'} alignItems="stretch" position={'sticky'} top="90px">
                {offer?.status === 'declined' && (
                  <Panel borderRadius={'10px'}>
                    <Box display={'flex'} justifyContent="center">
                      <img alt="file" src="/images/file.svg" width={'80px'} height={'80px'} />
                    </Box>
                    <Text mt={5} mb={0} textAlign="center" className="sub2">
                      Your offer has been declined
                    </Text>
                    {!!offer?.declinedNote && (
                      <Alert status="info" mt="18px">
                        <Text className="body3" fontWeight={500} color="text.400">
                          {offer?.declinedNote}
                        </Text>
                      </Alert>
                    )}
                    <VStack mt={8} spacing={'16px'}>
                      <Button
                        as="a"
                        href={`../tutor/${offer?.tutor._id}/offer`}
                        w={'100%'}
                        variant="solid">
                        Update Offer
                      </Button>
                    </VStack>
                  </Panel>
                )}
                {offer?.status === 'accepted' && (
                  <Panel borderRadius={'10px'}>
                    <Box display={'flex'} justifyContent="center">
                      <img alt="file" src="/images/file.svg" width={'80px'} height={'80px'} />
                    </Box>
                    <Text mt={5} mb={0} textAlign="center" className="sub2">
                      Your offer has been accepted
                    </Text>
                    <Text textAlign={'center'} mt={'7px'} className="body2">
                      {capitalize(offer.tutor.user.name.first)} has been added to your tutor list, send
                      them a message
                    </Text>
                    <VStack mt={8} spacing={'16px'}>
                      <Button as="a" w={'100%'} variant="floating">
                        Send message
                      </Button>
                    </VStack>
                  </Panel>
                )}
                <Panel p="24px" borderRadius={'10px'}>
                  <HStack>
                    <BsQuestionCircleFill color="#969CA6" />
                    <Text className="sub2">How this Works</Text>
                  </HStack>
                  <LinedList
                    mt={'30px'}
                    items={[
                      {
                        title: 'Send a Proposal',
                        subtitle:
                          'Find your desired tutor and prepare an offer on your terms and send to the tutor',
                      },
                      {
                        title: 'Get a Response',
                        subtitle:
                          'Proceed to provide your payment details once the tutor accepts your offer',
                      },
                      {
                        title: 'A Test-Run',
                        subtitle:
                          'You won’t be charged until after your first session, you may cancel after the first lesson.',
                      },
                    ]}
                  />
                </Panel>
              </VStack>
            )}
          </RightCol>
        </div>
      </Box>
    </Root>
  );
};

export default Offer;
