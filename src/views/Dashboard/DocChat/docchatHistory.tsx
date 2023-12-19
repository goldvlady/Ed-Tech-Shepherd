import DeleteIcn from '../../../assets/deleteIcn.svg?react';
import EditIcn from '../../../assets/editIcn.svg?react';
import HistoryIcn from '../../../assets/historyIcon.svg?react';
import { getDateString } from '../../../helpers';
import {
  fetchStudentConversations,
  getDocchatHistory
} from '../../../services/AI';
import userStore from '../../../state/userStore';
import {
  ChatHistoryBlock,
  ChatHistoryBody,
  ChatHistoryDate,
  ChatHistoryHeader,
  HomeWorkHelpChatContainer2
} from './styles';
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

interface IDocchatHistory {
  studentId: string;
  setIsChatHistory?: (value: boolean) => void;
  noteId?: string;
}

const Clock = styled.div`
  width: 20px;
  height: 20px;
  padding: 5px;
  margin: 5px;
  margin-top: 0;
`;

type Chat = {
  createdAt: string;
  documentId: string;
  documentURL: string;
  id: number;
  keywords: string[];
  reference: string;
  referenceId: string;
  title: string;
  updatedAt: string;
  createdDated: string;
  noteId?: string;
};
type ChatHistoryType = Array<
  { [key: string]: any } & {
    createdAt: string;
    createdDate: string;
    type: 'doc' | 'chat';
    title: string;
  } & Chat
>;
type GroupedChat = {
  date: string;
  messages: Chat[] | ChatHistoryType;
};

