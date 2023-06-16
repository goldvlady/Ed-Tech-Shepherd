import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
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
  useToast,
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

import { Level } from '../../../netlify/database/models/Level';
import Star5 from '../../assets/5star.svg';
import CustomSelect from '../../components/Select';
import TimePicker from '../../components/TimePicker';
import TimezoneSelect from '../../components/TimezoneSelect';
import ApiService from '../../services/ApiService';
import bookmarkedTutorsStore from '../../state/bookmarkedTutorsStore';
import resourceStore from '../../state/resourceStore';
import { Course, Schedule } from '../../types';
import { educationLevelOptions, numberToDayOfWeekName } from '../../util';
import Banner from './components/Banner';
import TutorCard from './components/TutorCard';
import { CustomButton } from './layout';

const priceOptions = [
  { value: '10-12', label: '$10.00 - $12.00', id: 1 },
  { value: '12-15', label: '$12.00 - $15.00', id: 2 },
  { value: '15-20', label: '$15.00 - $20.00', id: 3 },
  { value: '20-25', label: '$20.00 - $25.00', id: 4 },
];
const timezoneOffset = new Date().getTimezoneOffset();

const ratingOptions = [
  { value: 1.0, label: '⭐', id: 1 },
  { value: 2.0, label: '⭐⭐', id: 2 },
  { value: 3.0, label: '⭐⭐⭐', id: 3 },
  { value: 4.0, label: '⭐⭐⭐⭐', id: 4 },
  { value: 5.0, label: '⭐⭐⭐⭐⭐', id: 5 },
];

const dayOptions = [...new Array(7)].map((_, i) => {
  return { label: numberToDayOfWeekName(i), value: i };
});
const defaultTime = '';

