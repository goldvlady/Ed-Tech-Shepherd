import {
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
} from '@chakra-ui/react';
import React from 'react';

import Star from '../../../assets/littleStar.svg';
import Ribbon2 from '../../../assets/ribbon-blue.svg';
import Ribbon from '../../../assets/ribbon-grey.svg';
import TutorAvi from '../../../assets/tutoravi.svg';
import { textTruncate } from '../../../util';

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
                    <Image
                        objectFit="cover"
                        // boxSize="100%"
                        maxWidth={'118px'}
                        borderStartRadius={'8px'}
                        src={avatar}
                    />
                    <Box position="relative" minWidth="220px">
                        <LinkOverlay
                            href={`/dashboard/find-tutor/tutor/?id=${id}`}
                        >
                            <Flex pt={1} direction={'column'}>
                                <Text
                                    fontSize={'16px'}
                                    fontWeight={'semibold'}
                                    mb={0}
                                >
                                    {name}
                                    <Text
                                        fontWeight={400}
                                        color={'#212224'}
                                        fontSize="14px"
                                        mb={'2px'}
                                    >
                                        {levelOfEducation}
                                    </Text>
                                </Text>
                                <Text
                                    fontSize={'12px'}
                                    color={useColorModeValue(
                                        'gray.700',
                                        'gray.400'
                                    )}
                                >
                                    {description
                                        ? textTruncate(description, 100)
                                        : ''}
                                </Text>
                            </Flex>{' '}
                        </LinkOverlay>
                        {use === 'my tutors' ? (
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
                                    position={'absolute'}
                                    bottom={2}
                                    alignItems="center"
                                    width="full"
                                >
                                    <Text fontSize={16} fontWeight={'semibold'}>
                                        ${`${rate}.00 / hr`}
                                    </Text>

                                    <Spacer />
                                    <Flex>
                                        {' '}
                                        <Image src={Star} boxSize={4} />
                                        <Text
                                            fontSize={12}
                                            fontWeight={400}
                                            color="#6E7682"
                                        >
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
                        width={4}
                    />
                </Stack>
            </Center>
        </LinkBox>
    );
}
