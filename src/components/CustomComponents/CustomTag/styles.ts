import theme from '../../../theme/';
import { Tag, TagLabel } from '@chakra-ui/react';
import styled from 'styled-components';

export const StyledTag = styled(Tag)`
  border-radius: 5px;
  background: ${(props) => theme.color.gray};
  margin-left: 2px;
  margin-right: 2px;
  &:hover {
    opacity: 0.5;
  }
`;

export const StyledTagLabel = styled(TagLabel)`
  /* color: ${(props) => theme.color.textPrimary} */
  color: '#6E7682';
`;
