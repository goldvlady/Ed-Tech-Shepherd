import { ReactComponent as CloseIcon } from '../../../assets/shadowCloseIcn.svg';
import CustomScrollbar from '../CustomScrollBar';
import { SidebarContainer, SidebarContent } from './styles';
import React from 'react';

interface ICustomSideModalProp {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
}
const CustomSideModal = ({
  children,
  isOpen,
  onClose
}: ICustomSideModalProp) => {
  return (
    <SidebarContainer isOpen={isOpen}>
      <CloseIcon
        onClick={onClose}
        style={{
          position: 'relative',
          top: '120px',
          right: '17px',
          cursor: 'pointer'
        }}
      />
      <CustomScrollbar height="100vh">
        <SidebarContent>{children}</SidebarContent>
      </CustomScrollbar>
    </SidebarContainer>
  );
};

export default CustomSideModal;
