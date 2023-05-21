import {
    Box,
    Container,
    Grid,
    GridItem,
    Card,
    CardHeader,
    CardBody,
    Text,
    Badge,
    Button,
    Center,
    Flex,
    Heading,
    Image,
    Link,
    Stack,
    Spacer,
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
    useColorModeValue,
    LinkOverlay,
    Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    TableCaption,
    TableContainer,
    Divider,
} from '@chakra-ui/react'
import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { RiQuestionFill } from 'react-icons/ri'
import Ribbon from '../../assets/ribbon-grey.svg'
import { CustomButton } from './layout'
import FileAvi from '../../assets/file-avi.svg'
import FileAvi2 from '../../assets/file-avi2.svg'
import TutorAvi from "../../assets/tutoravi.svg"
import Star from "../../assets/littleStar.svg"
import HowItWorks from './components/HowItWorks'
import ApiService from '../../services.ts/ApiService'

export default function Tutor() {
    const [searchParams, setSearchParams] = useSearchParams()
    const [loadingData, setLoadingData] = useState(false)
    const [tutorData, setTutorData] = useState<any>({})
    const tutorId: any = searchParams.get('id')
    const getData = async () => {
        setLoadingData(true)
        try {
            const resp = await ApiService.getTutor(tutorId);
            const data = await resp.json();
            setTutorData(data);
        } catch (e) {
        }
        setLoadingData(false);
    }

    useEffect(() => {
        getData()
    }, [])
    console.log(tutorData);


    return (
        <Box>
            <Grid
                h='870px'
                templateRows='repeat(2, 1fr)'
                templateColumns='repeat(3, 1fr)'
                gap={3}

            >
                <GridItem rowSpan={2} colSpan={2} >
                    <Card>
                        <CardBody>
                            <Stack px={3} spacing={2} direction={'column'}>
                                <Flex  >
                                    <Image
                                        objectFit="cover"
                                        boxSize="100%"
                                        width={"125px"}
                                        borderRadius="8px"
                                        h={"125px"}
                                        src={
                                            tutorData.avatar
                                        }
                                    />
                                    <Stack direction={"column"} px={4}>
                                        <Text fontSize={"16px"} fontWeight={"semibold"} mb={0}  >
                                            {`${tutorData.name?.first} ${tutorData.name?.last}`}
                                            <Text fontWeight={400} color={'#212224'} fontSize="14px" mb={"2px"}>
                                                {tutorData.highestLevelOfEducation}
                                            </Text>
                                        </Text>
                                        <Spacer />
                                        <Text fontSize={12} fontWeight={400} color="#6E7682"  >
                                            <span style={{ display: "inline-block" }}><img src={Star} /></span>4.2(175)
                                        </Text>
                                    </Stack>

                                    <Spacer />
                                    <Text fontSize={16} fontWeight={"semibold"}>
                                        $22.00/hr
                                    </Text>
                                </Flex>
                            </Stack>
                            <Box mt={10}>
                                <Flex alignItems={"center"}>
                                    <Text>ABOUT ME</Text>
                                    <Spacer />
                                    <Button variant="outline" color="#585F68" fontSize="12px" leftIcon={<img src={Ribbon} alt="save" />}>
                                        Save Profile
                                    </Button>
                                </Flex>
                            </Box>
                            <Text fontSize={"14px"} my={2}>
                                {tutorData.description}                            </Text>

                            <Box my={7}>
                                <Tabs>
                                    <TabList color={"#969CA6"} _active={{ color: "#207DF7" }} className="tab-list">
                                        <Tab>REVIEWS</Tab>
                                        <Tab>QUALIFICATIONS</Tab>
                                        <Tab>AVAILABILITY</Tab>
                                        <Tab>SUBJECT OFFERED</Tab>
                                    </TabList>

                                    <TabPanels>
                                        <TabPanel>
                                            <p>0 reviews</p>
                                        </TabPanel>
                                        <TabPanel>
                                            <Flex px={3} gap={0} direction={'row'} my={2}>
                                                <img src={FileAvi2} alt="qualification" />
                                                <Stack direction={"column"} px={4} spacing={1}>
                                                    <Text fontSize={"16px"} fontWeight={"500"} mb={0}  >
                                                        Indian Institute of Management (IIM), Bangalore
                                                    </Text>
                                                    <Text fontWeight={400} color={'#585F68'} fontSize="14px" mb={"2px"}>
                                                        Master of Business Administration (MBA), Information System
                                                    </Text>

                                                    <Spacer />
                                                    <Text fontSize={12} fontWeight={400} color="#6E7682"  >
                                                        2008-2010
                                                    </Text>
                                                    <Divider />
                                                </Stack>
                                            </Flex>

                                        </TabPanel>
                                        <TabPanel>
                                            <p>three!</p>
                                        </TabPanel>
                                        <TabPanel>
                                            <TableContainer my={4}>
                                                <Box border={"1px solid #EEEFF2"} borderRadius={8} py={3}>
                                                    <Table variant='simple'>
                                                        {/* <TableCaption>Imperial to metric conversion factors</TableCaption> */}
                                                        <Thead>
                                                            <Tr>
                                                                <Th></Th>
                                                                <Th >Qualification</Th>
                                                                <Th>Price</Th>
                                                            </Tr>
                                                        </Thead>
                                                        <Tbody>
                                                            <Tr>
                                                                <Td bgColor={"#FAFAFA"}>Economics</Td>
                                                                <Td>GCSE</Td>
                                                                <Td >$10.00/hr</Td>
                                                            </Tr>
                                                            <Tr>
                                                                <Td bgColor={"#FAFAFA"}>Maths</Td>
                                                                <Td>A-level</Td>
                                                                <Td >$10.00/hr</Td>
                                                            </Tr>
                                                            <Tr>
                                                                <Td bgColor={"#FAFAFA"}>Yoruba</Td>
                                                                <Td>Grade 12</Td>
                                                                <Td >$10.00/hr</Td>
                                                            </Tr>
                                                        </Tbody>
                                                    </Table>
                                                </Box>

                                            </TableContainer>
                                        </TabPanel>
                                    </TabPanels>
                                </Tabs>
                            </Box>

                        </CardBody>
                    </Card>
                </GridItem>
                <GridItem h={305} >
                    <Card py={8}>
                        <CardBody>
                            <Stack
                                flex={1}
                                flexDirection="column"
                                justifyContent="center"
                                alignItems="center"
                                textAlign="center"
                                spacing={3}
                                p={1}
                                pt={2}>
                                <img src={FileAvi} alt="send-offer-img" />
                                <Text fontSize={16} fontWeight="semibold">Send an offer to {tutorData.name?.first}</Text>
                                <Text fontSize={14} fontWeight={400} color="#6E7682" maxWidth={"85%"}>You’ll be notified once they respond to your offer</Text>
                                <CustomButton buttonText="Send Offer" padding="9px 105px" />
                            </Stack>
                        </CardBody>
                    </Card>

                    <Text fontSize={14} mt={8}>

                        <Link color='#207DF7' href='#' textDecoration="underline">
                            More Economics tutors
                        </Link>
                    </Text>
                </GridItem>

                <GridItem >
                    <Card>
                        <Box px={4} pt={3} fontSize={16} fontWeight={"semibold"} display="flex">
                            <RiQuestionFill color='#969ca6' fontSize={"22px"} />
                            <Text mx={2}>
                                How this Works
                            </Text>
                        </Box>
                        <CardBody><HowItWorks /></CardBody>
                    </Card>
                </GridItem>

            </Grid>
        </Box>

    )
}
