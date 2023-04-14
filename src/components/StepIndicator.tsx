import { Box, Text, Tooltip } from "@chakra-ui/react";
import * as React from "react";
import styled from "styled-components";
import theme from "../theme";
import Panel from "./Panel";

const StepIcon = styled(Box)`
height: 40px;
width: 40px;
background: transparent;
border-radius: 100%;
color: #8789a7;
font-size: 18px;
display: flex;
justify-content: center;
align-items: center;
flex-shrink: 0;

&:hover {
    background: ${theme.colors.gray[100]};
}
`

const StyledStep = styled(Box)`
display: flex;
align-items: center;
gap: 10px;
position: relative;
padding-inline: ${props => props.$active ? "12px" : "6px"};

${props => props.$active ? `${StepIcon} {
    background: ${theme.colors.primary[400]};
    color: #FFF;
}` : ""}
`

const StepCount = styled(Box)`
position: absolute;
top: -12px;
left: 50%;
transform: translateX(-50%);
padding: 1px 11px;
background: #FFF;
border: 1px solid #edf2f6;
border-radius: 14px;
color: #fff;
`

const Root = styled(Panel)`
display: flex;
justify-content: center;
position: relative;

${StyledStep}:not(:last-child):after {
    content: "";content: "";
    position: absolute;
    right: 0;
    height: 24px;
    width: 1px;
    background: ${theme.colors.gray[100]};
    top: 50%;
    transform: translateY(-50%);}
`

export type Step = {
    title: string;
    icon: React.ReactNode
}

type Props = {
    steps: Step[]
    activeStep: number
}

const StepIndicator: React.FC<Props> = ({ steps, activeStep }) => {
    return <Root p={3}>
        <StepCount><Text fontSize='xs' fontWeight={600} color='primary.400'>Step {activeStep === -1 ? steps.length : activeStep+1}/{steps.length}</Text></StepCount>
        {
            steps.map((s, i) => {
                const active = activeStep === i;
                return <StyledStep key={s.title} $active={active}>
                    <Tooltip isDisabled={active} label={s.title}><StepIcon>{s.icon}</StepIcon></Tooltip>
                    {active && <Box>
                        <Text fontSize='md' fontWeight={600} color='primary.700'>{s.title}</Text>
                    </Box>}
                </StyledStep>
            })
        }
    </Root>
}

export default StepIndicator;