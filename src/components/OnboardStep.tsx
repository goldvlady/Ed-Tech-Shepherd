import { Box } from "@chakra-ui/react";
import * as React from "react";

import OnboardNav from "./OnboardNav";

type Props = {
  children: React.ReactNode;
  hideNav?: boolean;
  hasNext: boolean;
} & React.ComponentPropsWithoutRef<typeof OnboardNav>;

const OnboardStep: React.FC<Props> = ({
  children,
  nextStep,
  hideNav = false,
  hasNext,
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
        {!hideNav && (
          <OnboardNav hasNext={hasNext} nextStep={nextStep} {...rest} />
        )}
      </form>
    </Box>
  );
};

export default OnboardStep;
