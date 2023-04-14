import * as React from "react";
import OnboardNav from "./OnboardNav";
import Panel from "./Panel";

type Props = {
    children: React.ReactNode;
    hideNav?: boolean;
} & React.ComponentPropsWithoutRef<typeof OnboardNav>;

const OnboardStep: React.FC<Props> = ({ children, nextStep, hideNav = false, ...rest }) => {
    return <Panel p={4} pt="30px">
        <form onSubmit={(e) => {
            e.preventDefault();
            nextStep?.();
        }}>
            {children}
            {!hideNav && <OnboardNav {...rest} />}
        </form>
    </Panel>
}

export default OnboardStep;