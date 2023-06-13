import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControl,
  FormLabel,
  HStack,
  Heading,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  StackDivider,
  Text,
  VStack,
  useDisclosure,
} from '@chakra-ui/react';
import { capitalize, isEmpty, without } from 'lodash';
import Lottie from 'lottie-react';
import mixpanel from 'mixpanel-browser';
import moment from 'moment';
import { useEffect, useMemo, useRef, useState } from 'react';
import { FiBookOpen, FiCalendar, FiEdit, FiUser } from 'react-icons/fi';
import { HiEye, HiEyeOff } from 'react-icons/hi';
import { useLocation } from 'react-router';
import StepWizard, { StepWizardChildProps, StepWizardProps } from 'react-step-wizard';
import styled from 'styled-components';

import CourseSelect from '../components/CourseSelect';
import DateInput, { FORMAT } from '../components/DateInput';
import EmptyState from '../components/EmptyState';
import LargeSelect from '../components/LargeSelect';
import OnboardStep from '../components/OnboardStep';
import OnboardSubmitStep from '../components/OnboardSubmitStep';
import ScheduleBuilder from '../components/ScheduleBuilder';
import Select from '../components/Select';
import StepIndicator from '../components/StepIndicator';
import TimezoneSelect from '../components/TimezoneSelect';
import { useTitle } from '../hooks';
import lottieSuccessAnimationData from '../lottie/73392-success.json';
import ApiService from '../services/ApiService';
import onboardStudentStore from '../state/onboardStudentStore';
import resourceStore from '../state/resourceStore';
import { getOptionValue } from '../util';

const stepIndicatorSteps = [
  {
    title: 'Select Status',
    icon: <FiUser />,
    id: 'parent-or-student',
  },
  {
    title: 'Classes',
    icon: <FiBookOpen />,
    id: 'about-you',
  },
  {
    title: 'Security',
    icon: <FiCalendar />,
    id: 'security',
  },
];

