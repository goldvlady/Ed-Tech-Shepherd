import Star from '../../../assets/littleStar.svg';
import Ribbon2 from '../../../assets/ribbon-blue.svg';
import Ribbon from '../../../assets/ribbon-grey.svg';
import TutorAvi from '../../../assets/tutoravi.svg';
import CustomButton from '../../../components/CustomComponents/CustomButton';
import CustomModal from '../../../components/CustomComponents/CustomModal';
import CustomToast from '../../../components/CustomComponents/CustomToast';
import { useCustomToast } from '../../../components/CustomComponents/CustomToast/useCustomToast';
import ApiService from '../../../services/ApiService';
import bookmarkedTutorsStore from '../../../state/bookmarkedTutorsStore';
import userStore from '../../../state/userStore';
import { textTruncate } from '../../../util';
import AcceptBountyModal from './AcceptBounty';
import {
  Avatar,
  Badge,
  Box,
  Button,
  Center,
  Flex,
  Heading,
  Image,
  Link,
  LinkBox,
  LinkOverlay,
  Spacer,
  Stack,
  Text,
  VStack,
  useColorModeValue,
  useToast,
  Divider,
  Textarea,
  NumberInput,
  NumberInputField,
  useDisclosure
} from '@chakra-ui/react';
import React, { useCallback, useEffect, useState } from 'react';
import { IconContext } from 'react-icons';
import { AiFillStar } from 'react-icons/ai';
import { FaStar } from 'react-icons/fa';
import { useNavigate } from 'react-router';