const DocchatHistory = ({
  studentId,
  setIsChatHistory,
  noteId
}: IDocchatHistory) => {
  const { user, userDocuments, fetchUserDocuments } = userStore();
  const [chatHistory, setChatHistory] = useState<ChatHistoryType>([]);
  const [groupChatsByDateArr, setGroupChatsByDateArr] = useState<GroupedChat[]>(
    []
  );
  const [updateChatHistory, setUpdateChatHistory] = useState({});
  const [updatedChat, setUpdatedChat] = useState('');
  const [toggleHistoryBox, setToggleHistoryBox] = useState({});
  const showSearchRef = useRef(null) as any;
  const navigate = useNavigate();

  const handleClickOutside = (event) => {
    if (
      showSearchRef.current &&
      !showSearchRef.current.contains(event.target as Node)
    ) {
      setToggleHistoryBox({});
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSearchRef]);

  async function retrieveChatHistory(
    studentIdParam: string,
    noteText?: string
  ) {
    const [chatHistory, docHistories] = await Promise.all([
      fetchStudentConversations(studentIdParam),
      getDocchatHistory({ studentIdParam: studentId, noteText: '' })
    ]);
    const historyWithContent: any = chatHistory
      .filter((chat) => chat.ConversationLogs.length > 0)
      .map((convo) => {
        const message = convo.ConversationLogs.at(-1)?.log?.content || '';

        return {
          id: convo.id,
          title: convo?.title,
          topic: convo?.topic,
          subject: convo?.subject,
          level: convo?.level,
          type: 'chat',
          message:
            message.length < 140 ? message : message.substring(0, 139) + '...',
          createdDated: getDateString(new Date(convo.createdAt)),
          createdAt: new Date(convo.createdAt) // Add the raw timestamp for sorting
        };
      })
      .sort((a, b) => b.createdAt - a.createdAt);

    const filteredHistories = docHistories
      ?.map((docHistory) => ({
        ...docHistory,
        createdAt: new Date(docHistory.createdAt),
        title: docHistory.title,
        createdDated: getDateString(new Date(docHistory.createdAt))
      }))
      ?.sort((a, b) => b.createdAt - a.createdAt)
      .reduce((unique, item) => {
        if (!unique.some((obj) => obj.title === item.title)) {
          unique.push(item);
        }
        return unique;
      }, []);

    setChatHistory(
      [...historyWithContent, ...filteredHistories].sort(
        (a, b) => b.createdAt - a.createdAt
      )
    );
  }

  function groupChatsByDate(chatHistory: ChatHistoryType): GroupedChat[] {
    return chatHistory?.reduce((groupedChats, chat) => {
      const currentGroup = groupedChats?.find(
        (group) => group.date === chat.createdDated
      );
      if (currentGroup) {
        currentGroup?.messages.push(chat);
      } else {
        groupedChats?.push({ date: chat.createdDated, messages: [chat] });
      }
      return groupedChats;
    }, [] as GroupedChat[]);
  }

  const goToDocChat = async (
    documentUrl,
    docTitle,
    documentId,
    docKeywords,
    studentId
  ) => {
    navigate('/dashboard/docchat', {
      state: {
        documentUrl,
        docTitle,
        documentId,
        docKeywords,
        studentId
      }
    });
    if (setIsChatHistory) {
      setIsChatHistory(false);
    }

    user && fetchUserDocuments(user._id);
  };

  useEffect(() => {
    retrieveChatHistory(studentId, noteId);
  }, [studentId, noteId]);

  useEffect(() => {
    const groupedChats = groupChatsByDate(chatHistory);

    setGroupChatsByDateArr(groupedChats ?? []);
  }, [chatHistory]);

  return (
    <section className="">
      <div
        style={{
          marginTop: '2.6rem'
        }}
      >
        <ChatHistoryHeader docchat={true}>
          <p>Chat history</p>
          <p>Clear history</p>
        </ChatHistoryHeader>
      </div>

      <div
        style={{
          overflowY: 'scroll',
          height: '80vh'
        }}
      >
        {groupChatsByDateArr.length > 0 &&
          groupChatsByDateArr?.map((history, index) => (
            <ChatHistoryBlock key={index}>
              <ChatHistoryDate>{history.date}</ChatHistoryDate>
              {history.messages.map((message, index) => (
                <>
                  {!toggleHistoryBox[message.id] ? (
                    <ChatHistoryBody key={message.id}>
                      <Clock>
                        <HistoryIcn />
                      </Clock>
                      {toggleHistoryBox[message.id] ? (
                        <HomeWorkHelpChatContainer2
                          value={updateChatHistory[message.id]}
                          onChange={(event) => {
                            setUpdatedChat(event.target.value);
                            setUpdateChatHistory((prevChatHistory) => ({
                              ...prevChatHistory,
                              [message.id]: event.target.value
                            }));
                          }}
                        ></HomeWorkHelpChatContainer2>
                      ) : (
                        <p
                          onClick={() => {
                            if (message.type === 'doc') {
                              goToDocChat(
                                message.documentURL,
                                message.title,
                                message.documentId,
                                message.keywords,
                                user?._id
                              );
                            } else {
                              localStorage.setItem(
                                'conversationId',
                                message.id
                              );
                              navigate('/dashboard/ace-homework');
                            }
                          }}
                        >
                          {message.title}
                        </p>
                      )}

                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'inherit'
                        }}
                      >
                        {toggleHistoryBox[message.id] ? (
                          // <EditIcn onClick={handleUpdateConversation} />
                          <p
                            onClick={() => {
                              //
                            }}
                          >
                            Save
                          </p>
                        ) : (
                          //   <EditIcn
                          //     onClick={() => {
                          //       //   setEditConversationId(message.id);
                          //       //   toggleMessage(message.id);
                          //
                          //     }}
                          //   />
                          <></>
                        )}
                        {/* <EditIcn onClick={handleUpdateConversation} /> */}
                        <DeleteIcn
                          onClick={() => {
                            // setDeleteConservationModal(
                            //   (prevState) => !prevState
                            // );
                            // setConversationId(message.id);
                            // setRemoveIndex(index);
                          }}
                        />
                      </div>
                    </ChatHistoryBody>
                  ) : (
                    <ChatHistoryBody key={message.id} ref={showSearchRef}>
                      <Clock>
                        <HistoryIcn />
                      </Clock>
                      <HomeWorkHelpChatContainer2
                        value={updateChatHistory[message.id]}
                        onChange={(event) => {
                          setUpdatedChat(event.target.value);
                          setUpdateChatHistory((prevChatHistory) => ({
                            ...prevChatHistory,
                            [message.id]: event.target.value
                          }));
                        }}
                      ></HomeWorkHelpChatContainer2>

                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'inherit'
                        }}
                      >
                        <p
                          onClick={() => {
                            //
                          }}
                        >
                          Save
                        </p>

                        {/* <EditIcn onClick={handleUpdateConversation} /> */}
                        <DeleteIcn
                          onClick={() => {
                            // setDeleteConservationModal(
                            //   (prevState) => !prevState
                            // );
                            // setConversationId(message.id);
                            // setRemoveIndex(index);
                          }}
                        />
                      </div>
                    </ChatHistoryBody>
                  )}
                </>
              ))}
            </ChatHistoryBlock>
          ))}
      </div>
    </section>
  );
};

export default DocchatHistory;
