import { Booking } from '../types';
import { Box, Spinner, Text } from '@chakra-ui/react';
import { FiArrowRight } from 'react-icons/fi';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router';
import ApiService from '../services/ApiService';
import Header from '../components/Header';
import moment from "moment-timezone";
import styled from 'styled-components';
import theme from '../theme';
import userStore from '../state/userStore';

const SchedulePill = styled(Box)`
background: #F1F2F3;
border-radius: 6px;
padding: 4px 6px;
gap: 4px;
color: ${theme.colors.text[400]};
display: flex;
justify-content: center;
align-items: center;
`

const Root = styled(Box)`
background: #FFF;
min-height: 100vh;
min-width: 100vw;
display: flex;
flex-direction: column;
`

const Session = () => {
    const { user } = userStore();
    const { bookingId } = useParams();

    const [booking, setBooking] = useState<Booking | null>(null);
    const [loadingBooking, setLoadingBooking] = useState(false);

    const loadBooking = async () => {
        setLoadingBooking(true);

        try {
            const resp = await ApiService.getBooking(bookingId as string);
            setBooking(await resp.json());
        } catch (e) {

        }
        setLoadingBooking(false);
    }

    const isStudent = user?.type === 'student';
    const tz = isStudent ? user.studentLead?.tz : user?.tutorLead?.tz;

    useEffect(() => {
        loadBooking();
    }, []);

    const roomUrl = useMemo(() => {
        if (!booking) {
            return ''
        }
    
        const url = isStudent ? booking.conferenceHostRoomUrl : booking.conferenceHostRoomUrl;
        const urlParams = new URLSearchParams(url);
        urlParams.set('roomIntegrations', 'on');
        urlParams.set('displayName', `${user?.name.first} ${user?.name.last}`);
        return `${url}?${urlParams.toString()}`;
    }, [booking])

    return <Root>
        <Header left={
            booking && <Box display='flex' flexDirection='row' gap='12px' alignItems='center'>
                <Box display='flex' justifyContent='center'><Text className='sub2' m={0}>{booking?.offer.subject} Lesson</Text></Box>
                <SchedulePill className='body2'>{moment(booking.startDate).tz(tz as string).format('hh:mm A')} <FiArrowRight color='#6E7682' size={'15px'} /> {moment(booking.endDate).tz(tz as string).format('hh:mm A')}</SchedulePill>
            </Box>
        } />
        {loadingBooking && <Box display='flex' justifyContent='center' py='20px'>
            <Spinner />
        </Box>}
        {booking && <iframe src={roomUrl} allow="camera; microphone; fullscreen; speaker; display-capture" style={{ width: '100%', flexGrow: 1 }}></iframe>}
    </Root>
}

export default Session;