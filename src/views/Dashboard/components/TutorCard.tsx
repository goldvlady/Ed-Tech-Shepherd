import React from "react";
import {
  Box,
  Spacer,
  Badge,
  Button,
  Center,
  Flex,
  Heading,
  Image,
  Link,
  LinkBox,
  LinkOverlay,
  Stack,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import TutorAvi from "../../../assets/tutoravi.svg";
import Star from "../../../assets/littleStar.svg";
import Ribbon from "../../../assets/ribbon-grey.svg";
import Ribbon2 from "../../../assets/ribbon-blue.svg";
import { textTruncate } from "../../../util";

export default function TutorCard(props: any) {
    const {
        id,
        name,
        levelOfEducation,
        avatar,
        use,
        rate,
        saved,
        description,
        rating,
        reviewCount,
    } = props;
    return (
        <LinkBox as="article">
            <Center justifyContent="left">
                <Stack
                    borderWidth="1px"
                    borderRadius="lg"
                    w={{ sm: '100%', md: '360px' }}
                    height={{ sm: '476px', md: '20rem', lg: '191px' }}
                    direction={{ base: 'column', md: 'row' }}
                    bg={useColorModeValue('white', 'gray.900')}
                    boxShadow={'2xl'}
                    padding={2}
                    position="relative"
                >
                  {description ? textTruncate(description, 100) : ""}
                </Text>
              </Flex>{" "}
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
                  <Flex>
                    <Text fontSize={16} fontWeight={"semibold"}>
                      ${`${rate}.00 / hr`}
                    </Text>

                    <Spacer />

                    <Text fontSize={12} fontWeight={400} color="#6E7682">
                      <span style={{ display: "inline-block" }}>
                        <img src={Star} />
                      </span>
                      4.2(175)
                    </Text>
                  </Flex>
                </Box>
              )}
            </LinkOverlay>
          </Box>
        </Stack>
        <Image
          src={saved ? Ribbon2 : Ribbon}
          position="absolute"
          top={2}
          right={5}
          width={4}
        />
      </Center>
    </LinkBox>
  );
}
