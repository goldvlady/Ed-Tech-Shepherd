import { StyledMenuButton, StyledMenuList } from './styles';
import { Menu } from '@chakra-ui/react';
import React, { ReactElement } from 'react';

interface IDropdownProps {
  menuTitle: string;
  DropdownMenuIcon: ReactElement;
  children?: React.ReactNode;
  isCreateNew?: boolean;
  isWidth?: boolean;
  isCreateNewWidth?: boolean;
}

const DropdownMenu = ({
  menuTitle,
  DropdownMenuIcon,
  children,
  isCreateNew,
  isWidth,
  isCreateNewWidth
}: IDropdownProps) => {
  return (
    <Menu>
      <StyledMenuButton
        isWidth={isWidth}
        isCreateNewWidth={isCreateNewWidth}
        isCreateNew={isCreateNew}
      >
        {DropdownMenuIcon}
        <span>{menuTitle}</span>
      </StyledMenuButton>
      <StyledMenuList isCreateNew={isCreateNew}>{children}</StyledMenuList>
    </Menu>
  );
};

export default DropdownMenu;
