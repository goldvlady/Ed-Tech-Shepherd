import { ReactComponent as HistoryIcn } from '../../assets/historyIcon.svg';
import { getDateString } from '../../helpers';
import {
  ChatHistoryBlock,
  ChatHistoryBody,
  ChatHistoryContainer,
  ChatHistoryDate,
  ChatHistoryHeader
} from './styles';
import React from 'react';

const ChatHistory = () => {
  const chatHistory = [
    {
      id: 1,
      message:
        'What are 5 teaching strategies that can be used to engaged people...',
      createdDated: getDateString(new Date())
    },
    {
      id: 2,
      message:
        'What are 5 teaching strategies that can be used to engaged people...',
      createdDated: getDateString(new Date())
    }
  ];

  return (
    <ChatHistoryContainer>
      <ChatHistoryHeader>
        <p>Chat history</p>
        <p>Clear history</p>
      </ChatHistoryHeader>
      {chatHistory?.map((history) => (
        <ChatHistoryBlock key={history.id}>
          <ChatHistoryDate>{history.createdDated}</ChatHistoryDate>
          <ChatHistoryBody>
            <HistoryIcn />
            <p>{history.message}</p>
          </ChatHistoryBody>
        </ChatHistoryBlock>
      ))}
    </ChatHistoryContainer>
  );
};

export default ChatHistory;
