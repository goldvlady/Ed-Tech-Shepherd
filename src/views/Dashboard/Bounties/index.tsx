import {
  PencilIcon,
  SparklesIcon,
  ArrowRightIcon,
  EllipsistIcon
} from '../../../components/icons';
import { useTitle } from '../../../hooks';
import ApiService from '../../../services/ApiService';
import offerStore from '../../../state/offerStore';
import TutorAvi from '../../assets/tutoravi.svg';
import Pagination from '../components/Pagination';
import TutorCard from '../components/TutorCard';
import StudentBountyCard from './StudentBountyCard';
import {
  Avatar,
  Box,
  Divider,
  Flex,
  Image,
  SimpleGrid,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  VStack
} from '@chakra-ui/react';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import React, { useEffect, useState, useCallback } from 'react';

function AllBounties() {
  useTitle('Bounties');
  const [allTutors, setAllTutors] = useState<any>([]);
  const [loadingData, setLoadingData] = useState(false);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(5);
  const [count, setCount] = useState<number>(5);
  const [days, setDays] = useState<Array<any>>([]);
  const {
    fetchOffers,
    offers,
    isLoading,
    pagination,
    bounties,
    fetchBountyOffers
  } = offerStore();

  const doFetchStudentTutors = useCallback(async () => {
    await fetchOffers(page, limit, 'student');
    setAllTutors(offers);
    /* eslint-disable */
  }, []);

  useEffect(() => {
    doFetchStudentTutors();
  }, [doFetchStudentTutors]);

  const doFetchBountyOffers = useCallback(async () => {
    await fetchBountyOffers(page, limit);
    setAllTutors(bounties);
    /* eslint-disable */
  }, []);

  useEffect(() => {
    doFetchBountyOffers();
  }, [doFetchBountyOffers]);

  // const [pagination, setPagination] = useState<PaginationType>();

  const handleNextPage = () => {
    const nextPage = pagination.page + 1;
    fetchBountyOffers(nextPage, limit);
  };

  const handlePreviousPage = () => {
    const prevPage = pagination.page - 1;
    fetchBountyOffers(prevPage, limit);
  };

  const [tutorGrid] = useAutoAnimate();

  return (
    <>
      <Box p={3}>
        {' '}
        <Flex alignItems={'center'} gap={1}>
          <Box>
            <Text fontSize={24} fontWeight={600} color="text.200">
              Bounties
            </Text>
          </Box>

          <Text
            boxSize="fit-content"
            bgColor={'#F4F5F6'}
            p={2}
            borderRadius={'6px'}
          >
            {bounties ? bounties.length : ''}
          </Text>
        </Flex>
      </Box>
      <Box p={3}>
        {
          // [
          //   {
          //     id: 1,
          //     reward: 50,
          //     subject: 'Mathematics',
          //     modeOfInstruction: 'Chat',
          //     interestedTutors: 3,
          //     duration: 60,
          //     expiryDate: '2023-12-31'
          //   },
          //   {
          //     id: 2,
          //     reward: 50,
          //     subject: 'Physics',
          //     modeOfInstruction: 'Chat',
          //     interestedTutors: 6,
          //     duration: 60,
          //     expiryDate: '2023-12-31'
          //   },
          //   {
          //     id: 3,
          //     reward: 50,
          //     subject: 'Mathematics',
          //     modeOfInstruction: 'Chat',
          //     interestedTutors: 3,
          //     duration: 30,
          //     expiryDate: '2023-12-31'
          //   }
          // ]
          bounties &&
            bounties.map((bounty) => (
              <StudentBountyCard key={bounty.id} bounty={bounty} />
            ))
        }
      </Box>
    </>
  );
}

export default AllBounties;
