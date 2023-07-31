import { ReactComponent as CopyIcn } from '../../../assets/copy.svg';
import { ReactComponent as DeleteIcn } from '../../../assets/deleteIcn.svg';
import { ReactComponent as EditIcn } from '../../../assets/editIcn.svg';
import MainWrapper from '../FlashCards/create';
import { IconContainer, PageCount, SummaryContainer } from './styles';
import { ChevronRightIcon, ChevronLeftIcon } from '@chakra-ui/icons';
import React, { useState } from 'react';

const HighLight = () => {
  const [getHighIndex, setHightIndex] = useState<number>(0);

  const summaryTexts = [
    {
      id: 1,
      text: 'Nullam neque consequat risus orci. Purus tempor libero ultricies sed dignissim. Cras ipsum id aliquet faucibus accumsan. Sed amet tellus sapien pretium mauris. Ante quis amet curabitur nibh elementum lacus.'
    },
    {
      id: 2,
      text: 'Nullam neque consequat risus orci. Purus tempor libero ultricies sed dignissim. Cras ipsum id aliquet faucibus accumsan. Sed amet tellus sapien pretium mauris. Ante quis amet curabitur nibh elementum lacus.'
    },
    {
      id: 3,
      text: 'Nullam neque consequat risus orci. Purus tempor libero ultricies sed dignissim. Cras ipsum id aliquet faucibus accumsan. Sed amet tellus sapien pretium mauris. Ante quis amet curabitur nibh elementum lacus.'
    }
  ];
  return (
    <section>
      <PageCount>
        <ChevronLeftIcon />
        {`Page ${1}`}
        <ChevronRightIcon />
      </PageCount>
      {summaryTexts.map((summaryText) => (
        <SummaryContainer
          key={summaryText.id}
          onClick={() => setHightIndex(summaryText.id)}
        >
          {getHighIndex === summaryText.id && (
            <IconContainer>
              <CopyIcn />
              <EditIcn />
              <DeleteIcn />
            </IconContainer>
          )}

          {summaryText.text}
        </SummaryContainer>
      ))}
    </section>
  );
};

export default HighLight;
