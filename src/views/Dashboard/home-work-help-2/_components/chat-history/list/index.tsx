import React from 'react';
import SearchBar from '../search-bar';
import ListGroup from './_components/list-group';

function ChatList({ conversations }: { conversations: any[] }) {
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
        <ListGroup date="Today" groupItems={conversations.slice(0, 5)} />
        <ListGroup date="Yesterday" groupItems={conversations.slice(0, 5)} />
        <ListGroup
          date="1 February 2024"
          groupItems={conversations.slice(0, 5)}
        />
      </div>
    </React.Fragment>
  );
}

export default ChatList;