export default function Marketplace() {
  const { courses: courseList, levels: levelOptions } = resourceStore();
  const [allTutors, setAllTutors] = useState<any>([]);
  const [loadingData, setLoadingData] = useState(false);
  //   const [tz, setTz] = useState<any>(() => moment.tz.guess());
  const [subject, setSubject] = useState<string>('Subject');
  const [level, setLevel] = useState<any>('');
  const [price, setPrice] = useState<any>('');
  const [rating, setRating] = useState<any>('');
  const [searchParams, setSearchParams] = useSearchParams();
  const [fromTime, setFromTime] = useState('');
  const [toTime, setToTime] = useState('');
  const [days, setDays] = useState<Array<any>>([]);

  const [tutorGrid] = useAutoAnimate();
  const toast = useToast();

  //   const getData = async () => {
  //     setLoadingData(true);
  //     try {
  //       const resp = await ApiService.getAllTutors();
  //       const data = await resp.json();
  //       setAllTutors(data);
  //     } catch (e) {}
  //     setLoadingData(false);
  //   };
  const getData = async () => {
    let formData = {
      courses: subject === 'Subject' ? '' : subject.toLowerCase(),
      levels: level == '' ? '' : level._id,
      availability: '',
      tz: moment.tz.guess(),
      days: days,
      price: price == '' ? '' : price.value,
      floorRating: rating == '' ? '' : rating.value,
      startTime: toTime,
      endTime: fromTime,
    };
    setLoadingData(true);
    try {
      const resp = await ApiService.getAllTutors(formData);
      const data = await resp.json();
      setAllTutors(data);
    } catch (e) {}
    setLoadingData(false);
  };

  useEffect(() => {
    getData();
  }, [subject, level, price, rating, days]);

  const { fetchBookmarkedTutors, tutors: bookmarkedTutors } = bookmarkedTutorsStore();

  const doFetchBookmarkedTutors = useCallback(async () => {
    await fetchBookmarkedTutors();
  }, []);

  const checkBookmarks = (id: string) => {
    for (var i = 0; i < bookmarkedTutors.length; i++) {
      if (bookmarkedTutors[i].tutor._id == id) {
        return true;
        break;
      } else {
      }
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
  }, []);

  return (
    <>
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
          justifyItems={{ sm: 'center' }}>
          <HStack
            direction={{ base: 'row', sm: 'column', lg: 'row' }}
            spacing={{ base: 1, sm: 3 }}
            display={{ sm: 'grid', lg: 'flex' }}>
            <Flex alignItems={'center'} justifySelf={{ base: 'normal', sm: 'center' }}>
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
                color="text.400">
                {subject !== 'Subject'
                  ? courseList.map((course) => {
                      if (course._id === subject) {
                        return course.label;
                      }
                    })
                  : subject}
              </MenuButton>
              <MenuList>
                {courseList.map((course) => (
                  <MenuItem
                    key={course._id}
                    _hover={{ bgColor: '#F2F4F7' }}
                    onClick={() => setSubject(course._id)}>
                    {course.label}
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
            <Menu placement="bottom">
              <MenuButton
                as={Button}
                variant="outline"
                rightIcon={<FiChevronDown />}
                fontSize={14}
                borderRadius="40px"
                fontWeight={400}
                color="text.400">
                {level == '' ? 'Level' : level.label}
              </MenuButton>
              <MenuList>
                {levelOptions.map((level) => (
                  <MenuItem
                    key={level._id}
                    _hover={{ bgColor: '#F2F4F7' }}
                    onClick={() => setLevel(level)}>
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
                  width={{ sm: '400px', lg: 'auto' }}
                  fontWeight={400}
                  color="text.400">
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
                      <Box display={'flex'} alignItems="center" gap={'7px'}>
                        <Box>
                          <Box fontSize={14} my={2} color="#5C5F64">
                            Start Time
                          </Box>
                          <TimePicker
                            inputGroupProps={{
                              size: 'lg',
                            }}
                            inputProps={{
                              size: 'md',
                              placeholder: '01:00 PM',
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
                              size: 'md',
                            }}
                            inputProps={{
                              placeholder: '06:00 PM',
                            }}
                            value={toTime}
                            onChange={(v: string) => {
                              setToTime(v);
                            }}
                          />
                        </Box>
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
                fontWeight={400}
                color="text.400">
                {price == '' ? 'Price' : price.label}
              </MenuButton>
              <MenuList>
                {priceOptions.map((price) => (
                  <MenuItem
                    key={price.id}
                    _hover={{ bgColor: '#F2F4F7' }}
                    onClick={() => setPrice(price)}>
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
                fontWeight={400}
                color="text.400">
                {rating == '' ? 'Rating' : rating.label}
              </MenuButton>
              <MenuList>
                {ratingOptions.map((rating) => (
                  <MenuItem
                    key={rating.id}
                    _hover={{ bgColor: '#F2F4F7' }}
                    onClick={() => setRating(rating)}>
                    {rating.label}
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
            {/* <Box w="125px">
            <Select
              fontSize={14}
              borderRadius="40px"
              variant="outline"
              placeholder="Price"
              name="price">
              {priceOptions.map((price) => (
                <option key={price.id} value={price.value}>
                  {price.label}
                </option>
              ))}
            </Select>
          </Box> */}
            {/* <Box w="125px">
            <Select
              fontSize={14}
              borderRadius="40px"
              variant="outline"
              placeholder="Rating"
              name="rating">
              {ratingOptions.map((rating) => (
                <option key={rating.id} value={rating.value}>
                  {rating.label}
                </option>
              ))}
            </Select>
          </Box> */}
          </HStack>
          <Spacer />
          <Flex gap="2">
            <CustomButton
              buttonText={'Clear Filters'}
              buttonType="outlined"
              fontStyle={{ fontSize: '12px', fontWeight: 500 }}
              onClick={resetForm}
            />
            {/* <CustomButton
            buttonText={'Apply Filters'}
            buttonType="fill"
            fontStyle={{ fontSize: '12px', fontWeight: 500 }}
            onClick={getFilteredData}
          /> */}
          </Flex>
        </Flex>
      </Box>

      <Box my={45} py={2}>
        <SimpleGrid minChildWidth="345px" spacing="15px" ref={tutorGrid}>
          {allTutors.map((tutor: any) => (
            <TutorCard
              key={tutor._id}
              id={tutor._id}
              name={`${tutor.user.name.first} ${tutor.user.name.last} `}
              levelOfEducation={tutor.highestLevelOfEducation}
              avatar={tutor.avatar}
              rate={tutor.rate}
              description={tutor.description}
              rating={tutor.rating}
              reviewCount={tutor.reviewCount}
              saved={checkBookmarks(tutor._id)}
            />
          ))}
        </SimpleGrid>
      </Box>
    </>
  );
}
