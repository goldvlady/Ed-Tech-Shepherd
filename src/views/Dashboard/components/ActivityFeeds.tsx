import {
    Box,
    Button,
    Divider,
    Flex,
    HStack,
    Image,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Select,
    Spacer,
    Stack,
    Text,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { BsChevronDown, BsFiletypeDoc } from 'react-icons/bs';
import { RiCalendar2Fill } from 'react-icons/ri';
import { SlEnergy } from 'react-icons/sl';
import styled from 'styled-components';

import AdobeIcon from '../../../assets/adobedoc.svg';
import FeedIcon from '../../../assets/blue-energy.svg';
import DocIcon from '../../../assets/doc-icon.svg';
import FlashcardIcon from '../../../assets/flashcardIcon.svg';
import NoteIcon from '../../../assets/notes.svg';
import ReceiptIcon from '../../../assets/receiptIcon.svg';

const Root = styled(Flex)`
    position: relative;
    margin-left: 8px;
    alignitems: flex-start;
    direction: row;
    margin: 4 0;
    &:before {
        content: '';
        position: absolute;
        left: 22px;
        top: 0;
        bottom: -15px;
        width: 1px;
        background: #e8e9ed;
        z-index: 0;
    }
    padding-left: 0px;
`;

function ActivityFeeds() {
    const [feedPeriod, setFeedPeriod] = useState<any>('Today');

    return (
        <>
            <Box>
                <Flex>
                    <HStack>
                        <img src={FeedIcon} alt="feed-icon" width={12} />

                        <Text fontSize={16} fontWeight={500} mx={2}>
                            Activity Feed
                        </Text>
                    </HStack>
                    <Spacer />

                    <Menu>
                        <MenuButton
                            as={Button}
                            leftIcon={<RiCalendar2Fill />}
                            rightIcon={<BsChevronDown />}
                            variant="outline"
                            fontSize={14}
                            fontWeight={500}
                            color="#5C5F64"
                        >
                            {feedPeriod}
                        </MenuButton>
                        <MenuList>
                            <MenuItem onClick={() => setFeedPeriod('Today')}>
                                Today
                            </MenuItem>
                            <MenuItem
                                onClick={() => setFeedPeriod('This week')}
                            >
                                This week
                            </MenuItem>
                            <MenuItem
                                onClick={() => setFeedPeriod('This month')}
                            >
                                This month
                            </MenuItem>
                        </MenuList>
                    </Menu>
                </Flex>
                <Divider />
            </Box>

            <Box>
                <Root px={3} my={4}>
                    <Image src={DocIcon} alt="doc" maxHeight={45} zIndex={1} />
                    <Stack direction={'column'} px={4} spacing={1}>
                        <Text color="text.300" fontSize={12} mb={0}>
                            2 hrs ago
                        </Text>
                        <Text
                            fontWeight={400}
                            color="text.200"
                            fontSize="14px"
                            mb={0}
                        >
                            You uploaded documentationtitle.pdf to your
                            workspace
                        </Text>

                        <Spacer />

                        <Box
                            width={'fit-content'}
                            height="40px"
                            borderRadius={'30px'}
                            border=" 1px dashed #E2E4E9"
                            justifyContent="center"
                            alignItems="center"
                            px={3}
                        >
                            <Flex mt={2.5}>
                                <Text>
                                    <Image src={AdobeIcon} />
                                </Text>

                                <Text
                                    fontWeight={500}
                                    fontSize={12}
                                    color="#73777D"
                                >
                                    Documentationtitle.pdf
                                </Text>
                            </Flex>
                        </Box>
                    </Stack>
                </Root>

                <Root px={3} my={4}>
                    <Image src={NoteIcon} alt="doc" maxHeight={45} zIndex={1} />
                    <Stack direction={'column'} px={4} spacing={1}>
                        <Text color="text.300" fontSize={12} mb={0}>
                            7 hrs ago
                        </Text>
                        <Text
                            fontWeight={400}
                            color="text.200"
                            fontSize="14px"
                            mb={0}
                        >
                            You uploaded documentationtitle.pdf to your
                            workspace
                        </Text>

                        <Spacer />

                        <Box
                            width={'fit-content'}
                            height="40px"
                            borderRadius={'30px'}
                            border=" 1px dashed #E2E4E9"
                            justifyContent="center"
                            alignItems="center"
                            px={3}
                        >
                            <Flex mt={2.5}>
                                <Text>
                                    <Image src={AdobeIcon} />
                                </Text>

                                <Text
                                    fontWeight={500}
                                    fontSize={12}
                                    color="#73777D"
                                >
                                    Favoriteartistelist.pdf
                                </Text>
                            </Flex>
                        </Box>
                    </Stack>
                </Root>
                <Root px={3} my={4}>
                    <Image
                        src={ReceiptIcon}
                        alt="doc"
                        maxHeight={45}
                        zIndex={1}
                    />
                    <Stack direction={'column'} px={4} spacing={1}>
                        <Text color="text.300" fontSize={12} mb={0}>
                            Yesterday.13:00
                        </Text>
                        <Text
                            fontWeight={400}
                            color="text.200"
                            fontSize="14px"
                            mb={0}
                        >
                            You created a new flashcard deck documenttitleflash
                            from documentitle.pdf
                        </Text>

                        <Spacer />
                        <Box
                            width={'fit-content'}
                            height="40px"
                            borderRadius={'30px'}
                            border=" 1px dashed #E2E4E9"
                            justifyContent="center"
                            alignItems="center"
                            px={3}
                        >
                            <Flex mt={2.5}>
                                <Text>
                                    <Image src={AdobeIcon} />
                                </Text>

                                <Text
                                    fontWeight={500}
                                    fontSize={12}
                                    color="#73777D"
                                >
                                    Documenttitleflash
                                </Text>
                            </Flex>
                        </Box>
                    </Stack>
                </Root>
                <Flex alignItems="flex-start" px={3} direction={'row'} my={4}>
                    <Image
                        src={FlashcardIcon}
                        alt="doc"
                        maxHeight={45}
                        zIndex={1}
                        position={'relative'}
                        right={1}
                    />
                    <Stack direction={'column'} px={4} spacing={1}>
                        <Text color="text.300" fontSize={12} mb={0}>
                            17th May 2023.13:00
                        </Text>
                        <Text
                            fontWeight={400}
                            color="text.200"
                            fontSize="14px"
                            mb={0}
                        >
                            You made a payment of $10.95 to Leslie Peters for
                            Chemistry lessons
                        </Text>

                        <Spacer />

                        <Box
                            width={'fit-content'}
                            height="40px"
                            borderRadius={'30px'}
                            border=" 1px dashed #E2E4E9"
                            justifyContent="center"
                            alignItems="center"
                            px={3}
                        >
                            <Flex mt={2.5}>
                                <Text>
                                    <Image src={AdobeIcon} />
                                </Text>

                                <Text
                                    fontWeight={500}
                                    fontSize={12}
                                    color="#73777D"
                                >
                                    Transaction receipt
                                </Text>
                            </Flex>
                        </Box>
                    </Stack>
                </Flex>
            </Box>
        </>
    );
}

export default ActivityFeeds;
