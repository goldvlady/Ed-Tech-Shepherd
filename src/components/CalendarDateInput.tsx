import { useEffect, useRef, useState } from 'react';
import InputMask from 'react-input-mask';
import moment from 'moment';
import 'react-day-picker/dist/style.css';
import { DayPicker } from 'react-day-picker';

import { Input, InputGroup, InputProps, Text, InputRightElement, Popover, PopoverTrigger, PopoverContent, PopoverBody, Button, PopoverArrow, PopoverCloseButton, PopoverHeader, InputRightAddon } from '@chakra-ui/react';
import styled from 'styled-components';
import { RiCalendarEventFill } from 'react-icons/ri';
import theme from '../theme';

interface DateInputProps {
    value: Date;
    inputProps?: InputProps
    onChange: (value: Date) => void;
}

export const FORMAT = 'MM/DD/YYYY';

const StyledDatePicker = styled(DayPicker)`
margin: 0;
.rdp-head_cell {
    color: #969CA6;
    font-style: normal;
    font-weight: 400;
    font-size: 12px;
    line-height: 17px;
}
.rdp-nav_icon {
    color: #969CA6;
    width: 12px;
    height: 12px;
}
.rdp-caption_label {
    font-weight: 500;
    font-size: 16px;
    line-height: 21px;
    letter-spacing: 0.007em;
}
.rdp-month {
    width: 100%;
}
.rdp-table {
    width: 100%;
    max-width: 100%;
}
.rdp-day_selected {
    background: ${theme.colors.primary[400]};
}
`

const CalendarDateInput: React.FC<DateInputProps> = ({ value, onChange, inputProps = {}, ...rest }) => {
    const [popoverOpen, setPopoverOpen] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    return (
        <Popover isOpen={popoverOpen} onClose={() => setPopoverOpen(false)}>
            <PopoverTrigger>
                <InputGroup>
                    <Input
                        {...inputProps}
                        readOnly
                        ref={inputRef}
                        onClick={(e) => {
                            setPopoverOpen(true);
                            if (inputProps.onClick) {
                                inputProps.onClick(e)
                            }
                        }}
                        value={value ? moment(value).format(FORMAT) : ''}
                        isInvalid={!moment(value, FORMAT, true).isValid() && !!value}
                        {...rest}
                    />
                    <InputRightAddon children={<RiCalendarEventFill color='#969CA6' />} />
                </InputGroup>
            </PopoverTrigger>
            <PopoverContent>
                <PopoverBody>
                    <StyledDatePicker
                        mode="single"
                        selected={value}
                        onSelect={(d) => {
                            onChange(d as Date);
                            setPopoverOpen(false);
                        }}
                    />
                </PopoverBody>
            </PopoverContent>
        </Popover>
    );
};

export default CalendarDateInput;
