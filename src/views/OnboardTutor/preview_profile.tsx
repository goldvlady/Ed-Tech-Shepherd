import React, { useMemo, ReactNode } from "react";
import { Qualification } from "../../types";
import cloud from "../../assets/cloud.svg";
import { FaFileAlt, FaPen } from "react-icons/fa";
import {
  Box,
  Button,
  Flex,
  Heading,
  Icon,
  Grid,
  Text,
  Stack,
  VStack,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { EditIcon, CheckIcon } from "@chakra-ui/icons";
import { motion } from "framer-motion";
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
  background: #f8f9fb;
  justify-content: center;
  align-items: center;
  max-width: 100vw;
  width: 100%;
`;

const MainWrapper = styled(Box)`
  background: #f8f9fb;
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

const CourseTable = () => {
    const { subjectLevel, rate } = onboardTutorStore.useStore();
    return (
      <Box width="100%">
        <Table variant="simple" borderRadius="10px">
          <Thead>
            <Tr>
              <Th
                p={5}
                border="1px solid #EEEFF2"
                bg="#FAFAFA"
                borderRadius="8px"
              />
              <Th
                p={5}
                border="1px solid #EEEFF2"
                bg="#FFFFFF"
                borderRadius="8px"
              >
                Level
              </Th>
              <Th border="1px solid #EEEFF2" bg="#FFFFFF" borderRadius="8px">
                Price
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {subjectLevel.map((subLevel) => (
              <Tr>
                <Td
                  bg="#FAFAFA"
                  color="#585F68"
                  fontSize="14px"
                  fontWeight={500}
                  border="1px solid #EEEFF2"
                  p={5}
                  borderRadius="8px"
                >
                  {subLevel.subject}
                </Td>
                <Td
                  bg="#FFFFFF"
                  fontWeight="500"
                  fontSize="16px"
                  lineHeight="21px"
                  letterSpacing="0.012em"
                  color="#585F68"
                  border="1px solid #EEEFF2"
                  p={5}
                  borderRadius="8px"
                >
                  {subLevel.subject}
                </Td>
                <Td
                  bg="#FFFFFF"
                  fontWeight="500"
                  fontSize="16px"
                  lineHeight="21px"
                  letterSpacing="0.012em"
                  color="#212224"
                  border="1px solid #EEEFF2"
                  p={5}
                  borderRadius="8px"
                >
                  ${rate}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    );
  };
  

const AvailabilityTable = () => {
  const { availability } = onboardTutorStore.useStore();

  console.log(availability);

  const timeSlots = ["8am - 12am", "12am - 5pm", "5pm - 9pm"];

  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const checkedOut = (
    <Box
      minW={"70px"}
      minH={"70px"}
      padding={0}
      bg={`repeating-linear-gradient(
      45deg,
      #F7F7F8,
      #F7F7F8 10px,
      #fff 10px,
      #fff 15px
    )`}
    />
  );
  const renderAvailabilityCell = (slot: string, day: string) => {
    const fullDayName = Object.keys(availability).find((d) =>
      d.includes(day.toLowerCase())
    );
    if (!fullDayName) return checkedOut;
    const slotData = availability[fullDayName];

    if (slotData && slotData.slots.includes(slot)) {
      return (
        <VStack
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          p={5}
        >
          <CheckIcon color="green" />
        </VStack>
      );
    }
    return checkedOut;
  };

  return (
    <Box width="100%">
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th
              p={5}
              border="1px solid #EEEFF2"
              bg="#FAFAFA"
              borderRadius="8px"
            />
            {daysOfWeek.map((day) => (
              <Th
                key={day}
                p={5}
                border="1px solid #EEEFF2"
                bg="#FFFFFF"
                borderRadius="8px"
              >
                {day}
              </Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {timeSlots.map((slot) => (
            <Tr key={slot}>
              <Td
                bg="#FAFAFA"
                color="#585F68"
                fontSize="14px"
                justifyItems="center"
                alignItems={"center"}
                width={"auto"}
                borderRadius="8px"
              >
                <Box
                  display={"flex"}
                  justifyItems="center"
                  alignItems={"center"}
                >
                  <img
                    style={{ marginRight: "10px" }}
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
                </Box>
              </Td>
              {daysOfWeek.map((day) => (
                <Td
                  key={`${slot}-${day}`}
                  bg="#FFFFFF"
                  border="1px solid #EEEFF2"
                  borderRadius="8px"
                >
                  {renderAvailabilityCell(slot, day)}
                </Td>
              ))}
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

const QualificationsSegment = () => {
  const { qualifications } = onboardTutorStore.useStore();
  return (
    <Box background="#FFFFFF">
      {qualifications.map((qualification, index) => (
        <Flex
          borderBottom="2px solid #ECEDEE"
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
}: {
  title: string;
  children: ReactNode;
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
        borderRadius="10px"
        width={"100%"}
        p="20px"
      >
        <Flex justify="space-between" alignItems={"center"} mb="10px">
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
  const onboardingData = onboardTutorStore.useStore();
  return (
    <MainWrapper>
      <Header />
      <Root>
        <Stack direction={["column", "row"]} spacing="20px" padding="100px 10%">
          <VStack
            width={["65%", "65%"]}
            align={["flex-start", "center"]}
            spacing="20px"
          >
            <PreviewSegment title="ABOUT ME">
              <Text
                fontWeight={400}
                fontSize={"14px"}
                color="#212224"
                lineHeight={"24px"}
              >
                {onboardingData.bio}
              </Text>
            </PreviewSegment>
            <PreviewSegment title="SUBJECT OFFERED">
              <CourseTable></CourseTable>
            </PreviewSegment>
            <PreviewSegment title="QUALIFICATIONS">
              <QualificationsSegment />
            </PreviewSegment>
            <PreviewSegment title="AVAILABILITY">
              <AvailabilityTable />
            </PreviewSegment>
          </VStack>
          <VStack
            width={["45%", "45%"]}
            align={["flex-start", "center"]}
            spacing="20px"
          >
            <PreviewSegment title="About Me">
              <Text>{onboardingData.bio}</Text>
            </PreviewSegment>
          </VStack>
        </Stack>
      </Root>
    </MainWrapper>
  );
};
export default PreviewProfile;
