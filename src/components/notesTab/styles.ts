import { MenuButton } from '@chakra-ui/react';
import styled from 'styled-components';

export const StyledMenuButton = styled(MenuButton)`
  display: flex;
  align-items: center;
  background: #f4f5f5;
  font-size: 0.75rem;
  color: #585f68;
  border-radius: 6px;
  padding: 7px;
`;

export const StyledMenuSection = styled.section`
  position: absolute;
  bottom: 80px;
  background: white;
  border: 1px solid #f2f4f7;
  width: 245px;
  padding: 8px;
  border-radius: 8px;
`;

export const ModalFooter = styled.div`
  position: absolute;
  bottom: 0px;
  background: #f7f7f8;
  height: 72px;
  padding: 20px;
  width: 100%;
  text-align: right;

  > button:nth-child(2) {
    margin-left: 10px;
  }
`;

export const TableTitleWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
`;

export const TitleIcon = styled.img`
  margin-right: 100;
`;

export const DeleteConfirmationContainer = styled.div`
  height: 3rem;
  width: 3rem;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  border: 1px solid #d2d6dc;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  padding: 0.5rem;
  border-radius: 9999px;
`;

export const DeleteConfirmationImage = styled.img`
  height: 1.5rem;
  width: 1.5rem;
`;

export const DeleteConfirmationDetails = styled.div`
  margin-top: 0.75rem;
  padding: 0 1.5rem;
  text-align: center;
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
`;

export const DeleteConfirmationDescription = styled.p`
  margin-top: 0.5rem;
  padding: 0 1.5rem;
  font-size: 0.875rem;
  color: #6b7280;
`;
