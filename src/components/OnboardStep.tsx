import { Box } from '@chakra-ui/react';
import * as React from 'react';

import OnboardNav from './OnboardNav';

type Props = {
    children: React.ReactNode;
    hideNav?: boolean;
} & React.ComponentPropsWithoutRef<typeof OnboardNav>;

const OnboardStep: React.FC<Props> = ({
    children,
    nextStep,
    hideNav = false,
    ...rest
}) => {
    return (
        <Box pt="40px">
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    nextStep?.();
                }}
            >
                {children}
                {!hideNav && <OnboardNav {...rest} />}
            </form>
        </Box>
    );
};

export default OnboardStep;
