import { ReactComponent as CopyIcn } from '../../../assets/copy.svg';
import { ReactComponent as DeleteIcn } from '../../../assets/deleteIcn.svg';
import { ReactComponent as EditIcn } from '../../../assets/editIcn.svg';
import { ReactComponent as GenerateIcn } from '../../../assets/generateIcn.svg';
import { ReactComponent as SummaryIcn } from '../../../assets/summaryIcn1.svg';
import CustomButton from '../../../components/CustomComponents/CustomButton';
import {
  EmptyStateContainer,
  IconContainer,
  PageCount,
  SummaryContainer
} from './styles';
import { ChevronRightIcon, ChevronLeftIcon } from '@chakra-ui/icons';
import React, { useState, useCallback } from 'react';

const Summary = () => {
  const [getSummaryIndex, setSummaryIndex] = useState<number>(0);
  const [, setGenerateValue] = useState<any>(null);

  const onGenerate = useCallback(
    (event: React.SyntheticEvent<HTMLButtonElement>) => {
      setGenerateValue(event.target);
    },
    []
  );

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
      {summaryTexts.length <= 0 && (
        <>
          <PageCount>
            <ChevronLeftIcon />
            {`Page ${1}`}
            <ChevronRightIcon />
          </PageCount>
          {summaryTexts.map((summaryText) => (
            <SummaryContainer
              key={summaryText.id}
              onClick={() => setSummaryIndex(summaryText.id)}
            >
              {getSummaryIndex === summaryText.id && (
                <IconContainer>
                  <CopyIcn />
                  <EditIcn />
                  <DeleteIcn />
                </IconContainer>
              )}

              {summaryText.text}
            </SummaryContainer>
          ))}
        </>
      )}

      {summaryTexts.length >= 1 && (
        <EmptyStateContainer>
          <div>
            <SummaryIcn />
            <p>You’re yet to request for a summary</p>
          </div>
          <div>
            <CustomButton
              onClick={onGenerate}
              isPrimary
              type="button"
              title="Generate Summary"
              icon={<GenerateIcn />}
            />
          </div>
        </EmptyStateContainer>
      )}
    </section>
  );
};

export default Summary;