export default function TutorCard(props: any) {
  const {
    id,
    bidId,
    name,
    levelOfEducation,
    avatar,
    use,
    rate,
    description,
    courses,
    rating,
    reviewCount,
    saved,
    offerStatus,
    handleSelectedCourse
  } = props;
  const toast = useCustomToast();
  const { fetchBookmarkedTutors } = bookmarkedTutorsStore();
  const { user } = userStore();

  const [ribbonClicked, setRibbonClicked] = useState(false);
  const [reviewRate, setReviewRate] = useState<any>(1);
  const [review, setReview] = useState('');

  const toggleBookmarkTutor = async (id: string) => {
    setRibbonClicked(!ribbonClicked);
    try {
      const resp = await ApiService.toggleBookmarkedTutor(id);

      if (saved && resp.status === 200) {
        setRibbonClicked(false);
        toast({
          render: () => (
            <CustomToast
              title="Tutor removed from Bookmarks successfully"
              status="success"
            />
          ),
          position: 'top-right',
          isClosable: true
        });
      } else {
        setRibbonClicked(true);
        toast({
          render: () => (
            <CustomToast title="Tutor saved successfully" status="success" />
          ),
          position: 'top-right',
          isClosable: true
        });
      }
      fetchBookmarkedTutors();
    } catch (e) {
      setRibbonClicked(false);
      toast({
        title: 'An unknown error occured',
        position: 'top-right',
        status: 'error',
        isClosable: true
      });
    }
  };
  const tutorSubjects = [
    { id: 1, label: 'English' },
    { id: 2, label: 'Literature' },
    { id: 3, label: 'Maths' },
    { id: 4, label: 'English' },
    { id: 5, label: 'Literature' },
    { id: 6, label: 'English' },
    { id: 7, label: 'Literature' }
  ];
  const navigate = useNavigate();
  const {
    isOpen: isAcceptBountyOpen,
    onOpen: openAcceptBounty,
    onClose: closeAcceptBounty
  } = useDisclosure();

  const {
    isOpen: isReviewModalOpen,
    onOpen: openReviewModal,
    onClose: closeReviewModal
  } = useDisclosure();

  const handleBountyClick = () => {
    openAcceptBounty();
  };

  const handleSubmitReview = async () => {
    const formData = {
      reviewerId: user?._id,
      entityType: 'student',
      rating: reviewRate,
      review: review
    };

    try {
      const resp = await ApiService.submitReview(id, formData);

      if (resp.status === 200) {
        toast({
          render: () => (
            <CustomToast
              title="Review Submitted successfully"
              status="success"
            />
          ),
          position: 'top-right',
          isClosable: true
        });
      } else {
        toast({
          render: () => (
            <CustomToast title="Something went wrong" status="error" />
          ),
          position: 'top-right',
          isClosable: true
        });
      }
    } catch (e) {
      toast({
        title: 'An unknown error occured',
        position: 'top-right',
        status: 'error',
        isClosable: true
      });
    }
  };

  const handleRatingClick = (selectedRating) => {
    setReviewRate(selectedRating);
  };

  const renderStars = () => {
    const stars: any = [];
    for (let i = 1; i <= 5; i++) {
      const starColor = i <= reviewRate ? 'gold' : 'gray';
      stars.push(
        <IconContext.Provider key={i} value={{ color: starColor, size: '2em' }}>
          <AiFillStar onClick={() => setReviewRate(i)} />
        </IconContext.Provider>
      );
    }
    return stars;
  };

  return (
    <>
      <LinkBox as="article">
        <Box
          bg={'white'}
          border="1px solid #EBEDEF"
          borderRadius="12px"
          _hover={{
            boxShadow: 'xl',
            transition: 'box-shadow 0.3s ease-in-out'
          }}
          padding={4}
          width="100%"
          mb={4}
        >
          <Flex flexDir={['column', 'row']} alignItems="center">
            <Avatar
              size="lg"
              name={name}
              src={avatar}
              mr={[0, 4]}
              mb={[4, 0]}
            />

            <Box flex={1}>
              <Text fontSize="lg" fontWeight="semibold" mb={1}>
                {name}
              </Text>
              <Text fontWeight={400} color="#212224" fontSize="md">
                {levelOfEducation}
              </Text>
            </Box>
          </Flex>

          <Box my={4}>
            <Flex alignItems="center">
              <Text fontSize="lg" fontWeight="semibold">
                ${`${rate}.00 / hr`}
              </Text>
              <Spacer />
              <Flex alignItems="center">
                <Image src={Star} boxSize={4} mr={1} />
                <Text fontSize="sm" fontWeight={400} color="#6E7682">
                  {`${rating}(${reviewCount})`}
                </Text>
              </Flex>
            </Flex>
          </Box>

          <Text fontSize="sm" color={useColorModeValue('gray.700', 'gray.400')}>
            {description ? textTruncate(description, 200) : ''}
          </Text>

          {use === 'my tutors' ? (
            <Text
              bg={offerStatus === 'accepted' ? '#F1F9F1' : '#FFF2EB'}
              py={2}
              px={5}
              borderRadius={6}
              fontSize="sm"
              fontWeight={500}
              color={offerStatus === 'accepted' ? 'green' : '#FB8441'}
              mt={4}
              width="fit-content"
            >
              {offerStatus === 'accepted' ? 'Active' : 'Pending'}
            </Text>
          ) : (
            courses && (
              <Box mt={2}>
                <Flex flexWrap="wrap" gap={2}>
                  {courses.length <= 5
                    ? courses.map((subject, index) => (
                        <Text
                          key={index}
                          py={2}
                          px={4}
                          fontSize="sm"
                          fontWeight={500}
                          bgColor="#F1F2F3"
                          borderRadius={4}
                          _hover={{ cursor: 'pointer' }}
                          onClick={() =>
                            handleSelectedCourse(subject.course.label)
                          }
                        >
                          {subject.course.label}
                        </Text>
                      ))
                    : courses.slice(0, 5).map((subject, index) => (
                        <Text
                          key={index}
                          py={2}
                          px={4}
                          fontSize="sm"
                          fontWeight={500}
                          bgColor="#F1F2F3"
                          borderRadius={4}
                        >
                          {subject.course.label}
                        </Text>
                      ))}
                  {courses.length > 5 && (
                    <Link
                      color="#207DF7"
                      href={`/dashboard/find-tutor/tutor/?id=${id}`}
                      fontSize="sm"
                      mt={2}
                    >
                      + {courses.length - 5} more
                    </Link>
                  )}
                </Flex>
              </Box>
            )
          )}

          {use === 'bounty' && (
            <Button
              fontSize="sm"
              fontWeight={500}
              borderRadius={4}
              color="#fff"
              px={2}
              py={1}
              mt={4}
              onClick={() => handleBountyClick()}
            >
              Accept Bid
            </Button>
          )}
          {use === 'my tutors' && offerStatus === 'accepted' && (
            <Button
              variant="unstyled"
              fontSize="sm"
              fontWeight={500}
              borderRadius={4}
              border="1px solid grey"
              color="grey"
              position="absolute"
              bottom={8}
              right={4}
              px={2}
              onClick={openReviewModal}
            >
              Review
            </Button>
          )}
          {use !== 'my tutors' && (
            <Image
              src={saved || ribbonClicked ? Ribbon2 : Ribbon}
              boxSize="5"
              _hover={{ cursor: 'pointer' }}
              onClick={() => toggleBookmarkTutor(id)}
              position="absolute"
              top={4}
              right={4}
            />
          )}
        </Box>
      </LinkBox>
      <AcceptBountyModal
        isAcceptBountyOpen={isAcceptBountyOpen}
        closeAcceptBounty={closeAcceptBounty}
        bounty={bidId}
      />
      <CustomModal
        isOpen={isReviewModalOpen}
        modalTitle="Drop a Review"
        isModalCloseButton
        style={{
          maxWidth: '400px',
          height: 'fit-content'
        }}
        footerContent={
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button
              isDisabled={!reviewRate || !review}
              onClick={() => handleSubmitReview()}
            >
              Update
            </Button>
          </div>
        }
        onClose={closeReviewModal}
      >
        <VStack p={5} width="100%">
          <Box mb={4} justifyContent="center">
            <Flex gap={2}> {renderStars()}</Flex>
          </Box>
          <Box width="100%">
            <Textarea
              placeholder="Enter your review here..."
              value={review}
              onChange={(e) => setReview(e.target.value)}
              size="sm"
            />
          </Box>
        </VStack>
      </CustomModal>
    </>
  );
}
