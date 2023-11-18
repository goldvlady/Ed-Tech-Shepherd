import { ReactComponent as CopyIcn } from '../../../assets/copy.svg';
import { ReactComponent as DeleteIcn } from '../../../assets/deleteIcn.svg';
import { ReactComponent as EditIcn } from '../../../assets/editIcn.svg';
import { ReactComponent as SummaryIcn } from '../../../assets/summaryIcn1.svg';
import CustomMarkdownView from '../../../components/CustomComponents/CustomMarkdownView';
import {
  EmptyStateContainer,
  IconContainer,
  PageCount,
  SummaryContainer
} from './styles';
import {
  ChevronRightIcon,
  ChevronLeftIcon,
  ArrowDownIcon
} from '@chakra-ui/icons';
import { Box, Flex, Spacer, Spinner, Text } from '@chakra-ui/react';
import { highlightPlugin } from '@react-pdf-viewer/highlight';
import React, { useEffect, useState } from 'react';
import { BiDownArrow } from 'react-icons/bi';
import { CgChevronDown, CgChevronUp } from 'react-icons/cg';

const HighLight = ({
  hightlightedText,
  setSelectedHighlightArea,

  loading
}: {
  hightlightedText: any[];
  setSelectedHighlightArea: any;

  loading: boolean;
}) => {
  const [highlightStates, setHighlightStates] = useState(
    hightlightedText.map(() => false)
  );
  useEffect(() => {
    setHighlightStates(hightlightedText.map(() => false));
  }, [hightlightedText]);

  const toggleQuoteVisibility = (index) => {
    setHighlightStates((prevStates) => {
      const newStates = prevStates.map((state, i) =>
        i === index ? !state : false
      );
      return newStates;
    });
  };

  const [isQuoteVisible, setQuoteVisible] = useState(false);

  // const toggleQuoteVisibility = () => {
  //   setQuoteVisible(!isQuoteVisible);
  // };
  const [getHighIndex, setHightIndex] = useState<number>(0);

  if (loading) {
    return (
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
    );
  }

  return (
    <section>
      {/* <PageCount>
        <ChevronLeftIcon />
        {`Page ${1}`}
        <ChevronRightIcon />
      </PageCount> */}
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

      {hightlightedText.length >= 1 && (
        <>
          {hightlightedText.map((hightlight, index) => (
            <Box
              key={hightlight?.id}
              onClick={() => setHightIndex(hightlight?.id)}
              p={2}
              bgColor="#F4F5F6"
              borderRadius={8}
              position="relative"
              cursor="pointer"
              my={2}
            >
              {/* {getHighIndex === hightlight.id && (
                <IconContainer>
                  <CopyIcn />
                  <EditIcn />
                  <DeleteIcn />
                </IconContainer>
              )} */}
              {/* <CustomMarkdownView source={hightlight?.content} /> */}
              <Box>
                <Flex
                  alignItems={'center'}
                  my={1}
                  color="#585f68"
                  fontSize={'0.875rem'}
                  onClick={() => {
                    setSelectedHighlightArea(hightlight.highlight.position[0]);

                    sessionStorage.setItem(
                      'goTo',
                      JSON.stringify(hightlight.highlight.position[0])
                    );
                  }}
                >
                  <Text lineHeight={5}>
                    {hightlight?.highlight?.name.length > 35
                      ? hightlight?.highlight?.name.slice(0, 40) + '...'
                      : hightlight?.highlight?.name}
                  </Text>
                  <Spacer />
                  <Box
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleQuoteVisibility(index);
                    }}
                    p={2}
                  >
                    {highlightStates[index] ? (
                      <CgChevronUp />
                    ) : (
                      <CgChevronDown />
                    )}
                  </Box>
                </Flex>
                {highlightStates[index] && (
                  <>
                    {' '}
                    <Box borderLeft={'2px solid grey'}>
                      {hightlight?.comments.map((comment) => (
                        <Text
                          fontSize={11}
                          lineHeight={3}
                          px={3}
                          color="text.400"
                        >
                          {comment.content}
                        </Text>
                      ))}
                    </Box>{' '}
                    {/* <Flex
                      alignItems="center"
                      gap={3}
                      justifyContent="center"
                      cursor="pointer"
                      mt={1}
                    >
                      <CopyIcn />
                      <EditIcn />
                      <DeleteIcn />
                    </Flex> */}
                  </>
                )}
              </Box>
            </Box>
          ))}
        </>
      )}

      {hightlightedText.length === 0 && (
        <EmptyStateContainer>
          <div>
            <SummaryIcn />
            <p>You’re yet to highlight a word.</p>
          </div>
        </EmptyStateContainer>
      )}
    </section>
  );
};

export default HighLight;
