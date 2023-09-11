import { ReactComponent as DeleteIcn } from '../../../assets/deleteIcn.svg';
import { ReactComponent as EditIcn } from '../../../assets/editIcn.svg';
import { ReactComponent as HistoryIcn } from '../../../assets/historyIcon.svg';
import { arrangeDataByDate, getDateString } from '../../../helpers';
import { fetchStudentConversations } from '../../../services/AI';
import {
  ChatHistoryBlock,
  ChatHistoryBody,
  ChatHistoryContainer,
  ChatHistoryDate,
  ChatHistoryHeader,
  HomeWorkHelpChatContainer2
} from './styles';
import { Box, Spinner } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { messageCodeBlocks } from 'stream-chat-react';
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
  setConversationId,
  conversationId,
  isSubmitted
}: {
  studentId: string;
  setConversationId: (conversationId: string) => void;
  conversationId: string;
  isSubmitted?: boolean;
}) => {
  // const placeholder = [
  //   {
  //     messages: ['No conversations — yet'],
  //     date: getDateString(new Date())
  //   }
  // ];

  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updateChatHistory, setUpdateChatHistory] = useState({});
  const [toggleHistoryBox, setToggleHistoryBox] = useState({});

  async function retrieveChatHistory(studentId: string): Promise<void> {
    setLoading(false);
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

  const toggleMessage = (id) => {
    setToggleHistoryBox((prevState) => {
      const updatedState = { ...prevState };

      // Toggle the state of the clicked item
      updatedState[id] = !updatedState[id];

      // Close all previous items except the one clicked
      for (const key in updatedState) {
        if (key !== id) {
          updatedState[key] = false;
        }
      }

      return updatedState;
    });
  };

  useEffect(() => {
    const newChatHistory: Record<string, string> = {};

    groupChatsByDateArr?.forEach((history) => {
      history.messages.forEach((message) => {
        newChatHistory[message.id] = message.message;
      });
    });
    setUpdateChatHistory(newChatHistory);
  }, [toggleHistoryBox]);

  // useEffect(() => {
  //   retrieveChatHistory(studentId);
  // }, [studentId]);

  // useEffect(() => {
  //   if (groupChatsByDateArr.length) {
  //     localStorage.setItem(
  //       'groupChatsByDateArr',
  //       JSON.stringify(groupChatsByDateArr)
  //     );
  //   }
  // }, [groupChatsByDateArr]);

  // useEffect(() => {
  //   const storedGroupChatsArr = localStorage.getItem('groupChatsByDateArr');
  //   const groupedChats = JSON.parse(storedGroupChatsArr ?? '');

  //   console.log(
  //     'storedGroupChatsArr ==>',
  //     JSON.parse(storedGroupChatsArr ?? '')
  //   );
  // }, []);

  useEffect(() => {
    const storedGroupChatsArr = localStorage.getItem('groupChatsByDateArr');
    const groupedChats =
      storedGroupChatsArr && JSON.parse(storedGroupChatsArr ?? '');

    if (groupedChats) {
      setChatHistory(groupedChats);
    }
    retrieveChatHistory(studentId);
  }, [studentId]);

  useEffect(() => {
    if (chatHistory?.length) {
      localStorage.setItem('groupChatsByDateArr', JSON.stringify(chatHistory));
    }
  }, [chatHistory]);

  useEffect(() => {
    if (isSubmitted && studentId) {
      retrieveChatHistory(studentId);
    }
  }, [isSubmitted, studentId]);

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
                <ChatHistoryBody key={message.id}>
                  <Clock>
                    <HistoryIcn />
                  </Clock>
                  {toggleHistoryBox[message.id] ? (
                    <HomeWorkHelpChatContainer2
                      value={updateChatHistory[message.id]}
                      onChange={(event) => {
                        setUpdateChatHistory((prevChatHistory) => ({
                          ...prevChatHistory,
                          [message.id]: event.target.value
                        }));
                      }}
                    ></HomeWorkHelpChatContainer2>
                  ) : (
                    <p onClick={() => setConversationId(message.id)}>
                      {message.message}
                    </p>
                  )}

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'baseline'
                    }}
                  >
                    <EditIcn onClick={() => toggleMessage(message.id)} />
                    <DeleteIcn />
                  </div>
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
