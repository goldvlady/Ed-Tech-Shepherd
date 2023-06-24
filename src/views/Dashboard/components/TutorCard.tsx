import {
  Avatar,
  Badge,
  Box,
  Button,
  Center,
  Flex,
  Heading,
  Image,
  Link,
  LinkBox,
  LinkOverlay,
  Spacer,
  Stack,
  Text,
  VStack,
  useColorModeValue,
  useToast,
  Divider,
} from "@chakra-ui/react";
import React, { useCallback, useEffect } from "react";

import Star from "../../../assets/littleStar.svg";
import Ribbon2 from "../../../assets/ribbon-blue.svg";
import Ribbon from "../../../assets/ribbon-grey.svg";
import TutorAvi from "../../../assets/tutoravi.svg";
import ApiService from "../../../services/ApiService";
import bookmarkedTutorsStore from "../../../state/bookmarkedTutorsStore";
import { textTruncate } from "../../../util";

export default function TutorCard(props: any) {
  const {
    id,
    name,
    levelOfEducation,
    avatar,
    use,
    rate,
    description,
    rating,
    reviewCount,
    saved,
  } = props;
  const toast = useToast();
  const { fetchBookmarkedTutors } = bookmarkedTutorsStore();

  const toggleBookmarkTutor = async (id: string) => {
    try {
      const resp = await ApiService.toggleBookmarkedTutor(id);
      console.log(resp);
      if (saved) {
        toast({
          title: "Tutor removed from Bookmarks successfully",
          position: "top-right",
          status: "success",
          isClosable: true,
        });
      } else {
        toast({
          title: "Tutor saved successful",
          position: "top-right",
          status: "success",
          isClosable: true,
        });
      }
      fetchBookmarkedTutors();
    } catch (e) {
      toast({
        title: "An unknown error occured",
        position: "top-right",
        status: "error",
        isClosable: true,
      });
    }
  };
  const tutorSubjects = [
    { id: 1, label: "English" },
    { id: 2, label: "Literature" },
    { id: 3, label: "Maths" },
    { id: 4, label: "English" },
    { id: 5, label: "Literature" },
    { id: 6, label: "English" },
    { id: 7, label: "Literature" },
  ];
  console.log(tutorSubjects.length);

  return (
    <LinkBox as="article">
      <Center>
        <Box
          bg={"white"}
          w={{ sm: "100%", md: "100%", lg: "370px" }}
          height={{ sm: "285px", md: "325px", lg: "325px" }}
          borderRadius="12px"
          border="1px solid #EBEDEF"
          _hover={{ boxShadow: "2xl" }}
          padding={"20px"}
          position="relative"
        >
          <Flex gap={2} alignItems="center">
            <Avatar size="lg" name={name} src={avatar} />
            <LinkOverlay href={`/dashboard/find-tutor/tutor/?id=${id}`}>
              <Flex pt={1} direction={"column"}>
                <Text fontSize={"16px"} fontWeight={"semibold"} mb={0}>
                  {name}
                  <Text
                    fontWeight={400}
                    color={"#212224"}
                    fontSize="14px"
                    mb={"2px"}
                  >
                    {levelOfEducation}
                  </Text>
                </Text>
              </Flex>{" "}
            </LinkOverlay>
          </Flex>
          <Box my={2}>
            <Flex alignItems="center">
              <Text fontSize={16} fontWeight={"semibold"}>
                ${`${rate}.00 / hr`}
              </Text>

              <Spacer />
              <Flex>
                {" "}
                <Image src={Star} boxSize={4} />
                <Text fontSize={12} fontWeight={400} color="#6E7682">
                  {`${rating}(${reviewCount})`}
                </Text>
              </Flex>
            </Flex>
          </Box>
          <Divider />
          <Box my={2}>
            <Text
              fontSize={"12px"}
              color={useColorModeValue("gray.700", "gray.400")}
            >
              {description ? textTruncate(description, 200) : ""}
            </Text>
          </Box>
          <Box my={1}>
            <Flex gap={3} position="absolute" bottom={5} flexWrap="wrap">
              {tutorSubjects.length < 6
                ? tutorSubjects.map((subject, index) => (
                    <Text
                      key={subject.id}
                      py={1}
                      px={4}
                      fontSize={12}
                      fontWeight={500}
                      bgColor="#F1F2F3"
                      borderRadius={4}
                    >
                      {subject.label}
                    </Text>
                  ))
                : tutorSubjects.slice(0, 5).map((subject, index) =>
                    index == 4 ? (
                      <>
                        <Text
                          key={index}
                          py={1}
                          px={4}
                          fontSize={12}
                          fontWeight={500}
                          bgColor="#F1F2F3"
                          borderRadius={4}
                        >
                          {subject.label}
                        </Text>
                        <Link
                          color="#207DF7"
                          href="/dashboard"
                          fontSize={12}
                          alignSelf="center"
                        >
                          + {tutorSubjects.length - 5} more
                        </Link>
                      </>
                    ) : (
                      <Text
                        key={index}
                        py={1}
                        px={4}
                        fontSize={12}
                        fontWeight={500}
                        bgColor="#F1F2F3"
                        borderRadius={4}
                      >
                        {subject.label}
                      </Text>
                    )
                  )}
            </Flex>
          </Box>

          <Image
            src={saved ? Ribbon2 : Ribbon}
            position="absolute"
            top={4}
            right={5}
            width={saved ? 5 : 4}
            _hover={{ cursor: "pointer" }}
            onClick={() => toggleBookmarkTutor(id)}
          />
        </Box>
      </Center>

      {/* <Center justifyContent="left">
        <Stack
          borderWidth="1px"
          borderRadius="lg"
          w={{ sm: "100%", md: "100%", lg: "350px" }}
          height={{ sm: "150px", md: "150px", lg: "200px" }}
          direction={{ base: "row", md: "row" }}
          bg={useColorModeValue("white", "gray.900")}
          boxShadow={"2xl"}
          padding={2}
          position="relative"
        >
          <Image
            objectFit="cover"
            // boxSize="100%"
            maxWidth={"118px"}
            borderStartRadius={"8px"}
            src={avatar}
          />
          <Box position="relative" width="inherit">
            <LinkOverlay href={`/dashboard/find-tutor/tutor/?id=${id}`}>
              <Flex pt={1} direction={"column"}>
                <Text fontSize={"16px"} fontWeight={"semibold"} mb={0}>
                  {name}
                  <Text
                    fontWeight={400}
                    color={"#212224"}
                    fontSize="14px"
                    mb={"2px"}
                  >
                    {levelOfEducation}
                  </Text>
                </Text>
                <Text
                  fontSize={"12px"}
                  color={useColorModeValue("gray.700", "gray.400")}
                >
                  {description ? textTruncate(description, 100) : ""}
                </Text>
              </Flex>{" "}
            </LinkOverlay>
            {use === "my tutors" ? (
              <Text
                width="fit-content"
                bg="#f4f5f6"
                py={2}
                px={5}
                borderRadius={6}
                fontSize="12px"
                fontWeight={500}
                color="text.400"
              >
                Lesson 1
              </Text>
            ) : (
              <Box>
                <Flex
                  position={"absolute"}
                  bottom={2}
                  alignItems="center"
                  width="full"
                >
                  <Text fontSize={16} fontWeight={"semibold"}>
                    ${`${rate}.00 / hr`}
                  </Text>

                  <Spacer />
                  <Flex>
                    {" "}
                    <Image src={Star} boxSize={4} />
                    <Text fontSize={12} fontWeight={400} color="#6E7682">
                      {` ${rating}(${reviewCount})`}
                    </Text>
                  </Flex>
                </Flex>
              </Box>
            )}
          </Box>

          <Image
            src={saved ? Ribbon2 : Ribbon}
            position="absolute"
            top={2}
            right={2}
            width={saved ? 5 : 4}
            _hover={{ cursor: "pointer" }}
            onClick={() => toggleBookmarkTutor(id)}
          />
        </Stack>
      </Center> */}
    </LinkBox>
  );
}