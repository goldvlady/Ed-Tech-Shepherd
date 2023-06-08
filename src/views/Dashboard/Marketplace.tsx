import React, { useCallback, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
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
} from '@chakra-ui/react';
import { Select as MultiSelect } from 'chakra-react-select';
import { useFormik } from 'formik';
import moment from 'moment';
import React, { useCallback, useEffect, useState } from 'react';
import { BsStarFill } from 'react-icons/bs';
import { FiChevronDown } from 'react-icons/fi';
import { MdTune } from 'react-icons/md';
import { useSearchParams } from 'react-router-dom';

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

const levelOptions = [
  { value: "a-level", label: "A-Level", id: 1 },
  { value: "gcse", label: "GCSE", id: 2 },
  { value: "university", label: "University", id: 3 },
  { value: "grade10", label: "Grade 10", id: 4 },
  { value: "grade11", label: "Grade 11", id: 5 },
  { value: "grade12", label: "Grade 12", id: 6 },
];
const priceOptions = [
  { value: "10-12", label: "$10.00 - $12.00", id: 1 },
  { value: "12-15", label: "$12.00 - $15.00", id: 2 },
  { value: "15-20", label: "$15.00 - $20.00", id: 3 },
  { value: "20-25", label: "$20.00 - $25.00", id: 4 },
];

const ratingOptions = [
  { value: "1star", label: "⭐", id: 1 },
  { value: "2star", label: "⭐⭐", id: 2 },
  { value: "3star", label: "⭐⭐⭐", id: 3 },
  { value: "4star", label: "⭐⭐⭐⭐", id: 4 },
  { value: "5star", label: "⭐⭐⭐⭐⭐", id: 5 },
];

const dayOptions = [...new Array(7)].map((_, i) => {
  return { label: numberToDayOfWeekName(i), value: i };
});
const defaultTime = "";

export default function Marketplace() {
  const { courses: courseList } = resourceStore();
  const [allTutors, setAllTutors] = useState<any>([]);
  const [loadingData, setLoadingData] = useState(false);
  const [tz, setTz] = useState<any>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [fromTime, setFromTime] = useState("");
  const [toTime, setToTime] = useState("");
  const [days, setDays] = useState<Array<any>>([]);

  const formik = useFormik({
    initialValues: {
      subject: "",
      level: "",
      //   toTime: toTime,
      //   fromTime: fromTime,
      //   days: days,
      //   tz: tz,

      price: "",
      rating: "",
    },
    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2));
    },
  });
  console.log(days);

  const getData = async () => {
    setLoadingData(true);
    try {
      const resp = await ApiService.getAllTutors();
      const data = await resp.json();
      setAllTutors(data);
    } catch (e) {}
    setLoadingData(false);
  };
  const getFilteredData = async () => {
    let formData = {
      courses: formik.values.subject.toLowerCase(),
      teachLevel: formik.values.level,
      availability: "",
      tz: "Africa/Lagos",
      days: days,
      price: formik.values.price,
      rating: formik.values.rating,
    };
    setLoadingData(true);
    try {
      const resp = await ApiService.getFilteredTutors(formData);
      const data = await resp.json();
      setAllTutors(data);
    } catch (e) {}
    setLoadingData(false);
  };

  useEffect(() => {
    getData();
  }, []);
  console.log(allTutors);
  console.log("TZ", tz);

  const resetForm = () => {
    formik.resetForm();
    setTz(defaultTime);
    setDays([]);
    setFromTime("");
    setToTime("");
    getData();
  };

    const { fetchBookmarkedTutors, tutors: bookmarkedTutors } =
        bookmarkedTutorsStore();

    const doFetchBookmarkedTutors = useCallback(async () => {
        await fetchBookmarkedTutors();
    }, []);

    useEffect(() => {
        doFetchBookmarkedTutors();
    }, [doFetchBookmarkedTutors]);

    console.log('BOOKMARKED', bookmarkedTutors);

    const checkBookmarks = (id: string) => {
        for (var i = 0; i < bookmarkedTutors.length; i++) {
            if (bookmarkedTutors[i].tutor._id == id) {
                return true;
                break;
            } else {
            }
        }
    };

    return (
        <>
            <Box bgColor={'black'} borderRadius={'14px'} height={'200px'}>
                <Banner />
            </Box>
            <Box mt={3}>
                <Flex>
                    <HStack spacing={1} direction="row">
                        <Flex alignItems={'center'} mt={2}>
                            <Text>
                                <MdTune />
                            </Text>
                            <Text>Filter</Text>
                        </Flex>
                        <Select
                            fontSize={14}
                            variant="outline"
                            placeholder="Subject"
                            name="subject"
                            value={formik.values.subject}
                            onChange={formik.handleChange}
                        >
                            {courseList.map((course) => (
                                <option key={course._id} value={course._id}>
                                    {course.label}
                                </option>
                            ))}
                        </Select>
                        <Select
                            fontSize={14}
                            variant="outline"
                            size="md"
                            placeholder="Level"
                            name="level"
                            value={formik.values.level}
                            onChange={formik.handleChange}
                        >
                            {educationLevelOptions.map((level) => (
                                <option value={level.value}>
                                    {level.label}
                                </option>
                            ))}
                        </Select>

            <Box>
              {" "}
              <Menu>
                <MenuButton
                  as={Button}
                  variant="outline"
                  rightIcon={<FiChevronDown />}
                  fontSize={14}
                  fontWeight={500}
                  color="#5C5F64"
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
                      size={"md"}
                    />
                  </Box>
                  {/* <Box>
                    <FormControl>
                      <Box fontSize={14} my={2} color="#5C5F64">
                        Timezone
                      </Box>

                      <TimezoneSelect
                        value={tz}
                        onChange={(v) => setTz(v.value)}
                      />
                    </FormControl>
                  </Box> */}
                  <Box my={3}>
                    <FormControl>
                      <Box display={"flex"} alignItems="center" gap={"7px"}>
                        <Box>
                          <Box fontSize={14} my={2} color="#5C5F64">
                            Start Time
                          </Box>
                          <TimePicker
                            inputGroupProps={{ size: "lg" }}
                            inputProps={{ size: "md", placeholder: "01:00 PM" }}
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
                            inputGroupProps={{ size: "md" }}
                            inputProps={{ placeholder: "06:00 PM" }}
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
            <Box my={45} py={2}>
                <SimpleGrid minChildWidth="359px" spacing="30px">
                    {allTutors.map((tutor: any) => (
                        <TutorCard
                            key={tutor._id}
                            id={tutor._id}
                            name={`${tutor.name.first} ${tutor.name.last} `}
                            levelOfEducation={tutor.highestLevelOfEducation}
                            avatar={tutor.avatar}
                            rate={tutor.rate}
                            description={tutor.description}
                            saved={checkBookmarks(tutor._id)}
                        />
                    ))}
                </SimpleGrid>
            </Box>
        </>
    );
}
