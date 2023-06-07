import { Box } from '@chakra-ui/react';
import * as React from 'react';
import { useEffect } from 'react';

import OnboardNav from './OnboardNav';

type Props = {
    children: React.ReactNode;
    submitFunction: () => Promise<Response>;
} & Omit<React.ComponentPropsWithoutRef<typeof OnboardNav>, 'canGoNext'>;

const OnboardSubmitStep: React.FC<Props> = ({
    children,
    isActive,
    submitFunction,
    nextStep,
    previousStep,
    currentStep,
}) => {
    useEffect(() => {
        if (isActive) {
            submit();
        }
    }, [isActive]);

    const submit = async () => {
        try {
            await submitFunction();
            nextStep?.();
        } catch (e) {
            previousStep?.();
        }
    };

    return <Box>{children}</Box>;
};

export default OnboardSubmitStep;
