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
  SimpleGrid,
  RangeSlider,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  HStack,
  VStack
} from '@chakra-ui/react';

import { useNavigate } from 'react-router';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import SubjectCard from '../../../components/SubjectCard';
import studyPlanStore from '../../../state/studyPlanStore';
import resourceStore from '../../../state/resourceStore';
import moment from 'moment';
import Pagination from '../components/Pagination';
import ShepherdSpinner from '../components/shepherd-spinner';
import ApiService from '../../../services/ApiService';
import { useCustomToast } from '../../../components/CustomComponents/CustomToast/useCustomToast';
import { MdCancel, MdGraphicEq } from 'react-icons/md';
import Select, { components } from 'react-select';
import { FiChevronDown } from 'react-icons/fi';
import { GiCancel } from 'react-icons/gi';

function StudyPlans() {
  const { fetchPlans, studyPlans, pagination, isLoading, deleteStudyPlan } =
    studyPlanStore();
  const { courses: courseList, studyPlanCourses } = resourceStore();
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [tutorGrid] = useAutoAnimate();
  const navigate = useNavigate();
  const toast = useCustomToast();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [minScore, setMinScore] = useState(0);
  const [maxScore, setMaxScore] = useState(100);
  const [subject, setSubject] = useState<string>();

  const DropdownIndicator = (props) => {
    return (
      <components.DropdownIndicator {...props}>
        <Box as={FiChevronDown} color={'text.400'} />
      </components.DropdownIndicator>
    );
  };
  const doFetchStudyPlans = useCallback(async () => {
    await fetchPlans(page, limit);
  }, [fetchPlans, page, limit]);

  useEffect(() => {
    doFetchStudyPlans();
  }, [doFetchStudyPlans]);

  const handlePagination = (nextPage: number) => {
    fetchPlans(nextPage, limit);
  };

  const handleDeletePlan = async (id: string) => {
    try {
      const resp: any = await deleteStudyPlan(id);

      if (resp.status === 200) {
        toast({
          title: 'Plan Deleted Successfully',
          position: 'top-right',
          status: 'success',
          isClosable: true
        });
        // fetchPlans(page, limit);
      } else {
        // setLoading(false);
        toast({
          title: 'Failed to delete, try again',
          position: 'top-right',
          status: 'error',
          isClosable: true
        });
      }
    } catch (error: any) {
      // setLoading(false);
    }
  };
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
  const handleScoreChange = (newMinScore, newMaxScore) => {
    setMinScore(newMinScore);
    setMaxScore(newMaxScore);
    fetchPlans(page, limit, newMinScore, newMaxScore, searchTerm, subject);
  };

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = event.target.value;
    setSearchTerm(newSearchTerm);
    fetchPlans(page, limit, minScore, maxScore, newSearchTerm, subject);
  };

  const handleSubjectChange = (selectedOption) => {
    const newSubject = getSubject(selectedOption);
    setSubject(newSubject);
    fetchPlans(page, limit, minScore, maxScore, searchTerm, newSubject);
  };

  const subjectOptions: any = studyPlanCourses.map((item, index) => ({
    value: item._id,
    label: item.label,
    id: item._id
  }));

  // if (isLoading) {
  //   return (
  //     <Box
  //       p={5}
  //       textAlign="center"
  //       style={{
  //         display: 'flex',
  //         justifyContent: 'center',
  //         alignItems: 'center',
  //         height: '100vh'
  //       }}
  //     >
  //       <ShepherdSpinner />
  //     </Box>
  //   );
  // }
  const clearFilters = () => {
    setMinScore(0);
    setMaxScore(100);
    setSearchTerm('');
    setSubject('');
  };
  return (
    <>
      <Flex p={3} justifyContent="space-between">
        <Box>
          <Text fontSize={24} fontWeight={600} color="text.200">
            Study Plans
          </Text>
          <Text fontSize={14} fontWeight={400} color="text.300">
            Chart success: Monitor your personalized study plans.
          </Text>
        </Box>

        <Flex gap={2} alignItems="center">
          <MdCancel size={'100px'} color="lightgray" onClick={clearFilters} />
          <Box fontSize={{ base: 'sm', md: 'md' }}>
            <Select
              value={subject}
              onChange={(option: any) => {
                handleSubjectChange(option.id);
              }}
              options={subjectOptions}
              placeholder={subject ? subject : 'Select Subject'}
              components={{ DropdownIndicator }}
              isSearchable
              styles={{
                container: (provided) => ({
                  ...provided,
                  width: '150px'
                }),
                control: (provided) => ({
                  ...provided,
                  borderRadius: '40px',
                  fontSize: '14px',
                  fontWeight: '400',
                  textAlign: 'left',
                  borderColor: '#E2E8F0'
                }),
                menu: (provided) => ({
                  ...provided,
                  marginTop: '2px'
                }),
                option: (provided, state) => ({
                  ...provided,
                  backgroundColor: state.isFocused ? '#F2F4F7' : 'transparent',
                  ':active': {
                    backgroundColor: '#F2F4F7'
                  }
                })
              }}
            />
          </Box>
          <Text> {minScore}</Text>
          <RangeSlider
            aria-label={['min', 'max']}
            defaultValue={[minScore, maxScore]}
            onChangeEnd={(values) => handleScoreChange(values[0], values[1])}
          >
            <RangeSliderTrack>
              <RangeSliderFilledTrack />
            </RangeSliderTrack>
            <RangeSliderThumb index={0}>
              <Box color="tomato" as={MdGraphicEq} />
            </RangeSliderThumb>
            <RangeSliderThumb index={1} />
          </RangeSlider>
          <Text> {maxScore}</Text>

          <Input
            type="text"
            placeholder="Search by title..."
            value={searchTerm}
            onChange={handleSearchChange}
            w="full"
          />
          {studyPlans.length > 0 && (
            <Button
              onClick={() => navigate('/dashboard/create-study-plans')}
              w="full"
            >
              Create New
            </Button>
          )}
        </Flex>
      </Flex>
      {isLoading ? (
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
      ) : studyPlans.length > 0 ? (
        <>
          <SimpleGrid
            columns={{ base: 1, md: 2, lg: 3 }}
            spacing="20px"
            ref={tutorGrid}
            mt={4}
            p={2}
          >
            {studyPlans.map((plan: any) => (
              <SubjectCard
                key={plan._id}
                title={plan.title || getSubject(plan.course)}
                subjectId={plan.course}
                score={plan.readinessScore}
                scoreColor="green"
                date={moment(plan.createdAt).format('DD MMM, YYYY')}
                handleClick={() => navigate(`planId=${plan._id}`)}
                handleDelete={() => handleDeletePlan(plan._id)}
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
