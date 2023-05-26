import { useState } from 'react'
import {
  Input,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  Flex,
  Button,
  InputGroup,
  InputRightElement,
} from '@chakra-ui/react'
import { FiClock } from 'react-icons/fi'

interface TimePickerProps {
  value: string;
  onChange: (value: string) => void;
  inputProps?: React.ComponentProps<typeof Input>;
  inputGroupProps?: React.ComponentProps<typeof InputGroup>;
}

export const FORMAT = 'hh:mm A';

const TimePicker: React.FC<TimePickerProps> = ({ value, onChange, inputProps = {}, inputGroupProps = {} }) => {
  const [hours, setHours] = useState<string>('')
  const [minutes, setMinutes] = useState<string>('')
  const [isPm, setIsPm] = useState<boolean>(false)

  const handleHoursChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value)
    if (!isNaN(value) && value >= 0 && value <= 12) {
      setHours(value.toString().padStart(2, '0'));

      onChange(`${value.toString().padStart(2, '0')}:${(minutes || '00').padStart(2, '0')} ${isPm ? 'PM' : 'AM'}`)
    }
  }

  const handleMinutesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value)
    if (!isNaN(value) && value >= 0 && value <= 59) {
      setMinutes(value.toString().padStart(2, '0'))
      onChange(`${hours.padStart(2, '0')}:${value.toString().padStart(2, '0')} ${isPm ? 'PM' : 'AM'}`)
    }
  }

  const handleToggleAmPm = () => {
    setIsPm(!isPm)
    onChange(`${hours.padStart(2, '0')}:${(minutes || '00').padStart(2, '0')} ${!isPm ? 'PM' : 'AM'}`)
  }

  return (
    <Popover>
      <PopoverTrigger>
        <InputGroup {...inputGroupProps}>
          <InputRightElement children={
            <FiClock />
          } />
          <Input value={value} {...inputProps} readOnly />
        </InputGroup>
      </PopoverTrigger>
      <PopoverContent width={"auto"} p={2}>
        <PopoverArrow />
        <Flex alignItems="center" justifyContent="space-between">
          <Flex alignItems="center">
            <Input
              value={hours}
              onChange={handleHoursChange}
              type="number"
              min="0"
              max="12"
              placeholder="HH"
              mr={2}
            />
            <Input
              value={minutes}
              onChange={handleMinutesChange}
              type="number"
              min="0"
              max="59"
              placeholder="MM"
              mr={2}
            />
            <Button size="sm" onClick={handleToggleAmPm}>
              {isPm ? 'PM' : 'AM'}
            </Button>
          </Flex>
        </Flex>
      </PopoverContent>
    </Popover>
  )
}

export default TimePicker
