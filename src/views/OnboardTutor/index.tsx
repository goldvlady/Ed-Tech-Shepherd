import React, { useCallback, useEffect, useMemo, useState } from "react";
import { HiEye, HiEyeOff } from "react-icons/hi";
import StepIndicator from "../../components/StepIndicator";
import {
  FiUser,
  FiCalendar,
  FiBookOpen,
  FiDollarSign,
  FiEdit,
} from "react-icons/fi";
import DragAndDrop from "../../components/DragandDrop";
import SelectComponent from "../../components/Select";
import {
  Box,
  FormLabel,
  Heading,
  Input,
  Text,
  CircularProgress,
  InputGroup,
  InputLeftAddon,
  Alert,
  AlertIcon,
  VStack,
  useToast,
  Flex,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  StackDivider,
  Avatar,
  Textarea,
  FormControl,
  AlertDescription,
  HStack,
  Checkbox,
  InputRightElement,
} from "@chakra-ui/react";
import StepWizard, { StepWizardProps } from "react-step-wizard";
import LargeSelect from "../../components/LargeSelect";
import OnboardStep from "../../components/OnboardStep";
import onboardTutorStore from "../../state/onboardTutorStore";
import CourseSelect from "../../components/CourseSelect";
import { capitalize, isEmpty, sumBy } from "lodash";
import ScheduleBuilder from "../../components/ScheduleBuilder";
import OnboardSubmitStep from "../../components/OnboardSubmitStep";
import Lottie from "lottie-react";

import lottieSuccessAnimationData from "../../lottie/73392-success.json";
import { useTitle } from "../../hooks";
import ApiService from "../../services/ApiService";
import TimezoneSelect from "../../components/TimezoneSelect";

import moment from "moment";
import EmptyState from "../../components/EmptyState";

