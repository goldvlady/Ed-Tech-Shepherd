import Star5 from '../../assets/5star.svg';
import CustomSelect from '../../components/Select';
import TimePicker from '../../components/TimePicker';
import TimezoneSelect from '../../components/TimezoneSelect';
import ApiService from '../../services/ApiService';
import bookmarkedTutorsStore from '../../state/bookmarkedTutorsStore';
import resourceStore from '../../state/resourceStore';
import { educationLevelOptions, numberToDayOfWeekName } from '../../util';
import Banner from './components/Banner';
import Pagination from './components/Pagination';
import TutorCard from './components/TutorCard';
import { CustomButton } from './layout';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  HStack,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Select,
  SimpleGrid,
  Spacer,
  Stack,
  Text,
  useToast
} from '@chakra-ui/react';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { Select as MultiSelect } from 'chakra-react-select';
import { useFormik } from 'formik';
import moment from 'moment';
import React, { useCallback, useEffect, useState } from 'react';
import { BsStarFill } from 'react-icons/bs';
import { FiChevronDown } from 'react-icons/fi';
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
    const found = bookmarkedTutors.some((el) => el.tutor?._id === id);
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

  return (
    <>
      <Box p={5}>
        <Box bgColor={'black'} borderRadius={'14px'} height={'200px'}>
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
            <Flex gap="2">
              <CustomButton
                buttonText={'Clear Filters'}
                buttonType="outlined"
                fontStyle={{ fontSize: '12px', fontWeight: 500 }}
                onClick={resetForm}
              />
            </Flex>
          </Flex>
        </Box>

        <Box my={45} py={2} minHeight="750px">
          {!loadingData && allTutors.length > 0 ? (
            <>
              <SimpleGrid columns={[2, null, 3]} spacing="20px" ref={tutorGrid}>
                {allTutors.map((tutor: any) => (
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
                  />
                ))}
              </SimpleGrid>{' '}
              <Pagination
                page={pagination ? pagination.page : 0}
                count={pagination ? pagination.count : 0}
                limit={pagination ? pagination.limit : 0}
                handleNextPage={handleNextPage}
                handlePreviousPage={handlePreviousPage}
              />
            </>
          ) : (
            !loadingData && 'no tutors found'
          )}
        </Box>
      </Box>
    </>
  );
}