const SkillLevelImg = styled.div`
  height: 30px;
  width: 30px;
  background: white;
  border-radius: 100%;
  border: 0.6px solid #eaeaeb;
  object-fit: scale-down;
  padding: 8px;
  align-items: center;
  flex-shrink: 0;
`;

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
`;

const skillLevelOptions = [
  {
    label: (
      <SkillLevel>
        <SkillLevelImg>
          <img src="/images/beginner.png" />
        </SkillLevelImg>{' '}
        Beginner
      </SkillLevel>
    ),
    value: 'beginner',
  },
  {
    label: (
      <SkillLevel>
        <SkillLevelImg>
          <img src="/images/intermediate.png" />
        </SkillLevelImg>{' '}
        Intermediate
      </SkillLevel>
    ),
    value: 'intermediate',
  },
  {
    label: (
      <SkillLevel>
        <SkillLevelImg>
          <img src="/images/advanced.png" />
        </SkillLevelImg>{' '}
        Advanced
      </SkillLevel>
    ),
    value: 'advanced',
  },
];

const OnboardStudent = () => {
  const { courses: courseList } = resourceStore();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const location = useLocation();

  const stepWizardInstance = useRef<StepWizardChildProps | null>(null);

  const {
    isOpen: isSomethingElseModalOpen,
    onOpen: onSomethingElseModalOpen,
    onClose: onSomethingElseModalClose,
  } = useDisclosure();
  const [activeStep, setActiveStep] = useState<number>(1);

  const [editModalStep, setEditModalStep] = useState<string | null>(null);
  const {
    isOpen: editModalOpen,
    onOpen: onEditModalOpen,
    onClose: onEditModalClose,
  } = useDisclosure();

  const onStepChange: StepWizardProps['onStepChange'] = ({ activeStep, ...rest }) => {
    setActiveStep(activeStep);
  };

  const data = onboardStudentStore.useStore();
  const {
    parentOrStudent,
    name,
    dob,
    email,
    courses,
    somethingElse,
    schedule,
    tz,
    gradeLevel,
    topic,
    skillLevels,
  } = data;

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

  const passwordChecks = useMemo(() => {
    const isEightLetters = {
      text: 'Password is eight letters long',
      checked: password.length >= 8,
    };

    const isConfirmed = {
      text: 'Password has been confirmed',
      checked: [password, password === confirmPassword].every(Boolean),
    };

    const hasACharacter = {
      text: 'Password has at least one special character',
      checked: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password),
    };

    const hasANumber = {
      text: 'Password has at least one number',
      checked: /\d/.test(password),
    };

    return [isEightLetters, isConfirmed, hasACharacter, hasANumber];
  }, [password, confirmPassword]);

  const validatePasswordStep = passwordChecks.filter((check) => !check.checked).length === 0;

  const validateParentStudentStep = !!parentOrStudent;
  const validateAboutYouStep = !!name.first && !!name.last && !!email && dobValid && !!dob;
  const validateCoursesStep = !isEmpty(courses);
  const validateScheduleStep = !isEmpty(schedule) && !!tz;

  const validateCourseSupplementaryStep = useMemo(
    () =>
      !courses
        .map((c) => {
          if (c === 'maths') {
            return !!gradeLevel && !!topic;
          } else {
            return !courses
              .filter((c) => c !== 'maths')
              .map((c) => {
                return !!skillLevels.find((sl) => sl.course === c);
              })
              .includes(false);
          }
        })
        .includes(false),
    [courses, skillLevels, gradeLevel, topic]
  );

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
          value: <Text marginBottom={0}>{moment(dob, FORMAT).format('MMMM Do YYYY')}</Text>,
          step: 'about-you',
        },
        {
          title: 'Email Address',
          value: <Text marginBottom={0}>{email}</Text>,
          step: 'about-you',
        },
      ],
    },
    {
      title: 'Classes',
      fields: [
        {
          title: 'Classes',
          value: (
            <Text marginBottom={0}>
              {courses
                .map((tc) => {
                  return tc === 'something-else'
                    ? somethingElse
                    : courseList.find((ac) => ac._id === tc)?.label;
                })
                .join(', ')}
            </Text>
          ),
          step: 'classes',
        },
      ],
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
          value: (
            <Text marginBottom={0} whiteSpace={'pre'}>
              {Object.keys(schedule)
                .map((d) => parseInt(d))
                .map((s) => {
                  return schedule[s].map(
                    (s) =>
                      `${moment(s.begin).format('dddd')}: ${moment(s.begin)
                        .tz(tz)
                        .format('hh:mm A')} - ${moment(s.end).tz(tz).format('hh:mm A')}`
                  );
                })
                .join('\n')}
            </Text>
          ),
          step: 'availability',
        },
      ],
    },
  ];

  const steps = [
    {
      id: 'parent-or-student',
      stepIndicatorId: 'parent-or-student',
      template: (
        <Box>
          <Heading as="h3" textAlign={'center'}>
            Who is signing up?
          </Heading>
          <Box marginTop={30}>
            <LargeSelect
              value={parentOrStudent}
              onChange={(v) => onboardStudentStore.set.parentOrStudent(v)}
              options={[
                {
                  value: 'parent',

                  title: 'Parent or Guardian',
                  subtitle: "Choose this if you're signing up on behalf of someone else",
                  icon: (
                    <svg
                      width="16.7"
                      height="16.7"
                      viewBox="0 0 18 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 7.33329C10.8409 7.33329 12.3333 5.84091 12.3333 3.99996C12.3333 2.15901 10.8409 0.666626 9 0.666626C7.15905 0.666626 5.66666 2.15901 5.66666 3.99996C5.66666 5.84091 7.15905 7.33329 9 7.33329ZM3.58333 9.83329C4.73392 9.83329 5.66666 8.90054 5.66666 7.74996C5.66666 6.59937 4.73392 5.66663 3.58333 5.66663C2.43274 5.66663 1.5 6.59937 1.5 7.74996C1.5 8.90054 2.43274 9.83329 3.58333 9.83329ZM16.5 7.74996C16.5 8.90054 15.5672 9.83329 14.4167 9.83329C13.2661 9.83329 12.3333 8.90054 12.3333 7.74996C12.3333 6.59937 13.2661 5.66663 14.4167 5.66663C15.5672 5.66663 16.5 6.59937 16.5 7.74996ZM9 8.16663C11.3012 8.16663 13.1667 10.0321 13.1667 12.3333V17.3333H4.83333V12.3333C4.83333 10.0321 6.69881 8.16663 9 8.16663ZM3.16666 12.3332C3.16666 11.7558 3.25056 11.198 3.40681 10.6713L3.26553 10.6836C1.80419 10.842 0.666664 12.0798 0.666664 13.5832V17.3332H3.16666V12.3332ZM17.3333 17.3332V13.5832C17.3333 12.0315 16.1216 10.7627 14.5932 10.6713C14.7494 11.198 14.8333 11.7558 14.8333 12.3332V17.3332H17.3333Z" />
                    </svg>
                  ),
                },
                {
                  value: 'student',
                  title: 'Student',
                  subtitle: "Choose this if you're signing up for yourself",
                  icon: (
                    <svg
                      width="16.7"
                      height="16.7"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg">
                      <path d="M10 0.833374C15.06 0.833374 19.1667 4.94004 19.1667 10C19.1667 15.06 15.06 19.1667 10 19.1667C4.94001 19.1667 0.833344 15.06 0.833344 10C0.833344 4.94004 4.94001 0.833374 10 0.833374ZM4.52139 13.1316C5.8666 15.1397 7.88719 16.4167 10.1464 16.4167C12.4056 16.4167 14.4262 15.1397 15.7714 13.1316C14.2978 11.7575 12.3203 10.9167 10.1464 10.9167C7.97254 10.9167 5.99505 11.7575 4.52139 13.1316ZM10 9.08337C11.5188 9.08337 12.75 7.85215 12.75 6.33337C12.75 4.81459 11.5188 3.58337 10 3.58337C8.48118 3.58337 7.25001 4.81459 7.25001 6.33337C7.25001 7.85215 8.48118 9.08337 10 9.08337Z" />
                    </svg>
                  ),
                },
              ]}
            />
          </Box>
        </Box>
      ),
      canSave: validateParentStudentStep,
    },
    {
      id: 'about-you',
      stepIndicatorId: 'about-you',
      template: (
        <Box>
          <Heading as="h3" size="lg" textAlign={'center'}>
            First we need some information about you.
            <br />
            What's your name?
          </Heading>
          <Box marginTop={30}>
            <FormControl>
              <FormLabel>First Name</FormLabel>
              <Input
                size={'lg'}
                value={name.first}
                onChange={(e) =>
                  onboardStudentStore.set.name({
                    ...name,
                    first: e.target.value,
                  })
                }
              />
            </FormControl>
            <FormControl>
              <FormLabel marginTop={4}>Last Name</FormLabel>
              <Input
                size={'lg'}
                value={name.last}
                onChange={(e) =>
                  onboardStudentStore.set.name({
                    ...name,
                    last: e.target.value,
                  })
                }
              />
            </FormControl>
            <FormControl>
              <FormLabel marginTop={4}>Email</FormLabel>
              <Input
                size={'lg'}
                value={email}
                onChange={(e) => onboardStudentStore.set.email(e.target.value)}
                type="email"
              />
            </FormControl>
            <FormControl>
              <FormLabel marginTop={4}>Date of Birth</FormLabel>
              <DateInput
                size={'lg'}
                value={dob}
                onChange={(v) => {
                  onboardStudentStore.set.dob(v);
                }}
              />
            </FormControl>
          </Box>
        </Box>
      ),
      canSave: validateAboutYouStep,
    },
    {
      id: 'security',
      stepIndicatorId: 'security',
      template: (
        <Box>
          <Heading as="h3" size="lg" textAlign={'center'}>
            First we need some information about you.
            <br />
            Hi there, before you proceed, let us know who is signing up{' '}
          </Heading>
          <Box marginTop={30}>
            <FormControl>
              <FormLabel>Password</FormLabel>
              <InputGroup size="lg">
                <Input
                  placeholder="Create password"
                  type={showPassword ? 'text' : 'password'}
                  _placeholder={{ fontSize: '14px' }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <InputRightElement>
                  {!showPassword ? (
                    <HiEye cursor={'pointer'} onClick={() => setShowPassword((prev) => !prev)} />
                  ) : (
                    <HiEyeOff cursor="pointer" onClick={() => setShowPassword((prev) => !prev)} />
                  )}
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <FormControl mt={5}>
              <FormLabel>Confirm Password</FormLabel>
              <InputGroup size="lg">
                <Input
                  placeholder="Confirm password"
                  type={showPassword ? 'text' : 'password'}
                  _placeholder={{ fontSize: '14px' }}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <InputRightElement>
                  {!showPassword ? (
                    <HiEye
                      cursor="pointer"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                    />
                  ) : (
                    <HiEyeOff
                      cursor="pointer"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                    />
                  )}
                </InputRightElement>
              </InputGroup>
              {passwordChecks.map((passwordCheck) => (
                <HStack marginTop={30} spacing={2}>
                  <Checkbox
                    colorScheme={passwordCheck.checked ? 'green' : 'gray'}
                    variant={'looney'}
                    isChecked={passwordCheck.checked}
                    size="lg"
                  />
                  <Text fontSize="sm">{passwordCheck.text}</Text>
                </HStack>
              ))}
            </FormControl>
          </Box>
        </Box>
      ),
      canSave: validatePasswordStep,
    },
  ];

  const doSubmit = () => {
    mixpanel.track('Completed onboarding');
    return ApiService.submitTutor(data);
  };

  const openEditModal = (stepId: string) => {
    onEditModalOpen();
    setEditModalStep(stepId);
  };

  const activeStepObj = useMemo(() => steps[activeStep - 1], [activeStep]);

  const stepIndicatorActiveStep = useMemo(
    () => stepIndicatorSteps.find((s) => s.id === activeStepObj?.stepIndicatorId),
    [activeStepObj, stepIndicatorSteps]
  );

  useTitle(stepIndicatorActiveStep?.title || '');

  useEffect(() => {
    mixpanel.identify();
  }, []);

  useEffect(() => {
    if (!activeStepObj) return;

    mixpanel.track(`Onboarding Step Progress (${activeStepObj?.id})`);
  }, [activeStepObj]);

  useEffect(() => {
    if (name.first && name.last) mixpanel.people.set({ $name: `${name.first} ${name.last}` });

    if (email) mixpanel.people.set({ $email: email });

    if (age) mixpanel.people.set({ Age: age });

    if (parentOrStudent) mixpanel.people.set({ 'Parent Or Student': parentOrStudent });

    mixpanel.people.set({ Type: 'Student' });
  }, [email, name, age]);

  useEffect(() => {
    mixpanel.register({ ...data, type: 'student' });
  }, [data]);

  const canSaveCurrentEditModalStep = steps.find((s) => s.id === editModalStep)?.canSave;

  return (
    <Box>
      <Modal
        closeOnEsc={canSaveCurrentEditModalStep}
        closeOnOverlayClick={canSaveCurrentEditModalStep}
        size="xl"
        isOpen={editModalOpen}
        onClose={onEditModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <br />
          </ModalHeader>
          <ModalCloseButton isDisabled={!canSaveCurrentEditModalStep} />
          <ModalBody>
            <Box width={'100%'}>{steps.find((s) => s.id === editModalStep)?.template}</Box>
          </ModalBody>

          <ModalFooter>
            <Button isDisabled={!canSaveCurrentEditModalStep} onClick={onEditModalClose}>
              Done
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <StepIndicator
        activeStep={stepIndicatorSteps.findIndex((s) => s === stepIndicatorActiveStep)}
        steps={stepIndicatorSteps}
      />
      <Box mt={45}>
        <StepWizard
          isLazyMount
          className="flex-col-reverse"
          onStepChange={onStepChange}
          instance={(props) => {
            stepWizardInstance.current = props as unknown as StepWizardChildProps;
          }}>
          {
            steps.map((s) => {
              return (
                <OnboardStep key={s.id} canGoNext={s.canSave}>
                  {s.template}
                </OnboardStep>
              );
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
              <Heading as="h2" size="lg" textAlign={'center'}>
                You're all set {capitalize(name.first)}!
              </Heading>
              <Text color="gray.500" marginTop={2} textAlign="center">
                We'll match you with the best tutors around &amp; we'll shoot you an email at{' '}
                {email} when we're done!
              </Text>
            </Box>
          </OnboardStep>
        </StepWizard>
      </Box>
    </Box>
  );
};

export default OnboardStudent;