import occupationList from "../../occupations.json";
import { ref } from "@firebase/storage";
import { getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { storage } from "../../firebase";
import { getOptionValue } from "../../util";
import FileDisplay from "../../components/FileDisplay";
import { Course } from "../../types";

import DateInput, { FORMAT } from "../../components/DateInput";
import { FORMAT as TIME_PICKER_FORMAT } from "../../components/TimePicker";
import mixpanel from "mixpanel-browser";
import CreatableSelect from "../../components/CreatableSelect";
import { MdInfo } from "react-icons/md";
import theme from "../../theme";

const occupationOptions = occupationList.map((o) => {
  return { label: o, value: o };
});

const stepIndicatorSteps = [
  {
    title: "About you",
    icon: <FiUser />,
    id: "about-you",
  },
  {
    title: "Id Verification",
    icon: <FiBookOpen />,
    id: "id_verification",
  },
  {
    title: "Security",
    icon: <FiCalendar />,
    id: "security",
  },
];

const educationLevelOptions = [
  {
    label: "Primary School Certificate",
    value: "primary-school-cert",
  },
  {
    label: "Junior Secondary School Certificate",
    value: "junior-secondary-school-cert",
  },
  {
    label: "Senior Secondary School Certificate",
    value: "senior-secondary-school-cert",
  },
  {
    label: "National Diploma (ND)",
    value: "national-diploma",
  },
  {
    label: "Higher National Diploma (HND)",
    value: "higher-national-diploma",
  },
  {
    label: "Bachelor's Degree (BSc, BA, BEng, etc.)",
    value: "bachelors-degree",
  },
  {
    label: "Master's Degree (MSc, MA, MEng, etc.)",
    value: "masters-degree",
  },
  {
    label: "Doctoral Degree (PhD, MD, etc.)",
    value: "doctoral-degree",
  },
  {
    label: "Vocational/Technical Certificate",
    value: "vocation-technical-cert",
  },
];


const OnboardTutor = () => {
  const toast = useToast();
  const [courseList, setCourseList] = useState<Course[]>([]);
  const [confirmDocument, setConfirmDocument] = useState(false);
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [activeStep, setActiveStep] = useState<number>(1);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [editModalStep, setEditModalStep] = useState<string | null>(null);
  const {
    isOpen: editModalOpen,
    onOpen: onEditModalOpen,
    onClose: onEditModalClose,
  } = useDisclosure();

  const data = onboardTutorStore.useStore();
  const {
    name,
    dob,
    email,
    schedule,
    country,
    identityDocument,
    tz,
  } = data;

  const totalAvailableHours = useMemo(
    () =>
      sumBy(
        Object.keys(schedule)
          .map(function (key: any) {
            return schedule[key];
          })
          .flat(),
        (o) => {
          return moment
            .duration(
              moment(o.end, TIME_PICKER_FORMAT).diff(
                moment(o.begin, TIME_PICKER_FORMAT)
              )
            )
            .asHours();
        }
      ),
    [schedule]
  );

  const dobValid = moment(dob, FORMAT, true).isValid();
  const age = useMemo(() => moment().diff(moment(dob, FORMAT), "years"), [dob]);

  const validateNameStep = !!name.first && !!name.last;
  const validateCredentialsStep = !!country && !!identityDocument

  const [cvUploadPercent, setCvUploadPercent] = useState(0);
  const [selectedCV, setSelectedCV] = useState<File | null>(null);

  const [avatarUploadPercent, setAvatarUploadPercent] = useState(0);
  const [selectedAvatar, setSelectedAvatar] = useState<File | null>(null);
  const [selectedIdDoc, setSelectedIdDoc] = useState<File | null>(null);

  useEffect(() => {
    onboardTutorStore.set.cv("");

    if (!selectedCV) return;

    if (selectedCV?.size > 2000000) {
      toast({
        title: "Please upload a file under 2MB",
        status: "error",
        position: "top",
        isClosable: true,
      });
      return;
    }

    const storageRef = ref(storage, `files/${selectedCV.name}`);
    const uploadTask = uploadBytesResumable(storageRef, selectedCV);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
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
    onboardTutorStore.set.identityDocument?.("");

    if (!selectedIdDoc) return;

    if (selectedIdDoc?.size > 1000000) {
      toast({
        title: "Please upload a file under 1MB",
        status: "error",
        position: "top",
        isClosable: true,
      });
      return;
    }

    const storageRef = ref(storage, `files/${selectedIdDoc.name}`);
    const uploadTask = uploadBytesResumable(storageRef, selectedIdDoc);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        // setAvatarUploadPercent(progress);
      },
      (error) => {
        // setAvatarUploadPercent(0);
        alert(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          onboardTutorStore.set.identityDocument?.(downloadURL);
        });
      }
    );
  }, [selectedIdDoc]);

  useEffect(() => {
    onboardTutorStore.set.avatar?.("");

    if (!selectedAvatar) return;

    if (selectedAvatar?.size > 1000000) {
      toast({
        title: "Please upload a file under 1MB",
        status: "error",
        position: "top",
        isClosable: true,
      });
      return;
    }

    const storageRef = ref(storage, `files/${selectedAvatar.name}`);
    const uploadTask = uploadBytesResumable(storageRef, selectedAvatar);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
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
      value: "primary-school",
    },
    {
      label: "Secondary School",
      value: "secondary-school",
    },
    {
      label: "University and above",
      value: "university-plus",
    },
  ];

  const doSubmit = () => {
    mixpanel.track("Completed onboarding");
    return ApiService.submitTutorLead(data);
  };

  const onStepChange: StepWizardProps["onStepChange"] = ({
    activeStep,
    ...rest
  }) => {
    setActiveStep(activeStep);
  };

  const passwordChecks = useMemo(() => {
    const isEightLetters = {
      text: "Password is eight letters long",
      checked: password.length >= 8,
    };

    const isConfirmed = {
      text: "Password has been confirmed",
      checked:
      password ===
        confirmPassword,
    };

    const hasACharacter = {
      text: "Password has at least one special character",
      checked: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password),
    };

    const hasANumber = {
      text: "Password has at least one number",
      checked: /\d/.test(password),
    };

    return [isEightLetters, isConfirmed, hasACharacter, hasANumber];
  }, [
    password,
    confirmPassword,
  ]);

  const validatePasswordStep = passwordChecks.filter(check => !check.checked).length === 0

  console.log(validatePasswordStep)

  // const confirmations = [
  //   {
  //     title: "About you",
  //     fields: [
  //       {
  //         title: "First Name",
  //         value: <Text marginBottom={0}>{name.first}</Text>,
  //         step: "name",
  //       },
  //       {
  //         title: "Last Name",
  //         value: <Text marginBottom={0}>{name.last}</Text>,
  //         step: "name",
  //       },
  //       {
  //         title: "Date of Birth",
  //         value: (
  //           <Text marginBottom={0}>
  //             {moment(dob, FORMAT).format("MMMM Do YYYY")}
  //           </Text>
  //         ),
  //         step: "dob",
  //       },
  //       {
  //         title: "Email Address",
  //         value: <Text marginBottom={0}>{email}</Text>,
  //         step: "email",
  //       },
  //       {
  //         title: "Current Occupation",
  //         value: <Text marginBottom={0}>{occupation}</Text>,
  //         step: "more-info",
  //       },
  //       {
  //         title: "Highest Level of Education Obtained",
  //         value: (
  //           <Text marginBottom={0}>
  //             {
  //               educationLevelOptions.find(
  //                 (el) => el.value === highestLevelOfEducation
  //               )?.label
  //             }
  //           </Text>
  //         ),
  //         step: "more-info",
  //       },
  //       {
  //         title: "CV",
  //         value: !!selectedCV && (
  //           <FileDisplay marginTop={1} file={selectedCV as File} />
  //         ),
  //         step: "more-info",
  //       },
  //       {
  //         title: "Level of students you can teach",
  //         value: (
  //           <Text marginBottom={0}>
  //             {teachLevel
  //               .map((tc) => {
  //                 return teachLevelOptions.find((ac) => ac.value === tc)?.label;
  //               })
  //               .join(", ")}
  //           </Text>
  //         ),
  //         step: "more-info",
  //       },
  //     ],
  //   },
  //   {
  //     title: "Profile",
  //     fields: [
  //       {
  //         title: "Avatar",
  //         value: !!selectedAvatar && (
  //           <FileDisplay
  //             prefix={avatar ? <Avatar src={avatar} /> : null}
  //             marginTop={1}
  //             file={selectedAvatar as File}
  //           />
  //         ),
  //         step: "profile-setup",
  //       },
  //       {
  //         title: "About you",
  //         value: <Text marginBottom={0}>{description}</Text>,
  //         step: "profile-setup",
  //       },
  //     ],
  //   },
  //   {
  //     title: "Classes",
  //     fields: [
  //       {
  //         title: "Classes",
  //         value: (
  //           <Text marginBottom={0}>
  //             {courses
  //               .map((tc) => {
  //                 return courseList.find((ac) => ac.id === tc)?.title;
  //               })
  //               .join(", ")}
  //           </Text>
  //         ),
  //         step: "classes",
  //       },
  //     ],
  //   },
  //   {
  //     title: "Availability",
  //     fields: [
  //       {
  //         title: "Time zone",
  //         value: <Text marginBottom={0}>{tz}</Text>,
  //         step: "availability",
  //       },
  //       {
  //         title: "Schedule",
  //         value: <Text marginBottom={0} whiteSpace={"pre"}></Text>,
  //         step: "availability",
  //       },
  //     ],
  //   },
  //   {
  //     title: "Rate",
  //     fields: [
  //       {
  //         title: "Hourly rate",
  //         value: <Text marginBottom={0}>${rate}</Text>,
  //         step: "rate",
  //       },
  //     ],
  //   },
  // ];

  const steps = [
    {
      id: "name",
      stepIndicatorId: "about-you",
      template: (
        <Box>
          <Heading as="h3" size="lg" textAlign={"center"}>
            First we need some information about you.
            <br />
            What's your name?
          </Heading>
          <Box marginTop={30}>
            <FormControl>
              <FormLabel>First Name</FormLabel>
              <Input
                size={"lg"}
                value={name.first}
                onChange={(e) =>
                  onboardTutorStore.set.name({ ...name, first: e.target.value })
                }
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Last Name</FormLabel>
              <Input
                size={"lg"}
                value={name.last}
                onChange={(e) =>
                  onboardTutorStore.set.name({ ...name, last: e.target.value })
                }
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Email</FormLabel>
              <Input
                size={"lg"}
                value={email}
                onChange={(e) => onboardTutorStore.set.email(e.target.value)}
              />
            </FormControl>
          </Box>
        </Box>
      ),
      canSave: validateNameStep,
    },
    {
      id: "id_verification",
      stepIndicatorId: "id_verification",
      template: (
        <Box>
          <Heading as="h3" size="lg" textAlign={"center"}>
            First we need some information about you.
            <br />
            What's your name?
          </Heading>
          <Box marginTop={30}>
            <SelectComponent
              options={[
                { value: "us", label: "United States" },
                { value: "ca", label: "Canada" },
                { value: "uk", label: "United Kingdom" },
              ]}
              onChange={(e: any) => {
                country &&  onboardTutorStore.set.country?.(e.value);
              }}
              placeholder="Select a country"
              isSearchable
              // Add any additional props you want to pass
            />
            <DragAndDrop
              marginTop={30}
              onFileUpload={(file) => setSelectedIdDoc(file)}
            />
            <HStack marginTop={30} spacing={2}>
              <Checkbox
                borderRadius={"4px"}
                colorScheme={"blue"}
                isChecked={confirmDocument}
                onChange={(e) =>
                  setConfirmDocument(e.target.checked)  
                }
                size="lg"
              />
              <Text fontSize="sm">
                I confirm that I uploaded a valid government issued photo ID.
              </Text>
            </HStack>
          </Box>
        </Box>
      ),
      canSave: validateCredentialsStep,
    },
    {
      id: "security",
      stepIndicatorId: "security",
      template: (
        <Box>
          <Heading as="h3" size="lg" textAlign={"center"}>
            First we need some information about you.
            <br />
            Hi there, before you proceed, let us know who is signing up{" "}
          </Heading>
          <Box marginTop={30}>
            <FormControl>
              <FormLabel>Password</FormLabel>
              <InputGroup size="lg">
                <Input
                  placeholder="Create password"
                  type={showPassword ? "text" : "password"}
                  _placeholder={{ fontSize: "14px" }}
                  value={password}
                  onChange={(e) =>
                    setConfirmPassword(e.target.value)
                  }
                />
                <InputRightElement>
                  {!showPassword ? (
                    <HiEye
                      cursor={"pointer"}
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
                  type={showPassword ? "text" : "password"}
                  _placeholder={{ fontSize: "14px" }}
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(e.target.value)
                  }
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
                    colorScheme={passwordCheck.checked ? "green" : "gray"}
                    variant={"looney"}
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

  const openEditModal = (stepId: string) => {
    onEditModalOpen();
    setEditModalStep(stepId);
  };

  const activeStepObj = useMemo(() => steps[activeStep - 1], [activeStep]);

  const stepIndicatorActiveStep = useMemo(
    () =>
      stepIndicatorSteps.find((s) => s.id === activeStepObj?.stepIndicatorId),
    [activeStepObj, stepIndicatorSteps]
  );

  useTitle(stepIndicatorActiveStep?.title || "");

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

    mixpanel.people.set({ Type: "Tutor" });
  }, [email, name, age]);

  useEffect(() => {
    mixpanel.register({ ...data, type: "tutor" });
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
            <Box width={"100%"}>
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
        >
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
                <Lottie
                  style={{ height: 100 }}
                  animationData={lottieSuccessAnimationData}
                />
              </Box>
              <Heading as="h2" size="lg" textAlign={"center"}>
                You're all set {capitalize(name.first)}!
              </Heading>
              <Text color="gray.500" marginTop={2} textAlign="center">
                We'll match you with students within your availability &amp;
                shoot you an email at {email} with next steps!
              </Text>
            </Box>
          </OnboardStep>
        </StepWizard>
      </Box>
    </Box>
  );
};

export default OnboardTutor;