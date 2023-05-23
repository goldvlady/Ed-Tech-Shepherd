import React, { useState, useEffect } from "react";
import {
  Box,
  Flex,
  SimpleGrid,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Text,
} from "@chakra-ui/react";
import { useTitle } from "../../hooks";
import TutorCard from "./components/TutorCard";
import ApiService from "../../services/ApiService";
import TutorAvi from "../../assets/tutoravi.svg";

function MyTutors() {
  useTitle("My Tutors");
  const [allTutors, setAllTutors] = useState<any>([]);
  const [loadingData, setLoadingData] = useState(false);
  const getData = async () => {
    setLoadingData(true);
    try {
      const resp = await ApiService.getAllTutors();
      const data = await resp.json();
      setAllTutors(data);
    } catch (e) {}
    setLoadingData(false);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <Flex alignItems={"center"} gap={1}>
        <Box>
          <Text fontSize={24} fontWeight={600} color="text.200">
            My Tutors
          </Text>
        </Box>

        <Text
          boxSize="fit-content"
          bgColor={"#F4F5F6"}
          p={1}
          borderRadius={"6px"}
        >
          24
        </Text>
      </Flex>

      <Tabs>
        <TabList className="tab-list">
          <Tab fontSize={16} fontWeight={500} color="text.400">
            All
          </Tab>
          <Tab fontSize={16} fontWeight={500} color="text.400">
            Pending
          </Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <SimpleGrid minChildWidth="325px" spacing="30px">
              <TutorCard
                name={"Leslie Peters"}
                levelOfEducation={"BSC Bachelors"}
                avatar={TutorAvi}
                use="my tutors"
              />
              <TutorCard
                name={"Leslie Peters"}
                levelOfEducation={"BSC Bachelors"}
                avatar={TutorAvi}
                use="my tutors"
              />
              <TutorCard
                name={"Leslie Peters"}
                levelOfEducation={"BSC Bachelors"}
                avatar={TutorAvi}
                use="my tutors"
              />
              <TutorCard
                name={"Leslie Peters"}
                levelOfEducation={"BSC Bachelors"}
                avatar={TutorAvi}
                use="my tutors"
              />
              <TutorCard
                name={"Leslie Peters"}
                levelOfEducation={"BSC Bachelors"}
                avatar={TutorAvi}
                use="my tutors"
              />
              <TutorCard
                name={"Leslie Peters"}
                levelOfEducation={"BSC Bachelors"}
                avatar={TutorAvi}
                use="my tutors"
              />
            </SimpleGrid>
          </TabPanel>
          <TabPanel></TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
}

export default MyTutors;
