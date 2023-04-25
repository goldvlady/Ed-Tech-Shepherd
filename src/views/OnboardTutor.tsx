import React, { useCallback, useEffect, useMemo, useState } from 'react';
import StepIndicator from '../components/StepIndicator';
import { FiUser, FiCalendar, FiBookOpen, FiDollarSign, FiEdit } from "react-icons/fi";
import { Box, FormLabel, Heading, Input, Text, CircularProgress, InputGroup, InputLeftAddon, Alert, AlertIcon, VStack, useToast, Flex, IconButton, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Button, useDisclosure, StackDivider, Avatar, Textarea } from '@chakra-ui/react';
import StepWizard, { StepWizardProps } from 'react-step-wizard';
import OnboardStep from '../components/OnboardStep';
import onboardTutorStore from '../state/onboardTutorStore';
import CourseSelect from '../components/CourseSelect';
import { capitalize, isEmpty, sumBy } from 'lodash';
import ScheduleBuilder from '../components/ScheduleBuilder';
import OnboardSubmitStep from '../components/OnboardSubmitStep';
import Lottie from 'lottie-react';

import lottieSuccessAnimationData from "../lottie/73392-success.json";
import { useTitle } from '../hooks';
import ApiService from '../services.ts/ApiService';
import TimezoneSelect from '../components/TimezoneSelect';

import moment from 'moment';
import EmptyState from '../components/EmptyState';
import { CreatableSelect, useChakraSelectProps } from 'chakra-react-select';

import occupationList from "../occupations.json";
import { ref } from '@firebase/storage';
import { getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import { storage } from '../firebase';
import { getOptionValue } from '../util';
import FileDisplay from '../components/FileDisplay';
import { Course, Schedule } from '../types';

import DateInput, { FORMAT } from '../components/DateInput';
import { formatContentFulCourse, getContentfulClient } from '../contentful';
import mixpanel from 'mixpanel-browser';

const occupationOptions = occupationList.map((o) => {
    return { label: o, value: o }
});

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
    },
    {
        title: "Rate",
        icon: <FiDollarSign />,
        id: 'rate'
    }
]

const educationLevelOptions = [{
    label: "Primary School Certificate",
    value: "primary-school-cert"
},
{
    label: "Junior Secondary School Certificate",
    value: "junior-secondary-school-cert"
},
{
    label: "Senior Secondary School Certificate",
    value: "senior-secondary-school-cert"
},
{
    label: "National Diploma (ND)",
    value: "national-diploma"
},
{
    label: "Higher National Diploma (HND)",
    value: "higher-national-diploma"
},
{
    label: "Bachelor's Degree (BSc, BA, BEng, etc.)",
    value: "bachelors-degree"
},
{
    label: "Master's Degree (MSc, MA, MEng, etc.)",
    value: "masters-degree"
},
{
    label: "Doctoral Degree (PhD, MD, etc.)",
    value: "doctoral-degree"
},
{
    label: "Vocational/Technical Certificate",
    value: "vocation-technical-cert"
}]

const client = getContentfulClient();

