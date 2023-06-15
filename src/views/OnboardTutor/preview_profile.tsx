import React, { useState, ReactNode, useRef, useMemo, useEffect } from "react";
import cloud from "../../assets/cloud.svg";
import { FaFileAlt, FaPen, FaPlay, FaEdit, FaPause } from "react-icons/fa";
import {
  Box,
  Button,
  Flex,
  Icon,
  HStack,
  Text,
  Stack,
  VStack,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Image,
  TableContainer,
  BorderProps
} from "@chakra-ui/react";
import EditProfileModal from "./components/EditProfileStepModal";
import { EditIcon, CheckIcon } from "@chakra-ui/icons";
import { motion } from "framer-motion";
import { Schedule, SingleSchedule, TimeSchedule } from '../../types';
import ProfilePictureForm from "./components/steps/profile_picture.step";
import PaymentInformationForm from "./components/steps/payment_information.step";
import HourlyRateForm from "./components/steps/hourly_rate.step";
import SubjectLevelForm from "./components/steps/add_subjects";
import AvailabilityForm from "./components/steps/availabilty.steps";
import QualificationsForm from "./components/steps/qualifications.step";
import IntroVideoForm from "./components/steps/intro_video.step";
import BioForm from "./components/steps/bio.step";
import StepsLayout from "./components/StepsLayout";
import styled from "styled-components";
import Header from "../../components/Header";

import onboardTutorStore from "../../state/onboardTutorStore";

const Root = styled(Box)`
  display: flex;
  background: #f5f5f5;
  justify-content: center;
  align-items: center;
  max-width: 100vw;
  width: 100%;
`;

const MainWrapper = styled(Box)`
  background: #f5f5f5;
  min-width: 100vw;
  min-height: 100vh;
`;

type Step = {
  id: string;
  position: number;
  title: string;
  supportingText: string;
  element: React.FC;
  isValid?: boolean;
};

export type Availability = { [key: string]: SlotData };
export interface SlotData {
  timezone: string;
  slots: string[];
}


