import PlansModal from '../../../components/PlansModal';
import { useTitle } from '../../../hooks';
import userStore from '../../../state/userStore';
import {
  Avatar,
  Box,
  Button,
  Divider,
  Flex,
  Grid,
  GridItem,
  SimpleGrid,
  Spacer,
  Stack,
  Switch,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { RiArrowRightSLine } from 'react-icons/ri';

function AccSettings() {
  useTitle('Account Settings');
  const [togglePlansModal, setTogglePlansModal] = useState(false);
  const { user }: any = userStore();

  const activatePlansModal = () => {
    setTogglePlansModal(true);
  };

  return (
    <>
      <Box bgColor={'#FBF9FB'} pt={3} px={3}>
        <Box>
          <Text fontSize={24} fontWeight={600} color="text.200">
            Account Settings
          </Text>
        </Box>
        <Box m={4} bgColor="#ffffff" borderRadius="16px">
          <Tabs variant="unstyled" orientation="vertical">
            <Box
              sx={{
                borderRight: '1px solid #EEEFF2',
                width: { md: '200px', lg: '256px' },

                py: 5
              }}
            >
              <TabList>
                <Tab
                  _selected={{ color: '#207df7', bg: '#F0F6FE' }}
                  color="text.400"
                  my={1}
                  mx={5}
                  p="10px 18px"
                  borderRadius="8px"
                  justifyContent="left"
                >
                  <Text fontSize="14px" fontWeight="500">
                    My Profile
                  </Text>
                </Tab>
                <Tab
                  _selected={{ color: '#207df7', bg: '#F0F6FE' }}
                  color="text.400"
                  my={1}
                  mx={5}
                  p="10px 18px"
                  borderRadius="8px"
                  justifyContent="left"
                >
                  <Text fontSize="14px" fontWeight="500">
                    Billing
                  </Text>
                </Tab>
                <Button
                  _hover={{ color: '#207df7', bg: '#F0F6FE' }}
                  color="text.400"
                  bg="transparent"
                  my={1}
                  mx={5}
                  p="10px 18px"
                  borderRadius="8px"
                  justifyContent="left"
                  fontSize="14px"
                  fontWeight="500"
                  onClick={activatePlansModal}
                >
                  Upgrade Plan
                </Button>
              </TabList>
            </Box>
            <Box width="900px" px={6}>
              <TabPanels>
                <TabPanel>
                  <Box>
                    <Flex
                      gap={3}
                      p={4}
                      alignItems="center"
                      border="1px solid #EEEFF1"
                      borderRadius="10px"
                      mt={2}
                      mb={4}
                    >
                      <Avatar
                        boxSize="64px"
                        color="white"
                        name="Leslie Peters"
                        bg="#4CAF50;"
                      />
                      <Stack spacing={'2px'}>
                        <Text
                          fontSize="16px"
                          fontWeight={500}
                          color="text.200"
                          display={{ base: 'block', sm: 'none', md: 'block' }}
                        >
                          {`${user?.name?.first} ${user?.name?.last}`}
                        </Text>{' '}
                        <Text fontSize={14} color="text.400">
                          {user.email}
                        </Text>
                      </Stack>
                    </Flex>
                    <Box
                      p={4}
                      alignItems="center"
                      border="1px solid #EEEFF1"
                      borderRadius="10px"
                    >
                      <Text fontSize={'12px'} color="text.400" mb={2}>
                        ACCOUNT SECURITY
                      </Text>

                      <Divider />
                      <Flex gap={5} direction="column" py={2}>
                        <Flex width={'100%'} alignItems="center">
                          <Stack spacing={'2px'}>
                            <Text
                              fontSize="14px"
                              fontWeight={500}
                              color="text.200"
                              display={{
                                base: 'block',
                                sm: 'none',
                                md: 'block'
                              }}
                            >
                              Email
                            </Text>{' '}
                            <Text fontSize={12} color="text.300">
                              {user.email}
                            </Text>
                          </Stack>
                          <Spacer />{' '}
                          <Button
                            variant="unstyled"
                            sx={{
                              borderRadius: '8px',
                              fontSize: '12px',
                              fontWeight: '500',
                              px: 4,
                              border: '1px solid #E7E8E9',
                              color: '#5C5F64',
                              height: '29px'
                            }}
                          >
                            Change
                          </Button>
                        </Flex>
                        <Flex width={'100%'} alignItems="center">
                          <Stack spacing={'2px'}>
                            <Text
                              fontSize="14px"
                              fontWeight={500}
                              color="text.200"
                              display={{
                                base: 'block',
                                sm: 'none',
                                md: 'block'
                              }}
                            >
                              Password
                            </Text>{' '}
                            <Text fontSize={12} color="text.200">
                              xxxxxxxxxx
                            </Text>
                          </Stack>
                          <Spacer />
                          <Button
                            variant="unstyled"
                            sx={{
                              borderRadius: '8px',
                              fontSize: '12px',
                              fontWeight: '500',
                              px: 4,
                              border: '1px solid #E7E8E9',
                              color: '#5C5F64',
                              height: '29px'
                            }}
                          >
                            Change
                          </Button>
                        </Flex>
                        <Flex width={'100%'} alignItems="center">
                          <Stack spacing={'2px'}>
                            <Text
                              fontSize="14px"
                              fontWeight={500}
                              color="#F53535"
                              display={{
                                base: 'block',
                                sm: 'none',
                                md: 'block'
                              }}
                            >
                              Log out of all devices
                            </Text>{' '}
                            <Text fontSize={12} color="text.300">
                              Log out of all other active sessions on other
                              devices besides this one.
                            </Text>
                          </Stack>
                          <Spacer />{' '}
                          <RiArrowRightSLine size="24px" color="#969CA6" />
                        </Flex>
                      </Flex>
                    </Box>

                    <Box
                      p={4}
                      alignItems="center"
                      border="1px solid #EEEFF1"
                      borderRadius="10px"
                      my={4}
                    >
                      <Text fontSize={'12px'} color="text.400" mb={2}>
                        MANAGE ALERTS
                      </Text>

                      <Divider />
                      <Flex gap={4} direction="column" py={2}>
                        <Flex width={'100%'} alignItems="center">
                          <Stack spacing={'2px'}>
                            <Text
                              fontSize="14px"
                              fontWeight={500}
                              color="text.200"
                              display={{
                                base: 'block',
                                sm: 'none',
                                md: 'block'
                              }}
                            >
                              Email Notifications
                            </Text>{' '}
                            <Text fontSize={12} color="text.300">
                              Receive email updates, including schedule alerts
                            </Text>
                          </Stack>
                          <Spacer /> <Switch colorScheme={'green'} size="lg" />
                        </Flex>
                        <Flex width={'100%'} alignItems="center">
                          <Stack spacing={'2px'}>
                            <Text
                              fontSize="14px"
                              fontWeight={500}
                              color="text.200"
                              display={{
                                base: 'block',
                                sm: 'none',
                                md: 'block'
                              }}
                            >
                              Mobile Notifications
                            </Text>{' '}
                            <Text fontSize={12} color="text.300">
                              Receive email updates, including schedule alerts
                            </Text>
                          </Stack>
                          <Spacer />
                          <Switch colorScheme={'green'} size="lg" />
                        </Flex>
                      </Flex>
                    </Box>

                    <Box
                      p={4}
                      alignItems="center"
                      border="1px solid #EEEFF1"
                      borderRadius="10px"
                    >
                      <Text fontSize={'12px'} color="text.400" mb={2}>
                        SUPPORT
                      </Text>

                      <Divider />
                      <Flex gap={4} direction="column" py={2}>
                        <Flex width={'100%'} alignItems="center">
                          <Stack spacing={'2px'}>
                            <Text
                              fontSize="14px"
                              fontWeight={500}
                              color="text.200"
                              display={{
                                base: 'block',
                                sm: 'none',
                                md: 'block'
                              }}
                            >
                              Terms and conditions
                            </Text>{' '}
                            <Text fontSize={12} color="text.300">
                              Read Sherperd’s terms & conditions
                            </Text>
                          </Stack>
                          <Spacer />{' '}
                          <RiArrowRightSLine size="24px" color="#969CA6" />
                        </Flex>
                        <Flex width={'100%'} alignItems="center">
                          <Stack spacing={'2px'}>
                            <Text
                              fontSize="14px"
                              fontWeight={500}
                              color="text.200"
                              display={{
                                base: 'block',
                                sm: 'none',
                                md: 'block'
                              }}
                            >
                              Contact support
                            </Text>{' '}
                            <Text fontSize={12} color="text.300">
                              Need help? Kindly reach out to our support team
                              via mail
                            </Text>
                          </Stack>
                          <Spacer />{' '}
                          <RiArrowRightSLine size="24px" color="#969CA6" />
                        </Flex>
                        <Flex width={'100%'} alignItems="center">
                          <Stack spacing={'2px'}>
                            <Text
                              fontSize="14px"
                              fontWeight={500}
                              color="#F53535"
                              display={{
                                base: 'block',
                                sm: 'none',
                                md: 'block'
                              }}
                            >
                              Delete my account
                            </Text>{' '}
                            <Text fontSize={12} color="text.300">
                              Permanently delete your Sherpherd account
                            </Text>
                          </Stack>
                          <Spacer />{' '}
                          <RiArrowRightSLine size="24px" color="#969CA6" />
                        </Flex>
                      </Flex>
                    </Box>
                  </Box>
                </TabPanel>
                <TabPanel>
                  <Box>
                    <Flex
                      gap={3}
                      p={4}
                      alignItems="center"
                      border="1px solid #EEEFF1"
                      borderRadius="10px"
                      mt={2}
                      mb={4}
                    >
                      <Avatar
                        boxSize="64px"
                        color="white"
                        name="Leslie Peters"
                        bg="#4CAF50;"
                      />
                      <Stack spacing={'2px'}>
                        <Text
                          fontSize="16px"
                          fontWeight={500}
                          color="text.200"
                          display={{ base: 'block', sm: 'none', md: 'block' }}
                        >
                          Leslie Peters
                        </Text>{' '}
                        <Text fontSize={14} color="text.400">
                          leslie@gmail.com
                        </Text>
                      </Stack>
                    </Flex>
                    <Box
                      px={4}
                      alignItems="center"
                      border="1px solid #EEEFF1"
                      borderRadius="10px"
                      my={4}
                    >
                      <Flex alignItems="center" my={2}>
                        <Text fontSize={'12px'} color="text.400">
                          PAYMENT
                        </Text>
                        <Spacer />
                        <Button
                          variant="unstyled"
                          sx={{
                            borderRadius: '8px',
                            fontSize: '12px',
                            fontWeight: '500',
                            px: 4,
                            border: '1px solid #E7E8E9',
                            color: '#5C5F64',
                            height: '29px'
                          }}
                        >
                          Change
                        </Button>
                      </Flex>

                      <Divider />
                      <Flex gap={5} direction="column" py={2} mb={8}>
                        <Flex width={'100%'} alignItems="center">
                          <Stack spacing={'2px'}>
                            <Text
                              fontSize="14px"
                              fontWeight={500}
                              color="text.200"
                              display={{
                                base: 'block',
                                sm: 'none',
                                md: 'block'
                              }}
                            >
                              Account Name
                            </Text>{' '}
                            <Text fontSize={12} color="text.300">
                              Lateef Kayode{' '}
                            </Text>
                          </Stack>
                        </Flex>
                        <Flex width={'100%'} alignItems="center">
                          <Stack spacing={'2px'}>
                            <Text
                              fontSize="14px"
                              fontWeight={500}
                              color="text.200"
                              display={{
                                base: 'block',
                                sm: 'none',
                                md: 'block'
                              }}
                            >
                              Account number
                            </Text>{' '}
                            <Text fontSize={12} color="text.300">
                              0215824341
                            </Text>
                          </Stack>
                        </Flex>
                        <Flex width={'100%'} alignItems="center">
                          <Stack spacing={'2px'}>
                            <Text
                              fontSize="14px"
                              fontWeight={500}
                              color="text.200"
                              display={{
                                base: 'block',
                                sm: 'none',
                                md: 'block'
                              }}
                            >
                              Bank name
                            </Text>{' '}
                            <Text fontSize={12} color="text.300">
                              Bank of America
                            </Text>
                          </Stack>
                        </Flex>
                      </Flex>
                    </Box>

                    <Box
                      p={4}
                      alignItems="center"
                      border="1px solid #EEEFF1"
                      borderRadius="10px"
                    >
                      <Text fontSize={'12px'} color="text.400" mb={2}>
                        SUPPORT
                      </Text>

                      <Divider />
                      <Flex gap={4} direction="column" py={2}>
                        <Flex width={'100%'} alignItems="center">
                          <Stack spacing={'2px'}>
                            <Text
                              fontSize="14px"
                              fontWeight={500}
                              color="text.200"
                              display={{
                                base: 'block',
                                sm: 'none',
                                md: 'block'
                              }}
                            >
                              Terms and conditions
                            </Text>{' '}
                            <Text fontSize={12} color="text.300">
                              Read Sherperd’s terms & conditions
                            </Text>
                          </Stack>
                          <Spacer />{' '}
                          <RiArrowRightSLine size="24px" color="#969CA6" />
                        </Flex>
                        <Flex width={'100%'} alignItems="center">
                          <Stack spacing={'2px'}>
                            <Text
                              fontSize="14px"
                              fontWeight={500}
                              color="text.200"
                              display={{
                                base: 'block',
                                sm: 'none',
                                md: 'block'
                              }}
                            >
                              Contact support
                            </Text>{' '}
                            <Text fontSize={12} color="text.300">
                              Need help? Kindly reach out to our support team
                              via mail
                            </Text>
                          </Stack>
                          <Spacer />{' '}
                          <RiArrowRightSLine size="24px" color="#969CA6" />
                        </Flex>
                      </Flex>
                    </Box>
                  </Box>
                </TabPanel>
              </TabPanels>
            </Box>
          </Tabs>
          <PlansModal
            togglePlansModal={togglePlansModal}
            setTogglePlansModal={setTogglePlansModal}
          />
        </Box>
        {/* <Grid
          h="110vh"
          m={4}
          templateRows="repeat(1, 1fr)"
          templateColumns="repeat(5, 1fr)"
          gap={4}
          bgColor="#ffffff"
          borderRadius="16px"
        >
          <GridItem colSpan={1} borderRight="1px solid #EEEFF2">
            dfgf
          </GridItem>
          <GridItem colSpan={4} bg="papayawhip">
            dfdfdf
          </GridItem>
        </Grid> */}
      </Box>
    </>
  );
}

export default AccSettings;
