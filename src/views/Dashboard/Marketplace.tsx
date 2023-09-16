import Star5 from '../../assets/5star.svg';
import Sally from '../../assets/saly.svg';
import CustomButton2 from '../../components/CustomComponents/CustomButton/index';
import CustomModal from '../../components/CustomComponents/CustomModal';
import CustomToast from '../../components/CustomComponents/CustomToast';
import PaymentDialog, {
  PaymentDialogRef
} from '../../components/PaymentDialog';
import CustomSelect from '../../components/Select';
import SelectComponent, { Option } from '../../components/Select';
import TimePicker from '../../components/TimePicker';
import TimezoneSelect from '../../components/TimezoneSelect';
import ApiService from '../../services/ApiService';
import bookmarkedTutorsStore from '../../state/bookmarkedTutorsStore';
import resourceStore from '../../state/resourceStore';
import userStore from '../../state/userStore';
import theme from '../../theme';
import { educationLevelOptions, numberToDayOfWeekName } from '../../util';
import Banner from './components/Banner';
import BountyOfferModal from './components/BountyOfferModal';
import Pagination from './components/Pagination';
import TutorCard from './components/TutorCard';
import { CustomButton } from './layout';
import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  HStack,
  Image,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Radio,
  Select,
  SimpleGrid,
  Spacer,
  Stack,
  Text,
  useToast,
  useDisclosure,
  Modal,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  VStack,
  RadioGroup
} from '@chakra-ui/react';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { loadStripe } from '@stripe/stripe-js';
import { Select as MultiSelect } from 'chakra-react-select';
import { useFormik } from 'formik';
import moment from 'moment';
import React, {
  useCallback,
  useEffect,
  useState,
  useRef,
  ChangeEvent,
  useMemo
} from 'react';
import { BsStarFill } from 'react-icons/bs';
import { FiChevronDown } from 'react-icons/fi';
import { IoIosAlert } from 'react-icons/io';
import { MdInfo } from 'react-icons/md';
import { MdTune } from 'react-icons/md';
import { useSearchParams } from 'react-router-dom';

type PaginationType = {
  page: number;
  limit: number;
  count: number;
};

const priceOptions = [
  { value: '10-12', label: '$10.00 - $12.00', id: 1 },
  { value: '12-15', label: '$12.00 - $15.00', id: 2 },
  { value: '15-20', label: '$15.00 - $20.00', id: 3 },
  { value: '20-25', label: '$20.00 - $25.00', id: 4 }
];
const timezoneOffset = new Date().getTimezoneOffset();

const ratingOptions = [
  { value: 1.0, label: '⭐', id: 1 },
  { value: 2.0, label: '⭐⭐', id: 2 },
  { value: 3.0, label: '⭐⭐⭐', id: 3 },
  { value: 4.0, label: '⭐⭐⭐⭐', id: 4 },
  { value: 5.0, label: '⭐⭐⭐⭐⭐', id: 5 }
];

const dayOptions = [...new Array(7)].map((_, i) => {
  return { label: numberToDayOfWeekName(i), value: i };
});
const defaultTime = '';

