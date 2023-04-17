import React, { useCallback, useEffect, useMemo, useState } from 'react';
import StepIndicator from '../components/StepIndicator';
import { FiUser, FiCalendar, FiBookOpen, FiEdit } from "react-icons/fi";
import { Box, FormLabel, Heading, Input, Text, CircularProgress, Link, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Button, VStack, StackDivider, Flex, IconButton } from '@chakra-ui/react';
import StepWizard, { StepWizardProps } from 'react-step-wizard';
import LargeSelect from '../components/LargeSelect';
import OnboardStep from '../components/OnboardStep';
import onboardStudentStore from '../state/onboardStudentStore';
import CourseSelect from '../components/CourseSelect';
import { capitalize, isEmpty } from 'lodash';
import ScheduleBuilder from '../components/ScheduleBuilder';
import OnboardSubmitStep from '../components/OnboardSubmitStep';
import Lottie from 'lottie-react';

import lottieSuccessAnimationData from "../lottie/73392-success.json";
import { useTitle } from '../hooks';
import ApiService from '../services.ts/ApiService';
import TimezoneSelect from '../components/TimezoneSelect';

import moment from 'moment';
import EmptyState from '../components/EmptyState';

import DateInput, { FORMAT } from '../components/DateInput';
import { Course, Schedule } from '../types';
import { formatContentFulCourse, getContentfulClient } from '../contentful';

const client = getContentfulClient();

