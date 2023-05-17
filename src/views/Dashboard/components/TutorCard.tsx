import React from 'react'
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
    Stack,
    Text,
    useColorModeValue,
} from "@chakra-ui/react"
import TutorAvi from "../../../assets/tutoravi.svg"
import Star from "../../../assets/littleStar.svg"

export default function TutorCard() {
    return (
        <Center>
            <Stack
                borderWidth="1px"
                borderRadius="lg"
                w={{ sm: '100%', md: '540px' }}
                height={{ sm: '476px', md: '20rem', lg: '191px' }}
                direction={{ base: 'column', md: 'row' }}
                bg={useColorModeValue('white', 'gray.900')}
                boxShadow={'2xl'}
                padding={2}>
                <Flex flex={1} bg="white" >
                    <Image
                        objectFit="cover"
                        // boxSize="100%"
                        maxWidth={"118px"}
                        borderStartRadius={"8px"}
                        src={
                            TutorAvi
                        }
                    />
                </Flex>
                <Stack


                    p={1}
                    pt={2}>
                    <Heading fontSize={'16px'} >
                        Leslie A. Peters
                    </Heading>
                    <Text fontWeight={400} color={'#212224'} fontSize="14px" mb={8}>
                        Bsc Economics (Bachelors)
                    </Text>
                    <Text
                        fontSize={"12px"}
                        color={useColorModeValue('gray.700', 'gray.400')}
                    >
                        An enthusiastic enonomics teacher seeking to help students achieve their true potential and them the...
                    </Text>

                    <Flex alignItems={"center"}>
                        <Text fontSize={16} fontWeight={500} >
                            $22.00/hr
                        </Text>
                        <Spacer />
                        <Text fontSize={12} fontWeight={400} color="#6E7682" >
                            <span style={{ display: "inline-block" }}><img src={Star} /></span>4.2(175)
                        </Text>
                    </Flex>
                </Stack>
            </Stack>
        </Center>
    )
}
