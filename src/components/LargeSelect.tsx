import { Box, SimpleGrid, Text } from "@chakra-ui/react";
import * as React from "react";
import styled from "styled-components";
import theme from "../theme";

const Root = styled(Box)`
justify-content: center;
`

const StyledOption = styled('button')`
display: flex;
flex-direction: column;
justify-content: center;
padding: 20px;
align-items: center;
background: #FFF;
box-shadow: 0px 0px 1px 0px ${theme.colors.gray[700]};
border-radius: ${theme.radii.md};
height: 230px;
width: 100%;
box-sizing: border-box;


&:hover {
    box-shadow: 0px 0px 1px 0px ${theme.colors.primary[600]};
    background: ${theme.colors.gray[50]};
}

&.active {
    box-shadow: ${theme.colors.primary[500]} 0px 0px 0px 2px;
    background: ${theme.colors.primary[25]};

    svg {
        color: ${theme.colors.primary[500]};
    }
}
`

type Option = {
    title: String;
    subtitle: String;
    icon?: React.ReactNode;
    value: any;
}

type Props = {
    options: Option[];
    value: Option["value"];
    onChange: (value: Props["value"]) => void;
}

export const LargeSelect: React.FC<Props> = ({ value, options, onChange }: Props) => {
    return <Root>
        <SimpleGrid columns={{ sm: 2 }} spacing='15px'>
        {
            options.map(o => <StyledOption onClick={() => onChange(o.value)} key={o.value} type="button" role="button" className={value === o.value ? "active" : ""}>
                {!!o.icon && <Box width={40} height={40} fontSize={23} display="flex" alignItems="center" justifyContent="center">
                    {o.icon}
                </Box>}
                <Text as='b' display="block" marginBottom={15}>{o.title}</Text>
                <Box height={54} display="flex" alignItems={"flex-start"} flexShrink={0}>
                    <Text margin={"0 !important"} fontSize="xs" display="block" marginTop={5}>{o.subtitle}</Text>
                </Box>
            </StyledOption>)
        }
        </SimpleGrid>
    </Root>
}

export default LargeSelect;