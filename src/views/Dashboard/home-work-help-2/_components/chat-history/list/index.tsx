import React, { useState } from 'react';
import SearchBar from '../search-bar';
import ListGroup from './_components/list-group';
import { format, isToday, isYesterday } from 'date-fns';

type Conversation = any;

interface GroupedConversations {
  [date: string]: Conversation[];
}

function ChatList({ conversations = [] }: { conversations: Conversation[] }) {
  const [conversationHistoryFilter, setConversationHistoryFilter] = useState({
    keyword: '',
    subject: ''
  });

  // Filtering conversations based on subject and keyword
  const filteredConversations = conversations?.filter((conversation) => {
    const { keyword, subject } = conversationHistoryFilter;
    return (
      conversation?.subject?.toLowerCase().includes(subject.toLowerCase()) &&
      conversation?.title?.toLowerCase().includes(keyword.toLowerCase())
    );
  });

  const groupedConversations = groupConversationsByDate(filteredConversations);

  const handleSubjectFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setConversationHistoryFilter({
      ...conversationHistoryFilter,
      subject: e.target.value
    });
  };

  const handleKeywordFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConversationHistoryFilter({
      ...conversationHistoryFilter,
      keyword: e.target.value
    });
  };

  return (
    <React.Fragment>
      <div className="search-bar w-full">
        <SearchBar
          conversations={conversations}
          handleSubjectFilter={handleSubjectFilter}
          handleKeywordFilter={handleKeywordFilter}
        />
      </div>
      <div className="w-full h-full overflow-y-scroll flex-col gap-2 over no-scrollbar relative pb-20">
        {Object.keys(groupedConversations).map((date) => (
          <ListGroup
            key={date}
            date={date}
            groupItems={groupedConversations[date]}
          />
        ))}
      </div>
    </React.Fragment>
  );
}

function groupConversationsByDate(
  conversations: Conversation[]
): GroupedConversations {
  return conversations
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .reduce((acc: GroupedConversations, conversation) => {
      const date = new Date(conversation.createdAt);
      let key = '';

      if (isToday(date)) {
        key = 'Today';
      } else if (isYesterday(date)) {
        key = 'Yesterday';
      } else {
        key = format(date, 'dd MMMM yyyy');
      }

      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(conversation);

      return acc;
    }, {});
}

export default ChatList;
