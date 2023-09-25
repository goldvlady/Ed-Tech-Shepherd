import DateInput, { FORMAT } from '../../components/DateInput';
import LargeSelect from '../../components/LargeSelect';
import OnboardStep from '../../components/OnboardStep';
import OnboardSubmitStep from '../../components/OnboardSubmitStep';
import StepIndicator from '../../components/StepIndicator';
import { createUserWithEmailAndPassword, firebaseAuth } from '../../firebase';
import { googleProvider } from '../../firebase';
import { useTitle } from '../../hooks';
import lottieSuccessAnimationData from '../../lottie/73392-success.json';
import ApiService from '../../services/ApiService';
import onboardStudentStore from '../../state/onboardStudentStore';
import resourceStore from '../../state/resourceStore';
import { User } from '../../types';
import { getOptionValue } from '../../util';
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
  useDisclosure
} from '@chakra-ui/react';
import { signInWithPopup } from 'firebase/auth';
import { capitalize, isEmpty } from 'lodash';
import Lottie from 'lottie-react';
import mixpanel from 'mixpanel-browser';
import moment from 'moment';
import { useEffect, useMemo, useRef, useState } from 'react';
import { FiBookOpen, FiCalendar, FiEdit, FiUser } from 'react-icons/fi';
import { HiEye, HiEyeOff } from 'react-icons/hi';
import { useNavigate } from 'react-router';
import { useLocation } from 'react-router';
import StepWizard, {
  StepWizardChildProps,
  StepWizardProps
} from 'react-step-wizard';
import styled from 'styled-components';

const stepIndicatorSteps = [
  {
    title: '',
    icon: <FiUser />,
    id: 'parent-or-student'
  },
  {
    title: '',
    icon: <FiBookOpen />,
    id: 'about-you'
  },
  {
    title: '',
    icon: <FiCalendar />,
    id: 'security'
  }
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
          <img src="/images/beginner.png" alt="beginner" />
        </SkillLevelImg>{' '}
        Beginner
      </SkillLevel>
    ),
    value: 'beginner'
  },
  {
    label: (
      <SkillLevel>
        <SkillLevelImg>
          <img src="/images/intermediate.png" alt="intermediate" />
        </SkillLevelImg>{' '}
        Intermediate
      </SkillLevel>
    ),
    value: 'intermediate'
  },
  {
    label: (
      <SkillLevel>
        <SkillLevelImg>
          <img src="/images/advanced.png" alt="advanced" />
        </SkillLevelImg>{' '}
        Advanced
      </SkillLevel>
    ),
    value: 'advanced'
  }
];

