import { StyledMenuButton, StyledMenuList } from "./styles";
import { Menu } from "@chakra-ui/react";
import React, { ReactElement } from "react";

interface IDropdownProps {
  menuTitle: string;
  DropdownMenuIcon: ReactElement;
  children?: React.ReactNode;
  isCreateNew?: boolean;
}

const DropdownMenu = ({
  menuTitle,
  DropdownMenuIcon,
  children,
  isCreateNew,
}: IDropdownProps) => {
  return (
    <Menu>
      <StyledMenuButton isCreateNew={isCreateNew}>
        {DropdownMenuIcon}
        <span>{menuTitle}</span>
      </StyledMenuButton>
      <StyledMenuList isCreateNew={isCreateNew}>{children}</StyledMenuList>
    </Menu>
  );
};

export default DropdownMenu;
