import BillingModal from '../../../components/BillingModal';
import PlansModal from '../../../components/PlansModal';
import { useTitle } from '../../../hooks';
import userStore from '../../../state/userStore';
import Billing from '../components/Settings/Billing';
import MyProfile from '../components/Settings/MyProfile';
import {
  Box,
  Button,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text
} from '@chakra-ui/react';
import { useState } from 'react';

function AccSettings() {
  useTitle('Account Settings');
  const [togglePlansModal, setTogglePlansModal] = useState(false);
  const { user } = userStore();

  const activatePlansModal = () => {
    setTogglePlansModal(true);
  };

  return (
    <div>
      <Box bgColor={'#FBF9FB'} pt={3} px={3}>
        <Box>
          <Text
            fontSize={{ md: 24, sm: 14 }}
            mb={{ base: 4 }}
            ml={{ base: 3 }}
            mt={{ base: 4 }}
            fontWeight={600}
            color="text.200"
          >
            Account Settings
          </Text>
        </Box>
        <Box m={{ md: 4, sm: 0 }} bgColor="#ffffff" borderRadius="16px">
          <Tabs
            sx={{
              display: { md: 'flex', sm: 'block' }
            }}
            variant="unstyled"
            orientation="vertical"
          >
            <Box
              sx={{
                borderRight: '1px solid #EEEFF2',
                width: { md: '200px', lg: '256px' },
                py: 5
              }}
            >
              <TabList
                sx={{
                  display: 'flex'
                }}
              >
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
            <Box width={{ base: '100%' }} px={{ md: 0, lg: 6 }}>
              <TabPanels>
                <TabPanel>
                  <MyProfile
                    id={user?._id}
                    username={`${user?.name?.first} ${user?.name?.last}`}
                    email={user?.email}
                  />
                </TabPanel>
                <TabPanel>
                  <Button
                    _hover={{ color: '#207df7', bg: '#F0F6FE' }}
                    color="text.400"
                    bg="transparent"
                    my={1}
                    mx={5}
                    p="10px 18px"
                    borderRadius="8px"
                    justifyContent="left"
                    alignItems={'center'}
                    fontSize="14px"
                    fontWeight="500"
                    gap={2}
                    display={'flex'}
                    onClick={() =>
                      window.open(
                        `https://billing.stripe.com/p/login/test_7sI9BM0S3aiG6s07ss?prefilled_email=${user.email}`,
                        '_blank'
                      )
                    }
                  >
                    <span> Manage Billing</span>{' '}
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 15 15"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M3.64645 11.3536C3.45118 11.1583 3.45118 10.8417 3.64645 10.6465L10.2929 4L6 4C5.72386 4 5.5 3.77614 5.5 3.5C5.5 3.22386 5.72386 3 6 3L11.5 3C11.6326 3 11.7598 3.05268 11.8536 3.14645C11.9473 3.24022 12 3.36739 12 3.5L12 9.00001C12 9.27615 11.7761 9.50001 11.5 9.50001C11.2239 9.50001 11 9.27615 11 9.00001V4.70711L4.35355 11.3536C4.15829 11.5488 3.84171 11.5488 3.64645 11.3536Z"
                        fill="currentColor"
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                  </Button>
                  {/* <Billing
                    username={`${user?.name?.first} ${user?.name?.last}`}
                    email={user?.email}
                  /> */}
                </TabPanel>
              </TabPanels>
            </Box>
          </Tabs>
          <BillingModal open={togglePlansModal} setOpen={setTogglePlansModal} />
          {/* <PlansModal
            togglePlansModal={togglePlansModal}
            setTogglePlansModal={setTogglePlansModal}
          /> */}
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
    </div>
  );
}

export default AccSettings;
