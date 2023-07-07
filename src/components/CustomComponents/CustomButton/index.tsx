import { StyledButton } from './styles';
import React from 'react';

interface CustomButtonProps {
  isCancel?: boolean;
  isDelete?: boolean;
  isPrimary?: boolean;
  title: string;
  onClick: () => void;
  type: 'button' | 'submit' | 'reset';
}
const CustomButton = ({
  isCancel,
  isDelete,
  title,
  onClick,
  type
}: CustomButtonProps) => {
  return (
    <StyledButton
      isCancel={isCancel}
      isDelete={isDelete}
      onClick={onClick}
      type={type}
    >
      {title}
    </StyledButton>
  );
};

export default CustomButton;
