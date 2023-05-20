import * as React from "react";
import styled from "styled-components";
import { Box } from '@chakra-ui/react'
import theme from "../theme";

const Root = styled(Box)`
background: #FFF;
border: 1px solid #EBECF0;
border-radius: 12px;
`

type Props = React.ComponentProps<typeof Box>

const Panel: React.FC<Props> = (props) => {
    return <Root px={'32px'} py={'28px'} {...props} />
}

export default Panel;