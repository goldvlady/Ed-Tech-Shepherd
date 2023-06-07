import { Box, Text } from "@chakra-ui/react";
import * as React from "react";
import styled from "styled-components";
import theme from "../theme";

const Inner = styled.div`
  display: flex;
  gap: 6px;
  background: #fff;
  z-index: 5;
  padding-inline: 4px;
`;

const StyledStep = styled(Box)`
  display: flex;
  align-items: center;
  gap: 10px;
  position: relative;
  flex: 1;

  &:after {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    background: #dcdedf;
    height: 2px;
  }
`;

const Radio = styled.div`
  width: 24px;
  height: 24px;
  left: 0px;
  top: 0px;
  position: relative;
  background: #eff0f0;
  border: 1.5px solid #e2e3e4;
  border-radius: 100%;

  &:after {
    content: "";
    position: absolute;
    width: 8px;
    height: 8px;
    left: 8px;
    top: 8px;
    background: #cdd1d5;
    border-radius: 100%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
`;

const Root = styled(Box)`
  display: flex;

  ${StyledStep}:last-child {
    content: "";
    flex: 0;
  }

  ${StyledStep}.primary {
    &:after {
      background: ${theme.colors.primary[400]};
    }
    ${Radio} {
      background: ${theme.colors.primary[100]};
      border: 1.5px solid ${theme.colors.primary[200]};

      &:after {
        background: ${theme.colors.primary[400]};
      }
    }
  }
`;

export type Step = {
  title: string;
  icon: React.ReactNode;
};

type Props = {
  steps: Step[];
  activeStep: number;
};

const StepIndicator: React.FC<Props> = ({ steps, activeStep }) => {
  return (
    <Root p={3}>
      {steps.map((s, i) => {
        const active = activeStep === i;
        return (
          <StyledStep
            key={s.title}
            className={i <= activeStep ? "primary" : ""}
          >
            <Inner>
              <Radio />
              {active && (
                <Box>
                  <Text m={0} fontSize="14px" fontWeight={500} color="#585F68">
                    {s.title}
                  </Text>
                </Box>
              )}
            </Inner>
          </StyledStep>
        );
      })}
    </Root>
  );
};

export default StepIndicator;