const CourseTable = () => {
  const { coursesAndLevels, rate } = onboardTutorStore.useStore();
  return (
    <TableContainer my={4}>
      <Box border={'1px solid #EEEFF2'} borderRadius={8}>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th
                p={5}
                bg="#FAFAFA"
                borderTopLeftRadius="8px"
                borderRight="1px solid #EEEFF2"
              />
              <Th
                p={5}
                bg="#FFFFFF"
                borderTopLeftRadius="8px"
                borderRight="1px solid #EEEFF2"
              >
                Level
              </Th>
              <Th bg="#FFFFFF" borderRadius="8px">
                Price
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {coursesAndLevels.map((subLevel) => (
              <Tr>
                <Td paddingY={5} borderRight="1px solid #EEEFF2" bgColor={'#FAFAFA'}> {subLevel.course.label}</Td>
                <Td borderRight="1px solid #EEEFF2" paddingY={5}>{subLevel.level.label}</Td>
                <Td paddingY={5}>${rate}/hr</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </TableContainer>
  );
};

const ProfileDiv = ({ onEdit }: { onEdit: (v: string) => void }) => {
  const { avatar, qualifications, rate } = onboardTutorStore.useStore();
  const [showAlternateImage, setShowAlternateImage] = useState(false);

  const toggleImage = () => {
    setShowAlternateImage(!showAlternateImage);
  };

  return (
    <Box
      width="100%"
      bg="#FFFFFF"
      border="1px solid #EEEFF1"
      borderRadius="20px"
    >
      {/* Upper Section */}
      <VStack p="30px" alignItems="center">
        {/* Avatar */}
        <Box position="relative">
          <Image
            src={avatar}
            alt="Avatar"
            width="150px"
            height="150px"
            
            borderRadius="50%"
          />
          {/* Edit Icon */}
          <Box
            position="absolute"
            bottom="0"
            right="0"
            bg="#207DF7"
            borderRadius="50%"
            width="40px"
            height="40px"
            display="flex"
            justifyContent="center"
            alignItems="center"
            onClick={() => onEdit("upload_profile_picture")}
            cursor="pointer"
          >
            <FaPen color="#FFF" fontSize="14px" />
          </Box>
        </Box>

        {/* Name and Qualification */}
        <Box textAlign="center">
          <Text
            fontWeight="500"
            p={0}
            marginTop={"7px"}
            marginBottom={0}
            fontSize="18px"
            lineHeight="21px"
            color="#212224"
          >
            John Doe
          </Text>
          <Text
            fontWeight="400"
            p={0}
            marginTop={"7px"}
            marginBottom={0}
            fontSize="16px"
            lineHeight="20px"
            color="#6E7682"
          >
            {qualifications && qualifications[0].degree}
          </Text>
        </Box>
      </VStack>

      {/* Lower Section */}
      <Flex
        flexDirection="column"
        mt={"10px"}
        borderTop="1px solid #ECEDEE"
        p="20px 30px 30px"
      >
        {/* Hourly Rate */}
        <Flex justifyContent="space-between" alignItems="center">
          <HStack display={"flex"} alignItems={"baseline"} textAlign="center">
            <Text
              fontWeight="400"
              p={0}
              m={0}
              marginTop={"7px"}
              marginBottom={0}
              fontSize="12px"
              lineHeight="21px"
              color="#6E7682"
            >
              HOURLY RATE
            </Text>
            <Text
              fontWeight="500"
              p={0}
              m={0}
              marginTop={"7px"}
              marginBottom={0}
              fontSize="16px"
              lineHeight="20px"
              color="#212224"
            >
              ${rate}
            </Text>
          </HStack>
          <Button
            border="1px solid #ECEDEE"
            color="#212224"
            borderRadius="50%"
            p="5px"
            backgroundColor="transparent"
            onClick={() => onEdit("hourly_rate")}
          >
            <Icon color="#6E7682" as={FaPen} boxSize="12px" />
          </Button>
        </Flex>
        <Button mt="40px" colorScheme="blue" variant="solid" borderRadius="8px">
          Confirm Profile
        </Button>
      </Flex>
    </Box>
  );
};

const AvailabilityTable = () => {
  const { schedule } = onboardTutorStore.useStore();
  const [availability, setTutorAvailability] = useState<{ [key: string]: SlotData }>(
    {}
  );

  function formatScheduleToAvailability(schedule: Schedule): Availability {
    const storedAvailability: Availability = {};

    const dayMap: { [key: number]: string } = {
      1: 'sunday',
      2: 'monday',
      3: 'tuesday',
      4: 'wednesday',
      5: 'thursday',
      6: 'friday',
      7: 'saturday',
    };

    Object.keys(schedule).forEach((dayNumber: string) => {
      const day: string = dayMap[parseInt(dayNumber)];
      const timeSlots: TimeSchedule[] = schedule[parseInt(dayNumber)];

      const formattedSlots: string[] = timeSlots.map((timeSlot) => {
        return `${timeSlot.begin} - ${timeSlot.end}`;
      });

      storedAvailability[day] = { timezone: '', slots: formattedSlots };
    });

    return storedAvailability;
  }

  useEffect(() => {
    const availability = formatScheduleToAvailability(schedule)
    setTutorAvailability(availability)
  }, [])


  const timeSlots = ["8AM → 12PM", "12AM → 5PM", "5PM → 9PM", "9PM → 12AM"];

  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const renderAvailabilityCell = (slot: string, day: string) => {
    console.log(slot)
    const fullDayName = Object.keys(availability).find((d) =>
      d.includes(day.toLowerCase())
    );
    if (!fullDayName) return checkedOut;
    const slotData = availability[fullDayName];

    // Convert slot to 24-hour format for comparison
    console.log("before split", slot.split(/\s*→\s*/))

    const slot24h = slot.split(/\s*→\s*/).map(time12h => {
      const hour = time12h.slice(0, -2);
      const modifier = time12h.slice(-2).toLowerCase();
      return `${hour}${modifier}`;
    }).join("");

    console.log(slot24h, slotData.slots, slotData.slots.map(slot => slot.replace(/[^a-zA-Z0-9]/g, "").replace("undefined", "")))

    if (slotData && slotData.slots.some(slot => slot.replace(/[^a-zA-Z0-9]/g, "").replace("undefined", "").toLowerCase() === slot24h)) {
      console.log("down here")
      return (
        <VStack
          width="100%" // add this
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <CheckIcon color="green" />
        </VStack>
      );
    }
    return checkedOut;
  };

  const checkedOut = (
    <svg width="100%" height="100px" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="pattern" patternUnits="userSpaceOnUse" width="25" height="20" patternTransform="rotate(45)">
          <rect width="30" height="20" fill="#F7F7F8"></rect>
          <rect x="10" width="30" height="20" fill="#fff"></rect>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#pattern)"></rect>
    </svg>
  );
  return (
    <TableContainer my={4}>
      <Box border={'1px solid #EEEFF2'} borderRadius={8}>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th
                p={5}
                borderRight="1px solid #EEEFF2"
                bg="#FAFAFA"
                borderRadius="8px"
              />
              {daysOfWeek.map((day, index) => {
                const props: BorderProps = {}
                if (daysOfWeek.length - 1 !== index) {
                  props.borderRight = "1px solid #EEEFF2"
                }
                return (
                  <Th
                    textAlign="center" // Add this line
                    verticalAlign="middle" // Add this line
                    key={day}
                    p={5}
                    {...props}
                    bg="#FFFFFF"
                  >
                    {day}
                  </Th>
                )
              })}
            </Tr>
          </Thead>
          <Tbody>
            {timeSlots.map((slot, index) => {
              const props: BorderProps = {}
              if (daysOfWeek.length - 1 !== index) {
                props.borderRight = "1px solid #EEEFF2"
              }
              return (
                <Tr key={slot}>
                  <Td
                    paddingY={5} borderRight="1px solid #EEEFF2" bgColor={'#FAFAFA'}
                  >
                    <HStack
                      display={"flex"}
                      marginRight="13px"
                      justifyItems="center"
                      alignItems={"center"}
                    >
                      <img
                        alt=""
                        style={{ marginRight: "2px" }}
                        src={cloud}
                        width={"40px"}
                      />
                      <Text
                        m={0}
                        p={0}
                        fontSize={"14px"}
                        fontWeight={500}
                        color={"#585F68"}
                        whiteSpace={"nowrap"}
                      >
                        {slot}
                      </Text>
                    </HStack>
                  </Td>
                  {daysOfWeek.map((day) => (
                    <Td
                      m={0}
                      p={0}
                      {...props}
                      key={`${slot}-${day}`}
                    >
                      {renderAvailabilityCell(slot, day)}
                    </Td>
                  ))}
                </Tr>
              )
            })}

          </Tbody>
        </Table>
      </Box>
    </TableContainer>
  );
};

const VideoViewingSection = ({ onEdit }: { onEdit: () => void }) => {
  const { introVideo } = onboardTutorStore.useStore();
  const [isVideoPlaying, setVideoPlaying] = useState(false);
  const [isHovered, setHovered] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  const handlePlayVideo = () => {
    console.log("Here");
    if (videoRef.current?.paused) {
      videoRef.current?.play();
    } else {
      videoRef.current?.pause();
    }
    setVideoPlaying(videoRef.current?.paused || false);
  };

  const handleEditVideo = () => {
    onEdit()
    // Add your edit video functionality here
  };

  const handleMouseEnter = () => {
    setHovered(true);
  };

  const handleMouseLeave = () => {
    setHovered(false);
  };

  return (
    <div
      style={{ width: "100%", borderRadius: "20px", position: "relative" }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Video */}
      <video
        ref={videoRef}
        src={introVideo} // Replace with your video link
        controls={isVideoPlaying}
        style={{ width: "100%", borderRadius: "20px" }}
      />

      {/* Dark Overlay */}
      {(isVideoPlaying && isHovered) ||
        (!isVideoPlaying && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: "20px",
            }}
          >
            {/* Play/Pause Button */}
            <button
              onClick={handlePlayVideo}
              style={{
                background: "#FFF",
                border: "none",
                color: "#000",
                fontSize: "14px",
                cursor: "pointer",
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginRight: "20px",
              }}
            >
              {isVideoPlaying ? <FaPause /> : <FaPlay />}
            </button>

            <Text marginTop={"10px"} cursor={"pointer"} onClick={handleEditVideo}
              color={"#fff"}>Update Intro Video</Text>

            {/* Edit Button
            <button
              onClick={handleEditVideo}
              style={{
                background: "#FFF",
                border: "none",
                color: "#000",
                fontSize: "14px",
                cursor: "pointer",
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Icon color="#6E7682" as={FaPen} boxSize="12px" /> Update Intro Video
            </button> */}

          </div>
        ))}
    </div>
  );
};

