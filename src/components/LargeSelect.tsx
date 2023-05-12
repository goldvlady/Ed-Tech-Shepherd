import { Box, SimpleGrid, Text } from "@chakra-ui/react";
import * as React from "react";
import styled from "styled-components";
import theme from "../theme";

const Title = styled(Text)`
font-weight: 400;
font-size: 16px;
line-height: 21px;
letter-spacing: -0.003em;
color: #212224;
margin-bottom: 0;
text-align: left;
`

const Subtitle = styled(Text)`
font-weight: 400;
font-size: 14px;
line-height: 20px;
color: #6E7682;
text-align: left;
margin-top: 6px;
margin-bottom: 0;
`

const Root = styled(Box)`
justify-content: center;
`

const StyledOption = styled('button')`
display: flex;
flex-direction: column;
justify-content: center;
padding: 20px;
background: #FFF;
box-shadow: #e4e5e7 0px 0px 0px 1px;
border-radius: 6px;
height: 230px;
width: 100%;
box-sizing: border-box;

svg {
    fill: #6E7682;
}

&:hover {
    box-shadow: ${theme.colors.primary[600]} 0px 0px 0px 1px;
    background: ${theme.colors.gray[50]};
}

&.active {
    box-shadow: ${theme.colors.primary[400]} 0px 0px 0px 1.8px, 0px 6px 18px rgba(136, 139, 143, 0.18);

    svg {
        fill: #212224;
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
                {!!o.icon && <Box marginBottom={'25.67px'} display="flex" alignItems="center" justifyContent="center">
                    {o.icon}
                </Box>}
                <Title>{o.title}</Title>
                <Box height={54} display="flex" alignItems={"flex-start"} flexShrink={0}>
                    <Subtitle>{o.subtitle}</Subtitle>
                </Box>
            </StyledOption>)
        }
        </SimpleGrid>
    </Root>
}

export default LargeSelect;