const OnboardStudent = () => {
  const { courses: courseList } = resourceStore();
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const location = useLocation();

  const stepWizardInstance = useRef<StepWizardChildProps | null>(null);

  const {
    isOpen: isSomethingElseModalOpen,
    onOpen: onSomethingElseModalOpen,
    onClose: onSomethingElseModalClose
  } = useDisclosure();
  const [activeStep, setActiveStep] = useState<number>(1);

  const [editModalStep, setEditModalStep] = useState<string | null>(null);
  const {
    isOpen: editModalOpen,
    onOpen: onEditModalOpen,
    onClose: onEditModalClose
  } = useDisclosure();

  const onStepChange: StepWizardProps['onStepChange'] = ({
    activeStep,
    ...rest
  }) => {
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
    skillLevels
  } = data;

  useEffect(() => {
    const preSelectedCourse = new URLSearchParams(location.search).get(
      'course'
    );
    if (preSelectedCourse) {
      setTimeout(() => {
        onboardStudentStore.set.courses([preSelectedCourse]);
      }, 0);
    }
  }, [location.search]);

  const dobValid = moment(dob, FORMAT, true).isValid();
  const age = useMemo(() => moment().diff(moment(dob, FORMAT), 'years'), [dob]);

  const passwordChecks = useMemo(() => {
    const isEightLetters = {
      text: 'Password is eight letters long',
      checked: password.length >= 8
    };

    const isConfirmed = {
      text: 'Password has been confirmed',
      checked: [password, password === confirmPassword].every(Boolean)
    };

    const hasACharacter = {
      text: 'Password has at least one special character',
      checked: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)
    };

    const hasANumber = {
      text: 'Password has at least one number',
      checked: /\d/.test(password)
    };

    return [isEightLetters, isConfirmed, hasACharacter, hasANumber];
  }, [password, confirmPassword]);

  const validatePasswordStep =
    passwordChecks.filter((check) => !check.checked).length === 0;

  const validateParentStudentStep = !!parentOrStudent;
  const validateAboutYouStep =
    !!name.first && !!name.last && !!email && dobValid && !!dob;
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
      // onboardStudentStore.set.courses(without(courses, 'something-else')); --Ask Tobi
    }
  }, [somethingElse, courses]);

  const confirmations = [
    {
      title: 'About you',
      fields: [
        {
          title: 'First Name',
          value: <Text marginBottom={0}>{name.first}</Text>,
          step: 'about-you'
        },
        {
          title: 'Last Name',
          value: <Text marginBottom={0}>{name.last}</Text>,
          step: 'about-you'
        },
        {
          title: 'Date of Birth',
          value: (
            <Text marginBottom={0}>
              {moment(dob, FORMAT).format('MMMM Do YYYY')}
            </Text>
          ),
          step: 'about-you'
        },
        {
          title: 'Email Address',
          value: <Text marginBottom={0}>{email}</Text>,
          step: 'about-you'
        }
      ]
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
          step: 'classes'
        }
      ]
    },
    {
      title: 'Availability',
      fields: [
        {
          title: 'Time zone',
          value: <Text marginBottom={0}>{tz}</Text>,
          step: 'availability'
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
                        .format('hh:mm A')} - ${moment(s.end)
                        .tz(tz)
                        .format('hh:mm A')}`
                  );
                })
                .join('\n')}
            </Text>
          ),
          step: 'availability'
        }
      ]
    }
  ];

  const doSubmit = async () => {
    mixpanel.track('Completed onboarding');

    const user = await firebaseAuth.currentUser;
    let firebaseId: string | null | undefined = user?.uid;

    if (!firebaseId) {
      const firebaseUser = await createUserWithEmailAndPassword(
        firebaseAuth,
        data.email,
        password
      );
      firebaseId = firebaseUser.user.uid;
    }

    await ApiService.createUser({
      ...data,
      // @ts-ignore FIXME: to resolve later
      firebaseId,
      type: 'student'
    });

    const response = await ApiService.submitStudent(data);
    return response;
  };

  const triggerOauth = async () => {
    try {
      const result = await signInWithPopup(firebaseAuth, googleProvider);
      const { uid: firebaseId, email, photoURL } = result.user;
      const userResp = result['_tokenResponse'];

      const userPayload = {
        email: email as string,
        avatar: photoURL as string,
        name: {
          first: userResp?.firstName,
          last: userResp?.firstName
        },
        dob: ''
      };
      await ApiService.createUser({
        ...userPayload,
        firebaseId,
        type: 'student'
      });
      const response = await ApiService.submitStudent(data);
      if (response.status === 200) {
        navigate('/verification_pending');
      }
    } catch (error) {
      // console.log(error);
    }
  };

  // const openEditModal = (stepId: string) => {
  //   onEditModalOpen();
  //   setEditModalStep(stepId);
  // };

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
              onChange={(v) => {
                if (v === 'tutor') navigate('/onboard/tutor');
                else {
                  onboardStudentStore.set.parentOrStudent(v);
                  stepWizardInstance.current?.goToStep(2);
                }
              }}
              options={[
                {
                  value: 'student',
                  title: 'Student',
                  subtitle:
                    'Enroll as a student and unlock your learning potential',
                  icon: <img src="/images/studentIcon.svg" alt="student icon" />
                },
                {
                  value: 'tutor',
                  title: 'Tutor',
                  subtitle: 'Become a tutor and unlock your earning potential',
                  icon: <img src={'/images/tutorIcn.svg'} alt="tutor" />
                }
              ]}
            />
          </Box>
        </Box>
      ),
      canSave: validateParentStudentStep
    },
    {
      id: 'about-you',
      stepIndicatorId: 'about-you',
      showOAuthButton: true,
      handleAuth: triggerOauth,
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
                    first: e.target.value
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
                    last: e.target.value
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
      canSave: validateAboutYouStep
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
                    <HiEye
                      cursor={'pointer'}
                      onClick={() => setShowPassword((prev) => !prev)}
                    />
                  ) : (
                    <HiEyeOff
                      cursor="pointer"
                      onClick={() => setShowPassword((prev) => !prev)}
                    />
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
      canSave: validatePasswordStep
    }
  ];
  const activeStepObj = useMemo(() => steps[activeStep - 1], [activeStep]);

  const stepIndicatorActiveStep = useMemo(
    () =>
      stepIndicatorSteps.find((s) => s.id === activeStepObj?.stepIndicatorId),
    [activeStepObj]
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
    if (name.first && name.last)
      mixpanel.people.set({ $name: `${name.first} ${name.last}` });

    if (email) mixpanel.people.set({ $email: email });

    if (age) mixpanel.people.set({ Age: age });

    if (parentOrStudent)
      mixpanel.people.set({ 'Parent Or Student': parentOrStudent });

    mixpanel.people.set({ Type: 'Student' });
  }, [email, name, age, parentOrStudent]);

  useEffect(() => {
    mixpanel.register({ ...data, type: 'student' });
  }, [data]);

  const canSaveCurrentEditModalStep = steps.find(
    (s) => s.id === editModalStep
  )?.canSave;

  return (
    <Box>
      <Modal
        closeOnEsc={canSaveCurrentEditModalStep}
        closeOnOverlayClick={canSaveCurrentEditModalStep}
        size="xl"
        isOpen={editModalOpen}
        onClose={onEditModalClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <br />
          </ModalHeader>
          <ModalCloseButton isDisabled={!canSaveCurrentEditModalStep} />
          <ModalBody>
            <Box width={'100%'}>
              {steps.find((s) => s.id === editModalStep)?.template}
            </Box>
          </ModalBody>

          <ModalFooter>
            <Button
              isDisabled={!canSaveCurrentEditModalStep}
              onClick={onEditModalClose}
            >
              Done
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <StepIndicator
        activeStep={stepIndicatorSteps.findIndex(
          (s) => s === stepIndicatorActiveStep
        )}
        steps={stepIndicatorSteps}
      />
      <Box mt={45}>
        <StepWizard
          isLazyMount
          className="flex-col-reverse"
          onStepChange={onStepChange}
          instance={(props) => {
            stepWizardInstance.current =
              props as unknown as StepWizardChildProps;
          }}
        >
          {
            steps.map((s) => {
              return (
                <OnboardStep {...s} key={s.id} canGoNext={s.canSave}>
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
                <Lottie
                  style={{ height: 100 }}
                  animationData={lottieSuccessAnimationData}
                />
              </Box>
              <Heading as="h2" size="lg" textAlign={'center'}>
                You're all set {capitalize(name.first)}!
              </Heading>
              <Text color="gray.500" marginTop={2} textAlign="center">
                We'll match you with the best tutors around &amp; we'll shoot
                you an email at {email} when we're done!
              </Text>
            </Box>
          </OnboardStep>
        </StepWizard>
      </Box>
    </Box>
  );
};

export default OnboardStudent;
