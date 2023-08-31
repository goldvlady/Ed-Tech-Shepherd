import { useTitle } from '../../../hooks';
import ApiService from '../../../services/ApiService';
import offerStore from '../../../state/offerStore';
import TutorAvi from '../../assets/tutoravi.svg';
import Pagination from '../components/Pagination';
import TutorCard from '../components/TutorCard';
import {
  Badge,
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

function Bounties() {
  useTitle('Bounties');
  const [allTutors, setAllTutors] = useState<any>([]);
  const [loadingData, setLoadingData] = useState(false);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(5);
  const [count, setCount] = useState<number>(5);
  const [days, setDays] = useState<Array<any>>([]);
  const { fetchOffers, offers, isLoading, pagination } = offerStore();

  const doFetchStudentTutors = useCallback(async () => {
    await fetchOffers(page, limit, 'student');
    setAllTutors(offers);
    /* eslint-disable */
  }, []);

  useEffect(() => {
    doFetchStudentTutors();
  }, [doFetchStudentTutors]);

  // const [pagination, setPagination] = useState<PaginationType>();

  const handleNextPage = () => {
    const nextPage = pagination.page + 1;
    fetchOffers(nextPage, limit, 'student');
  };

  const handlePreviousPage = () => {
    const prevPage = pagination.page - 1;
    fetchOffers(prevPage, limit, 'student');
  };

  const [tutorGrid] = useAutoAnimate();

  return (
    <>
      <Box p={3}>
        {' '}
        <Flex alignItems={'center'} gap={1}>
          <Box>
            <Text fontSize={24} fontWeight={600} color="text.200">
              Interested Tutors
            </Text>
          </Box>
          <Badge bgColor={'#F4F5F6'} p={2} borderRadius={'6px'}>
            {offers ? offers.length : ''}
          </Badge>
        </Flex>
        <Box>
          {' '}
          {!isLoading && offers ? (
            <>
              {' '}
              <SimpleGrid
                columns={{ base: 1, md: 2, lg: 3 }}
                spacing="20px"
                ref={tutorGrid}
                mt={4}
              >
                {offers.map((tutor: any) => (
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
                    use="bounty"
                    offerStatus={tutor.status}
                  />
                ))}
              </SimpleGrid>{' '}
              <Pagination
                page={pagination.page}
                count={pagination.total}
                limit={pagination.limit}
                handleNextPage={handleNextPage}
                handlePreviousPage={handlePreviousPage}
              />
            </>
          ) : (
            !isLoading && 'no tutors found'
          )}
        </Box>
      </Box>
    </>
  );
}

export default Bounties;
