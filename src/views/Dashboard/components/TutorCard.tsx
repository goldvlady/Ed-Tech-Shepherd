import Star from '../../../assets/littleStar.svg';
import Ribbon2 from '../../../assets/ribbon-blue.svg';
import Ribbon from '../../../assets/ribbon-grey.svg';
import TutorAvi from '../../../assets/tutoravi.svg';
import CustomButton from '../../../components/CustomComponents/CustomButton';
import CustomToast from '../../../components/CustomComponents/CustomToast';
import ApiService from '../../../services/ApiService';
import bookmarkedTutorsStore from '../../../state/bookmarkedTutorsStore';
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
  useDisclosure
} from '@chakra-ui/react';
import React, { useCallback, useEffect, useState } from 'react';
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
  const toast = useToast();
  const { fetchBookmarkedTutors } = bookmarkedTutorsStore();

  const [ribbonClicked, setRibbonClicked] = useState(false);

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

  const handleBountyClick = () => {
    openAcceptBounty();
  };
  return (
    <>
      <LinkBox as="article">
        <Center>
          {' '}
          <Box
            bg={'white'}
            w={{ sm: '100%', md: '100%', lg: '100%', base: '100%' }}
            height={{
              sm: '285px',
              md: '285px',
              lg: '325px'
            }}
            borderRadius="12px"
            border="1px solid #EBEDEF"
            _hover={{
              boxShadow: 'xl',
              transition: 'box-shadow 0.3s ease-in-out'
            }}
            padding={'20px'}
            position="relative"
          >
            <Box
              onClick={() => navigate(`/dashboard/find-tutor/tutor/?id=${id}`)}
            >
              <Flex gap={2} alignItems="center" position="relative">
                <Avatar size="lg" name={name} src={avatar} />
                {/* <div>
                <div
                  style={{
                    width: '16px',
                    height: '16px',
                    background: 'linear-gradient(0deg, #66BD6A, #66BD6A)',
                    border: '2.5px solid #FFFFFF',
                    borderRadius: '50%',
                    position: 'absolute',
                    top: '46px',
                    left: '50px'
                  }}
                ></div>
              </div> */}
                <Box>
                  <Flex pt={1} direction={'column'}>
                    <Text fontSize={'16px'} fontWeight={'semibold'} mb={0}>
                      {name}
                      <Text
                        fontWeight={400}
                        color={'#212224'}
                        fontSize="14px"
                        mb={'2px'}
                      >
                        {levelOfEducation}
                      </Text>
                    </Text>
                  </Flex>{' '}
                </Box>
              </Flex>
              <Box my={2}>
                <Flex alignItems="center">
                  <Text fontSize={16} fontWeight={'semibold'}>
                    ${`${rate}.00 / hr`}
                  </Text>

                  <Spacer />
                  <Flex>
                    {' '}
                    <Image src={Star} boxSize={4} />
                    <Text fontSize={12} fontWeight={400} color="#6E7682">
                      {`${rating}(${reviewCount})`}
                    </Text>
                  </Flex>
                </Flex>
              </Box>
            </Box>

            <Divider />
            <Box my={2}>
              <Text
                fontSize={'12px'}
                color={useColorModeValue('gray.700', 'gray.400')}
              >
                {description ? textTruncate(description, 200) : ''}
              </Text>
            </Box>

            {use === 'my tutors' ? (
              <Text
                width="fit-content"
                bg={offerStatus === 'accepted' ? '#F1F9F1' : '#FFF2EB'}
                py={2}
                px={5}
                borderRadius={6}
                fontSize="12px"
                fontWeight={500}
                color={offerStatus === 'accepted' ? 'green' : '#FB8441'}
                position={'absolute'}
                bottom={5}
              >
                {offerStatus === 'accepted' ? 'Active' : 'Pending'}
              </Text>
            ) : (
              courses && (
                <Box my={1}>
                  <Flex gap={3} position="absolute" bottom={5} flexWrap="wrap">
                    {courses.map((subject, index) =>
                      courses.length < 6 ? (
                        <Text
                          key={index}
                          py={1}
                          px={4}
                          fontSize={12}
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
                      ) : (
                        courses.slice(0, 5).map((subject, index) => (
                          <>
                            <Text
                              key={index}
                              py={1}
                              px={4}
                              fontSize={12}
                              fontWeight={500}
                              bgColor="#F1F2F3"
                              borderRadius={4}
                            >
                              {subject.course.label}
                            </Text>
                            {index === 4 && (
                              <Link
                                color="#207DF7"
                                href="/dashboard"
                                fontSize={12}
                                alignSelf="center"
                              >
                                + {courses.length - 5} more
                              </Link>
                            )}
                          </>
                        ))
                      )
                    )}
                  </Flex>
                </Box>
              )
            )}
            {use === 'bounty' && (
              <Button
                fontSize={12}
                fontWeight={500}
                borderRadius={4}
                // position="absolute"
                zIndex={1}
                color="#fff"
                // bottom={4}
                right={0}
                px={2}
                py={'1px'}
                onClick={() => handleBountyClick()}
              >
                Accept Bid
              </Button>
            )}
            {use !== 'my tutors' && (
              <Image
                src={saved || ribbonClicked ? Ribbon2 : Ribbon}
                position="absolute"
                top={4}
                right={5}
                width={saved || ribbonClicked ? 5 : 4}
                _hover={{ cursor: 'pointer' }}
                onClick={() => toggleBookmarkTutor(id)}
              />
            )}
          </Box>
        </Center>
      </LinkBox>
      <AcceptBountyModal
        isAcceptBountyOpen={isAcceptBountyOpen}
        closeAcceptBounty={closeAcceptBounty}
        bounty={bidId}
      />
    </>
  );
}
