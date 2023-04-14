import * as React from "react";
import styled from "styled-components";
import { Box } from '@chakra-ui/react'
import theme from "../theme";

const Root = styled(Box)`
--looney-lip: -4px;
position: relative;
border-radius: ${theme.radii.md};
transition: all .1s ease-out;
box-shadow: 0 0.125em 0.313em rgba(50, 50, 93, 0.09), 0 0.063em 0.125em rgba(0, 0, 0, 0.07);

&:before {
    content: "";
    left: 0px;
    position: absolute;
    right: 0px;
    top: 0px;
    bottom: 0px;
    z-index: -2;
    border-radius: 12px;
    background: white;
    transition: all .1s ease-out;
    box-shadow: inset 0px var(--looney-lip) 0px 0px ${theme.colors.gray[200]};
}

`

type Props = React.ComponentProps<typeof Box>

const Panel: React.FC<Props> = (props) => {
    return <Root {...props} />
}

export default Panel;