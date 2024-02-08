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
  const { fetchPlans, studyPlans, pagination, isLoading } = studyPlanStore();
  const { courses: courseList, studyPlanCourses } = resourceStore();
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [tutorGrid] = useAutoAnimate();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState<string>('');

  const doFetchStudyPlans = useCallback(async () => {
    await fetchPlans(page, limit);
  }, [fetchPlans, page, limit]);

  useEffect(() => {
    doFetchStudyPlans();
  }, [doFetchStudyPlans]);

  const handlePagination = (nextPage: number) => {
    fetchPlans(nextPage, limit);
  };

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredPlans = studyPlans.filter((plan) =>
    plan.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const displayPlans = filteredPlans.length > 0 ? filteredPlans : studyPlans;

  function getSubject(id) {
    const labelFromCourseList = courseList
      .map((course) => (course._id === id ? course.label : null))
      .filter((label) => label !== null);

    const labelFromStudyPlanCourses = studyPlanCourses
      .map((course) => (course._id === id ? course.label : null))
      .filter((label) => label !== null);

    const allLabels = [...labelFromCourseList, ...labelFromStudyPlanCourses];

    return allLabels.length > 0 ? allLabels[0] : null;
  }

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
        <Box>
          <Text fontSize={24} fontWeight={600} color="text.200">
            Study Plans
          </Text>
          <Text fontSize={14} fontWeight={400} color="text.300">
            Chart success: Monitor your personalized study plans.
          </Text>
        </Box>
        <Spacer />
        <Flex gap={2}>
          <Input
            type="text"
            placeholder="Search by title..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
          {displayPlans.length > 0 && (
            <Button onClick={() => navigate('/dashboard/create-study-plans')}>
              Create New
            </Button>
          )}
        </Flex>
      </Flex>

      {displayPlans.length > 0 ? (
        <>
          <SimpleGrid
            columns={{ base: 1, md: 2, lg: 3 }}
            spacing="20px"
            ref={tutorGrid}
            mt={4}
            p={2}
          >
            {displayPlans.map((plan: any) => (
              <SubjectCard
                key={plan._id}
                title={plan.title || getSubject(plan.course)}
                subjectId={plan.course}
                score={plan.readinessScore}
                scoreColor="green"
                date={moment(plan.createdAt).format('DD MMM, YYYY')}
                handleClick={() => navigate(`planId=${plan._id}`)}
              />
            ))}
          </SimpleGrid>
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
