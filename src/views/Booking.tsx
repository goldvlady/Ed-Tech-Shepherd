import { Box, Container, Heading, Spinner, Text, VStack } from '@chakra-ui/react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router';
import styled from 'styled-components';
import Header from '../components/Header';
import Panel from '../components/Panel';
import ApiService from '../services.ts/ApiService';
import { Booking as BookingType, Course, Slot } from '../types';
import { useTitle } from '../hooks';
import TutorCard from '../components/TutorCard';
import Session from '../components/Session';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import StripeCheckoutForm from '../components/StripeCheckoutForm';
import { formatContentFulCourse, getContentfulClient } from '../contentful';

const TutorSide = styled('aside')`
height: 100%;
max-width: 400px;
margin: 0 auto;
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

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY as string);

const Booking = () => {
    useTitle("Booking");

    const { bookingId } = useParams();

    const [loadingData, setLoadingData] = useState(true);

    const [booking, setBooking] = useState<BookingType | null>(null);

    const url: URL = new URL(window.location.href);
    const params: URLSearchParams = url.searchParams;
    const clientSecret = params.get('payment_intent_client_secret');

    const getData = async () => {
        try {
            const resp = await ApiService.getBooking(bookingId as string);
            const data = await resp.json();
            setBooking(data);
        } catch (e) {
        }
        setLoadingData(false);
    }

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

    const currentCourse = useMemo(() => {
        return courseList.find(c => c.id === booking?.course);
    }, [booking])

    useEffect(() => {
        getData();
    }, []);


    return <>
        <Header />
        <Box display={"none"}>
        {!!clientSecret && <Elements options={{ clientSecret: clientSecret, appearance: { theme: 'stripe' } }} stripe={stripePromise}>
            <StripeCheckoutForm checkPaymentIntentStatus={true} clientSecret={clientSecret} returnUrl={window.location.href} />
        </Elements>}
        </Box>
        {(loadingData || loadingCourses) && <Container variant={""} textAlign={"center"} my={20} maxW='container.xl'><Spinner thickness='4px' speed='0.65s' color='primary.500' size='xl' /></Container>}
        {!!booking && !!currentCourse && <Root>
            <Container my={20} maxW='container.xl'>
                <Heading fontSize={"3xl"}>Hey {booking.studentLead.name.first},<br />Here's your booking information</Heading>
                <Box display={{ lg: 'flex' }} gap="16px">
                    <Box width={['100%', '100%', '100%', '65%']} flexShrink={0}>
                        <Panel marginTop={30}>
                            <Box p={4} pb={0}>
                                <Box>
                                    <Heading fontSize={"larger"}>
                                        Your Course
                                    </Heading>
                                </Box>
                                <Box marginTop={2}>
                                    <Text lineHeight={"1"}>{currentCourse.title}</Text>
                                </Box>
                            </Box>
                            <Box p={4} pb={0} marginTop={30}>
                                <Box>
                                    <Heading fontSize={"larger"}>
                                        Your tutor
                                    </Heading>
                                </Box>
                                <Box marginTop={2} maxWidth="400px">
                                    <TutorCard tutor={booking.tutorLead} />
                                </Box>
                            </Box>
                            <Box p={4} marginTop={30}>
                                <Heading fontSize={"larger"}>
                                    Sessions
                                </Heading>
                                <Box position={"relative"} marginTop={2}>
                                    <VStack>
                                        {
                                            booking.slots.map(s => <Session key={s.begin as unknown as string} slot={s as unknown as Slot} url={booking.conferenceRoomUrl as string} />)
                                        }
                                    </VStack>
                                </Box>
                            </Box>
                        </Panel>
                    </Box>
                </Box>
            </Container>
        </Root>}
    </>
}

export default Booking;