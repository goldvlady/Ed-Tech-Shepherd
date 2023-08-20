import { ReactComponent as HistoryIcn } from '../../../assets/historyIcon.svg';
import { arrangeDataByDate, getDateString } from '../../../helpers';
import { fetchStudentConversations } from '../../../services/AI';
import {
  ChatHistoryBlock,
  ChatHistoryBody,
  ChatHistoryContainer,
  ChatHistoryDate,
  ChatHistoryHeader
} from './styles';
import { Box, Spinner } from '@chakra-ui/react';
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

type Chat = {
  id: string;
  message: string;
  createdDated: string;
};

type GroupedChat = {
  date: string;
  messages: Chat[];
};

const ChatHistory = ({
  studentId,
  setConversationId
}: {
  studentId: string;
  setConversationId: (conversationId: string) => void;
}) => {
  // const placeholder = [
  //   {
  //     messages: ['No conversations — yet'],
  //     date: getDateString(new Date())
  //   }
  // ];

  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  async function retrieveChatHistory(studentId: string): Promise<void> {
    setLoading(true);
    const chatHistory = await fetchStudentConversations(studentId);

    const historyWithContent: any = chatHistory
      .filter((chat) => chat.ConversationLogs.length > 0)
      .map((convo) => {
        const message = convo.ConversationLogs.at(-1)?.log?.content || '';
        return {
          id: convo.id,
          message:
            message.length < 140 ? message : message.substring(0, 139) + '...',
          createdDated: getDateString(new Date(convo.createdAt))
        };
      })
      .reverse();

    setChatHistory(historyWithContent);
    setLoading(false);
  }

  function groupChatsByDate(chatHistory: Chat[]): GroupedChat[] {
    return chatHistory.reduce((groupedChats, chat) => {
      const currentGroup = groupedChats.find(
        (group) => group.date === chat.createdDated
      );
      if (currentGroup) {
        currentGroup.messages.push(chat);
      } else {
        groupedChats.push({ date: chat.createdDated, messages: [chat] });
      }
      return groupedChats;
    }, [] as GroupedChat[]);
  }

  const groupChatsByDateArr: GroupedChat[] = groupChatsByDate(chatHistory);

  useEffect(() => {
    retrieveChatHistory(studentId);
  }, [studentId]);

  return (
    <ChatHistoryContainer>
      <ChatHistoryHeader>
        <p>Chat history</p>
        <p>Clear history</p>
      </ChatHistoryHeader>
      {loading && (
        <Box
          p={5}
          textAlign="center"
          margin="0 auto"
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '40vh',
            width: '24vw'
          }}
        >
          <Spinner />
        </Box>
      )}
      {!loading && (
        <>
          {groupChatsByDateArr?.map((history, index) => (
            <ChatHistoryBlock key={index}>
              <ChatHistoryDate>{history.date}</ChatHistoryDate>
              {history.messages.map((message) => (
                <ChatHistoryBody
                  key={message.id}
                  onClick={() => setConversationId(message.id)}
                >
                  <Clock>
                    <HistoryIcn />
                  </Clock>
                  <p>{message.message}</p>
                </ChatHistoryBody>
              ))}
            </ChatHistoryBlock>
          ))}
        </>
      )}
    </ChatHistoryContainer>
  );
};

export default ChatHistory;
