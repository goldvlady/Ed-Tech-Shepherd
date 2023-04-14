import { Box, Button } from "@chakra-ui/react";
import * as React from "react";
import { FiArrowLeft } from "react-icons/fi";
import { StepWizardChildProps } from "react-step-wizard";

type Props = {
    canGoNext: boolean
} & Partial<StepWizardChildProps>;

const OnboardNav: React.FC<Props> = ({previousStep, nextStep, currentStep, canGoNext}) => {

    return <Box display={"flex"} gap={4} marginTop={45} justifyContent="flex-end">
        {currentStep !== undefined && currentStep > 1 && <Button variant={"looneyGhost"} onClick={previousStep} leftIcon={<FiArrowLeft />} size={"lg"}>
            Back
        </Button>}
        <Button type="submit" isDisabled={!canGoNext} variant={"looney"} size={"lg"}>Next</Button>
    </Box>
}

export default OnboardNav;