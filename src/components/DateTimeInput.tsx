import * as React from "react";
import styled from "styled-components";
import { Input, InputGroup } from "@chakra-ui/react";
import { useRef } from "react";

type Props = {
  type: "date" | "time";
} & React.ComponentPropsWithoutRef<typeof Input>;

const StyledDateInput = styled(Input)`
  position: relative;
`;

const DateTimeInput: React.FC<Props> = ({ type, ...rest }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <InputGroup>
      <StyledDateInput size={"lg"} ref={inputRef} type={type} {...rest} />
    </InputGroup>
  );
};

export default DateTimeInput;
