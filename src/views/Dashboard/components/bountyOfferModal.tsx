import CustomButton2 from '../../../components/CustomComponents/CustomButton';
import CustomModal from '../../../components/CustomComponents/CustomModal';
import CustomToast from '../../../components/CustomComponents/CustomToast';
import ApiService from '../../../services/ApiService';
import resourceStore from '../../../state/resourceStore';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Text,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Radio,
  RadioGroup,
  useToast
} from '@chakra-ui/react';
import React, { useCallback, useState, useMemo } from 'react';
import { FiChevronDown } from 'react-icons/fi';

function BountyOfferModal(props) {
  const { isBountyModalOpen, closeBountyModal } = props;
  const { courses: courseList, levels: levelOptions } = resourceStore();

  const [bountyOffer, setBountyOffer] = useState({
    subject: '',
    topic: '',
    level: '',
    price: '',
    rating: 0,
    instructionMode: '',
    time: ''
  });

  const [searchValue, setSearchValue] = useState('');
  const priceOptions = [
    { value: '10-12', label: '$10.00 - $12.00', id: 1 },
    { value: '12-15', label: '$12.00 - $15.00', id: 2 },
    { value: '15-20', label: '$15.00 - $20.00', id: 3 },
    { value: '20-25', label: '$20.00 - $25.00', id: 4 }
  ];
  const toast = useToast();
  const searchQuery = useCallback((searchValue: string, courseList: any[]) => {
    return courseList.filter((course) =>
      course.label.toLowerCase().includes(searchValue.toLowerCase())
    );
  }, []);

  const filteredOptions = searchQuery(searchValue, courseList);

  const isDisabledBtn = useMemo(() => {
    return !Object.values(bountyOffer).some((value) => value === '');
  }, [bountyOffer]);

  const handleSubmitBounty = async () => {
    const newObject = {
      topic: bountyOffer.topic,
      description: `Need help understanding the basics of ${bountyOffer.subject} including ${bountyOffer.topic}.`,
      subject: '',
      reward: parseInt(bountyOffer.price, 10) || 0,
      type: bountyOffer.instructionMode,
      courseId: bountyOffer.subject,
      levelId: bountyOffer.level,
      expiryDate: 'Tue Aug 29 2023'
    };
    const response = await ApiService.createBounty(newObject);
    closeBountyModal();
    if (response.status === 200) {
      toast({
        render: () => (
          <CustomToast
            title="Bounty Offer Placed Successfully"
            status="success"
          />
        ),
        position: 'top-right',
        isClosable: true
      });
    } else {
      toast({
        render: () => (
          <CustomToast title="Something went wrong.." status="error" />
        ),
        position: 'top-right',
        isClosable: true
      });
    }
  };

  return (
    <>
      {' '}
      <CustomModal
        isOpen={isBountyModalOpen}
        modalTitle="Place Bounty"
        isModalCloseButton
        style={{
          maxWidth: '400px',
          height: 'auto'
        }}
        footerContent={
          <div style={{ display: 'flex', gap: '8px' }}>
            <CustomButton2
              type="button"
              isCancel
              onClick={closeBountyModal}
              title="Cancel"
            />
            <CustomButton2
              type="button"
              onClick={handleSubmitBounty}
              active={isDisabledBtn}
              title="Confirm"
              disabled={!isDisabledBtn}
            />
          </div>
        }
        onClose={closeBountyModal}
      >
        <Box bg="white" width="100%" mt="30px" padding="0 28px">
          <FormControl mb={4}>
            <FormLabel
              fontSize="0.75rem"
              lineHeight="17px"
              color="#5C5F64"
              mb={3}
            >
              Subject
            </FormLabel>

            <Menu>
              <MenuButton
                as={Button}
                variant="outline"
                rightIcon={<FiChevronDown />}
                fontSize={14}
                borderRadius="8px"
                fontWeight={400}
                width="100%"
                height="42px"
                color="text.400"
                textAlign="left"
                placeholder="e.g Biology"
              >
                {bountyOffer.subject !== 'Subject'
                  ? courseList.map((course) => {
                      if (course._id === bountyOffer.subject) {
                        return course.label;
                      }
                    })
                  : bountyOffer.subject}
              </MenuButton>
              <MenuList zIndex={3} width="24em">
                <Input
                  size="sm"
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder="Search Subject"
                  value={searchValue}
                />
                <div
                  style={{
                    maxHeight: '200px',
                    overflowY: 'auto'
                  }}
                >
                  {filteredOptions.map((course) => (
                    <MenuItem
                      fontSize="0.875rem"
                      key={course._id}
                      _hover={{ bgColor: '#F2F4F7' }}
                      onClick={() => {
                        setBountyOffer((prevState) => ({
                          ...prevState,
                          subject: course._id
                        }));
                      }}
                    >
                      {course.label}
                    </MenuItem>
                  ))}
                </div>
              </MenuList>
            </Menu>
          </FormControl>
          <FormControl mb={4}>
            <FormLabel
              fontSize="0.75rem"
              lineHeight="17px"
              color="#5C5F64"
              mb={3}
            >
              Topic
            </FormLabel>
            <Input
              type="text"
              name="topic"
              placeholder="e.g genetics"
              value={bountyOffer.topic}
              onChange={(e) =>
                setBountyOffer((prevState) => ({
                  ...prevState,
                  topic: e.target.value
                }))
              }
              _placeholder={{ fontSize: '0.875rem', color: '#9A9DA2' }}
            />
          </FormControl>

          <FormControl mb={4}>
            <FormLabel fontSize="12px" lineHeight="17px" color="#5C5F64" mb={3}>
              Level
            </FormLabel>
            <Menu>
              <MenuButton
                as={Button}
                variant="outline"
                rightIcon={<FiChevronDown />}
                fontSize={14}
                borderRadius="8px"
                fontWeight={400}
                color="text.400"
                width="100%"
                height="42px"
                textAlign="left"
              >
                {bountyOffer.level !== 'Level'
                  ? levelOptions.map((level) => {
                      if (level._id === bountyOffer.level) {
                        return level.label;
                      }
                    })
                  : bountyOffer.level}
              </MenuButton>
              <MenuList minWidth={'auto'}>
                {levelOptions.map((level) => (
                  <MenuItem
                    fontSize="0.875rem"
                    key={level._id}
                    _hover={{ bgColor: '#F2F4F7' }}
                    onClick={() => {
                      setBountyOffer((prevState) => ({
                        ...prevState,
                        level: level._id
                      }));
                    }}
                  >
                    {level.label}
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
          </FormControl>
          <FormControl mb={4}>
            <FormLabel fontSize="12px" lineHeight="17px" color="#5C5F64" mb={3}>
              Select Time
            </FormLabel>
            <RadioGroup
              name="time"
              value={bountyOffer.time}
              onChange={(value) => {
                setBountyOffer((prevState) => ({
                  ...prevState,
                  time: value
                }));
              }}
            >
              <Radio value="30min">
                <Text fontSize="14px">30 mins</Text>
              </Radio>
              <Radio ml={'10px'} value="60min">
                <Text fontSize="14px"> 1 hour</Text>
              </Radio>
            </RadioGroup>
          </FormControl>
          <FormControl mb={4}>
            <FormLabel fontSize="12px" lineHeight="17px" color="#5C5F64" mb={3}>
              Price
            </FormLabel>
            <Menu>
              <MenuButton
                as={Button}
                variant="outline"
                rightIcon={<FiChevronDown />}
                fontSize={14}
                borderRadius="8px"
                fontWeight={400}
                color="text.400"
                width="100%"
                height="42px"
                textAlign="left"
              >
                {bountyOffer.price === '' ? 'Price' : bountyOffer.price}
              </MenuButton>
              <MenuList minWidth={'auto'}>
                {priceOptions.map((price) => (
                  <MenuItem
                    key={price.id}
                    _hover={{ bgColor: '#F2F4F7' }}
                    onClick={() => {
                      setBountyOffer((prevState) => ({
                        ...prevState,
                        price: price.value
                      }));
                    }}
                  >
                    {price.label}
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
            {/* <Menu>
          <MenuButton
            as={Button}
            variant="outline"
            rightIcon={<FiChevronDown />}
            fontSize={14}
            borderRadius="40px"
            height="36px"
            fontWeight={400}
            color="text.400"
          >
            {rating === '' ? 'Rating' : rating.label}
          </MenuButton>
          <MenuList minWidth={'auto'}>
            {ratingOptions.map((rating) => (
              <MenuItem
                key={rating.id}
                _hover={{ bgColor: '#F2F4F7' }}
                onClick={() => setRating(rating)}
              >
                {rating.label}
              </MenuItem>
            ))}
          </MenuList>
        </Menu> */}
          </FormControl>
          <FormControl mb={4}>
            <FormLabel fontSize="12px" lineHeight="17px" color="#5C5F64" mb={3}>
              Select mode of instruction
            </FormLabel>
            <RadioGroup
              name="instructionMode"
              value={bountyOffer.instructionMode}
              onChange={(value) => {
                setBountyOffer((prevState) => ({
                  ...prevState,
                  instructionMode: value
                }));
              }}
            >
              <Radio value="chat">
                <Text fontSize="14px">Chat</Text>
              </Radio>
              <Radio ml={'10px'} value="video">
                <Text fontSize="14px"> Video</Text>
              </Radio>
            </RadioGroup>
          </FormControl>
        </Box>
      </CustomModal>
    </>
  );
}

export default BountyOfferModal;
