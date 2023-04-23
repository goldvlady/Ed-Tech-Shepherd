import React, { useCallback, useEffect, useMemo, useState } from 'react';
import StepIndicator from '../components/StepIndicator';
import { FiUser, FiCalendar, FiBookOpen, FiEdit, FiTrash } from "react-icons/fi";
import { Box, FormLabel, Heading, Input, Text, CircularProgress, Link, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Button, VStack, StackDivider, Flex, IconButton, Textarea, HStack } from '@chakra-ui/react';
import StepWizard, { StepWizardProps } from 'react-step-wizard';
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
import { Select } from 'chakra-react-select';
import { getOptionValue } from '../util';
import theme from '../theme';
import styled from 'styled-components';

const client = getContentfulClient();

const LearnSomethingElseDisplay = styled('a')`
display: block;
padding-inline: var(--chakra-space-4);
padding-block: var(--chakra-space-2);
border-radius: ${theme.radii.md};
border: 1px solid ${theme.colors.gray[300]};

&:hover {
    border-color: ${theme.colors.gray[500]};
}
`

const OnboardStudent = () => {
    const { isOpen: isSomethingElseModalOpen, onOpen: onSomethingElseModalOpen, onClose: onSomethingElseModalClose } = useDisclosure()
    const [courseList, setCourseList] = useState<Course[]>([]);
    const [loadingCourses, setLoadingCourses] = useState(false);
    const [activeStep, setActiveStep] = useState<number>(1);

    const [editModalStep, setEditModalStep] = useState<string | null>(null);
    const { isOpen: editModalOpen, onOpen: onEditModalOpen, onClose: onEditModalClose } = useDisclosure();

    const onStepChange: StepWizardProps["onStepChange"] = ({ activeStep }) => {
        setActiveStep(activeStep);
    }

    const data = onboardStudentStore.useStore();
    const { parentOrStudent, name, dob, email, courses, somethingElse, schedule, tz, gradeLevel, topic, skillLevels } = data;

    const dobValid = moment(dob, FORMAT, true).isValid();
    const age = useMemo(() => moment().diff(moment(dob, FORMAT), 'years'), [dob]);

    const validateParentStudentStep = !!parentOrStudent;
    const validateNameStep = !!name.first && !!name.last;
    const validateDobStep = !!dob && !(age < 13 && parentOrStudent === "student") && dobValid;
    const validateEmailStep = !!email;
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

    useEffect(() => {
        if (somethingElse) {
            if (!courses.includes('something-else')) {
                onboardStudentStore.set.courses([...courses, 'something-else']);
            }
        } else {
            onboardStudentStore.set.courses(without(courses, 'something-else'));
        }
    }, [somethingElse]);

    const skillLevelOptions = [
        {
            label: "Beginner",
            value: "beginner"
        },
        {
            label: "Intermediate",
            value: "intermediate"
        },
        {
            label: "Advanced",
            value: "advanced"
        }
    ];

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
                    value: <Text>{courses.filter(tc => tc !== 'something-else').map(tc => {
                        return courseList.find(ac => ac.id === tc)?.title;
                    }).join(', ')}{somethingElse ? `, ${somethingElse}` : ''}</Text>,
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
                    Who is signing up?
                </Heading>
                <Box marginTop={30}>
                    <LargeSelect value={parentOrStudent} onChange={(v) => onboardStudentStore.set.parentOrStudent(v)} options={[
                        {
                            value: "parent",
                            title: "Parent or Guardian",
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
                    <Modal isOpen={isSomethingElseModalOpen} onClose={onSomethingElseModalClose}>
                        <ModalOverlay />
                        <ModalContent>
                            <ModalHeader></ModalHeader>
                            <ModalCloseButton />
                            <ModalBody>
                                <Box>
                                    <Box display={"flex"} justifyContent="center" mb={4}>
                                        <img alt="uh oh!" style={{ height: "80px" }} src="/images/empty-state-no-content.png" />
                                    </Box>
                                    <Heading mb={1} as='h5' size='sm' textAlign={"center"}>Learn something else</Heading>
                                    <FormLabel margin={0}>
                                        <Text color="gray.500" mb={3} textAlign={"center"} fontSize='sm' fontWeight={400}>Can't find the class or skill you'd like to learn? Tell us, we'll match you with an experienced tutor who can guide you through it!</Text>
                                        <Box mt={1}>
                                            <Textarea value={somethingElse} onChange={(e) => onboardStudentStore.set.somethingElse?.(e.target.value)} maxH={"200px"} placeholder='Rocket science' />
                                        </Box>
                                    </FormLabel>
                                </Box>
                            </ModalBody>

                            <ModalFooter>
                                <Button isDisabled={!!!somethingElse} variant="looney" onClick={onSomethingElseModalClose}>Done</Button>
                            </ModalFooter>
                        </ModalContent>
                    </Modal>
                    <Box>
                        <CourseSelect multi value={courses} onChange={(v) => onboardStudentStore.set.courses(v)} options={courseList.map(c => {
                            return { ...c, value: c.id }
                        })} />
                        <Box mt={4}>
                            {!!!somethingElse && <Text as={"a"} href="#" display="block" onClick={(e) => {
                                e.preventDefault();
                                onSomethingElseModalOpen();
                                return false;
                            }} cursor={"pointer"} textDecor={"underline"} textAlign={"center"} fontSize={"small"} fontStyle={"italic"} variant={"muted"}>I'd like to learn something that isn't listed here</Text>}
                            {!!somethingElse && <LearnSomethingElseDisplay href='#' onClick={(e) => {
                                e.preventDefault();
                                onSomethingElseModalOpen();
                                return false;
                            }}>
                                <HStack>
                                    <Text flexGrow={1} gap={1}>{somethingElse}</Text>
                                    <IconButton
                                        variant='ghost'
                                        aria-label='Delete learn something else'
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            onboardStudentStore.set.somethingElse('')
                                        }}
                                        icon={<FiTrash />}
                                    />
                                </HStack>
                            </LearnSomethingElseDisplay>
                            }
                        </Box>
                    </Box>
                </Box>
            </Box>,
            canSave: validateCoursesStep
        },
        {
            id: 'course-supplementary',
            stepIndicatorId: 'classes',
            template: <Box>
                <Heading as='h2' size='lg' textAlign={"center"}>
                    {parentOrStudent === "parent" ? "What classes are your child interested in?" : "What classes are you interested in?"}
                </Heading>
                <Box marginTop={30}>
                    {courses.map(c => {
                        const courseName = c === 'something-else' ? capitalize(somethingElse) : courseList.find(ac => ac.id === c)?.title;

                        if (c === 'maths') {
                            return <Box key={'course-supplementary'+c}><FormLabel>
                                {parentOrStudent === "parent" ? "What grade level is your child in?" : "What grade level are you in?"}
                                <Input value={gradeLevel} onChange={(e) => onboardStudentStore.set.gradeLevel(e.target.value)} placeholder='e.g Grade 12' required />
                            </FormLabel>
                                <FormLabel>
                                    {parentOrStudent === "parent" ? "What Maths topic does your child need help with?" : "What Maths topic do you need help with?"}
                                    <Input value={topic} onChange={(e) => onboardStudentStore.set.topic(e.target.value)} placeholder='e.g Algebra' required />
                                </FormLabel>
                            </Box>
                        }

                        return <FormLabel key={'course-supplementary'+c}>
                            {parentOrStudent === "parent" ? `What's your child's skill level for ${courseName}?` : `What's your skill level for ${courseName}?`}
                            <Select
                                tagVariant="solid"
                                onChange={(v => {
                                    const currSkillLevels = [...skillLevels]
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
                        </FormLabel>
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