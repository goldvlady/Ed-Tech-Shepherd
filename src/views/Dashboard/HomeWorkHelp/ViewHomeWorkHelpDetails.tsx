import CustomButton from '../../../components/CustomComponents/CustomButton/index';
import CustomModal from '../../../components/CustomComponents/CustomModal';
import SelectComponent, { Option } from '../../../components/Select';
import resourceStore from '../../../state/resourceStore';
import {
  Box,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Select,
  VStack,
  extendTheme,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button
} from '@chakra-ui/react';
import React, { ChangeEvent, useCallback, useState, useMemo } from 'react';
import { FiChevronDown } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

interface FlashcardData {
  level?: string;
  topic: string;
  subject?: string;
}
const ViewHomeWorkHelpDetails = ({
  openAceHomework,
  handleClose,
  handleAceHomeWorkHelp
}: {
  openAceHomework: boolean;
  handleClose: () => void;
  handleAceHomeWorkHelp: () => void;
}) => {
  const { courses: courseList, levels: levelOptions } = resourceStore();
  const [subjectId, setSubject] = useState<string>('Subject');
  const [searchValue, setSearchValue] = useState('');
  const [localData, setLocalData] = useState<FlashcardData>({
    subject: subjectId,
    topic: ''
  });
  const [level, setLevel] = useState<any>('');

  const searchQuery = (searchValue, courseList) => {
    setSearchValue(searchValue);
    return courseList?.filter((item) =>
      item.label
        ?.toLocaleLowerCase?.()
        ?.includes(searchValue?.toLocaleLowerCase())
    );
  };

  const filteredOptions = useMemo(
    () => searchQuery(searchValue, courseList),
    [courseList, searchValue]
  );

  const navigate = useNavigate();

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setLocalData((prevState: any) => ({
        ...prevState,
        [name]: value
      }));
    },
    [setLocalData]
  );

  const isDisabledBtn = useMemo(() => {
    return !Object.values(localData).some((value) => value === '');
  }, [localData]);

  const onRouteHomeWorkHelp = useCallback(() => {
    handleClose();
    handleAceHomeWorkHelp();
    navigate('/dashboard/ace-homework', {
      state: { subject: subjectId, topic: localData.topic, level }
    });
  }, [subjectId, localData, level]);

  return (
    <CustomModal
      isOpen={openAceHomework}
      modalTitle="Provide more details"
      isModalCloseButton
      style={{
        maxWidth: '400px',
        height: 'auto'
      }}
      footerContent={
        <div style={{ display: 'flex', gap: '8px' }}>
          <CustomButton
            type="button"
            isCancel
            onClick={handleAceHomeWorkHelp}
            title="Cancel"
          />
          <CustomButton
            type="button"
            onClick={onRouteHomeWorkHelp}
            active={isDisabledBtn}
            title="Confirm"
            disabled={!isDisabledBtn}
          />
        </div>
      }
      onClose={handleAceHomeWorkHelp}
    >
      <Box bg="white" width="100%" mt="30px" padding="0 28px">
        <FormControl mb={6}>
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
            >
              {subjectId !== 'Subject'
                ? courseList.map((course) => {
                    if (course._id === subjectId) {
                      return course.label;
                    }
                  })
                : 'e.g Biology'}
            </MenuButton>
            <MenuList zIndex={3} width="100%">
              <input
                style={{
                  height: '38px',
                  borderRadius: '8px',
                  fontSize: '0.75rem',
                  width: '100%',
                  margin: '10px 0'
                }}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search Subject"
                onClick={function (e) {
                  e.stopPropagation();
                }}
                onKeyDown={(e) => {
                  e.code === 'Space' && e.stopPropagation();
                }}
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
                    onClick={() => setSubject(course._id)}
                  >
                    {course.label}
                  </MenuItem>
                ))}
              </div>
            </MenuList>
          </Menu>
        </FormControl>
        <FormControl mb={6}>
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
            value={localData.topic}
            onChange={handleChange}
            _placeholder={{ fontSize: '0.875rem', color: '#9A9DA2' }}
          />
        </FormControl>
        {/* <FormControl mb={6}>
          <FormLabel
            fontSize="0.75rem"
            lineHeight="17px"
            color="#5C5F64"
            mb={3}
          >
            Level
          </FormLabel>
          <Input
            type="text"
            name="deckName"
            placeholder="Level"
            value={localData.deckName}
            onChange={handleChange}
            _placeholder={{ fontSize: '0.8756rem', color: '#9A9DA2' }}
          />
        </FormControl> */}
        <FormControl mb={8}>
          <FormLabel fontSize="12px" lineHeight="17px" color="#5C5F64" mb={3}>
            Level (optional)
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
              {level === '' ? 'Level' : level.label}
            </MenuButton>
            <MenuList minWidth={'auto'}>
              {levelOptions.map((level) => (
                <MenuItem
                  key={level._id}
                  _hover={{ bgColor: '#F2F4F7' }}
                  onClick={() => setLevel(level)}
                >
                  {level.label}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
        </FormControl>
      </Box>
    </CustomModal>
  );
};

export default ViewHomeWorkHelpDetails;
