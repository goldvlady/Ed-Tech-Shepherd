import { Tr as ChakraTr, Th, Td as ChakraTd } from '@chakra-ui/react';
import styled from 'styled-components';

export const StyledTh = styled(Th)<{ textAlign?: string }>`
  background: #f7f8fa;
  color: #6e7682;
  font-weight: bold;
  font-size: 12px;
  padding: 1rem 0rem;
  line-height: 17px;
  text-align: ${(props) => props.textAlign || 'center'};
  border-radius: 5px;
`;

export const StyledTr = styled(ChakraTr)<{
  selectable?: boolean;
  active?: boolean;
  tagsColor?: string;
}>`
  &:hover {
    background: ${(props) => (props.selectable ? '#EEEFF2' : 'inherit')};
  }

  background: ${(props) => (props.active ? '#F0F6FE' : 'inherit')};

  cursor: ${(props) => (props.selectable ? 'pointer' : 'default')};
`;

export const StyledTd = styled(ChakraTd)<{
  tagsColor: string;
  textAlign?: string;
}>`
  padding: 15px 0;
  &:first-child,
  &:last-child {
    padding: 22px 5px;
  }
  border-bottom: 0.8px solid #eeeff2;
  text-align: ${(props) => props.textAlign || 'center'};
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  color: #585f68;
`;
