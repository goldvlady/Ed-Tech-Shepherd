import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FiUser, FiCalendar, FiBookOpen, FiEdit } from "react-icons/fi";
import { Box, FormLabel, Heading, Input, Text, CircularProgress, Link, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Button, VStack, StackDivider, Flex, IconButton, FormControl } from '@chakra-ui/react';
import StepWizard, { StepWizardChildProps, StepWizardProps } from 'react-step-wizard';
import LargeSelect from '../components/LargeSelect';
import OnboardStep from '../components/OnboardStep';
import onboardStudentStore from '../state/onboardStudentStore';
import CourseSelect from '../components/CourseSelect';
import { capitalize, isEmpty, without } from 'lodash';
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
import { getOptionValue } from '../util';
import theme from '../theme';
import styled from 'styled-components';
import { useLocation } from 'react-router';
import mixpanel from 'mixpanel-browser';
import Select from '../components/Select';
import StepIndicator from '../components/StepIndicator';

const client = getContentfulClient();

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

const SkillLevelImg = styled.div`
height: 30px;
width: 30px;
background: white;
border-radius: 100%;
border: 0.6px solid #EAEAEB;
object-fit: scale-down;
padding: 8px;
align-items: center;
flex-shrink: 0;
`

const SkillLevel = styled.div`
display: flex;
gap: 8px;
align-items: center;
&:hover,
.active {
    ${SkillLevelImg} {
        box-shadow: 0px 2px 10px rgba(63, 81, 94, 0.1);
    }
}
`

const skillLevelOptions = [
    {
        label: <SkillLevel><SkillLevelImg><img src='/images/beginner.png' /></SkillLevelImg> Beginner</SkillLevel>,
        value: "beginner"
    },
    {
        label: <SkillLevel><SkillLevelImg><img src='/images/intermediate.png' /></SkillLevelImg> Intermediate</SkillLevel>,
        value: "intermediate"
    },
    {
        label: <SkillLevel><SkillLevelImg><img src='/images/advanced.png' /></SkillLevelImg> Advanced</SkillLevel>,
        value: "advanced"
    }
];

