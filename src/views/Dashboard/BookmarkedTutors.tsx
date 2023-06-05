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

function BookmarkedTutors() {
  const [allTutors, setAllTutors] = useState<any>([]);
  const [loadingData, setLoadingData] = useState(false);
  // const getData = async () => {
  //   setLoadingData(true);
  //   try {
  //     const resp = await ApiService.getAllTutors();
  //     const data = await resp.json();
  //     setAllTutors(data);
  //   } catch (e) {}
  //   setLoadingData(false);
  // };

  const getBookmarkedTutors = async () => {
    setLoadingData(true);
    try {
      const resp = await ApiService.getBookmarkedTutors();
      const data = await resp.json();
      setAllTutors(data);
    } catch (e) {}
    setLoadingData(false);
  };
  useEffect(() => {
    getBookmarkedTutors();
  }, []);
  console.log("saved tutors", allTutors);

  return (
    <>
      <Flex alignItems={"center"} gap={1}>
        <Box>
          <Text fontSize={24} fontWeight={600} color="text.200" mb={0}>
            Saved Tutors
          </Text>
          <Text fontSize={16} fontWeight={400} color="text.300">
            Keep up with tutors you’ve saved their profile
          </Text>
        </Box>
      </Flex>

      <SimpleGrid minChildWidth="325px" spacing="30px">
        {allTutors.map((tutor: any) => (
          <TutorCard
            name={"Leslie Peters"}
            levelOfEducation={"BSC Bachelors"}
            avatar={TutorAvi}
            saved={true}
            rate={5}
          />
        ))}
      </SimpleGrid>
    </>
  );
}

export default BookmarkedTutors;
