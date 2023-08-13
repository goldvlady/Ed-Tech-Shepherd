import { ReactComponent as CopyIcn } from '../../../assets/copy.svg';
import { ReactComponent as DeleteIcn } from '../../../assets/deleteIcn.svg';
import { ReactComponent as EditIcn } from '../../../assets/editIcn.svg';
import { ReactComponent as GenerateIcn } from '../../../assets/generateIcn.svg';
import { ReactComponent as SummaryIcn } from '../../../assets/summaryIcn1.svg';
import CustomButton from '../../../components/CustomComponents/CustomButton';
import CustomMarkdownView from '../../../components/CustomComponents/CustomMarkdownView';
import { copierHandler } from '../../../helpers';
import {
  DefaultSummaryContainer,
  EmptyStateContainer,
  IconContainer,
  PageCount,
  SummaryContainer,
  SummaryContainer2
} from './styles';
import { Box, Spinner } from '@chakra-ui/react';
// import { ChevronRightIcon, ChevronLeftIcon } from '@chakra-ui/icons';
import React, { useState, useCallback, useEffect } from 'react';

const Summary = ({
  handleSummary,
  summaryLoading,
  summaryTexts,
  setSummaryText,
  handleDeleteSummary,
  handleUpdateSummary,
  loading
}: {
  handleSummary: () => void;
  summaryLoading?: boolean;
  summaryTexts?: string | undefined;
  setSummaryText?: any;
  handleDeleteSummary?: () => void;
  handleUpdateSummary?: () => void;
  loading?: boolean;
}) => {
  const [isEdit, setEdit] = useState(true);
  const [copiedView, setCopiedView] = useState(false);

  const onEditToggle = useCallback(() => {
    setEdit((prevState) => !prevState);
  }, [setEdit]);

  useEffect(() => {
    if (!loading) {
      onEditToggle();
    }
  }, [loading]);

  return (
    <section>
      {!!summaryTexts?.length && (
        <>
          <PageCount>
            {/* <ChevronLeftIcon />
            {`Page ${1}`}
            <ChevronRightIcon /> */}
          </PageCount>
          <IconContainer>
            {copiedView ? (
              <p style={{ fontSize: '.75rem', color: 'rgb(88, 95, 104)' }}>
                {'Copied!'}
              </p>
            ) : (
              <CopyIcn
                onClick={() => copierHandler(summaryTexts, setCopiedView)}
              />
            )}

            {!isEdit ? (
              <p
                style={{
                  fontSize: '0.875rem',
                  color: '#FB8441',
                  cursor: 'pointer'
                }}
                onClick={handleUpdateSummary}
              >
                Save
              </p>
            ) : (
              <EditIcn onClick={onEditToggle} />
            )}
            <DeleteIcn onClick={handleDeleteSummary} />
          </IconContainer>
          {loading && (
            <Box
              p={5}
              textAlign="center"
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh'
              }}
            >
              <Spinner />
            </Box>
          )}
          {!loading && (
            <>
              {isEdit ? (
                <DefaultSummaryContainer>
                  <CustomMarkdownView source={summaryTexts} />
                </DefaultSummaryContainer>
              ) : (
                <SummaryContainer2
                  value={summaryTexts}
                  onChange={(event) => setSummaryText(event.target.value!)}
                ></SummaryContainer2>
              )}
            </>
          )}
        </>
      )}

      {!summaryTexts?.length && (
        <EmptyStateContainer>
          <div>
            <SummaryIcn />
            <p>You’re yet to request for a summary</p>
          </div>
          <div>
            <CustomButton
              onClick={handleSummary}
              isPrimary
              type="button"
              title={
                summaryLoading ? 'Generating Summary...' : 'Generate Summary'
              }
              icon={<GenerateIcn />}
            />
          </div>
        </EmptyStateContainer>
      )}
    </section>
  );
};

export default Summary;