const OnboardStudent = () => {
    const location = useLocation();

    const stepWizardInstance = useRef<StepWizardChildProps | null>(null);

    const { isOpen: isSomethingElseModalOpen, onOpen: onSomethingElseModalOpen, onClose: onSomethingElseModalClose } = useDisclosure()
    const [courseList, setCourseList] = useState<Course[]>([]);
    const [loadingCourses, setLoadingCourses] = useState(false);
    const [activeStep, setActiveStep] = useState<number>(1);

    const [editModalStep, setEditModalStep] = useState<string | null>(null);
    const { isOpen: editModalOpen, onOpen: onEditModalOpen, onClose: onEditModalClose } = useDisclosure();

    const onStepChange: StepWizardProps["onStepChange"] = ({ activeStep, ...rest }) => {
        setActiveStep(activeStep);
    }

    const data = onboardStudentStore.useStore();
    const { parentOrStudent, name, dob, email, courses, somethingElse, schedule, tz, gradeLevel, topic, skillLevels } = data;

    useEffect(() => {
        const preSelectedCourse = new URLSearchParams(location.search).get('course');
        if (preSelectedCourse) {
            setTimeout(() => {
                onboardStudentStore.set.courses([preSelectedCourse]);
            }, 0);
        }
    }, []);

    const dobValid = moment(dob, FORMAT, true).isValid();
    const age = useMemo(() => moment().diff(moment(dob, FORMAT), 'years'), [dob]);

    const validateParentStudentStep = !!parentOrStudent;
    const validateAboutYouStep = !!name.first && !!name.last && !!email && dobValid && !!dob;
    const validateCoursesStep = !isEmpty(courses);
    const validateScheduleStep = !isEmpty(schedule) && !!tz;

    const validateCourseSupplementaryStep = useMemo(() => !courses.map(c => {
        if (c === 'maths') {
            return !!gradeLevel && !!topic;
        } else {
            return !courses.filter(c => c !== 'maths').map(c => {
                return !!skillLevels.find(sl => sl.course === c)
            }).includes(false);
        }
    }).includes(false), [courses, skillLevels, gradeLevel, topic]);

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

    useEffect(() => {
        if (somethingElse) {
            if (!courses.includes('something-else')) {
                onboardStudentStore.set.courses([...courses, 'something-else']);
            }
        } else {
            onboardStudentStore.set.courses(without(courses, 'something-else'));
        }
    }, [somethingElse]);

    const confirmations = [
        {
            title: 'About you',
            fields: [
                {
                    title: 'First Name',
                    value: <Text marginBottom={0}>{name.first}</Text>,
                    step: 'about-you',
                },
                {
                    title: 'Last Name',
                    value: <Text marginBottom={0}>{name.last}</Text>,
                    step: 'about-you',
                },
                {
                    title: 'Date of Birth',
                    value: <Text marginBottom={0}>{moment(dob, FORMAT).format("MMMM Do YYYY")}</Text>,
                    step: 'about-you',
                },
                {
                    title: 'Email Address',
                    value: <Text marginBottom={0}>{email}</Text>,
                    step: 'about-you',
                },
            ]
        },
        {
            title: "Classes",
            fields: [
                {
                    title: 'Classes',
                    value: <Text marginBottom={0}>{courses.map(tc => {
                        return tc === 'something-else' ? somethingElse : courseList.find(ac => ac.id === tc)?.title;
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
                    value: <Text marginBottom={0}>{tz}</Text>,
                    step: 'availability',
                },
                {
                    title: 'Schedule',
                    value: <Text marginBottom={0} whiteSpace={'pre'}>{schedule.map((s: Schedule) => {
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
                <Heading as='h3' textAlign={"center"}>
                    Who is signing up?
                </Heading>
                <Box marginTop={30}>
                    <LargeSelect value={parentOrStudent} onChange={(v) => onboardStudentStore.set.parentOrStudent(v)} options={[
                        {
                            value: "parent",

                            title: "Parent or Guardian",
                            subtitle: "Choose this if you're signing up on behalf of someone else",
                            icon: <svg width="16.7" height="16.7" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9 7.33329C10.8409 7.33329 12.3333 5.84091 12.3333 3.99996C12.3333 2.15901 10.8409 0.666626 9 0.666626C7.15905 0.666626 5.66666 2.15901 5.66666 3.99996C5.66666 5.84091 7.15905 7.33329 9 7.33329ZM3.58333 9.83329C4.73392 9.83329 5.66666 8.90054 5.66666 7.74996C5.66666 6.59937 4.73392 5.66663 3.58333 5.66663C2.43274 5.66663 1.5 6.59937 1.5 7.74996C1.5 8.90054 2.43274 9.83329 3.58333 9.83329ZM16.5 7.74996C16.5 8.90054 15.5672 9.83329 14.4167 9.83329C13.2661 9.83329 12.3333 8.90054 12.3333 7.74996C12.3333 6.59937 13.2661 5.66663 14.4167 5.66663C15.5672 5.66663 16.5 6.59937 16.5 7.74996ZM9 8.16663C11.3012 8.16663 13.1667 10.0321 13.1667 12.3333V17.3333H4.83333V12.3333C4.83333 10.0321 6.69881 8.16663 9 8.16663ZM3.16666 12.3332C3.16666 11.7558 3.25056 11.198 3.40681 10.6713L3.26553 10.6836C1.80419 10.842 0.666664 12.0798 0.666664 13.5832V17.3332H3.16666V12.3332ZM17.3333 17.3332V13.5832C17.3333 12.0315 16.1216 10.7627 14.5932 10.6713C14.7494 11.198 14.8333 11.7558 14.8333 12.3332V17.3332H17.3333Z" />
                            </svg>

                        },
                        {
                            value: "student",
                            title: "Student",
                            subtitle: "Choose this if you're signing up for yourself",
                            icon: <svg width="16.7" height="16.7" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M10 0.833374C15.06 0.833374 19.1667 4.94004 19.1667 10C19.1667 15.06 15.06 19.1667 10 19.1667C4.94001 19.1667 0.833344 15.06 0.833344 10C0.833344 4.94004 4.94001 0.833374 10 0.833374ZM4.52139 13.1316C5.8666 15.1397 7.88719 16.4167 10.1464 16.4167C12.4056 16.4167 14.4262 15.1397 15.7714 13.1316C14.2978 11.7575 12.3203 10.9167 10.1464 10.9167C7.97254 10.9167 5.99505 11.7575 4.52139 13.1316ZM10 9.08337C11.5188 9.08337 12.75 7.85215 12.75 6.33337C12.75 4.81459 11.5188 3.58337 10 3.58337C8.48118 3.58337 7.25001 4.81459 7.25001 6.33337C7.25001 7.85215 8.48118 9.08337 10 9.08337Z" />
                            </svg>
                        }
                    ]} />
                </Box>
            </Box>,
            canSave: validateParentStudentStep
        },
        {
            id: 'about-you',
            stepIndicatorId: 'about-you',
            template: <Box>
                <Heading as='h3' size='lg' textAlign={"center"}>
                    First we need some information about you.<br />
                    What's your name?
                </Heading>
                <Box marginTop={30}>
                    <FormControl>
                        <FormLabel>First Name</FormLabel>
                        <Input size={'lg'} value={name.first} onChange={(e) => onboardStudentStore.set.name({ ...name, first: e.target.value })} />
                    </FormControl>
                    <FormControl>
                        <FormLabel marginTop={4}>Last Name</FormLabel>
                        <Input size={'lg'} value={name.last} onChange={(e) => onboardStudentStore.set.name({ ...name, last: e.target.value })} />
                    </FormControl>
                    <FormControl>
                        <FormLabel marginTop={4}>Email</FormLabel>
                        <Input size={'lg'} value={email} onChange={(e) => onboardStudentStore.set.email(e.target.value)} type="email" />
                    </FormControl>
                    <FormControl>
                        <FormLabel marginTop={4}>Date of Birth</FormLabel>
                        <DateInput
                            size={'lg'}
                            value={dob}
                            onChange={(v) => {
                                onboardStudentStore.set.dob(v)
                            }}
                        />
                    </FormControl>
                </Box>
            </Box>,
            canSave: validateAboutYouStep
        },
        {
            id: 'classes',
            stepIndicatorId: 'classes',
            template: <Box>
                {(!dobValid) || !(age < 13 && parentOrStudent === "student") ? <>
                    <Heading as='h3' size='lg' textAlign={"center"}>
                        {parentOrStudent === "parent" ? "What classes are your child interested in?" : "What classes are you interested in?"}
                    </Heading>
                    <Box marginTop={30}>
                        <Modal isOpen={isSomethingElseModalOpen} onClose={onSomethingElseModalClose}>
                            <ModalOverlay />
                            <ModalContent>
                                <ModalCloseButton />
                                <ModalBody>
                                    <Box>
                                        <Box>
                                            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <rect width="48" height="48" rx="7" transform="matrix(-1 -8.74228e-08 -8.74228e-08 1 48 0)" fill="#F4F8FE" />
                                                <path d="M24 34C18.4771 34 14 29.5228 14 24C14 18.4771 18.4771 14 24 14C29.5228 14 34 18.4771 34 24C34 29.5228 29.5228 34 24 34ZM23 27V29H25V27H23ZM25 25.3551C26.4457 24.9248 27.5 23.5855 27.5 22C27.5 20.067 25.933 18.5 24 18.5C22.302 18.5 20.8864 19.7092 20.5673 21.3135L22.5288 21.7058C22.6656 21.0182 23.2723 20.5 24 20.5C24.8284 20.5 25.5 21.1716 25.5 22C25.5 22.8284 24.8284 23.5 24 23.5C23.4477 23.5 23 23.9477 23 24.5V26H25V25.3551Z" fill="#4D8DF9" />
                                            </svg>
                                        </Box>
                                        <Box marginTop={4}>
                                            <Text className='modal-title'>Learn something else</Text>
                                            Can’t find the subject you wish to learn, tell us, we’ll match you with an experienced tutor
                                            <FormLabel margin={0}>
                                                <Box mt={4}>
                                                    <Input size={'lg'} value={somethingElse} onChange={(e) => onboardStudentStore.set.somethingElse?.(e.target.value)} placeholder='Enter subject' />
                                                </Box>
                                            </FormLabel>
                                        </Box>
                                    </Box>
                                </ModalBody>

                                <ModalFooter>
                                    <Button isDisabled={!!!somethingElse} onClick={onSomethingElseModalClose}>Confirm</Button>
                                </ModalFooter>
                            </ModalContent>
                        </Modal>
                        <Box>
                            <CourseSelect multi value={courses} onChange={(v) => {
                                if (v.includes('something-else') && !courses.includes('something-else')) {
                                    onSomethingElseModalOpen();
                                } else if (courses.includes('something-else') && !v.includes('something-else')) {
                                    onboardStudentStore.set.somethingElse('');
                                }
                                onboardStudentStore.set.courses(v)
                            }} options={[...courseList, {
                                title: somethingElse ? somethingElse : 'Want to learn something else?',
                                id: 'something-else',
                                image: '',
                                icon: <svg style={{ margin: '0 auto' }} width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10.5 20C4.97715 20 0.5 15.5228 0.5 10C0.5 4.47715 4.97715 0 10.5 0C16.0228 0 20.5 4.47715 20.5 10C20.5 15.5228 16.0228 20 10.5 20ZM9.5 13V15H11.5V13H9.5ZM11.5 11.3551C12.9457 10.9248 14 9.5855 14 8C14 6.067 12.433 4.5 10.5 4.5C8.802 4.5 7.38637 5.70919 7.06731 7.31346L9.0288 7.70577C9.1656 7.01823 9.7723 6.5 10.5 6.5C11.3284 6.5 12 7.17157 12 8C12 8.8284 11.3284 9.5 10.5 9.5C9.9477 9.5 9.5 9.9477 9.5 10.5V12H11.5V11.3551Z" fill="#969CA6" />
                                </svg>
                            }].map(c => {
                                return { ...c, value: c.id }
                            })} />
                        </Box>
                    </Box> </> : <EmptyState title="Uh oh!" subtitle={<>Looks like you're not quite old enough to sign up on your own just yet. Don't worry though, we've got you covered! Ask your parent or guardian to <Link href='/onboard/student' color='primary.600'>sign up</Link> on your behalf and start learning with us today.</>} image={<img alt="uh oh!" style={{ height: "80px" }} src="/images/empty-state-no-content.png" />} action={<Button onClick={() => {
                        stepWizardInstance.current?.previousStep();
                    }} variant={"ghost"}>Change Date of Birth</Button>} />}
            </Box>,
            canSave: validateCoursesStep
        },
        {
            id: 'course-supplementary',
            stepIndicatorId: 'classes',
            template: <Box>
                <Heading as='h3' size='lg' textAlign={"center"}>
                    {parentOrStudent === "parent" ? "What classes are your child interested in?" : "What classes are you interested in?"}
                </Heading>
                <Box marginTop={30}>
                    {courses.map(c => {
                        const courseName = c === 'something-else' ? capitalize(somethingElse) : courseList.find(ac => ac.id === c)?.title;

                        if (c === 'maths') {
                            return <Box key={'course-supplementary' + c}>
                                <FormControl>
                                    <FormLabel>{parentOrStudent === "parent" ? "What grade level is your child in?" : "What grade level are you in?"}</FormLabel>
                                    <Input size={'lg'} value={gradeLevel} onChange={(e) => onboardStudentStore.set.gradeLevel(e.target.value)} placeholder='e.g Grade 12' required />
                                </FormControl>

                                <FormControl mt={4}>
                                    <FormLabel>{parentOrStudent === "parent" ? "What Maths topic does your child need help with?" : "What Maths topic do you need help with?"}</FormLabel>
                                    <Input size={'lg'} value={topic} onChange={(e) => onboardStudentStore.set.topic(e.target.value)} placeholder='e.g Algebra' required />
                                </FormControl>
                            </Box>
                        }

                        return <FormControl>
                            <FormLabel key={'course-supplementary' + c}>{parentOrStudent === "parent" ? `What's your child's skill level for ${courseName}?` : `What's your skill level for ${courseName}?`}</FormLabel>
                            <Select
                                tagVariant="solid"
                                placeholder={parentOrStudent === 'parent' ? 'Select your child\'s skill level' : 'Select your skill level'}
                                size={'lg'}
                                onChange={(v => {
                                    const currSkillLevels = [...skillLevels];
                                    // @ts-expect-error
                                    const slv = { course: c, skillLevel: v?.value };
                                    const currentIndex = currSkillLevels.findIndex(v => v.course === c);
                                    if (currentIndex > -1) {
                                        currSkillLevels[currentIndex] = slv;
                                    } else {
                                        currSkillLevels.push(slv);
                                    }

                                    onboardStudentStore.set.skillLevels?.(currSkillLevels);
                                })}
                                defaultValue={getOptionValue(skillLevelOptions, skillLevels.find(s => s.course === c)?.skillLevel)}
                                options={skillLevelOptions}
                            />
                        </FormControl>
                    })
                    }
                </Box>
            </Box>,
            canSave: validateCourseSupplementaryStep
        },
        {
            id: 'availability',
            stepIndicatorId: 'availability',
            template: <Box>
                <FormControl>
                    <FormLabel m={0}>Timezone</FormLabel>
                    <TimezoneSelect value={tz} onChange={(v) => onboardStudentStore.set.tz(v.value)} />
                </FormControl>
                <Box mt={"40px"}>
                    <ScheduleBuilder value={schedule} onChange={(v) => onboardStudentStore.set.schedule(v)} />
                </Box>
            </Box>,
            canSave: validateScheduleStep
        },
        {
            id: 'confirm',
            template: <Box>
                <Heading as='h3' size='lg' textAlign={"center"}>
                    Review Your Information
                </Heading>
                <Box marginTop={30}>
                    <VStack alignItems={"stretch"} spacing={5}>
                        {
                            confirmations.map(c => <Box key={c.title}>
                                <Heading as="h5" size={'md'} marginBottom={5}>{c.title}</Heading>
                                <VStack divider={<StackDivider borderColor='gray.200' />} alignItems={"stretch"}>
                                    {
                                        c.fields.map(f => {
                                            return <Flex key={f.title}>
                                                <Flex flexDirection={'column'} justifyContent="center" flexGrow={1}>
                                                    {!!f.title && <Heading as="h6" textTransform={"capitalize"} size={"sm"}>{f.title}</Heading>}
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
        mixpanel.track('Completed onboarding');
        return ApiService.submitStudentLead(data);
    }

    const openEditModal = (stepId: string) => {
        onEditModalOpen();
        setEditModalStep(stepId);
    }

    const activeStepObj = useMemo(() => steps[activeStep - 1], [activeStep]);

    const stepIndicatorActiveStep = useMemo(() => stepIndicatorSteps.find(s => s.id === activeStepObj?.stepIndicatorId), [activeStepObj, stepIndicatorSteps]);

    useTitle(stepIndicatorActiveStep?.title || '');

    useEffect(() => {
        mixpanel.identify();
    }, []);

    useEffect(() => {
        if (!activeStepObj) return

        mixpanel.track(`Onboarding Step Progress (${activeStepObj?.id})`)
    }, [activeStepObj]);

    useEffect(() => {
        if (name.first && name.last)
            mixpanel.people.set({ "$name": `${name.first} ${name.last}` });

        if (email)
            mixpanel.people.set({ "$email": email });

        if (age)
            mixpanel.people.set({ "Age": age });

        if (parentOrStudent)
            mixpanel.people.set({ "Parent Or Student": parentOrStudent });

        mixpanel.people.set({ "Type": "Student" });
    }, [email, name, age]);

    useEffect(() => {
        mixpanel.register({ ...data, type: 'student' });
    }, [data]);

    const canSaveCurrentEditModalStep = steps.find(s => s.id === editModalStep)?.canSave;

    return <Box>
        <Modal closeOnEsc={canSaveCurrentEditModalStep} closeOnOverlayClick={canSaveCurrentEditModalStep} size='xl' isOpen={editModalOpen} onClose={onEditModalClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader><br /></ModalHeader>
                <ModalCloseButton isDisabled={!canSaveCurrentEditModalStep} />
                <ModalBody>
                    <Box width={'100%'}>
                        {steps.find(s => s.id === editModalStep)?.template}
                    </Box>
                </ModalBody>

                <ModalFooter>
                    <Button isDisabled={!canSaveCurrentEditModalStep} onClick={onEditModalClose}>Done</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
        <StepIndicator activeStep={stepIndicatorSteps.findIndex(s => s === stepIndicatorActiveStep)} steps={stepIndicatorSteps} />
        <Box mt={45}>
            <StepWizard isLazyMount className='flex-col-reverse' onStepChange={onStepChange} instance={(props) => {
                stepWizardInstance.current = props as unknown as StepWizardChildProps;
            }}>
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