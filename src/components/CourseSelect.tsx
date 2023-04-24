import { Box, SimpleGrid } from "@chakra-ui/react";
import { includes, xor } from "lodash";
import * as React from "react";
import styled from "styled-components";
import theme from "../theme";
import { Course } from "../types";

const Root = styled(Box)`
display: flex;
gap: 15px;
justify-content: center;
`

const StyledOption = styled('button')`
display: flex;
flex-direction: column;
background: #FFF;
border: 1px solid ${theme.colors.gray[300]};
border-radius: 14px;
overflow: hidden;
transition: all .2s ease-out;

&:hover {
    border-color: ${theme.colors.primary[600]};
    background: ${theme.colors.gray[50]};
}

&.active {
    border: 1px solid ${theme.colors.primary[500]};
    background: ${theme.colors.primary[500]};

    color: #FFF;

    svg {
        color: ${theme.colors.primary[500]};
    }
}
`

const Image = styled.img`
height: 115px;
width: 100%;
object-fit: cover;

`

const Meta = styled.div`
width: 100%;
border-top: 1px solid ${theme.colors.gray[300]};
padding: 0.7rem;

h6 {
    margin: 0;
    font-weight: bolder!important;
}
`

type Option = Course & {
    value: any;
}

type Props = {
    options: Option[];
    value: Option["value"][] | Option["value"];
    onChange: (value: Props["value"]) => void;
    multi?: boolean
}

export const CourseSelect: React.FC<Props> = ({ value, options, multi = false, onChange }: Props) => {

    const toggleArrayValue = (v: Option["value"]) => {
        multi ? onChange(xor(value, [v])) : onChange(v);
    }

    return <Root>
        <SimpleGrid width={'100%'} columns={{ base: 1, sm: 2 }} spacing='15px'>
            {
                options.map(o => <StyledOption onClick={() => toggleArrayValue(o.value)} key={o.value} type="button" role="button" className={(multi ? includes(value, o.value) : value === o.value) ? "active" : ""}>
                    <Image alt={o.title} src={o.image} />
                    <Meta>
                        <h6>{o.title}</h6>
                    </Meta>
                </StyledOption>)
            }
        </SimpleGrid>
    </Root>
}

export default CourseSelect;