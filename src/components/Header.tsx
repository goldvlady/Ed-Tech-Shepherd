import * as React from "react";
import styled from "styled-components";
import { Box } from '@chakra-ui/react'
import Logo from "./Logo";
import theme from "../theme";

const Root = styled(Box)`
height: 56px;
width: 100%;
border-bottom: 1px solid ${theme.colors.gray[200]};
padding-inline: 16px;
display: flex;
align-items: center;
justify-content: space-between;
`

const Header: React.FC = () => {
    return <Root as="header">
        <a href="https://shepherdtutors.com">
            <Logo />
        </a>
    </Root>
}

export default Header;