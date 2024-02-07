import React from 'react';
import SearchBar from '../search-bar';
import ListGroup from './_components/list-group';

import { format, subDays } from 'date-fns';

function ChatList({ conversations }: { conversations: any[] }) {
  const groupedConversations = conversations
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .reduce((acc, conversation) => {
      const date = new Date(conversation.createdAt);
      const dateStr = date.toDateString();

      const today = new Date();
      const yesterday = subDays(today, 1);

      let key = '';
      if (dateStr === today.toDateString()) {
        key = 'Today';
      } else if (dateStr === yesterday.toDateString()) {
        key = 'Yesterday';
      } else {
        key = format(date, 'dd MMMM yyyy');
      }

      if (acc[key]) {
        acc[key].push(conversation);
      } else {
        acc[key] = [conversation];
      }
      return acc;
    }, {});

  return (
    <React.Fragment>
      <div className="search-bar w-full">
        <SearchBar conversations={conversations} />
      </div>
      <div
        className={
          'w-full h-full overflow-y-scroll flex-col gap-2 over no-scrollbar relative pb-20'
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