const OnboardTutor = () => {
    const toast = useToast();
    const [courseList, setCourseList] = useState<Course[]>([]);
    const [loadingCourses, setLoadingCourses] = useState(false);
    const [activeStep, setActiveStep] = useState<number>(1);

    const [editModalStep, setEditModalStep] = useState<string | null>(null);
    const { isOpen: editModalOpen, onOpen: onEditModalOpen, onClose: onEditModalClose } = useDisclosure();

    const data = onboardTutorStore.useStore();
    const { name, dob, email, courses, schedule, tz, occupation, highestLevelOfEducation, rate, cv, avatar, description, teachLevel } = data;

    const totalAvailableHours = useMemo(() => sumBy(schedule, (o) => {
        return moment.duration(moment(o.end).diff(moment(o.begin))).asHours();
    }), [schedule]);

    const dobValid = moment(dob, FORMAT, true).isValid();
    const age = useMemo(() => moment().diff(moment(dob, FORMAT), 'years'), [dob]);

    const validateNameStep = !!name.first && !!name.last;
    const validateDobStep = !!dob && age >= 18 && dobValid;
    const validateEmailStep = !!email;
    const validateCoursesStep = !isEmpty(courses);
    const validateScheduleStep = !isEmpty(schedule) && !!tz && totalAvailableHours >= 3;
    const validateProfileSetupStep = !!avatar && !!description;
    const validateMoreInformationStep = !!occupation && !!highestLevelOfEducation && !!cv && !isEmpty(teachLevel);

    const validateRateStep = !!rate;

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

    const occupationSelectProps = useChakraSelectProps({
        value: getOptionValue(occupationOptions, occupation),
        isMulti: false,
        onChange: (v => onboardTutorStore.set.occupation?.(v?.value)),
        options: occupationOptions
    });

    const highestEducationLevelSelectProps = useChakraSelectProps({
        value: getOptionValue(educationLevelOptions, highestLevelOfEducation),
        isMulti: false,
        onChange: ((v) => {
            onboardTutorStore.set.highestLevelOfEducation(v?.value)
        }),
        options: educationLevelOptions
    });

    const [cvUploadPercent, setCvUploadPercent] = useState(0);
    const [selectedCV, setSelectedCV] = useState<File | null>(null);

    const [avatarUploadPercent, setAvatarUploadPercent] = useState(0);
    const [selectedAvatar, setSelectedAvatar] = useState<File | null>(null);

    useEffect(() => {
        onboardTutorStore.set.cv("");

        if (!selectedCV) return;

        if (selectedCV?.size > 2000000) {
            toast({
                title: 'Please upload a file under 2MB',
                status: 'error',
                position: 'top',
                isClosable: true
            })
            return;
        }

        const storageRef = ref(storage, `files/${selectedCV.name}`);
        const uploadTask = uploadBytesResumable(storageRef, selectedCV);

        uploadTask.on("state_changed",
            (snapshot) => {
                const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                setCvUploadPercent(progress);
            },
            (error) => {
                setCvUploadPercent(0);
                alert(error);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    onboardTutorStore.set.cv(downloadURL);
                });
            }
        );
    }, [selectedCV]);

    useEffect(() => {
        onboardTutorStore.set.avatar?.("");

        if (!selectedAvatar) return;

        if (selectedAvatar?.size > 1000000) {
            toast({
                title: 'Please upload a file under 1MB',
                status: 'error',
                position: 'top',
                isClosable: true
            })
            return;
        }

        const storageRef = ref(storage, `files/${selectedAvatar.name}`);
        const uploadTask = uploadBytesResumable(storageRef, selectedAvatar);

        uploadTask.on("state_changed",
            (snapshot) => {
                const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                setAvatarUploadPercent(progress);
            },
            (error) => {
                setAvatarUploadPercent(0);
                alert(error);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    onboardTutorStore.set.avatar?.(downloadURL);
                });
            }
        );
    }, [selectedAvatar]);

    const teachLevelOptions = [
        {
            label: "Primary School",
            value: "primary-school"
        },
        {
            label: "Secondary School",
            value: "secondary-school"
        },
        {
            label: "University and above",
            value: "university-plus"
        }
    ];

    const teachLevelSelectProps = useChakraSelectProps({
        value: getOptionValue(teachLevelOptions, teachLevel),
        isMulti: true,
        onChange: ((v) => {
            onboardTutorStore.set.teachLevel(v.map(i => i.value))
        }),
        options: teachLevelOptions
    });

    const doSubmit = () => {
        mixpanel.track('Completed onboarding');
        return ApiService.submitTutorLead(data);
    }

    const onStepChange: StepWizardProps["onStepChange"] = ({ activeStep, ...rest }) => {
        setActiveStep(activeStep);
    }

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
                {
                    title: 'Current Occupation',
                    value: <Text>{occupation}</Text>,
                    step: 'more-info',
                },
                {
                    title: 'Highest Level of Education Obtained',
                    value: <Text>{educationLevelOptions.find(el => el.value === highestLevelOfEducation)?.label}</Text>,
                    step: 'more-info',
                },
                {
                    title: 'CV',
                    value: !!selectedCV && <FileDisplay marginTop={1} file={selectedCV as File} />,
                    step: 'more-info',
                },
                {
                    title: 'Level of students you can teach',
                    value: <Text>{teachLevel.map(tc => {
                        return teachLevelOptions.find(ac => ac.value === tc)?.label;
                    }).join(', ')}</Text>,
                    step: 'more-info',
                },
            ]
        },
        {
            title: "Profile",
            fields: [
                {
                    title: 'Avatar',
                    value: !!selectedAvatar && <FileDisplay prefix={avatar ? <Avatar src={avatar} /> : null} marginTop={1} file={selectedAvatar as File} />,
                    step: 'profile-setup',
                },
                {
                    title: 'About you',
                    value: <Text>{description}</Text>,
                    step: 'profile-setup',
                }
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
        },
        {
            title: 'Rate',
            fields: [
                {
                    title: 'Hourly rate',
                    value: <Text>${rate}</Text>,
                    step: 'rate',
                },
            ]
        }
    ]

    const steps = [
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
                        <Input value={name.first} onChange={(e) => onboardTutorStore.set.name({ ...name, first: e.target.value })} />
                    </FormLabel>
                    <FormLabel>
                        Last name
                        <Input value={name.last} onChange={(e) => onboardTutorStore.set.name({ ...name, last: e.target.value })} />
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
                    {(!dobValid) || (age >= 18) ? <FormLabel>
                        Date of birth
                        <DateInput
                            value={dob}
                            onChange={(v) => {
                                onboardTutorStore.set.dob(v)
                            }}
                        />
                    </FormLabel> : <EmptyState
                        title="Uh oh!"
                        subtitle={"Looks like you're not quite old enough to sign up for this. You'll need to be at least 18 years old to join as a tutor. Don't worry, you'll be eligible to tutor with us soon enough!"}
                        image={<img alt="uh oh!"
                            style={{ height: "80px" }}
                            src="/images/empty-state-no-content.png" />}
                        action={<Button onClick={() => {
                            onboardTutorStore.set.dob('')
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
                        <Input value={email} onChange={(e) => onboardTutorStore.set.email(e.target.value)} type="email" />
                    </FormLabel>
                </Box>
            </Box>,
            canSave: validateEmailStep,
        },
        {
            id: 'more-info',
            stepIndicatorId: 'about-you',
            template: <Box>
                <Heading as='h2' size='lg' textAlign={"center"}>
                    And some more information
                </Heading>
                <Box marginTop={30}>
                    <VStack align='stretch' spacing={3}>
                        <FormLabel margin={0}>
                            Current Occupation
                            <CreatableSelect
                                tagVariant="solid"
                                isClearable
                                {...occupationSelectProps}
                            />
                        </FormLabel>
                        <FormLabel>
                            Highest Level of Education Obtained
                            <CreatableSelect
                                tagVariant="solid"
                                isClearable
                                {...highestEducationLevelSelectProps}
                            />
                        </FormLabel>
                        <FormLabel>
                            Upload a copy of your CV
                            <Text variant={"muted"} marginBottom={"4px"}>Please upload a PDF, JPG, or PNG file under 2MB</Text>
                            {!!!selectedCV && <InputGroup>
                                <Input type={"file"} accept="application/pdf, image/jpeg, image/png" paddingTop="4px" onChange={(e) => {
                                    setSelectedCV(e.target.files ? e.target.files[0] : null)
                                }} />
                            </InputGroup>}
                            {!!selectedCV && <FileDisplay uploading={cvUploadPercent > 0 && cvUploadPercent < 100} file={selectedCV} onDeleteClicked={(e) => {
                                e.preventDefault();
                                setSelectedCV(null);
                            }} />}
                        </FormLabel>
                        <FormLabel>
                            Level of students you can teach
                            <CreatableSelect
                                tagVariant="solid"
                                isClearable
                                {...teachLevelSelectProps}
                            />
                        </FormLabel>
                    </VStack>
                </Box>
            </Box>,
            canSave: validateMoreInformationStep,
        },
        {
            id: 'profile-setup',
            stepIndicatorId: 'about-you',
            template: <Box>
                <Heading as='h2' size='lg' textAlign={"center"}>
                    We'll need these to setup your profile
                </Heading>
                <Box marginTop={30}>
                    <VStack align='stretch' spacing={3}>
                        <FormLabel>
                            Upload an avatar
                            <Text variant={"muted"} marginBottom={"4px"}>Please upload a JPG or PNG file under 1MB</Text>
                            {!!!selectedAvatar && <InputGroup>
                                <Input type={"file"} accept="image/jpeg, image/png" paddingTop="4px" onChange={(e) => {
                                    setSelectedAvatar(e.target.files ? e.target.files[0] : null)
                                }} />
                            </InputGroup>}
                            {!!selectedAvatar && <FileDisplay prefix={avatar ? <Avatar src={avatar} /> : null} uploading={avatarUploadPercent > 0 && avatarUploadPercent < 100} file={selectedAvatar} onDeleteClicked={(e) => {
                                e.preventDefault();
                                setSelectedAvatar(null);
                            }} />}
                        </FormLabel>
                        <FormLabel>
                            Tell us a little bit about yourself
                            <Textarea placeholder={`Hi, I'm ${name.first}, ...`} value={description} onChange={(e) => onboardTutorStore.set.description?.(e.target.value)} />
                        </FormLabel>
                    </VStack>
                </Box>
            </Box>,
            canSave: validateProfileSetupStep,
        },
        {
            id: 'classes',
            stepIndicatorId: 'classes',
            template: <Box>
                <Heading as='h2' size='lg' textAlign={"center"}>
                    What classes are you interested in teaching?
                </Heading>
                <Box marginTop={30}>
                    <CourseSelect multi value={courses} onChange={(v) => onboardTutorStore.set.courses(v)} options={courseList.map(c => {
                        return { ...c, value: c.id }
                    })} />
                </Box>
            </Box>,
            canSave: validateCoursesStep,
        },
        {
            id: 'availability',
            stepIndicatorId: 'availability',
            template: <Box>
                <FormLabel m={0}>
                    Time zone
                    <TimezoneSelect value={tz} onChange={(v) => onboardTutorStore.set.tz(v.value)} />
                </FormLabel>
                <Box mt={"20px"}>
                    {totalAvailableHours > 0 && totalAvailableHours < 3 && <Box mb={"15px"}>
                        <Alert status='info'>
                            <AlertIcon />
                            A minimum availability of 3 hours per week is required.
                        </Alert>
                    </Box>}
                    <ScheduleBuilder value={schedule} onChange={(v) => onboardTutorStore.set.schedule(v)} />
                </Box>
            </Box>,
            canSave: validateScheduleStep,
        },
        {
            id: 'rate',
            stepIndicatorId: 'rate',
            template: <Box>
                <Heading as='h2' size='lg' textAlign={"center"}>
                    How much would you like to get paid hourly?
                </Heading>
                <Box marginTop={30}>
                    <FormLabel m={0}>
                        Rate
                        <InputGroup>
                            <InputLeftAddon children='$' />
                            <Input min={0} inputMode="numeric" value={rate} onChange={(e) => onboardTutorStore.set.rate(parseInt(e.target.value))} type="number" placeholder='Hourly rate' />
                        </InputGroup>
                    </FormLabel>
                </Box>
            </Box>,
            canSave: validateRateStep,
        },
        {
            id: 'confirm',
            template: <Box>
                <Heading as='h2' size='lg' textAlign={"center"}>
                    Review Your Onboarding Information
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

        mixpanel.people.set({ "Type": "Tutor" });
    }, [email, name, age]);

    useEffect(() => {
        mixpanel.register({...data, type: 'tutor'});
    }, [data]);

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
                        <Text color="gray.500" marginTop={2} textAlign="center">We'll match you with students within your availability &amp; shoot you an email at {email} with next steps!</Text>
                    </Box>
                </OnboardStep>
            </StepWizard>
        </Box>
    </Box>
}

export default OnboardTutor;