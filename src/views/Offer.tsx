import { Alert, AlertDescription, AlertIcon, Box, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Button, FormControl, FormErrorMessage, FormLabel, Heading, HStack, Input, InputGroup, InputLeftAddon, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalOverlay, SimpleGrid, Spinner, Text, Textarea, useDisclosure, VStack } from '@chakra-ui/react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FiArrowRight, FiChevronRight } from 'react-icons/fi';
import { RiMoneyDollarCircleFill } from 'react-icons/ri';
import { BsBookmarkStarFill } from 'react-icons/bs';
import { MdInfo } from 'react-icons/md';
import { useNavigate, useParams } from 'react-router';
import styled from 'styled-components';
import ButtonGroup from '../components/ButtonGroup';
import { BsQuestionCircleFill } from 'react-icons/bs';
import PageTitle from '../components/PageTitle';
import Panel from '../components/Panel';
import Select, { Option } from '../components/Select';
import TimePicker from '../components/TimePicker';
import LinedList from '../components/LinedList';
import { Field, FieldProps, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { numberToDayOfWeekName, ServiceFeePercentage } from '../util';
import LargeSelect from '../components/LargeSelect';
import theme from '../theme';
import TutorCard from '../components/TutorCard';
import ApiService from '../services/ApiService';
import { Course, Offer as OfferType } from '../types';
import { formatContentFulCourse, getContentfulClient } from '../contentful';
import { useTitle } from '../hooks';

const LeftCol = styled(Box)`
background: #FFF;
padding: 32px;
min-height: 100vh;
`

const OfferValueText = styled(Text)`
cursor: pointer;
font-weight: 500;
font-size: 14px;
line-height: 20px;
letter-spacing: -0.001em;
color: ${theme.colors.text[200]};
margin-bottom: 0;
`

const RightCol = styled(Box)`
padding-inline: 24px;
`

const Root = styled(Box)`
`

export const scheduleOptions = [
    {
        label: 'Weekly',
        value: 'weekly',
    },
    {
        label: 'Twice a week',
        value: 'twice-a-week'
    },
    {
        label: 'Fortnightly',
        value: 'fortnightly'
    },
    {
        label: 'Monthly',
        value: 'monthly'
    }
]

const client = getContentfulClient();

const Offer = () => {
    useTitle('Offer');

    const { offerId } = useParams() as { offerId: string };

    const navigate = useNavigate();
    const [loadingOffer, setLoadingOffer] = useState(false);
    const [offer, setOffer] = useState<OfferType | null>(null);
    const [courseList, setCourseList] = useState<Course[]>([]);
    const [loadingCourses, setLoadingCourses] = useState(false);

    const { isOpen: isOfferAcceptedModalOpen, onOpen: onOfferAcceptedModalOpen, onClose: onOfferAcceptedModalClose } = useDisclosure();

    const loadOffer = useCallback(async () => {
        setLoadingOffer(true);

        try {
            const resp = await ApiService.getOffer(offerId);
            setOffer(await resp.json());
        } catch (e) {

        }

        setLoadingOffer(false);
    }, [])

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
        loadOffer();
    }, []);

    const loading = loadingOffer;

    return <Root className='container-fluid'>
        <Box className='row'>
            <LeftCol className='col-md-8'>
                {loading && <Box textAlign={'center'}><Spinner /></Box>}
                {!!offer && <Box>
                    <Modal isOpen={isOfferAcceptedModalOpen} onClose={onOfferAcceptedModalClose}>
                        <ModalOverlay />
                        <ModalContent>
                            <ModalBody>
                                <Box w={'100%'} mt={5} textAlign='center'>
                                    <Box display={'flex'} justifyContent='center'>
                                        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <circle cx="20" cy="20" r="20" fill="#EDF7EE" />
                                            <path d="M18.0007 23.1709L27.1931 13.9785L28.6073 15.3927L18.0007 25.9993L11.6367 19.6354L13.0509 18.2212L18.0007 23.1709Z" fill="#4CAF50" />
                                        </svg>

                                    </Box>
                                    <Box marginTop={3}>
                                        <Text className='modal-title'>Offer successfully sent</Text>
                                        <div style={{ color: theme.colors.text[400] }}>lorem</div>
                                    </Box>
                                </Box>
                            </ModalBody>

                            <ModalFooter>
                                <Button onClick={() => navigate('/dashboard')}>Send a message</Button>
                            </ModalFooter>
                        </ModalContent>
                    </Modal>

                    <Breadcrumb spacing='8px' separator={<FiChevronRight size={10} color='gray.500' />}>
                        <BreadcrumbItem>
                            <BreadcrumbLink href='#'>Offers</BreadcrumbLink>
                        </BreadcrumbItem>

                        <BreadcrumbItem isCurrentPage>
                            <BreadcrumbLink href='#'>Review offer</BreadcrumbLink>
                        </BreadcrumbItem>
                    </Breadcrumb>
                    <PageTitle marginTop={'28px'} mb={10} title='Review Offer' subtitle={`Respond to offer from clients, you may also choose to renegotiate`} />
                    <Panel mt={'32px'}>
                        <Text className='sub1' mb={0}>Offer Details</Text>
                        <Box mt={8}>
                            <VStack spacing={'24px'} alignItems='flex-start'>
                                <Box>
                                    <FormLabel>Subject & Level</FormLabel>
                                    <OfferValueText>{offer.subjectAndLevel}</OfferValueText>
                                </Box>
                                <Box>
                                    <FormLabel>What days would you like to have your classes</FormLabel>
                                    <OfferValueText>{offer.days.map(d => numberToDayOfWeekName(d)).join(', ')}</OfferValueText>
                                </Box>
                                <Box>
                                    <FormLabel>Frequency of class sessions</FormLabel>
                                    <OfferValueText>{scheduleOptions.find(so => so.value === offer.schedule)?.label}</OfferValueText>
                                </Box>
                                <Box>
                                    <FormLabel>Time</FormLabel>
                                    <OfferValueText display='flex' gap='1px' alignItems='center'>{offer.startTime} <FiArrowRight color='#6E7682' size={'15px'} /> {offer.endTime}</OfferValueText>
                                </Box>
                                <Box>
                                    <FormLabel>Note</FormLabel>
                                    <OfferValueText>{offer.note || '-'}</OfferValueText>
                                </Box>
                            </VStack>
                        </Box>
                    </Panel>
                    <Panel mt={'32px'}>
                        <Text className='sub1' mb={0}>Payment Details</Text>
                        <Box mt={8}>
                            <VStack spacing={'24px'} alignItems='flex-start'>
                                <Box>
                                    <FormLabel>Hourly rate</FormLabel>
                                    <OfferValueText>${offer.rate}/hr</OfferValueText>
                                    <Text color='text.300' mt={'10px'} mb={0} fontSize='12px' fontWeight={'500'}>Shepherd charges a <Box color='primary.400' as={'span'}>{ServiceFeePercentage * 100}% service fee (-${offer.rate * ServiceFeePercentage}/hr)</Box></Text>
                                </Box>
                                <Box>
                                    <FormLabel>You’ll receive</FormLabel>
                                    <OfferValueText>${offer.rate - (offer.rate * ServiceFeePercentage)}/hr</OfferValueText>
                                </Box>
                                <Box>
                                    <FormLabel>Total amount</FormLabel>
                                    <OfferValueText>{offer.rate}</OfferValueText>
                                    <Text color='text.300' mt={'10px'} mb={0} fontSize='12px' fontWeight={'500'}>This will be paid in full at the end of a month  after the start of the contract</Text>
                                </Box>
                            </VStack>
                        </Box>
                        <Alert status='info' mt='22px'>
                            <AlertIcon><MdInfo color={theme.colors.primary[500]} /></AlertIcon>
                            <AlertDescription>Initial payment will not be made until after the client reviews the offer after the first session. The client may decide to continue with you or withdraw the offer</AlertDescription>
                        </Alert>
                    </Panel>
                </Box>}
            </LeftCol>
            <div className='col-md-4'>
                <RightCol height='100%'>
                    <Panel borderRadius={'10px'} position={"sticky"} top="90px">
                        <img src='/images/file.svg' width={'80px'} height={'80px'} />

                    </Panel>
                </RightCol>
            </div>
        </Box >
    </Root >

}

export default Offer;