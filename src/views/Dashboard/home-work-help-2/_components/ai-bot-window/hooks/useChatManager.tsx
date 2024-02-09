import { useState, useEffect, useRef, useCallback } from 'react';
import io, { Socket } from 'socket.io-client';
import useUserStore from '../../../../../../state/userStore';
import { HEADER_KEY } from '../../../../../../config';

// Fixed server URL for the WebSocket connection
const SERVER_URL = 'https://ai.shepherd.study';

// Interface definitions for the chat log and chat message structures
interface ChatLog {
  role: 'assistant' | 'user';
  content: string;
}

interface ChatMessage {
  id: number;
  studentId: string;
  log: ChatLog;
  liked: boolean;
  disliked: boolean;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
  conversationId: string;
}

const useChatManager = () => {
  const user = useUserStore((state) => state.user);
  const studentId = user?._id;
  // State hooks for managing chat messages, current chat content, and conversation ID
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentChat, setCurrentChat] = useState<string>('');
  const [conversationId, setConversationId] = useState<string | null>(null);

  // useRef to hold a persistent reference to the socket connection
  const socketRef = useRef<Socket | null>(null);

  // Helper function to force component update by updating a state that is not used elsewhere
  const [, updateState] = useState({});
  const forceUpdate = useCallback(() => updateState({}), []);

  // useEffect hook for cleanup on component unmount to disconnect the socket
  useEffect(() => {
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  // useCallback for formatting messages before they are sent or stored
  const formatMessage = useCallback(
    (message: string, role: 'assistant' | 'user' = 'user'): ChatMessage => {
      return {
        id: Date.now(), // Simplified ID generation, should be unique in a real application
        studentId: studentId, // Placeholder, replace with dynamic student ID
        log: { role, content: message },
        liked: false,
        disliked: false,
        isPinned: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        conversationId: conversationId || 'unknown' // Use current conversationId or fallback
      };
    },
    [conversationId]
  );

  // useCallback for sending messages through the WebSocket and updating the local state
  const sendMessage = useCallback(
    (message: string) => {
      if (!socketRef.current) {
        console.error('Socket is not initialized.');
        return;
      }
      const newMessage = formatMessage(message);
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      socketRef.current.emit('chat message', message); // Emitting the message to the server
    },
    [formatMessage]
  );

  // useCallback for fetching chat history from the server
  const fetchHistory = useCallback(
    (limit: number, offset: number, convoId?: string) => {
      const hasConvoId = [convoId, conversationId].some(Boolean);
      if (!socketRef.current || !hasConvoId) {
        console.error(
          'Socket is not initialized or conversationId is not set.'
        );
        return;
      }
      console.log('Emitted');
      socketRef.current.emit('fetch_history', { limit, offset });
    },
    [conversationId]
  );

  // useCallback for adding custom event listeners to the socket
  const onEvent = useCallback(
    (event: string, handler: (...args: any[]) => void) => {
      if (!socketRef.current) {
        console.warn(
          'Socket not initialized, unable to attach event listener.'
        );
        return;
      }
      socketRef.current.on(event, handler);
    },
    []
  );

  // useCallback for emitting custom events through the socket
  const emitEvent = useCallback((event: string, data?: any) => {
    if (!socketRef.current) {
      console.error('Socket is not initialized, unable to emit event.');
      return;
    }
    socketRef.current.emit(event, data);
  }, []);

  // Setup initial socket listeners and handlers for chat events
  const setupSocketListeners = useCallback(
    (conversationInitializer?: string) => {
      if (!socketRef.current) return;

      // Event listener for socket connection
      socketRef.current.on('connect', () => {
        console.log('Socket connected:', socketRef.current?.id);
      });

      // Handlers for chat response start and end, updating chat state accordingly
      socketRef.current.on('chat response start', (token: string) => {
        setCurrentChat((prevChat) => prevChat + token);
        // forceUpdate(); // Force update to render changes
      });

      socketRef.current.on('chat response end', (newMessage: string) => {
        setMessages((prevMessages) => [
          ...prevMessages,
          formatMessage(newMessage, 'assistant')
        ]);
        setCurrentChat('');
      });

      socketRef.current.on('fetch_history_error', (error) => {
        console.log(error);
      });

      // Handler for when the AI model is ready, fetching history or starting new conversation
      socketRef.current.on('ready', () => {
        console.log('AI model is ready to interact.');
      });

      // Handler for receiving chat history from the server
      socketRef.current.on('chat_history', (chatHistoryJson: string) => {
        const chatHistory = JSON.parse(chatHistoryJson) as ChatMessage[];
        console.log('chat history', chatHistory);
        if (!chatHistory.length && conversationInitializer) {
          sendMessage(conversationInitializer);
        }
        setMessages((prev) => [...chatHistory, ...prev]);
      });

      // Handler for setting the current conversation ID
      socketRef.current.on('current_conversation', (id: string) => {
        console.log('current_conversation_id', id);
        setConversationId(id);
        if (conversationInitializer) {
          console.log('refetching history', conversationInitializer);
          fetchHistory(30, 0, id); // Fetch initial chat history
        }
      });
    },
    [fetchHistory, formatMessage, forceUpdate, sendMessage]
  );

  // Initialize and configure the socket connection
  const initiateSocket = useCallback(
    (queryParams: Record<string, any>, conversationInitializer?: string) => {
      if (socketRef.current) {
        socketRef.current.disconnect(); // Disconnect existing socket
      }
      if (!queryParams.namespace) {
        console.error('NO NAMESPACE IN YOUR QUERY PARAMS');
      }

      // Initialize new socket connection with server
      socketRef.current = io(SERVER_URL + '/' + queryParams.namespace, {
        extraHeaders: {
          'x-shepherd-header': HEADER_KEY // Example custom header
        },
        auth: (cb) => cb(queryParams) // Authentication with query parameters
      }).connect();

      // Setup socket listeners with optional conversation starter
      setupSocketListeners(conversationInitializer);
    },
    [setupSocketListeners]
  );

  // Function to start a new conversation
  const startConversation = useCallback(
    (queryParams: Record<string, any>, conversationInitializer?: string) => {
      initiateSocket(queryParams, conversationInitializer); // Initiate socket with queryParams
    },
    [initiateSocket]
  );

  // Returning hook state and functions to manage chat
  return {
    messages,
    currentChat,
    conversationId,
    startConversation,
    sendMessage,
    fetchHistory,
    onEvent,
    emitEvent,
    currentSocket: socketRef?.current
  };
};

export default useChatManager;
