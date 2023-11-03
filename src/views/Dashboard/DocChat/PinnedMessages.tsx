import { ReactComponent as CopyIcn } from '../../../assets/copy.svg';
import { ReactComponent as DeleteIcn } from '../../../assets/deleteIcn.svg';
import { ReactComponent as EditIcn } from '../../../assets/editIcn.svg';
import { ReactComponent as SummaryIcn } from '../../../assets/summaryIcn1.svg';
import CustomMarkdownView from '../../../components/CustomComponents/CustomMarkdownView';
import { IconContainer, IconContainer2, SummaryContainer } from './styles';
import { Flex, Input, InputGroup, InputLeftElement } from '@chakra-ui/react';
import React, { useState, useEffect, useMemo } from 'react';
import { BsSearch } from 'react-icons/bs';

const PinnedMessages = ({
  messages,
  scrollToMessage,
  onPinnedMessages
}: {
  messages: any[];
  scrollToMessage: any;
  onPinnedMessages?: any;
}) => {
  const [pinnedSearches, setPinnedSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const filteredMessages = useMemo(() => {
    return messages.filter((messages) => messages.isPinned);
  }, [messages]);
  console.log('filteredMessages ==>', filteredMessages);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setPinnedSearch(value);

    // If the search input is empty, display all texts
    if (!value.trim()) {
      setSearchResults(filteredMessages);
      return;
    }

    const lowercasedValue = value.toLowerCase();
    const results = filteredMessages.filter((text) =>
      text.text.toLowerCase().includes(lowercasedValue)
    );
    setSearchResults(results);
  };

  // Set initial search results
  useEffect(() => {
    setSearchResults(filteredMessages);
  }, [filteredMessages]);

  return (
    <div
      style={{
        marginTop: '40px'
      }}
    >
      <p
        style={{
          textAlign: 'center',
          fontSize: '0.75rem',
          color: '#585F68',
          background: '#fff',
          borderRadius: '6px',
          boxShadow: '-1px 5px 11px 0px #2E303814',
          margin: '0px 22px',
          padding: '10px'
        }}
      >
        Pinned Messages
      </p>
      <Flex margin="30px 22px" alignItems="center">
        <InputGroup
          size="sm"
          borderRadius="6px"
          width={{ base: '100%', md: '100%' }}
          height="32px"
        >
          <InputLeftElement marginRight={'10px'} pointerEvents="none">
            <BsSearch color="#5E6164" size="14px" />
          </InputLeftElement>
          <Input
            type="text"
            variant="outline"
            onChange={handleSearch}
            size="sm"
            placeholder="Search"
            borderRadius="6px"
            value={pinnedSearches}
          />
        </InputGroup>
      </Flex>
      <div style={{ marginTop: '60px' }}>
        {!!searchResults.length && (
          <>
            {searchResults.map((text) => (
              <SummaryContainer
                key={text}
                onClick={() => {
                  scrollToMessage(text?.chatId);
                  onPinnedMessages();
                }}
              >
                <IconContainer2>
                  <CopyIcn />
                  <DeleteIcn />
                </IconContainer2>
                <CustomMarkdownView source={text.text} />
              </SummaryContainer>
            ))}
          </>
        )}

        {!searchResults.length && (
          <div>
            <p
              style={{
                fontWeight: '700',
                fontSize: '1rem',
                textAlign: 'center'
              }}
            >
              Pin word not found
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PinnedMessages;
