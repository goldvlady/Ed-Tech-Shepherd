import { Box, Button, Container, Divider, Heading, HStack, Spinner, Text, useToast, Wrap, WrapItem } from '@chakra-ui/react';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router';
import styled from 'styled-components';
import Header from '../components/Header';
import { FiBookOpen, FiClock, FiUser } from "react-icons/fi";
import theme from '../theme';
import confirmBookingStore from '../state/confirmBookingStore';
import Scheduler from '../components/Scheduler';
import moment from 'moment';
import Panel from '../components/Panel';
import TutorSelect from '../components/TutorSelect';
import ApiService from '../services.ts/ApiService';
import { Course, Schedule, Slot, Student, Tutor } from '../types';
import { capitalize, isEmpty } from 'lodash';
import { usePaystackPayment } from 'react-paystack';
import { useTitle } from '../hooks';
import { formatContentFulCourse, getContentfulClient } from '../contentful';
import { REACT_APP_PAYSTACK_PUBLIC_KEY } from '../config';

const TutorSide = styled('aside')`
height: 100%;
max-width: 400px;
margin: 0 auto;
`

const TutorCalendarBlocker = styled(Box)`
position: absolute;
z-index: 4;
left: 0;
right: 0;
top: 0;
bottom: 0;
display: flex;
justify-content: center;
align-items: center;
background: rgb(255 255 255 / 81%);
`

const Root = styled(Box)`
width: 100%;
min-height: 100vh;
min-height: 100dvh;
display: flex;

@media(max-width: 992px) {
    flex-direction: column;

    ${TutorSide} {
        width: 100%;
        max-width: 100%;
        margin: 0;
    }
}
`

const client = getContentfulClient();

