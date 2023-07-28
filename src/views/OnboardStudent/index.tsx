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
    title: 'Select Status',
    icon: <FiUser />,
    id: 'parent-or-student'
  },
  {
    title: 'Classes',
    icon: <FiBookOpen />,
    id: 'about-you'
  },
  {
    title: 'Security',
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
                  value: 'tutor',

                  title: 'Tutor',
                  subtitle: 'Become a tutor and unlock your earning potential',
                  icon: (
                    <svg
                      width="36"
                      height="36"
                      viewBox="0 0 36 36"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect width="36" height="36" fill="url(#pattern0)" />
                      <defs>
                        <pattern
                          id="pattern0"
                          patternContentUnits="objectBoundingBox"
                          width="1"
                          height="1"
                        >
                          <use
                            xlinkHref="#image0_1121_28216"
                            transform="scale(0.00195312)"
                          />
                        </pattern>
                        <image
                          id="image0_1121_28216"
                          width="512"
                          height="512"
                          xlinkHref="data:image/png;base64,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"
                        />
                      </defs>
                    </svg>
                  )
                },
                {
                  value: 'student',
                  title: 'Student',
                  subtitle:
                    'Enroll as a student and unlock limitless learning ',
                  icon: (
                    <svg
                      width="36"
                      height="36"
                      viewBox="0 0 36 36"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      xmlnsXlink="http://www.w3.org/1999/xlink"
                    >
                      <rect width="36" height="36" fill="url(#pattern0)" />
                      <defs>
                        <pattern
                          id="pattern0"
                          patternContentUnits="objectBoundingBox"
                          width="1"
                          height="1"
                        >
                          <use
                            xlinkHref="#image0_978_11488"
                            transform="scale(0.00195312)"
                          />
                        </pattern>
                        <image
                          id="image0_978_11488"
                          width="512"
                          height="512"
                          xlinkHref="data:image/png;base64,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"
                        />
                      </defs>
                    </svg>
                  )
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
