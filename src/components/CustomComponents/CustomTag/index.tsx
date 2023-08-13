import { StyledTag, StyledTagLabel } from './styles';
import { TagLabel, TagLeftIcon } from '@chakra-ui/react';
import { FC, ReactNode } from 'react';

interface TagProps {
  label: string;
  icon?: ReactNode;
  onClick?: (event: React.SyntheticEvent<HTMLButtonElement>) => void;
}
const TableTag: FC<TagProps> = (props) => {
  const { label, onClick, icon } = props;

  return (
    <StyledTag onClick={onClick}>
      {icon && <TagLeftIcon>{icon}</TagLeftIcon>}
      <StyledTagLabel>{label}</StyledTagLabel>
    </StyledTag>
  );
};

export default TableTag;