const BookSession = () => {
    const toast = useToast();
    const { studentLeadId, course } = useParams();

    const [paymentAttempts, setPaymentAttempts] = useState(0);
    const [loadingData, setLoadingData] = useState(true);

    const [studentLead, setStudentLead] = useState<Student | null>(null);
    const [matchedTutors, setMatchedTutors] = useState<Tutor[]>([]);
    const [paymentInProgress, setPaymentInProgress] = useState(false);

    const data = confirmBookingStore.useStore();
    const { slots, tutor } = data;

    const [courseList, setCourseList] = useState<Course[]>([]);
    const [loadingCourses, setLoadingCourses] = useState(false);
    const loadCourses = useCallback(async () => {
        setLoadingCourses(true);

        try {
            const resp = await client.getEntries({
                content_type: 'course'
            })

            let courseList: Array<Course> = [];
            resp.items.map((i: any) => {
                courseList.push(formatContentFulCourse(i));
            })

            setCourseList(courseList);
        } catch (e) {

        }
        setLoadingCourses(false);
    }, []);

    useEffect(() => {
        loadCourses();
    }, [loadCourses]);

    const currentCourse = courseList.find(ac => ac.id === course);

    const fourteenDayRange = useMemo(() => [...new Array(14)].map((_, i) => {
        return moment().add(i, 'days');
    }), []);

    const selectedTutor = useMemo(() => matchedTutors.find(mt => mt._id === tutor), [tutor, matchedTutors]);

    useTitle(`Book a session${!!selectedTutor ? ` with ${capitalize(selectedTutor.name.first)}` : ''}`);

    const getData = async () => {
        const resp = await ApiService.getBookSessionData({
            studentLeadId,
            course
        });

        const data = await resp.json();
        setLoadingData(false);

        setStudentLead(data.studentLead);
        setMatchedTutors(data.matchedTutors);
    }

    useEffect(() => {
        getData();
    }, []);

    useEffect(() => {
        confirmBookingStore.set.slots([]);
    }, [tutor]);

    const tutorSchedule: Schedule[] = selectedTutor?.schedule || [];

    const schedule = fourteenDayRange.map(d => {
        const scheduleForDay = tutorSchedule.filter((tsd) => {
            const begin = moment(tsd.begin);
            const isDay = begin.day() === d.day();
            return isDay;
        })

        const slots = scheduleForDay.map(sfd => {
            const slots: Slot[] = [];
            const beginHour = moment(sfd.begin).get("hour");
            const endHour = moment(sfd.end).get("hour");
            const hourDifference = endHour - beginHour;

            for (var i = 0; i < hourDifference; i++) {
                slots.push({
                    begin: moment(d).set("hour", beginHour + i).set("minutes", 0).toString(),
                    end: moment(d).set("hour", beginHour + i + 1).set("minutes", 0).toString()
                })
            }

            return slots
        }).flat();

        return {
            date: d,
            slots
        }
    });

    const total = slots.length * (selectedTutor?.rate || 0);

    const config = {
        reference: `${(new Date()).getTime()}${paymentAttempts}`,
        email: studentLead?.email as string,
        amount: total * 100,
        //currency: "usd", TODO: Change currency to usd
        publicKey: REACT_APP_PAYSTACK_PUBLIC_KEY
    };

    const initializePayment = usePaystackPayment(config);

    const onPaystackSuccess = function() {
        const {reference: paystackReference, status} = arguments[0] as unknown as {reference: string, status: string};

        if (status !== 'success') {
            toast({
                title: 'An error occurred, please retry',
                status: 'error',
                position: 'top',
                isClosable: true
            })

            setPaymentInProgress(false);

            return
        }

        toast({
            title: 'Payment successful',
            status: 'success',
            position: 'top',
            isClosable: true
        })
        
        ApiService.createBooking({
            tutor,
            student: studentLeadId,
            course,
            slots,
            paystackReference
        }).then(resp => {
            resp.json().then(r => {
                setPaymentInProgress(false);
                window.location.href = `/booking/${r.bookingId}`
            })
        }).catch(e => {
            setPaymentInProgress(false);
        })
    };

    const onPaystackClose = () => {
        setPaymentInProgress(false);
    }

    const startPayment = async () => {
        setPaymentAttempts(p => p+1);
        setPaymentInProgress(true);
        initializePayment(onPaystackSuccess, onPaystackClose);
    }

    return <>
        <Header />
        {(loadingData || loadingCourses) && <Container variant={""} textAlign={"center"} my={20} maxW='container.xl'><Spinner thickness='4px' speed='0.65s' color='primary.500' size='xl' /></Container>}
        {!!studentLead && !!currentCourse && <Root>
            <Container my={20} maxW='container.xl'>
                <Heading fontSize={"3xl"}>Hey {capitalize(studentLead.name.first)},<br />We've found just the right tutors for you!</Heading>
                <Box display={{ lg: 'flex' }} gap="16px">
                    <Box width={['100%', '100%', '100%', '65%']} flexShrink={0}>
                        <Panel marginTop={30}>
                            <Box>
                                <Box p={4} pb={0}>
                                    <Heading fontSize={"larger"}>
                                        1. Choose a tutor
                                    </Heading>
                                    <Text variant={"muted"} fontSize="medium" mt={"5px"}>We've carefully matched you with tutors who have extensive experience in {currentCourse.title} and can help you reach your goals.</Text>
                                </Box>
                                <Box marginTop={30}>
                                    <TutorSelect value={tutor} options={matchedTutors} onChange={(v) => confirmBookingStore.set.tutor(v)} />
                                </Box>
                            </Box>
                            <Box p={4} marginTop={30}>
                                <Heading fontSize={"larger"}>
                                    2. Select an open slot on {selectedTutor ? `${capitalize(selectedTutor.name.first)}'s` : "your tutor's"} calendar
                                </Heading>
                                <Box position={"relative"} marginTop={30}>
                                    {!!!selectedTutor && <TutorCalendarBlocker>
                                        <Text variant={"muted"} as="small">Choose a tutor to view their calendar</Text>
                                    </TutorCalendarBlocker>}
                                    <Scheduler schedule={schedule} value={slots} onChange={(v) => confirmBookingStore.set.slots(v)} />
                                </Box>
                            </Box>
                        </Panel>
                    </Box>
                    <Box width={['100%', '100%', '100%', '35%']}>
                        <Panel position={"sticky"} top="16px" marginTop={30} p={4}>
                            <Heading fontSize={"larger"}>Summary</Heading>
                            {!!selectedTutor && !isEmpty(slots) ? <Box mt={17}>
                                <Wrap width={"100%"}>
                                    <WrapItem width={"100%"}>
                                        <HStack justifyContent={"space-between"} width="100%">
                                            <HStack><FiUser style={{ flexShrink: 0 }} color={theme.colors.gray[600]} /> <Text color={"gray.600"}>Tutor</Text></HStack>
                                            <HStack color={"gray.600"}><Text fontWeight={500}>{selectedTutor.name.first} {selectedTutor.name.last}</Text></HStack>
                                        </HStack>
                                    </WrapItem>
                                    <WrapItem width={"100%"}>
                                        <HStack justifyContent={"space-between"} width="100%">
                                            <HStack><FiBookOpen style={{ flexShrink: 0 }} color={theme.colors.gray[600]} /> <Text color={"gray.600"}>Class</Text></HStack>
                                            <HStack color={"gray.600"}><Text fontWeight={500}>{currentCourse.title}</Text></HStack>
                                        </HStack>
                                    </WrapItem>
                                    <Divider />
                                    {slots.map(s => <WrapItem key={s.begin} width={"100%"}>
                                        <HStack justifyContent={"space-between"} width="100%">
                                            <HStack><FiClock style={{ flexShrink: 0 }} color={theme.colors.gray[600]} /> <Text color={"gray.600"}>{moment(s.begin).format("MMM Do")} {moment(s.begin).format("h:mm A")} - {moment(s.end).format("h:mm A")}</Text></HStack>
                                            <HStack color={"gray.600"}><Text fontWeight={500}>${selectedTutor.rate}</Text></HStack>
                                        </HStack>
                                    </WrapItem>)}
                                    <Divider />
                                    <WrapItem width={"100%"}>
                                        <HStack justifyContent={"space-between"} width="100%">
                                            <HStack><Text fontWeight={600} fontSize="large">Total</Text></HStack>
                                            <HStack><Text fontWeight={500} fontSize="large">${total}</Text></HStack>
                                        </HStack>
                                    </WrapItem>
                                </Wrap>
                                <Box mt={3}>
                                    <Button isLoading={paymentInProgress} onClick={startPayment} size={"lg"} variant={"looney"} width="100%">Continue to payment</Button>
                                </Box>
                            </Box> : <Box paddingBlock={4} textAlign={"center"}>
                                <Text as="small" variant={"muted"}>Choose a tutor &amp; select time slots to view your summary</Text>
                            </Box>}
                        </Panel>
                    </Box>
                </Box>
            </Container>
        </Root>}
    </>
}

export default BookSession;