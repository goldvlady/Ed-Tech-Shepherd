import {
  Box,
  Step,
  StepDescription,
  StepIcon,
  StepIndicator,
  StepNumber,
  StepSeparator,
  StepStatus,
  StepTitle,
  Stepper,
  Text,
  useSteps
} from '@chakra-ui/react';
import React from 'react';

const steps = [
  {
    title: 'Send a Proposal',
    description:
      'Find your desired tutor and prepare an offer on your terms and send to the tutor'
  },
  {
    title: 'Get a Response',
    description:
      'Proceed to provide your payment details once the tutor accepts your offer'
  },
  {
    title: 'A Test-Run',
    description:
      'You won’t be charged until after your first session, you may cancel after the first lesson.'
  }
];
function HowItWorks() {
  const { activeStep } = useSteps({
    index: 0,
    count: steps.length
  });
  return (
    <Stepper
      index={activeStep}
      orientation="vertical"
      height="235px"
      gap="0"
      size={'xs'}
    >
      {steps.map((step, index) => (
        <Step key={index}>
          <StepIndicator>
            {/* <StepStatus
                            complete={<StepIcon />}
                            incomplete={<StepNumber />}
                            active={<StepNumber />}
                        /> */}
          </StepIndicator>

          <Box>
            <Text fontSize={14} fontWeight={500} mb={1}>
              {step.title}
            </Text>
            <Text fontSize={12} fontWeight={400} lineHeight={4} color="#585F68">
              {step.description}
            </Text>
          </Box>

          <StepSeparator />
        </Step>
      ))}
    </Stepper>
  );
}

export default HowItWorks;