const QualificationsSegment = () => {
  const { qualifications: rawQualifications } = onboardTutorStore.useStore();

  const qualifications = rawQualifications ? rawQualifications.filter((qualification, index, self) =>
    index === self.findIndex((qual) => (
      `${qual.institution}${qual.degree}${qual.startDate.getTime()}${qual.endDate.getTime()}` ===
      `${qualification.institution}${qualification.degree}${qualification.startDate.getTime()}${qualification.endDate.getTime()}`
    ))
  ) : [];

  return (
    <Box background="#FFFFFF">
      {qualifications && qualifications.map((qualification, index) => (
        <Flex
          borderBottom={
            qualifications && index !== qualifications.length - 1 ? "1px solid #ECEDEE" : ""
          }
          paddingBottom={"15px"}
          key={index}
          mb={4}
        >
          <Button
            border="1px solid #ECEDEE"
            color="#ECEDEE"
            h="50px"
            w="50px"
            marginRight={"10px"}
            borderRadius="50%"
            boxShadow={"0px 2px 8px rgba(77, 77, 77, 0.08)"}
            backgroundColor="transparent"
          >
            <FaFileAlt size={30} />
          </Button>
          <VStack alignItems="flex-start">
            <Text
              fontWeight={500}
              fontSize="16px"
              marginBottom={0}
              lineHeight="21px"
              letterSpacing="0.007em"
              color="#212224"
            >
              {qualification.institution}
            </Text>
            <Text
              fontWeight={400}
              fontSize="14px"
              lineHeight="20px"
              color="#585F68"
            >
              {qualification.degree}
            </Text>
            <Text
              fontWeight={400}
              fontSize="14px"
              lineHeight="20px"
              color="#585F68"
            >
              {new Date(qualification.startDate).getFullYear()} -{" "}
              {new Date(qualification.endDate).getFullYear()}
            </Text>
          </VStack>
        </Flex>
      ))}
    </Box>
  );
};

