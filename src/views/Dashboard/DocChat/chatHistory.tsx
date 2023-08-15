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

const ChatHistory = ({ studentId }: { studentId: string }) => {
  const placeholder = [
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

  const [chatHistory, setChatHistory] = useState(placeholder);

  const retrieveChatHistory = async (studentId: string) => {
    const chatHistory = await fetchStudentConversations(studentId);
    const historyWithContent = chatHistory
      .filter((chat) => chat.ConversationLogs.length > 0)
      .map((convo) => {
        return {
          id: convo.id,
          message: convo.ConversationLogs.at(-1).log.content,
          createdDate: getDateString(new Date(convo.createdAt))
        };
      });
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
            <HistoryIcn />
            <p>{history.message}</p>
          </ChatHistoryBody>
        </ChatHistoryBlock>
      ))}
    </ChatHistoryContainer>
  );
};

export default ChatHistory;
