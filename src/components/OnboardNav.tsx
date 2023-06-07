import { Box, Button } from '@chakra-ui/react';
import * as React from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import { StepWizardChildProps } from 'react-step-wizard';

type Props = {
    canGoNext: boolean;
} & Partial<StepWizardChildProps>;

const OnboardNav: React.FC<Props> = ({
    previousStep,
    nextStep,
    currentStep,
    canGoNext,
}) => {
    return (
        <Box
            display={'flex'}
            flexDirection="column"
            gap={4}
            marginTop={45}
            justifyContent="flex-end"
        >
            <Button
                variant="solid"
                colorScheme={'primary'}
                type="submit"
                isDisabled={!canGoNext}
                size={'lg'}
            >
                Next
            </Button>
            {currentStep !== undefined && currentStep > 1 && (
                <Button onClick={previousStep} variant="link">
                    Previous
                </Button>
            )}
        </Box>
    );
};

export default OnboardNav;
