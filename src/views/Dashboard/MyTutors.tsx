import TutorAvi from '../../assets/tutoravi.svg';
import { useTitle } from '../../hooks';
import ApiService from '../../services/ApiService';
import offerStore from '../../state/offerStore';
import TutorCard from './components/TutorCard';
import {
  Box,
  Flex,
  SimpleGrid,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text
} from '@chakra-ui/react';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import React, { useEffect, useState, useCallback } from 'react';

function MyTutors() {
  useTitle('My Tutors');
  const [allTutors, setAllTutors] = useState<any>([]);
  const [loadingData, setLoadingData] = useState(false);
  const { fetchOffers, offers, isLoading } = offerStore();

  const doFetchStudentTutors = useCallback(async () => {
    const response = await ApiService.getOffers();
    const jsonResp = await response.json();
    setAllTutors(jsonResp?.data?.data ?? []);
    /* eslint-disable */
  }, []);

  useEffect(() => {
    doFetchStudentTutors();
  }, [doFetchStudentTutors]);

  const [tutorGrid] = useAutoAnimate();

  return (
    <>
      <Box p={3}>
        {' '}
        <Flex alignItems={'center'} gap={1}>
          <Box>
            <Text fontSize={24} fontWeight={600} color="text.200">
              My Tutors
            </Text>
          </Box>

          <Text
            boxSize="fit-content"
            bgColor={'#F4F5F6'}
            p={2}
            borderRadius={'6px'}
          >
            {allTutors?.length}
          </Text>
        </Flex>
        <Tabs>
          <TabList className="tab-list">
            <Tab fontSize={16} fontWeight={500} color="text.400">
              All
            </Tab>
            <Tab fontSize={16} fontWeight={500} color="text.400">
              Pending
            </Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <SimpleGrid
                columns={{ base: 1, md: 2, lg: 3 }}
                spacing="20px"
                ref={tutorGrid}
                mt={4}
              >
                {allTutors?.map((tutor: any) => (
                  <TutorCard
                    key={tutor.tutor?._id}
                    id={tutor.tutor?._id}
                    name={`${tutor.tutor.user.name.first} ${tutor.tutor.user.name.last}`}
                    levelOfEducation={'BSC'}
                    avatar={tutor.tutor.user.avatar}
                    saved={true}
                    description={tutor.tutor?.description}
                    rate={tutor.tutor?.rate}
                    rating={tutor.tutor?.rating}
                    reviewCount={tutor.tutor?.reviewCount}
                    use="my tutors"
                    offerStatus={tutor.status}
                  />
                ))}
              </SimpleGrid>
            </TabPanel>
            <TabPanel>
              {' '}
              <SimpleGrid
                columns={{ base: 1, md: 2, lg: 3 }}
                spacing="20px"
                ref={tutorGrid}
                mt={4}
              >
                {allTutors?.map(
                  (tutor: any) =>
                    tutor.status === 'draft' && (
                      <TutorCard
                        key={tutor?.tutor?._id}
                        id={tutor?.tutor?._id}
                        name={`${tutor.tutor.user.name.first} ${tutor.tutor.user.name.last}`}
                        levelOfEducation={'BSC'}
                        avatar={tutor.tutor.user.avatar}
                        saved={true}
                        description={tutor.tutor?.description}
                        rate={tutor.tutor?.rate}
                        rating={tutor.tutor?.rating}
                        reviewCount={tutor.tutor?.reviewCount}
                        use="my tutors"
                        offerStatus={tutor.status}
                      />
                    )
                )}
              </SimpleGrid>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </>
  );
}

export default MyTutors;
