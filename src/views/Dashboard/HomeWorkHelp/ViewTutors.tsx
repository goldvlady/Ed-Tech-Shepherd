import { ReactComponent as BackIcn } from '../../../assets/backIcn.svg';
import CustomScrollbar from '../../../components/CustomComponents/CustomScrollBar';
import ApiService from '../../../services/ApiService';
import bookmarkedTutorsStore from '../../../state/bookmarkedTutorsStore';
import resourceStore from '../../../state/resourceStore';
import TutorCard from '../../Dashboard/components/TutorCard';
import {
  DiscoverMore,
  PreviouslyText,
  TutorsBackIcn,
  ViewTutorSection
} from './style';
import { SimpleGrid, Spinner, Box } from '@chakra-ui/react';
import moment from 'moment';
import React, { useCallback, useState, useEffect } from 'react';

const ViewTutors = ({ onOpenModal }: { onOpenModal?: () => void }) => {
  const { courses: courseList, levels: levelOptions } = resourceStore();
  //   const { fetchBookmarkedTutors, tutors: allTutors } = bookmarkedTutorsStore();
  const [subject, setSubject] = useState<string>('Subject');
  const [allTutors, setAllTutors] = useState<any>([]);
  const [tutorDetails, setTutortDetails] = useState({
    level: {
      _id: ''
    },
    tz: '',
    days: [],
    price: { value: '' },
    rating: { value: '' },
    toTime: '',
    fromTime: '',
    page: '',
    limit: ''
  });
  const [loadingData, setLoadingData] = useState(false);
  //   const doFetchBookmarkedTutors = useCallback(async () => {
  //     await fetchBookmarkedTutors();
  //     /* eslint-disable */
  //   }, []);

  const getData = async () => {
    const formData = {
      courses: subject === 'Subject' ? '' : subject.toLowerCase(),
      levels: tutorDetails.level?._id.length < 0 ? '' : tutorDetails.level?._id,
      availability: '',
      tz: moment.tz.guess(),
      days: tutorDetails.days,
      price:
        tutorDetails.price.value.length < 0 ? '' : tutorDetails.price.value,
      floorRating:
        tutorDetails.rating.value.length < 0 ? '' : tutorDetails.rating.value,
      startTime: tutorDetails.toTime,
      endTime: tutorDetails.fromTime,
      page: tutorDetails.page,
      limit: tutorDetails.limit
    };
    setLoadingData(true);
    const resp = await ApiService.getAllTutors(formData);
    const data = await resp.json();

    // setPagination(data.meta.pagination);
    // const startIndex = (page - 1) * data.meta.pagination.limit;
    // const endIndex = Math.min(
    //   startIndex + data.meta.pagination.limit,
    //   data.meta.pagination.count
    // );
    // const visibleTutors = data.tutors.slice(startIndex, endIndex);
    setAllTutors(data?.tutors);
    setLoadingData(false);
  };

  //   useEffect(() => {
  //     doFetchBookmarkedTutors();
  //   }, [doFetchBookmarkedTutors]);

  const handleSelectedCourse = (selectedCourse) => {
    const selectedCourseObject = courseList.find(
      (course) => course.label === selectedCourse
    );

    if (selectedCourseObject) {
      const selectedID = selectedCourseObject._id;
      setSubject(selectedID);
    }
  };

  useEffect(() => {
    getData();
    /* eslint-disable */
  }, [tutorDetails]);

  return (
    <ViewTutorSection>
      <TutorsBackIcn onClick={onOpenModal}>
        <BackIcn /> Back
      </TutorsBackIcn>
      <CustomScrollbar>
        <div>
          <PreviouslyText>Tutors you’ve hired previously</PreviouslyText>
        </div>
        <div>
          {loadingData ? (
            <Box
              p={5}
              textAlign="center"
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                width: '100%'
              }}
            >
              <Spinner />
            </Box>
          ) : (
            <SimpleGrid columns={[2, null, 3]} spacing="20px" padding="0 120px">
              {allTutors.map((tutor: any) => (
                <TutorCard
                  key={tutor?.level?._id}
                  name={`${tutor?.user?.name?.first ?? ''} ${
                    tutor?.user?.name?.last ?? ''
                  }`}
                  levelOfEducation={'BSC'}
                  avatar={tutor?.user?.avatar ?? ''}
                  rate={tutor?.rate ?? ''}
                  rating={tutor?.rating ?? ''}
                  courses={tutor?.coursesAndLevels}
                  reviewCount={tutor?.reviewCount ?? ''}
                  description={tutor?.description ?? ''}
                />
              ))}
            </SimpleGrid>
          )}
        </div>
        <div>
          <PreviouslyText>Online tutors</PreviouslyText>
        </div>
        <div>
          {loadingData ? (
            <Box
              p={5}
              textAlign="center"
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                width: '100%'
              }}
            >
              <Spinner />
            </Box>
          ) : (
            <SimpleGrid columns={[2, null, 3]} spacing="20px" padding="0 120px">
              {allTutors.map((tutor: any) => (
                <TutorCard
                  key={tutor?.level?._id}
                  name={`${tutor?.user?.name?.first ?? ''} ${
                    tutor?.user?.name?.last ?? ''
                  }`}
                  levelOfEducation={'BSC'}
                  avatar={tutor?.user?.avatar ?? ''}
                  rate={tutor?.rate ?? ''}
                  rating={tutor?.rating ?? ''}
                  courses={tutor?.coursesAndLevels ?? ''}
                  reviewCount={tutor?.reviewCount ?? ''}
                  description={tutor?.description ?? ''}
                />
              ))}
            </SimpleGrid>
          )}
        </div>
        <DiscoverMore>{'Discover more tutors >>>'}</DiscoverMore>
      </CustomScrollbar>
    </ViewTutorSection>
  );
};

export default ViewTutors;
