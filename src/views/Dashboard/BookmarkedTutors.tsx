import TutorAvi from "../../assets/tutoravi.svg";
import { useTitle } from "../../hooks";
import ApiService from "../../services/ApiService";
import bookmarkedTutorsStore from "../../state/bookmarkedTutorsStore";
import TutorCard from "./components/TutorCard";
import {
  Box,
  Flex,
  SimpleGrid,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import React, { useCallback, useEffect, useState } from "react";

function BookmarkedTutors() {
  const [loadingData, setLoadingData] = useState(false);

  // const getBookmarkedTutors = async () => {
  //   setLoadingData(true);
  //   try {
  //     const resp = await ApiService.getBookmarkedTutors();
  //     const data = await resp.json();

  //     setAllTutors(data);
  //   } catch (e) {}
  //   setLoadingData(false);
  // };
  // useEffect(() => {
  //   getBookmarkedTutors();
  // }, []);

  const { fetchBookmarkedTutors, tutors: allTutors } = bookmarkedTutorsStore();
  const doFetchBookmarkedTutors = useCallback(async () => {
    await fetchBookmarkedTutors();
  }, []);

  useEffect(() => {
    doFetchBookmarkedTutors();
  }, [doFetchBookmarkedTutors]);

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

      <SimpleGrid
        // minChildWidth="360px"
        justifyItems={"left"}
        templateColumns={{ sm: "repeat(1, 1fr)", lg: "repeat(3, 1fr)" }}
        mt={2}
        // spacingX="-40px"
        spacingY="20px"
        gap={3}
      >
        {allTutors.map((tutor: any) => (
          <TutorCard
            key={tutor.tutor?._id}
            id={tutor.tutor?._id}
            // name={`${tutor.user?.name.first} ${tutor.user?.name.last}`}
            name={"Tutor"}
            levelOfEducation={"BSC"}
            avatar={tutor.tutor.avatar}
            saved={true}
            description={tutor.tutor?.description}
            rate={tutor.tutor?.rate}
            rating={tutor.tutor?.rating}
            reviewCount={tutor.tutor?.reviewCount}
          />
        ))}
      </SimpleGrid>
    </>
  );
}

export default BookmarkedTutors;
