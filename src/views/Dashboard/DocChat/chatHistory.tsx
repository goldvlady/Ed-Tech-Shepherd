import { ReactComponent as HistoryIcn } from '../../../assets/historyIcon.svg';
import { getDateString } from '../../../helpers';
import { fetchStudentConversations } from '../../../services/AI';
import {
  ChatHistoryBlock,
  ChatHistoryBody,
  ChatHistoryContainer,
  ChatHistoryDate,
  ChatHistoryHeader
} from './styles';
import { useState, useEffect } from 'react';
import React from 'react';
import styled from 'styled-components';

const Clock = styled.div`
  width: 20px;
  height: 20px;
  padding: 5px;
  margin: 5px;
  margin-top: 0;
`;

const ChatHistory = ({ studentId }: { studentId: string }) => {
  const placeholder = [
    {
      id: 1,
      message: 'No conversations — yet',
      createdDated: getDateString(new Date())
    }
  ];

  const [chatHistory, setChatHistory] = useState(placeholder);

  const retrieveChatHistory = async (studentId: string) => {
    const chatHistory = await fetchStudentConversations(studentId);
    const historyWithContent = chatHistory
      .filter((chat) => chat.ConversationLogs.length > 0)
      .map((convo) => {
        const message = convo.ConversationLogs.at(-1).log.content;
        return {
          id: convo.id,
          message:
            message.length < 140 ? message : message.substring(0, 139) + '...',
          createdDated: getDateString(new Date(convo.createdAt))
        };
      })
      .reverse();
    setChatHistory(historyWithContent);
  };

  useEffect(() => {
    retrieveChatHistory(studentId);
  }, [studentId]);

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
            <Clock>
              <HistoryIcn />
            </Clock>
            <p>{history.message}</p>
          </ChatHistoryBody>
        </ChatHistoryBlock>
      ))}
    </ChatHistoryContainer>
  );
};

export default ChatHistory;
