import React, { useCallback, useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Box, SimpleGrid, Stack, Select, Flex, Spacer, FormControl, Text } from '@chakra-ui/react'
import { Select as MultiSelect } from "chakra-react-select"
import Banner from './components/Banner'
import TutorCard from './components/TutorCard'
import { MdTune } from 'react-icons/md'
import { CustomButton } from './layout'
import Star5 from '../../assets/5star.svg'
import { BsStarFill } from 'react-icons/bs'
import { formatContentFulCourse, getContentfulClient } from '../../contentful';
import { Course, Schedule } from '../../types';
import { useFormik } from 'formik'
import ApiService from '../../services.ts/ApiService';

const levelOptions = [
    { value: "a-level", label: "A-Level", id: 1 },
    { value: "gcse", label: "GCSE", id: 2 },
    { value: "university", label: "University", id: 3 },
    { value: "grade10", label: "Grade 10", id: 4 },
    { value: "grade11", label: "Grade 11", id: 5 },
    { value: "grade12", label: "Grade 12", id: 6 }
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


const client = getContentfulClient();

export default function Marketplace() {
    const [allTutors, setAllTutors] = useState<any>([])
    const [courseList, setCourseList] = useState<Course[]>([]);
    const [loadingCourses, setLoadingCourses] = useState(false);
    const [loadingData, setLoadingData] = useState(false);

    const [searchParams, setSearchParams] = useSearchParams()

    const formik = useFormik({
        initialValues: {
            subject: '',
            level: '',
            availability: '',
            price: '',
            rating: ''
        },
        onSubmit: values => {
            alert(JSON.stringify(values, null, 2));
        },
    });

    const loadCourses = useCallback(async () => {
        setLoadingCourses(true);

        try {
            const resp = await client.getEntries({
                content_type: 'course'
            })

            let newCourseList: Array<Course> = [];
            resp.items.map((i: any) => {
                newCourseList.push(formatContentFulCourse(i));
            })

            setCourseList(newCourseList);
        } catch (e) {

        }
        setLoadingCourses(false);
    }, []);

    useEffect(() => {
        loadCourses();
    }, [loadCourses]);

    const getData = async () => {
        setLoadingData(true)
        try {
            const resp = await ApiService.getAllTutors();
            const data = await resp.json();
            setAllTutors(data);
        } catch (e) {
        }
        setLoadingData(false);
    }
    useEffect(() => {
        getData();
    }, []);
    console.log(allTutors);

    return (
        <>
            <Box bgColor={"black"} borderRadius={"14px"} height={"200px"}><Banner /></Box>
            <Box mt={3}>

                <Flex>
                    <Stack spacing={3} direction='row' >
                        <Flex alignItems={"center"} mt={2}>
                            <Text><MdTune /></Text>
                            <Text>Filter</Text>
                        </Flex>
                        <Select fontSize={14} variant='outline' placeholder='Subject' name="subject" value={formik.values.subject} onChange={formik.handleChange} >
                            {courseList.map((course) => (
                                <option key={course.id} value={course.title}>{course.title}</option>
                            ))}
                        </Select>
                        <Select fontSize={14} variant='outline' placeholder='Level' name="level" value={formik.values.level} onChange={formik.handleChange}>
                            {levelOptions.map((level) => (<option key={level.id} value={level.value}>{level.label}</option>))}
                        </Select>
                        <Select fontSize={14} variant='outline' placeholder='Availability' name="availability" value={formik.values.availability} onChange={formik.handleChange}>
                            <option value='option1'>Option 1</option>
                            <option value='option2'>Option 2</option>
                            <option value='option3'>Option 3</option>
                        </Select>
                        <Select fontSize={14} variant='outline' placeholder='Price' name="price" value={formik.values.price} onChange={formik.handleChange}  >
                            {priceOptions.map((price) => (<option key={price.id} value={price.value}>{price.label}</option>))}
                        </Select>
                        <Select fontSize={14} variant='outline' placeholder='Rating' name="rating" value={formik.values.rating} onChange={formik.handleChange}>
                            {ratingOptions.map((rating) => (<option key={rating.id} value={rating.value}>{rating.label}</option>))}

                        </Select>

                    </Stack>
                    <Spacer />
                    <CustomButton buttonText={"Clear Filters"} buttonType="outlined" fontStyle={{ fontSize: "12px", fontWeight: 500 }} onClick={formik.resetForm} />
                    <CustomButton buttonText={"Apply Filters"} buttonType="fill" fontStyle={{ fontSize: "12px", fontWeight: 500 }} onClick={formik.handleSubmit} />
                </Flex>

            </Box>
            <Box my={45} py={2}>
                <SimpleGrid minChildWidth='359px' spacing='30px' >
                    {allTutors.map((tutor: any) => (<TutorCard key={tutor._id} id={tutor._id} name={`${tutor.name.first} ${tutor.name.last} `} levelOfEducation={tutor.highestLevelOfEducation} avatar={tutor.avatar} />))}

                </SimpleGrid>
            </Box>
        </>
    )
}
