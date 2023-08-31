import CustomButton from '../../../components/CustomComponents/CustomButton/index';
import CustomModal from '../../../components/CustomComponents/CustomModal';
import SelectComponent, { Option } from '../../../components/Select';
import { uid } from '../../../helpers';
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
import React, {
  ChangeEvent,
  useCallback,
  useState,
  useMemo,
  useEffect
} from 'react';
import { FiChevronDown } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import CreatableSelect from 'react-select/creatable';

interface FlashcardData {
  level?: string;
  topic: string;
  subject?: string;
}
const ViewHomeWorkHelpDetails = ({
  openAceHomework,
  handleAceHomeWorkHelp,
  setSubject,
  subjectId,
  setLocalData,
  setLevel,
  localData,
  level,
  onRouteHomeWorkHelp
}: {
  openAceHomework: boolean;
  handleClose: () => void;
  handleAceHomeWorkHelp: () => void;
  isHomeWorkHelp?: boolean;
  setMessages?: any;
  setSubject?: any;
  subjectId?: any;
  setLocalData?: any;
  setLevel?: any;
  localData?: any;
  level?: any;
  onRouteHomeWorkHelp?: any;
}) => {
  const { courses: courseListRaw, levels: levelOptions } = resourceStore();
  const [searchValue, setSearchValue] = useState('');
  const [isShowInput, setShowInput] = useState('');
  const courseList = [...courseListRaw];
  const searchQuery = useCallback((searchValue: string, courseList: any[]) => {
    return courseList.filter((course) =>
      course.label.toLowerCase().includes(searchValue.toLowerCase())
    );
  }, []);

  const filteredOptions = searchQuery(searchValue, courseList);

  const [selectedOption, setSelectedOption] = useState(null);

  const handleOnChange = (newValue) => {
    setSelectedOption(newValue);

    setLocalData((prevState: any) => ({
      ...prevState,
      subject: newValue?.label,
      subjectId: newValue?._id
    }));
  };

  const handleOnCreateOption = (inputValue) => {
    // Create a new option
    const newOption = {
      value: inputValue,
      label: inputValue
    };

    // Set the new option as the selected value
    setSelectedOption(newOption as any);

    setLocalData((prevState: any) => ({
      ...prevState,
      subject: newOption.value
    }));
  };

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
          <CreatableSelect
            isClearable
            onChange={handleOnChange}
            onCreateOption={handleOnCreateOption}
            options={courseList}
            value={selectedOption}
            placeholder="Search or select an option..."
          />
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
