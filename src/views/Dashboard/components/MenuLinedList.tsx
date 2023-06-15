import { Box, Flex, FlexProps, Icon, Link, Text, VStack } from '@chakra-ui/react';
import React from 'react';
import { IconType } from 'react-icons';
import { BsChatLeftDots, BsPin, BsPlayCircle } from 'react-icons/bs';
import styled from 'styled-components';

const Title = styled(Text).attrs(() => ({ className: 'sub3' }))`
  margin-bottom: 1px;
  position: relative;
  line-height: 0.1;
  &:before {
    content: '';
    height: 5px;
    width: 5px;
    display: block;

    border-radius: 100%;
    position: absolute;
    left: -38px;
    background: #cdd1d5;
    top: 50%;
    transform: translateY(-50%);
    z-index: 4;
  }
`;

const Subtitle = styled(Text).attrs(() => ({ className: 'body3' }))`
  margin-bottom: 0;
  color: #585f68;
`;

const Item = styled(Box)``;

const Root = styled(VStack)`
  position: relative;
  margin-left: 25px;

  &:before {
    content: '';
    position: absolute;
    left: -19px;
    top: 15px;
    bottom: 15px;
    width: 1px;
    background: #e8e9ed;
    z-index: 0;
  }
  padding-left: 17px;

  ${Item}:last-of-type ${Title} {
    position: relative;
    z-index: 3;
    &:before {
      content: '';
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
`;
interface NavItemProps extends FlexProps {
  icon?: IconType;
  children: any;
  path: string;
}
const NavItem = ({ icon, path, children, ...rest }: NavItemProps) => {
  return (
    <Link href={path} style={{ textDecoration: 'none' }} _focus={{ boxShadow: 'none' }}>
      <Flex
        align="center"
        py="4"
        px="2px"
        // my="2"
        mx={-4}
        borderRadius="lg"
        role="group"
        cursor="pointer"
        _hover={{
          color: '#207DF7',
        }}
        _activeLink={{
          color: '#207DF7',
        }}
        fontSize={14}
        color="text.400"
        fontWeight={500}
        {...rest}>
        {icon && (
          <Icon
            mr="4"
            fontSize="16"
            _groupHover={{
              color: '#207DF7',
            }}
            as={icon}
          />
        )}
        {children}
      </Flex>
    </Link>
  );
};

type Props = React.ComponentProps<typeof Root> & {
  items: Array<{ title: string; path: string }>;
};

const MenuLinedList: React.FC<Props> = ({ items, ...rest }) => {
  return (
    <Root spacing="0px" {...rest} alignItems="flex-start">
      {items.map((i) => (
        <>
          <Title>
            <NavItem path={i.path}>{i.title}</NavItem>
          </Title>
        </>
      ))}
    </Root>
  );
};

export default MenuLinedList;