export default function Marketplace() {
  const { courses: courseList, levels: levelOptions } = resourceStore();
  const { user } = userStore();
  const [allTutors, setAllTutors] = useState<any>([]);
  const [pagination, setPagination] = useState<PaginationType>();

  const [loadingData, setLoadingData] = useState(false);
  //   const [tz, setTz] = useState<any>(() => moment.tz.guess());
  const [subject, setSubject] = useState<string>('Subject');
  const [level, setLevel] = useState<any>('');
  const [price, setPrice] = useState<any>('');
  const [rating, setRating] = useState<any>('');
  const [searchParams, setSearchParams] = useSearchParams();
  const [fromTime, setFromTime] = useState('');
  const [toTime, setToTime] = useState('');
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(20);
  const [count, setCount] = useState<number>(5);
  const [days, setDays] = useState<Array<any>>([]);

  const [settingUpPaymentMethod, setSettingUpPaymentMethod] = useState(false);

  //Payment Method Handlers
  const paymentDialogRef = useRef<PaymentDialogRef>(null);
  const url: URL = new URL(window.location.href);
  const params: URLSearchParams = url.searchParams;
  const clientSecret = params.get('setup_intent_client_secret');
  const stripePromise = loadStripe(
    process.env.REACT_APP_STRIPE_PUBLIC_KEY as string
  );

  const [onlineTutorsId, setOnlineTutorsId] = useState<string[]>([]);

  const [isShowInput, setShowInput] = useState('');

  const [currentPage, setCurrentPage] = useState(1);

  const handleNextPage = () => {
    setPage(page + 1);
  };

  const handlePreviousPage = () => {
    setPage(page - 1);
  };

  const [tutorGrid] = useAutoAnimate();
  const toast = useToast();

  const getData = async () => {
    setLoadingData(true);
    const formData = {
      courses: subject === 'Subject' ? '' : subject.toLowerCase(),
      levels: level === '' ? '' : level._id,
      availability: '',
      tz: moment.tz.guess(),
      days: days,
      price: price === '' ? '' : price.value,
      floorRating: rating === '' ? '' : rating.value,
      startTime: toTime,
      endTime: fromTime,
      page: page,
      limit: limit
    };

    const resp = await ApiService.getAllTutors(formData);
    const data = await resp.json();

    setPagination(data.meta.pagination);

    setAllTutors(data.tutors);
    setLoadingData(false);
  };

  useEffect(() => {
    getData();
    /* eslint-disable */
  }, [subject, level, price, rating, days, page]);

  const handleSelectedCourse = (selectedcourse) => {
    let selectedID = '';
    for (let i = 0; i < courseList.length; i++) {
      if (courseList[i].label === selectedcourse) {
        selectedID = courseList[i]._id;
        // return courseList[i].label;
      }
    }
    setSubject(selectedID);
  };

  const { fetchBookmarkedTutors, tutors: bookmarkedTutors } =
    bookmarkedTutorsStore();

  const doFetchBookmarkedTutors = useCallback(async () => {
    await fetchBookmarkedTutors();
  }, []);

  const checkBookmarks = (id: string) => {
    const found = bookmarkedTutors?.some((tutor) => tutor._id === id);
    if (!found) {
      return false;
    } else {
      return true;
    }
  };

  useEffect(() => {
    doFetchBookmarkedTutors();
  }, [doFetchBookmarkedTutors]);

  const resetForm = useCallback(() => {
    setSubject('Subject');
    setLevel('');
    setPrice('');
    setRating('');
    setDays([]);
    setFromTime('');
    setToTime('');
    getData();
    /* eslint-disable */
  }, []);

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
        // await fetchUser();
        switch (setupIntent?.setupIntent?.status) {
          case 'succeeded':
            toast({
              title: 'Your payment method has been saved.',
              status: 'success',
              position: 'top',
              isClosable: true
            });
            openBountyModal;
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
    isOpen: isBountyModalOpen,
    onOpen: openBountyModal,
    onClose: closeBountyModal
  } = useDisclosure();

  useEffect(() => {
    const getNotes = async () => {
      try {
        const resp = await ApiService.getOnlineTutors();

        const response = await resp.json();
        setOnlineTutorsId(response?.data);
      } catch (error: any) {
        toast({
          render: () => (
            <CustomToast
              title="Failed to fetch chat history..."
              status="error"
            />
          ),
          position: 'top-right',
          isClosable: true
        });
      }
    };
    getNotes();
  }, []);

  return (
    <>
      <Box p={5}>
        <Box
          bgColor={'transparent'}
          borderRadius={'14px'}
          border="1px solid #E2E8F0"
          height={'200px'}
        >
          <Banner />
        </Box>
        <Box textAlign="center">
          <Flex
            alignItems="center"
            gap="2"
            mt={2}
            textColor="text.400"
            display={{ base: 'flex', sm: 'inline-grid', lg: 'flex' }}
            justifyItems={{ sm: 'center' }}
          >
            <HStack
              direction={{ base: 'row', sm: 'column', lg: 'row' }}
              spacing={{ base: 1, sm: 3 }}
              display={{ sm: 'grid', lg: 'flex' }}
            >
              <Flex
                alignItems={'center'}
                justifySelf={{ base: 'normal', sm: 'center' }}
              >
                <Text>
                  <MdTune />
                </Text>
                <Text>Filter</Text>
              </Flex>
              <Menu>
                <MenuButton
                  as={Button}
                  variant="outline"
                  rightIcon={<FiChevronDown />}
                  fontSize={14}
                  borderRadius="40px"
                  fontWeight={400}
                  width={{ sm: '400px', lg: 'auto' }}
                  height="36px"
                  color="text.400"
                >
                  {subject !== 'Subject'
                    ? courseList.map((course) => {
                        if (course._id === subject) {
                          return course.label;
                        }
                      })
                    : subject}
                </MenuButton>
                <MenuList zIndex={3}>
                  {courseList.map((course) => (
                    <MenuItem
                      key={course._id}
                      _hover={{ bgColor: '#F2F4F7' }}
                      onClick={() => setSubject(course._id)}
                    >
                      {course.label}
                    </MenuItem>
                  ))}
                </MenuList>
              </Menu>
              <Menu>
                <MenuButton
                  as={Button}
                  variant="outline"
                  rightIcon={<FiChevronDown />}
                  fontSize={14}
                  borderRadius="40px"
                  height="36px"
                  fontWeight={400}
                  color="text.400"
                >
                  {level === '' ? 'Level' : level.label}
                </MenuButton>
                <MenuList minWidth={'auto'}>
                  {levelOptions.map((level) => (
                    <MenuItem
                      key={level._id}
                      _hover={{ bgColor: '#F2F4F7' }}
                      onClick={() => setLevel(level)}
                    >
                      {level.label}
                    </MenuItem>
                  ))}
                </MenuList>
              </Menu>

              <Box>
                <Menu>
                  <MenuButton
                    as={Button}
                    variant="outline"
                    rightIcon={<FiChevronDown />}
                    fontSize={14}
                    borderRadius="40px"
                    height="36px"
                    width={{ sm: '400px', lg: 'auto' }}
                    fontWeight={400}
                    color="text.400"
                  >
                    Availability
                  </MenuButton>
                  <MenuList p={5}>
                    <Box>
                      <Box fontSize={14} mb={2} color="#5C5F64">
                        Days
                      </Box>

                      <CustomSelect
                        value={days}
                        isMulti
                        onChange={(v) => setDays(v as Array<any>)}
                        tagVariant="solid"
                        options={dayOptions}
                        size={'md'}
                      />
                    </Box>

                    <Box my={3}>
                      <FormControl>
                        <Box>
                          <Box fontSize={14} my={2} color="#5C5F64">
                            Start Time
                          </Box>
                          <TimePicker
                            inputGroupProps={{
                              size: 'lg'
                            }}
                            inputProps={{
                              size: 'md',
                              placeholder: '01:00 PM'
                            }}
                            value={fromTime}
                            onChange={(v: string) => {
                              setFromTime(v);
                            }}
                          />
                        </Box>

                        <Box>
                          <Box fontSize={14} my={2} color="#5C5F64">
                            End Time
                          </Box>

                          <TimePicker
                            inputGroupProps={{
                              size: 'md'
                            }}
                            inputProps={{
                              placeholder: '06:00 PM'
                            }}
                            value={toTime}
                            onChange={(v: string) => {
                              setToTime(v);
                            }}
                          />
                        </Box>
                      </FormControl>
                    </Box>
                  </MenuList>
                </Menu>
              </Box>
              <Menu>
                <MenuButton
                  as={Button}
                  variant="outline"
                  rightIcon={<FiChevronDown />}
                  fontSize={14}
                  borderRadius="40px"
                  height="36px"
                  fontWeight={400}
                  color="text.400"
                >
                  {price === '' ? 'Price' : price.label}
                </MenuButton>
                <MenuList minWidth={'auto'}>
                  {priceOptions.map((price) => (
                    <MenuItem
                      key={price.id}
                      _hover={{ bgColor: '#F2F4F7' }}
                      onClick={() => setPrice(price)}
                    >
                      {price.label}
                    </MenuItem>
                  ))}
                </MenuList>
              </Menu>
              <Menu>
                <MenuButton
                  as={Button}
                  variant="outline"
                  rightIcon={<FiChevronDown />}
                  fontSize={14}
                  borderRadius="40px"
                  height="36px"
                  fontWeight={400}
                  color="text.400"
                >
                  {rating === '' ? 'Rating' : rating.label}
                </MenuButton>
                <MenuList minWidth={'auto'}>
                  {ratingOptions.map((rating) => (
                    <MenuItem
                      key={rating.id}
                      _hover={{ bgColor: '#F2F4F7' }}
                      onClick={() => setRating(rating)}
                    >
                      {rating.label}
                    </MenuItem>
                  ))}
                </MenuList>
              </Menu>
            </HStack>
            <Spacer />
            <Box>
              <CustomButton
                buttonText={'Clear Filters'}
                buttonType="outlined"
                fontStyle={{ fontSize: '12px', fontWeight: 500 }}
                onClick={resetForm}
              />
            </Box>
          </Flex>
        </Box>

        <Box my={45} py={2} minHeight="750px">
          {!loadingData && allTutors.length > 0 ? (
            <>
              <SimpleGrid
                columns={{ base: 1, md: 2, lg: 3 }}
                spacing="20px"
                ref={tutorGrid}
              >
                {allTutors?.map((tutor: any) => (
                  <TutorCard
                    key={tutor._id}
                    id={tutor._id}
                    name={`${tutor.user.name.first} ${tutor.user.name.last} `}
                    levelOfEducation={tutor.highestLevelOfEducation}
                    avatar={tutor.user.avatar}
                    rate={tutor.rate}
                    description={tutor.description}
                    rating={tutor.rating}
                    reviewCount={tutor.reviewCount}
                    saved={checkBookmarks(tutor._id)}
                    courses={tutor.coursesAndLevels.map((course) => course)}
                    handleSelectedCourse={handleSelectedCourse}
                    isTutorOnline={onlineTutorsId?.includes(tutor?._id)}
                  />
                ))}
              </SimpleGrid>{' '}
              <Pagination
                page={pagination ? pagination.page : 0}
                count={pagination ? pagination.count : 0}
                limit={pagination ? pagination.limit : 0}
                handlePagination={(nextPage) => setPage(nextPage)}
              />
            </>
          ) : (
            !loadingData && 'no tutors found'
          )}
        </Box>
      </Box>
      <Box
        position="fixed"
        bottom={3}
        right={3}
        bg={'white'}
        borderRadius={'10px'}
        width="328px"
        borderColor="grey"
        textAlign="center"
        boxShadow="0px 4px 20px 0px rgba(115, 126, 140, 0.25)"
      >
        <Image
          src={Sally}
          alt="instant tutoring"
          borderTopLeftRadius={'10px'}
          borderTopRightRadius={'10px'}
        />
        <VStack p={3} gap={2}>
          <Text>Need Instant Tutoring ?</Text>
          <Button
            onClick={
              user && user.paymentMethods?.length > 0
                ? openBountyModal
                : setupPaymentMethod
            }
          >
            Place Bounty
          </Button>
        </VStack>
      </Box>
      <BountyOfferModal
        isBountyModalOpen={isBountyModalOpen}
        closeBountyModal={closeBountyModal}
      />
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
    </>
  );
}
