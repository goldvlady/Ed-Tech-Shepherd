import React, {
  useRef,
  useState,
  useCallback,
  useEffect,
  ChangeEvent
} from 'react';
import {
  Grid,
  Box,
  Divider,
  Flex,
  Image,
  Text,
  Input,
  Button,
  Spacer,
  SimpleGrid
} from '@chakra-ui/react';

import { useNavigate } from 'react-router';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import SubjectCard from '../../../components/SubjectCard';
import studyPlanStore from '../../../state/studyPlanStore';
import resourceStore from '../../../state/resourceStore';
import moment from 'moment';
import Pagination from '../components/Pagination';
import ShepherdSpinner from '../components/shepherd-spinner';

function StudyPlans() {
  // const [studyPlans, setStudyPlans] = useState(['1', '2']);
  const { fetchPlans, studyPlans, pagination, isLoading } = studyPlanStore();
  const { courses: courseList, levels: levelOptions } = resourceStore();
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(30);
  const doFetchStudyPlans = useCallback(async () => {
    await fetchPlans(page, limit);
    /* eslint-disable */
  }, []);
  useEffect(() => {
    doFetchStudyPlans();
  }, [doFetchStudyPlans]);
  const [tutorGrid] = useAutoAnimate();
  const navigate = useNavigate();
  console.log(studyPlans);

  function getSubject(id) {
    return courseList.map((course) => {
      if (course._id === id) {
        return course.label;
      }
      return null;
    });
  }

  const allPlans = studyPlans.sort((a, b) => {
    const dateA = moment(a.createdAt);
    const dateB = moment(b.createdAt);
    if (dateA.isAfter(dateB)) {
      return -1;
    } else if (dateB.isAfter(dateA)) {
      return 1;
    }
    return 0;
  });
  const handlePagination = (nextPage: number) => {
    fetchPlans(nextPage, limit);
  };

  if (isLoading) {
    return (
      <Box
        p={5}
        textAlign="center"
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh'
        }}
      >
        <ShepherdSpinner />
      </Box>
    );
  }
  return (
    <>
      <Flex p={3}>
        {' '}
        <Box>
          <Text fontSize={24} fontWeight={600} color="text.200">
            Study Plans
          </Text>
          <Text fontSize={14} fontWeight={400} color="text.300">
            Chart success: Monitor your personalized study plans.
          </Text>
        </Box>{' '}
        <Spacer />
        {allPlans.length > 0 && (
          <Button onClick={() => navigate('/dashboard/create-study-plans')}>
            Create New
          </Button>
        )}
      </Flex>

      {allPlans.length > 0 ? (
        <>
          {' '}
          <SimpleGrid
            columns={{ base: 1, md: 2, lg: 3 }}
            spacing="20px"
            ref={tutorGrid}
            mt={4}
            p={2}
          >
            {studyPlans?.map((plan: any) => (
              <SubjectCard
                title={getSubject(plan.course)}
                score={plan.readinessScore}
                scoreColor="green"
                date={moment(plan.createdAt).format('DD MMM, YYYY')}
                handleClick={() => navigate(`planId=${plan._id}`)}
              />
            ))}
          </SimpleGrid>{' '}
          <Pagination
            page={pagination.page}
            count={pagination.total}
            limit={pagination.limit}
            handlePagination={handlePagination}
          />
        </>
      ) : (
        <section className="flex justify-center items-center mt-28 w-full">
          <div className="text-center">
            <img src="/images/notes.png" alt="" />
            <Text>You don't have any study plans yet!</Text>
            <Button onClick={() => navigate('/dashboard/create-study-plans')}>
              Create New
            </Button>
          </div>
        </section>
      )}
    </>
  );
}

export default StudyPlans;