const OnboardStudent = () => {
    const [courseList, setCourseList] = useState<Course[]>([]);
    const [loadingCourses, setLoadingCourses] = useState(false);
    const [activeStep, setActiveStep] = useState<number>(1);

    const [editModalStep, setEditModalStep] = useState<string | null>(null);
    const { isOpen: editModalOpen, onOpen: onEditModalOpen, onClose: onEditModalClose } = useDisclosure();

    const onStepChange: StepWizardProps["onStepChange"] = ({ activeStep }) => {
        setActiveStep(activeStep);
    }

    const data = onboardStudentStore.useStore();
    const { parentOrStudent, name, dob, email, courses, schedule, tz } = data;

    const dobValid = moment(dob, FORMAT, true).isValid();
    const age = useMemo(() => moment().diff(moment(dob, FORMAT), 'years'), [dob]);

    const validateParentStudentStep = !!parentOrStudent;
    const validateNameStep = !!name.first && !!name.last;
    const validateDobStep = !!dob && !(age < 13 && parentOrStudent === "student") && dobValid;
    const validateEmailStep = !!email;
    const validateCoursesStep = !isEmpty(courses);
    const validateScheduleStep = !isEmpty(schedule) && !!tz;

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

    const stepIndicatorSteps = [
        {
            title: "About you",
            icon: <FiUser />,
            id: 'about-you'
        },
        {
            title: "Classes",
            icon: <FiBookOpen />,
            id: 'classes'
        },
        {
            title: "Availability",
            icon: <FiCalendar />,
            id: 'availability'
        }
    ]

    const confirmations = [
        {
            title: 'About you',
            fields: [
                {
                    title: 'First Name',
                    value: <Text>{name.first}</Text>,
                    step: 'name',
                },
                {
                    title: 'Last Name',
                    value: <Text>{name.last}</Text>,
                    step: 'name',
                },
                {
                    title: 'Date of Birth',
                    value: <Text>{moment(dob, FORMAT).format("MMMM Do YYYY")}</Text>,
                    step: 'dob',
                },
                {
                    title: 'Email Address',
                    value: <Text>{email}</Text>,
                    step: 'email',
                },
            ]
        },
        {
            title: "Classes",
            fields: [
                {
                    title: 'Classes',
                    value: <Text>{courses.map(tc => {
                        return courseList.find(ac => ac.id === tc)?.title;
                    }).join(', ')}</Text>,
                    step: 'classes',
                }
            ]
        },
        {
            title: 'Availability',
            fields: [
                {
                    title: 'Time zone',
                    value: <Text>{tz}</Text>,
                    step: 'availability',
                },
                {
                    title: 'Schedule',
                    value: <Text whiteSpace={'pre'}>{schedule.map((s: Schedule) => {
                        return `${moment(s.begin).format('dddd')}: ${moment(s.begin).tz(tz).format('hh:mm A')} - ${moment(s.end).tz(tz).format('hh:mm A')}`
                    }).join("\n")}</Text>,
                    step: 'availability',
                }
            ]
        }
    ]

    const steps = [
        {
            id: 'parent-or-student',
            stepIndicatorId: 'about-you',
            template: <Box>
                <Heading as='h2' size='lg' textAlign={"center"}>
                    Are you a parent or student?
                </Heading>
                <Box marginTop={30}>
                    <LargeSelect value={parentOrStudent} onChange={(v) => onboardStudentStore.set.parentOrStudent(v)} options={[
                        {
                            value: "parent",
                            title: "Parent",
                            subtitle: "Choose this if you're signing up on behalf of someone else"
                        },
                        {
                            value: "student",
                            title: "Student",
                            subtitle: "Choose this if you're signing up for yourself"
                        }
                    ]} />
                </Box>
            </Box>,
            canSave: validateParentStudentStep
        },
        {
            id: 'name',
            stepIndicatorId: 'about-you',
            template: <Box>
                <Heading as='h2' size='lg' textAlign={"center"}>
                    First we need some information about you.<br />
                    What's your name?
                </Heading>
                <Box marginTop={30}>
                    <FormLabel>
                        First name
                        <Input value={name.first} onChange={(e) => onboardStudentStore.set.name({ ...name, first: e.target.value })} />
                    </FormLabel>
                    <FormLabel>
                        Last name
                        <Input value={name.last} onChange={(e) => onboardStudentStore.set.name({ ...name, last: e.target.value })} />
                    </FormLabel>
                </Box>
            </Box>,
            canSave: validateNameStep
        },
        {
            id: 'dob',
            stepIndicatorId: 'about-you',
            template: <Box>
                <Heading as='h2' size='lg' textAlign={"center"}>
                    Nice to meet you, <Text as="span" textTransform="capitalize">{name.first}</Text>!<br />What's your date of birth?
                </Heading>
                <Box marginTop={30}>
                    {(!dobValid) || !(age < 13 && parentOrStudent === "student") ? <FormLabel>
                        Date of birth
                        <DateInput
                            value={dob}
                            onChange={(v) => {
                                onboardStudentStore.set.dob(v)
                            }}
                        />
                    </FormLabel> : <EmptyState title="Uh oh!" subtitle={<>Looks like you're not quite old enough to sign up on your own just yet. Don't worry though, we've got you covered! Ask your parent or guardian to <Link href='/onboard/student' color='primary.600'>sign up</Link> on your behalf and start learning with us today.</>} image={<img alt="uh oh!" style={{ height: "80px" }} src="/images/empty-state-no-content.png" />} action={<Button onClick={() => {
                        onboardStudentStore.set.dob('')
                    }} variant={"ghost"}>Change Date of Birth</Button>} />}
                </Box>
            </Box>,
            canSave: validateDobStep
        },
        {
            id: 'email',
            stepIndicatorId: 'about-you',
            template: <Box>
                <Heading as='h2' size='lg' textAlign={"center"}>
                    We'll need your email address as well
                </Heading>
                <Box marginTop={30}>
                    <FormLabel>
                        Email address
                        <Input value={email} onChange={(e) => onboardStudentStore.set.email(e.target.value)} type="email" />
                    </FormLabel>
                </Box>
            </Box>,
            canSave: validateEmailStep
        },
        {
            id: 'classes',
            stepIndicatorId: 'classes',
            template: <Box>
                <Heading as='h2' size='lg' textAlign={"center"}>
                    {parentOrStudent === "parent" ? "What classes are your child interested in?" : "What classes are you interested in?"}
                </Heading>
                <Box marginTop={30}>
                    <CourseSelect multi value={courses} onChange={(v) => onboardStudentStore.set.courses(v)} options={courseList.map(c => {
                        return {...c, value: c.id}
                    })} />
                </Box>
            </Box>,
            canSave: validateCoursesStep
        },
        {
            id: 'availability',
            stepIndicatorId: 'availability',
            template: <Box>
                <FormLabel m={0}>
                    Timezone
                    <TimezoneSelect value={tz} onChange={(v) => onboardStudentStore.set.tz(v.value)} />
                </FormLabel>
                <Box mt={"40px"}>
                    <ScheduleBuilder value={schedule} onChange={(v) => onboardStudentStore.set.schedule(v)} />
                </Box>
            </Box>,
            canSave: validateScheduleStep
        },
        {
            id: 'confirm',
            template: <Box>
                <Heading as='h2' size='lg' textAlign={"center"}>
                    Review Your Information
                </Heading>
                <Box marginTop={30}>
                    <VStack alignItems={"stretch"} spacing={5}>
                        {
                            confirmations.map(c => <Box key={c.title}>
                                <Heading size={'md'} marginBottom={5}>{c.title}</Heading>
                                <VStack divider={<StackDivider borderColor='gray.200' />} alignItems={"stretch"}>
                                    {
                                        c.fields.map(f => {
                                            return <Flex key={f.title}>
                                                <Flex flexDirection={'column'} justifyContent="center" flexGrow={1}>
                                                    {!!f.title && <Heading textTransform={"capitalize"} size={"sm"}>{f.title}</Heading>}
                                                    {f.value}
                                                </Flex>
                                                <IconButton
                                                    variant='ghost'
                                                    aria-label='Edit'
                                                    onClick={() => openEditModal(f.step)}
                                                    icon={<FiEdit />}
                                                />
                                            </Flex>
                                        })
                                    }
                                </VStack></Box>)
                        }
                    </VStack>
                </Box>
            </Box>,
            canSave: true,
        },
    ]

    const doSubmit = () => {
        return ApiService.submitStudentLead(data);
    }

    const openEditModal = (stepId: string) => {
        onEditModalOpen();
        setEditModalStep(stepId);
    }

    const stepIndicatorActiveStep = stepIndicatorSteps.find(s => s.id === steps[activeStep - 1]?.stepIndicatorId);

    useTitle(stepIndicatorActiveStep?.title || '');

    const canSaveCurrentEditModalStep = steps.find(s => s.id === editModalStep)?.canSave;

    return <Box>
        <Modal closeOnEsc={canSaveCurrentEditModalStep} closeOnOverlayClick={canSaveCurrentEditModalStep} size='xl' isOpen={editModalOpen} onClose={onEditModalClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader><br /></ModalHeader>
                <ModalCloseButton isDisabled={!canSaveCurrentEditModalStep} />
                <ModalBody>
                    {steps.find(s => s.id === editModalStep)?.template}
                </ModalBody>

                <ModalFooter>
                    <Button isDisabled={!canSaveCurrentEditModalStep} variant='looney' onClick={onEditModalClose}>Done</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
        <StepIndicator activeStep={stepIndicatorSteps.findIndex(s => s === stepIndicatorActiveStep)} steps={stepIndicatorSteps} />
        <Box mt={45}>
            <StepWizard isLazyMount className='flex-col-reverse' onStepChange={onStepChange}>
                {
                    steps.map(s => {
                        return <OnboardStep key={s.id} canGoNext={s.canSave}>
                            {s.template}
                        </OnboardStep>
                    }) as unknown as JSX.Element
                }
                <OnboardSubmitStep submitFunction={doSubmit}>
                    <Box textAlign="center">
                        <CircularProgress isIndeterminate />
                    </Box>
                </OnboardSubmitStep>
                <OnboardStep canGoNext={false} hideNav={true}>
                    <Box paddingBottom={5}>
                        <Box>
                            <Lottie style={{ height: 100 }} animationData={lottieSuccessAnimationData} />
                        </Box>
                        <Heading as='h2' size='lg' textAlign={"center"}>
                            You're all set {capitalize(name.first)}!
                        </Heading>
                        <Text color="gray.500" marginTop={2} textAlign="center">We'll match you with the best tutors around &amp; we'll shoot you an email at {email} when we're done!</Text>
                    </Box>
                </OnboardStep>
            </StepWizard>
        </Box>
    </Box>
}

export default OnboardStudent;