import Chat from '../../docchat/chat';
import ChatHistory from '../../docchat/chatHistory';
import {
  HomeWorkHelpChatContainer,
  HomeWorkHelpContainer,
  HomeWorkHelpHistoryContainer
} from './style';
import React from 'react';

const HomeWorkHelp = () => {
  return (
    <HomeWorkHelpContainer>
      <HomeWorkHelpHistoryContainer>
        <ChatHistory />
      </HomeWorkHelpHistoryContainer>
      <HomeWorkHelpChatContainer>
        <Chat HomeWorkHelp />
      </HomeWorkHelpChatContainer>
    </HomeWorkHelpContainer>
  );
};

export default HomeWorkHelp;
