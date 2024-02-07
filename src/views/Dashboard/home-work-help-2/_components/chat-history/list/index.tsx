import React from 'react';
import SearchBar from '../search-bar';
import ListGroup from './_components/list-group';

function ChatList({ conversations }: { conversations: any[] }) {
  const groupedConversations = conversations.reduce((acc, conversation) => {
    const date = new Date(conversation.createdAt);
    const dateStr = date.toDateString();
    if (acc[dateStr]) {
      acc[dateStr].push(conversation);
    } else {
      acc[dateStr] = [conversation];
    }
    return acc;
  }, {});
  console.log('groupedConversations', groupedConversations);
  return (
    <React.Fragment>
      <div className="search-bar w-full">
        <SearchBar conversations={conversations} />
      </div>
      <div
        className={
          'w-full h-full overflow-y-scroll flex-col gap-2 over no-scrollbar relative'
        }
      >
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

export default ChatList;
