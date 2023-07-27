import CustomSelect from '../../../../components/CustomSelect';
import DatePicker from '../../../../components/DatePicker';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton
} from '@chakra-ui/react';
import { format } from 'date-fns';
import React, { useState, ChangeEvent, useMemo } from 'react';

export interface ScheduleFormState {
  day: Date | null;
  time: string;
  frequency: string;
}

interface ScheduleStudyModalProps {
  isOpen: boolean;
  onClose: () => void;
  isLoading: boolean;
  onSumbit: (d: ScheduleFormState) => void;
}

export const ScheduleStudyModal: React.FC<ScheduleStudyModalProps> = ({
  isOpen,
  onClose,
  isLoading,
  onSumbit
}) => {
  const [formState, setScheduleFormState] = useState<ScheduleFormState>({
    day: null,
    time: '',
    frequency: ''
  });

  const isValid = useMemo(() => {
    return [formState.day, formState.time].every(Boolean);
  }, [formState]);

  const timeOptions = Array.from({ length: 96 }, (_, index) => {
    const hour = Math.floor(index / 4);
    const minute = 15 * (index % 4);
    const displayHour = hour === 0 || hour === 12 ? 12 : hour % 12;
    const displayMinute = minute === 0 ? '00' : String(minute);
    const period = hour < 12 ? ' AM' : ' PM';

    return `${displayHour}:${displayMinute}${period}`;
  });

  const handleInputChange =
    (name: keyof ScheduleFormState) => (value: string | Date | null) => {
      setScheduleFormState((prevState) => ({ ...prevState, [name]: value }));
    };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Schedule Study</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box width="100%">
            <FormControl id="day" marginBottom="20px">
              <FormLabel>Day</FormLabel>
              <DatePicker
                placeholder="Select Day"
                value={formState.day ? format(formState.day, 'yyyy-MM-dd') : ''}
                onChange={handleInputChange('day')}
              />
            </FormControl>

            <FormControl id="time" marginBottom="20px">
              <FormLabel>Time</FormLabel>
              <CustomSelect
                placeholder="Select Time"
                value={formState.time}
                onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                  handleInputChange('time')(e.target.value)
                }
              >
                {timeOptions.map((option) => (
                  <option
                    style={{ padding: '10px' }}
                    key={option}
                    value={option}
                  >
                    {option}
                  </option>
                ))}
              </CustomSelect>
            </FormControl>

            <FormControl id="frequency" marginBottom="20px">
              <FormLabel>Frequency</FormLabel>
              <CustomSelect
                placeholder="Select Frequency"
                value={formState.frequency}
                onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                  handleInputChange('frequency')(e.target.value)
                }
              >
                <option style={{ padding: '10px' }} value="daily">
                  Daily
                </option>
                <option style={{ padding: '10px' }} value="weekly">
                  Weekly
                </option>
                <option style={{ padding: '10px' }} value="monthly">
                  Monthly
                </option>
                <option style={{ padding: '10px' }} value="none">
                  Doesn't Repeat
                </option>
              </CustomSelect>
            </FormControl>
          </Box>
        </ModalBody>

        <ModalFooter
          bg="#F7F7F8"
          borderRadius="0px 0px 10px 10px"
          p="16px"
          justifyContent="flex-end"
        >
          <Button
            isDisabled={!isValid}
            _hover={{
              backgroundColor: '#207DF7',
              boxShadow: '0px 2px 6px 0px rgba(136, 139, 143, 0.10)'
            }}
            bg="#207DF7"
            color="#FFF"
            fontSize="14px"
            fontFamily="Inter"
            fontWeight="500"
            lineHeight="20px"
            onClick={() => onSumbit(formState)}
            isLoading={isLoading}
            borderRadius="8px"
            boxShadow="0px 2px 6px 0px rgba(136, 139, 143, 0.10)"
            mr={3}
            variant="primary"
          >
            Submit
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ScheduleStudyModal;
