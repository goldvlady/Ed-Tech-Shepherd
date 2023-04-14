import { useEffect, useRef } from 'react';
import InputMask from 'react-input-mask';
import moment from 'moment';
import { Input, InputProps } from '@chakra-ui/react';

// @ts-ignore
interface DateInputProps extends InputProps {
  value: string;
  onChange: (value: string) => void;
}

export const FORMAT = 'MM/DD/YYYY'

const DateInput: React.FC<DateInputProps> = ({ value, onChange, ...rest }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const date = moment(value, FORMAT, true);
    if (date.isValid()) {
      onChange(date.format(FORMAT));
    }
  }, [value, onChange]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target?.value.replace(/_/g, '');
    if (inputRef.current) {
      const previousCursorPosition = inputRef.current.selectionStart;
      onChange(newValue);
      if (previousCursorPosition !== null) {
        const cursorPosition = Math.min(previousCursorPosition + newValue.length - value.length, 10);
        inputRef.current.setSelectionRange(cursorPosition, cursorPosition);
      }
    }
  };

  return (
    <InputMask
      maskChar=''
      mask="**/**/****"
      value={value}
      onChange={handleInputChange}
    >
      {// @ts-ignore
      (inputProps: InputProps) => (
        <Input
          {...inputProps}
          ref={inputRef}
          placeholder={FORMAT}
          isInvalid={!moment(value, FORMAT, true).isValid() && !!value}
          {...rest}
        />
      )}
    </InputMask>
  );
};

export default DateInput;
