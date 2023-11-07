/* eslint-disable react-hooks/exhaustive-deps */
import CustomToast from '../../../components/CustomComponents/CustomToast/index';
import { AI_API } from '../../../config';
import useIsMobile from '../../../helpers/useIsMobile';
import {
  chatHistory,
  chatWithDoc,
  deleteGeneratedSummary,
  generateSummary,
  getPDFHighlight,
  getToggleReaction,
  postGenerateSummary,
  postPinnedPrompt,
  updateGeneratedSummary
} from '../../../services/AI';
import socketWithAuth from '../../../socket';
import userStore from '../../../state/userStore';
import DocViewer from './DocViewer';
import TempPDFViewer from './TempPDFViewer';
import Chat from './chat';
import { TempPDF } from './styles';
import { BlockNoteEditor } from '@blocknote/core';
import { BlockNoteView, useBlockNote } from '@blocknote/react';
import { useToast } from '@chakra-ui/react';
import { useEffect, useState, useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function DocChat() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = userStore();
  const toast = useToast();
  const [llmResponse, setLLMResponse] = useState('');
  const [readyToChat, setReadyToChat] = useState(false);
  const [chatHistoryLoaded, setChatHistoryLoaded] = useState(false);
  const [botStatus, setBotStatus] = useState(
    'Philosopher, thinker, study companion.'
  );
  const [messages, setMessages] = useState<
    {
      text: string;
      isUser: boolean;
      isLoading: boolean;
      dislike: boolean;
      like: boolean;
      chatId?: number;
      isPinned?: boolean;
    }[]
  >([]);
  const [inputValue, setInputValue] = useState('');
  const [isShowPrompt, setShowPrompt] = useState<boolean>(false);
  const documentId = location.state.documentId ?? '';
  const docKeywords = location.state.docKeywords ?? [];
  const [keyword, setKeyword] = useState('');
  const title = location.state.docTitle ?? '';
  const studentId = user?._id ?? '';
  const directStudentId = user?.student?._id;
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summaryText, setSummaryText] = useState('');
  const [socket, setSocket] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [hightlightedText, setHightlightedText] = useState<any[]>([]);
  const [selectedHighlightArea, setSelectedHighlightArea] = useState<any>({});
  const [isUpdatedSummary, setUpdatedSummary] = useState<boolean>(false);
  const content = location.state?.content;
  const [initialContent, setInitialContent] = useState<any>(content);
  const editor: BlockNoteEditor | null = useBlockNote({
    initialContent: initialContent ? JSON.parse(initialContent) : undefined,
    editable: false
  });
  const [summaryStart, setSummaryStart] = useState(false);
  const [summaryError, setSummaryError] = useState(false);
  const mobile = useIsMobile();
  const [switchDocument, setSwitchDocument] = useState(true);
  const [likesDislikes, setLikesDislikes] = useState(
    new Array(messages.length).fill({ like: false, dislike: false })
  );
  const [chatId, setChatId] = useState('');
  const [pinnedResponse, setPinnedResponse] = useState<any>();

  const isLike = useMemo(() => {
    return likesDislikes[1]?.like
      ? true
      : false || likesDislikes[1]?.dislike
      ? false
      : true;
  }, [likesDislikes]);

  const reaction = useCallback(
    async () =>
      getToggleReaction({
        chatId,
        reactionType: isLike ? 'like' : 'dislike'
      }).catch((err) => {
        console.log(err);
      }),
    []
  );

  const handleDislike = (index) => {
    setLikesDislikes((prev) => {
      const newState = [...prev];
      newState[index] = { dislike: !prev[index]?.dislike, like: false };
      return newState;
    });
  };

  const handleLike = (index) => {
    setLikesDislikes((prev) => {
      const newState = [...prev];
      newState[index] = { like: !prev[index]?.like, dislike: false };
      return newState;
    });
  };

  useEffect(() => {
    if (documentId && studentId) {
      const authSocket = socketWithAuth({
        studentId,
        documentId,
        namespace: 'doc-chat'
      }).connect();

      setSocket(authSocket);
    }
  }, [studentId, documentId]);

  useEffect(() => {
    if (socket) {
      socket.on('ready', (ready) => {
        setReadyToChat(ready);
      });

      return () => socket.off('ready');
    }
  }, [socket]);

  useEffect(() => {
    if (socket) {
      socket.on('chat response end', (completeText) => {
        setLLMResponse('');
        setTimeout(
          () => setBotStatus('Philosopher, thinker, study companion.'),
          1000
        );
        // eslint-disable-next-line
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            text: completeText,
            isUser: false,
            isLoading: false,
            dislike: false,
            like: false
          }
        ]);
      });

      return () => socket.off('chat response end');
    }
  }, [socket]);

  useEffect(() => {
    if (socket) {
      socket.on('chat response start', async (token) => {
        setBotStatus('Typing...');

        setLLMResponse((llmResponse) => llmResponse + token);
      });

      return () => socket.off('chat response start');
    }
  }, [socket]);

  useEffect(() => {
    if (!summaryStart || !socket) return;

    const handleSummaryStart = (token) => {
      if (token) {
        setSummaryText((prevSummary) => prevSummary + token);
      }
    };

    socket.on('summary start', handleSummaryStart);

    // Cleanup listener when the component is unmounted or when dependencies change
    return () => socket.off('summary start', handleSummaryStart);
  }, [summaryStart, socket]);

  useEffect(() => {
    if (socket) {
      socket.on('summary end', async () => {
        setSummaryLoading(false);
      });

      return () => socket.off('summary end');
    }
  }, [socket]);

  useEffect(() => {
    const summaryNeeded =
      socket && readyToChat && chatHistoryLoaded && !messages?.length;
    if (summaryNeeded) {
      socket.emit('generate summary');
    }
  }, [readyToChat, socket, messages?.length, chatHistoryLoaded]);

  useEffect(() => {
    if (socket) {
      socket.on('summary_generation_error', async (data) => {
        setSummaryError(true);
        showToast(data.title, data.status);
      });

      return () => socket.off('summary_generation_error');
    }
  }, [socket]);

  useEffect(() => {
    if (summaryError) {
      socket.emit('summary_generation_error', {
        title:
          'Unable to process your request at this time. Please try again later.',
        status: 'error'
      });
    }
  }, [summaryError]);

  useEffect(() => {
    const response = async () =>
      await getToggleReaction({
        chatId,
        reactionType: isLike ? 'like' : 'dislike'
      }).catch((err) => {
        console.error(err);
      });
    response();
  }, [getToggleReaction, chatId, likesDislikes]);

  function showToast(title: string, status: string) {
    <CustomToast title={title} status={status} />;
  }

  useEffect(() => {
    const fetchSummary = async () => {
      const { summary } = await generateSummary({ documentId, studentId });
      setSummaryText(summary);
    };
    fetchSummary();
  }, [documentId, studentId]);

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      setInputValue(event.target.value);
    },
    [setInputValue]
  );

  const handleClickPrompt = useCallback(
    async (event: React.SyntheticEvent<HTMLDivElement>, prompt: string) => {
      event.preventDefault();

      setShowPrompt(!!messages?.length);

      setMessages((prevMessages) => [
        ...prevMessages,
        {
          text: prompt,
          isUser: true,
          isLoading: false,
          dislike: false,
          like: false
        }
      ]);

      socket.emit('chat message', prompt);
    },
    [socket, messages?.length]
  );

  const handleSendMessage = useCallback(
    async (event: React.SyntheticEvent<HTMLButtonElement>) => {
      event.preventDefault();

      if (inputValue.trim() === '') {
        return;
      }

      setShowPrompt(!!messages?.length);

      setMessages((prevMessages) => [
        ...prevMessages,
        {
          text: inputValue,
          isUser: true,
          isLoading: false,
          dislike: false,
          like: false
        }
      ]);
      setInputValue('');

      socket.emit('chat message', inputValue);
    },
    [inputValue, messages, socket]
  );

  const handleSendKeyword = useCallback(
    async (
      event: React.SyntheticEvent<HTMLSpanElement>,
      clickedKeyword: string
    ) => {
      event.preventDefault();

      const keywordText = `Tell me more about this keyword: ${clickedKeyword} in the context of this document. What is it's significance?`;

      try {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            text: `Tell me more about ${clickedKeyword} in the context of this document.`,
            isUser: true,
            isLoading: false,
            dislike: false,
            like: false
          }
        ]);
        socket.emit('chat message', keywordText);
      } catch (e) {
        console.log('ERROR', e);
      }
    },
    [socket]
  );

  const handleKeyDown = useCallback(
    (event: any) => {
      // If the key pressed was 'Enter', and the Shift key was not also held down
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault(); // Prevent a new line from being added to the textarea
        handleSendMessage(event);
      }
    },
    [handleSendMessage]
  );

  const handleSummary = useCallback(
    async (event: React.SyntheticEvent<HTMLButtonElement>) => {
      event.preventDefault();
      setSummaryStart(true);
      socket.emit('generate summary');
    },
    [socket]
  );

  const handleDeleteSummary = useCallback(async () => {
    try {
      const data = await deleteGeneratedSummary({
        documentId,
        studentId
      });
      if (data) {
        const fetchSummary = async () => {
          const { summary } = await generateSummary({ documentId, studentId });
          setSummaryText(summary);
          setSummaryStart(false);
        };
        fetchSummary();
      }
    } catch (error) {
      toast({
        render: () => (
          <CustomToast
            title="Unable to process your request at this time. Please try again later."
            status="error"
          />
        ),
        position: 'top-right',
        isClosable: true
      });
    }
  }, [documentId, studentId]);

  const onSwitchOnMobileView = useCallback(() => {
    setSwitchDocument((prevState) => !prevState);
  }, [setSwitchDocument]);

  const handlePinPrompt = useCallback(
    async ({ chatHistoryId = '', studentId = '' }) => {
      try {
        const response = await postPinnedPrompt({
          chatId: chatHistoryId,
          studentId
        });
        if (response) {
          setPinnedResponse(response);
          // You might want to toast a success message or handle the success response
          toast({
            render: () => (
              <CustomToast
                title="Chat prompt pinned successfully!"
                status="success"
              />
            ),
            position: 'top-right',
            isClosable: true
          });
        } else {
          // Handle the null response case
          toast({
            title: 'Failed to pin chat prompt',
            description: 'No response received from the server.',
            status: 'warning',
            duration: 5000,
            isClosable: true
          });
        }
      } catch (error) {
        // Handle errors here
        toast({
          title: 'An error occurred',
          description: error.message,
          status: 'error',
          duration: 5000,
          isClosable: true
        });
      }
    },
    []
  );

  const handleUpdateSummary = useCallback(async () => {
    setLoading(true);
    try {
      const request = await updateGeneratedSummary({
        documentId,
        studentId,
        summary: summaryText
      });
      if ([200, 201].includes(request.status)) {
        setLoading(true);
        setUpdatedSummary(true);
        setSummaryStart(false);
        toast({
          title: `Summary for ${documentId} has been updated successfully`,
          position: 'top-right',
          status: 'success',
          isClosable: true
        });

        const fetchSummary = async () => {
          const { summary } = await generateSummary({ documentId, studentId });
          setSummaryText(summary);
        };
        fetchSummary();
        setLoading(false);
      }
    } catch (error) {
      toast({
        render: () => (
          <CustomToast
            title="Unable to process your request at this time. Please try again later."
            status="error"
          />
        ),
        position: 'top-right',
        isClosable: true
      });
      setLoading(false);
    }
  }, [documentId, studentId, summaryText]);

  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const historyData = await chatHistory({
          documentId,
          studentId
        });

        const mappedData = historyData?.map((item) => ({
          text: item?.log.content,
          isUser: item?.log.role === 'user',
          isLoading: false,
          disliked: item?.disliked,
          liked: item?.liked,
          chatId: item?.id,
          isPinned: item?.isPinned
        }));

        setMessages(mappedData);
        // Set likesDislikes based on the fetched chat history
        setLikesDislikes(
          mappedData.map((message) => ({
            like: message.liked,
            dislike: message.disliked
          }))
        );
        setChatHistoryLoaded(true);
      } catch (error) {
        toast({
          render: () => (
            <CustomToast
              title="Failed to fetch chat history..."
              status="error"
            />
          ),
          position: 'top-right',
          isClosable: true
        });
      }
    };
    fetchChatHistory();
    if (pinnedResponse) {
      fetchChatHistory();
    }
  }, [documentId, studentId, pinnedResponse]);

  useEffect(() => setShowPrompt(!!messages?.length), [messages?.length]);

  useEffect(() => {
    const getHighlight = async () => {
      setLoading(true);
      const response = await getPDFHighlight({ documentId });
      setHightlightedText(response);
      setLoading(false);
    };
    getHighlight();
  }, [documentId]);

  useEffect(() => {
    if (!location.state?.documentUrl && !location.state?.docTitle) {
      // navigate('/dashboard/notes')
    }
  }, [navigate, location.state?.documentUrl, location.state?.docTitle]);

  useEffect(() => {
    if (summaryStart) {
      setSummaryLoading(true);
    } else {
      setSummaryLoading(false);
    }
  }, [summaryStart]);

  return (
    <section className="fixed max-w-screen-xl mx-auto divide-y">
      <div className="h-screen bg-white divide-y divide-gray-200 lg:grid lg:grid-cols-12 lg:divide-y-0 lg:divide-x">
        {!mobile && (
          <>
            {location.state?.documentUrl ? (
              <DocViewer
                pdfLink={location.state.documentUrl}
                pdfName={location.state.docTitle}
                documentId={documentId}
                hightlightedText={hightlightedText}
                setHightlightedText={setHightlightedText}
                selectedHighlightArea={selectedHighlightArea}
                setSelectedHighlightArea={setSelectedHighlightArea}
                setLoading={setLoading}
              />
            ) : (
              <div
                style={{
                  display: 'flex',
                  position: 'fixed',
                  paddingTop: '2em'
                }}
                className="flex-auto w-1/2 h-full lg:col-span-6"
              >
                <div style={{ width: '87%' }}>
                  <BlockNoteView editor={editor} />
                </div>
              </div>
            )}
          </>
        )}
        {!mobile && (
          <Chat
            isShowPrompt={isShowPrompt}
            isReadyToChat={readyToChat}
            messages={messages}
            llmResponse={llmResponse}
            botStatus={botStatus}
            handleSendMessage={handleSendMessage}
            handleSendKeyword={handleSendKeyword}
            handleInputChange={handleInputChange}
            inputValue={inputValue}
            handleKeyDown={handleKeyDown}
            handleSummary={handleSummary}
            summaryLoading={summaryLoading}
            summaryText={summaryText}
            setSummaryText={setSummaryText}
            documentId={documentId}
            docKeywords={docKeywords}
            title={title}
            handleClickPrompt={handleClickPrompt}
            handleDeleteSummary={handleDeleteSummary}
            handleUpdateSummary={handleUpdateSummary}
            hightlightedText={hightlightedText}
            setSelectedHighlightArea={setSelectedHighlightArea}
            loading={loading}
            isUpdatedSummary={isUpdatedSummary}
            directStudentId={directStudentId}
            onSwitchOnMobileView={onSwitchOnMobileView}
            handleDislike={handleDislike}
            handleLike={handleLike}
            likesDislikes={likesDislikes}
            setChatId={setChatId}
            handlePinPrompt={handlePinPrompt}
            studentId={studentId}
          />
        )}

        {mobile && switchDocument ? (
          <>
            {location.state?.documentUrl ? (
              <DocViewer
                pdfLink={location.state.documentUrl}
                pdfName={location.state.docTitle}
                documentId={documentId}
                hightlightedText={hightlightedText}
                setHightlightedText={setHightlightedText}
                selectedHighlightArea={selectedHighlightArea}
                setSelectedHighlightArea={setSelectedHighlightArea}
                setLoading={setLoading}
              />
            ) : (
              <div
                style={{
                  display: 'flex',
                  position: 'fixed',
                  paddingTop: '2em'
                }}
                className="flex-auto w-1/2 h-full lg:col-span-6"
              >
                <div style={{ width: '87%' }}>
                  <BlockNoteView editor={editor} />
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            <Chat
              isShowPrompt={isShowPrompt}
              isReadyToChat={readyToChat}
              messages={messages}
              llmResponse={llmResponse}
              botStatus={botStatus}
              handleSendMessage={handleSendMessage}
              handleSendKeyword={handleSendKeyword}
              handleInputChange={handleInputChange}
              inputValue={inputValue}
              handleKeyDown={handleKeyDown}
              handleSummary={handleSummary}
              summaryLoading={summaryLoading}
              summaryText={summaryText}
              setSummaryText={setSummaryText}
              documentId={documentId}
              docKeywords={docKeywords}
              title={title}
              handleClickPrompt={handleClickPrompt}
              handleDeleteSummary={handleDeleteSummary}
              handleUpdateSummary={handleUpdateSummary}
              hightlightedText={hightlightedText}
              setSelectedHighlightArea={setSelectedHighlightArea}
              loading={loading}
              isUpdatedSummary={isUpdatedSummary}
              directStudentId={directStudentId}
              onSwitchOnMobileView={onSwitchOnMobileView}
              handleDislike={handleDislike}
              handleLike={handleLike}
              likesDislikes={likesDislikes}
              setChatId={setChatId}
              handlePinPrompt={handlePinPrompt}
              studentId={studentId}
            />
          </>
        )}
      </div>
    </section>
    // )
  );
}