const PreviewSegment = ({
  title,
  children,
  onEdit
}: {
  title: string;
  children: ReactNode;
  onEdit: () => void
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{ width: "100%" }}
    >
      <Box
        background="#FFFFFF"
        border="1px solid #EEEFF1"
        borderRadius="20px"
        width={"100%"}
        p="35px"
      >
        <Flex justify="space-between" alignItems={"center"} mb="20px">
          <Text
            fontWeight={400}
            fontSize="12px"
            lineHeight="17px"
            color="#6E7682"
            mr="10px"
          >
            {title}
          </Text>
          <Button
            border="1px solid #ECEDEE"
            color="#212224"
            onClick={() => onEdit()}
            borderRadius="50%"
            p="5px"
            backgroundColor="transparent"
          >
            <Icon color="#6E7682" as={FaPen} boxSize="12px" />
          </Button>
        </Flex>
        {children}
      </Box>
    </motion.div>
  );
};

const PreviewProfile = () => {
  const [showModal, setShowModal] = useState(false);
  const [currentlyEditing, setCurrentlyEditing] = useState<string | null>(null)
  const onboardingData = onboardTutorStore.useStore();

  const steps = [
    {
      id: "subjects",
      updateFunction: onboardTutorStore.set.coursesAndLevels,
      position: 0,
      element: SubjectLevelForm,
      value: onboardingData.coursesAndLevels,
      mainText: "Please inform us of the subjects you would like to teach ",
      supportingText:
        "Kindly select your area of expertise and proficiency level, you may add multiple subjects",
    },
    {
      id: "qualifications",
      position: 1,
      updateFunction: onboardTutorStore.set.qualifications,
      element: QualificationsForm,
      value: onboardingData.qualifications,
      mainText:
        "Add your professional qualifications relevant to the subjects you selected",
      supportingText:
        "Provide relevant educational background, certifications and experiences",
    },
    {
      id: "bio",
      position: 2,
      element: BioForm,
      value: onboardingData.description,
      updateFunction: onboardTutorStore.set.description,
      mainText: "Write a bio to let your potential students know about you",
      supportingText:
        "Help potential students make an informed decision by showcasing your personality and teaching style.",
    },
    {
      id: "availability",
      position: 3,
      element: AvailabilityForm,
      value: { ...onboardingData.schedule },
      updateFunction: onboardTutorStore.set.schedule,
      mainText: "Let’s Know when you’ll be available",
      supportingText:
        "Provide the days and time frame when will you be available",
    },
    {
      id: "intro_video",
      position: 4,
      element: IntroVideoForm,
      value: onboardingData.introVideo,
      updateFunction: onboardTutorStore.set.introVideo,
      mainText:
        "Upload an intro video to show your proficiency in your chosen subjects",
      supportingText:
        "Be as detailed as possible, this lets your potential student know you are capable ",
    },
    {
      id: "hourly_rate",
      position: 5,
      value: onboardingData.rate,
      element: HourlyRateForm,
      updateFunction: onboardTutorStore.set.rate,
      mainText: "Set your hourly rate",
      supportingText:
        "Your clients will send you offers based on this rate. You can always adjust your rate",
    },
    {
      id: "upload_profile_picture",
      position: 6,
      value: onboardingData.avatar,
      updateFunction: onboardTutorStore.set.avatar,
      element: ProfilePictureForm,
      mainText: "Add a profile picture",
      supportingText:
        "Ensure this is a clear and actual picture of you, your picture helps your clients trust you",
    },
    {
      id: "payment",
      position: 7,
      value: onboardingData.bankInfo,
      updateFunction: onboardTutorStore.set.bankInfo,
      element: PaymentInformationForm,
      mainText: "Provide your account details",
      supportingText:
        "Shepherd uses your account details to remit payment from clients to you ",
    },
  ];

  const currentEdit = useMemo(() => {
    return steps.find(step => step.id === currentlyEditing) || {
      element: () => <></>
    } as typeof steps[0]
  }, [currentlyEditing])

  const { element: Element } = currentEdit;

  console.log(currentEdit)


  return (
    <MainWrapper>
      <Header />
      <EditProfileModal key={currentEdit.id} supportingText={currentEdit.supportingText} mainText={currentEdit.mainText} value={currentEdit?.value} onSave={() => setCurrentlyEditing(null)} onCancel={(previousValue) => {
        currentEdit.updateFunction && currentEdit.updateFunction(previousValue as never)
        setCurrentlyEditing(null)
      }} isOpen={Boolean(currentlyEditing)} onClose={() => console.log()} >
        <Element />
      </EditProfileModal>
      <Root>
        <Stack direction={["column", "row"]} spacing="40px" padding="70px 10%">
          <VStack
            width={["70%", "70%"]}
            align={["flex-start", "flex-start"]}
            spacing="20px"
          >
            <Text
              fontWeight="600"
              fontSize="20px"
              lineHeight="25px"
              display="flex"
              alignItems="center"
              letterSpacing="0.004em"
              color="#212224"
            >
              Profile Preview
            </Text>
            <PreviewSegment onEdit={() => setCurrentlyEditing("bio")} title="ABOUT ME">
              <Text
                fontWeight={500}
                fontSize={"14px"}
                color="#212224"
                lineHeight={"30px"}
              >
                {onboardingData.description}
              </Text>
            </PreviewSegment>
            <PreviewSegment onEdit={() => setCurrentlyEditing("subjects")} title="SUBJECT OFFERED">
              <CourseTable></CourseTable>
            </PreviewSegment>
            <PreviewSegment onEdit={() => setCurrentlyEditing("qualifications")} title="QUALIFICATIONS">
              <QualificationsSegment />
            </PreviewSegment>
            <PreviewSegment onEdit={() => setCurrentlyEditing("availability")} title="AVAILABILITY">
              <AvailabilityTable />
            </PreviewSegment>
          </VStack>
          <VStack
            width={["70%", "30%"]}
            paddingTop={"45px"}
            align={["flex-start", "center"]}
            spacing="20px"
          >
            <ProfileDiv onEdit={(editName) => setCurrentlyEditing(editName)} />
            <VideoViewingSection onEdit={() => setCurrentlyEditing("intro_video")} />
            {/* <PreviewSegment title="About Me">
              <Text>{onboardingData.bio}</Text>
            </PreviewSegment> */}
          </VStack>
        </Stack>
      </Root>
    </MainWrapper>
  );
};
export default PreviewProfile;
