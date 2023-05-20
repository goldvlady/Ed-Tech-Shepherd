import { VStack, Box, Text } from "@chakra-ui/react";
import styled from "styled-components";

const Title = styled(Text).attrs(() => ({ className: 'sub3' }))`
margin-bottom: 11px;
position: relative;
line-height: 0.1;
&:before {
    content: "";
    height: 10px;
    width: 10px;
    display: block;
    border: 1px solid #207DF7;
    border-radius: 100%;
    position: absolute;
    left: -21.5px;
    background: #FFF;
    top: 50%;
    transform: translateY(-50%);
    z-index: 4;
}
`

const Subtitle = styled(Text).attrs(() => ({ className: 'body3' }))`
margin-bottom: 0;
color: #585F68;
`

const Item = styled(Box)``

const Root = styled(VStack)`
position: relative;
margin-left: 8px;

&:before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 1px;
    background: #E8E9ED;
    z-index: 0;
}
padding-left: 17px;

${Item}:last-of-type ${Subtitle} {
    position: relative;
    z-index: 3;
    &:before {
        content: "";
        position: absolute;
        display: block;
        background: white;
        z-index: -13;
        left: -17px;
        top: -8px;
        bottom: 0;
        width: 1px;
    }
}
`

type Props = React.ComponentProps<typeof Root> & {
    items: Array<{ title: string, subtitle: string }>
};

const LinedList: React.FC<Props> = ({ items, ...rest }) => {
    return <Root spacing='24px' {...rest} alignItems='flex-start'>
        {
            items.map(i => <Item key={i.title}>
                <Title>{i.title}</Title>
                <Subtitle>{i.subtitle}</Subtitle>
            </Item>)
        }
    </Root>
}

export default LinedList;