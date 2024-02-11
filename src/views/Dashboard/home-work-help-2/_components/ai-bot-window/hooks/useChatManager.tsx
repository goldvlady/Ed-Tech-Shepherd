import { useState, useEffect, useRef, useCallback } from 'react';
import io, { Socket } from 'socket.io-client';
import { useQueryClient } from '@tanstack/react-query';
import ApiService from '../../../../../../services/ApiService';
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

type InitConversationOptions = {
  conversationInitializer: string;
  isNewConversation: boolean;
};

const debugLog = (code: string, message?: any) => {
  message = message ? `: ${message}` : '';
  if (process.env.NODE_ENV === 'development') {
    console.log(`${code.toUpperCase()} ${message}`);
  }
};

const useChatManager = (namespace: string) => {
  const user = useUserStore((state) => state.user);
  const studentId = user?._id;
  const queryClient = useQueryClient();

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
        debugLog('SEND MESSAGE', message);
        return;
      }
      const newMessage = formatMessage(message);
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      socketRef.current.emit('chat message', message); // Emitting the message to the server
      debugLog('SEND MESSAGE', message);
    },
    [formatMessage]
  );

  // useCallback for fetching chat history from the server
  const fetchHistory = useCallback(
    async (limit: number, offset: number, convoId?: string) => {
      const id = convoId || conversationId;

      if (!socketRef.current || !id) {
        console.error(
          'Socket is not initialized or conversationId is not set.'
        );
        return;
      }
      debugLog('FETCH HISTORY', { limit, offset });
      const data = await ApiService.getConversionById({ conversationId: id });
      console.log(data);
      setMessages((prev) => ({ ...prev }));

      // socketRef.current.emit('fetch_history', { limit, offset });
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
      debugLog('EVENT LISTENER ADDED', event);
    },
    []
  );

  const refreshManager = () => {
    setMessages([]);
    setCurrentChat('');
    setConversationId(null);
  };

  // useCallback for emitting custom events through the socket
  const emitEvent = useCallback((event: string, data?: any) => {
    if (!socketRef.current) {
      console.error('Socket is not initialized, unable to emit event.');
      return;
    }
    socketRef.current.emit(event, data);
    debugLog('EMIT EVENT', event);
  }, []);

  // Setup initial socket listeners and handlers for chat events
  const setupSocketListeners = useCallback(
    (options?: InitConversationOptions) => {
      if (!socketRef.current) return;
      const { conversationInitializer, isNewConversation } = options || {};

      // Event listener for socket connection
      socketRef.current.on('connect', () => {
        console.log('Socket connected:', socketRef.current?.id);
        debugLog('SOCKET CONNECTED', socketRef.current?.id);
        // refreshManager();
      });

      // Handlers for chat response start and end, updating chat state accordingly
      socketRef.current.on('chat response start', (token: string) => {
        setCurrentChat((prevChat) => prevChat + token);
        // forceUpdate(); // Force update to render changes
        debugLog('CHAT RESPONSE START', token);
      });

      socketRef.current.on('chat response end', (newMessage: string) => {
        setMessages((prevMessages) => [
          ...prevMessages,
          formatMessage(newMessage, 'assistant')
        ]);
        setCurrentChat('');
        debugLog('CHAT RESPONSE END', newMessage);
      });

      socketRef.current.on('fetch_history_error', (error) => {
        console.log(error);
        debugLog('FETCH HISTORY ERROR', error);
      });

      // Handler for when the AI model is ready, fetching history or starting new conversation
      socketRef.current.on('ready', () => {
        debugLog('AI MODEL READY');
        if (isNewConversation) {
          debugLog('INITIALIZING NEW CONVERSATION BEFORE HISTORY FETCH');
          sendMessage(conversationInitializer);
        }
      });

      // Handler for receiving chat history from the server
      socketRef.current.on('chat_history', (chatHistoryJson: string) => {
        const chatHistory = JSON.parse(chatHistoryJson) as ChatMessage[];
        const startConversation = [
          !chatHistory.length,
          conversationInitializer,
          !isNewConversation
        ].every(Boolean);

        if (startConversation) {
          sendMessage(conversationInitializer);
        }
        setMessages((prev) => [...chatHistory, ...prev]);
        debugLog('CHAT HISTORY', chatHistory);
      });

      // Handler for setting the current conversation ID
      socketRef.current.on('current_conversation', (id: string) => {
        console.log('current_conversation_id', id);

        setConversationId(id);
        debugLog('CURRENT CONVERSATION', id);
      });
    },
    [fetchHistory, formatMessage, forceUpdate, sendMessage]
  );

  // Initialize and configure the socket connection
  const initiateSocket = useCallback(
    (
      queryParams: Record<string, any>,
      conversationOptions?: InitConversationOptions
    ) => {
      if (socketRef.current) {
        socketRef.current.disconnect(); // Disconnect existing socket
      }

      // Initialize new socket connection with server
      socketRef.current = io(SERVER_URL + '/' + namespace, {
        extraHeaders: {
          'x-shepherd-header': HEADER_KEY // Example custom header
        },
        auth: (cb) => cb(queryParams) // Authentication with query parameters
      }).connect();

      debugLog('SOCKET CONNECTED', socketRef.current.id);

      // Setup socket listeners with optional conversation starter
      setupSocketListeners(conversationOptions);
    },
    [setupSocketListeners]
  );

  // Function to start a new conversation
  const startConversation = useCallback(
    (
      queryParams: Record<string, any>,
      conversationOptions?: InitConversationOptions
    ) => {
      const { conversationId } = queryParams;
      refreshManager();
      initiateSocket(queryParams, conversationOptions); // Initiate socket with queryParams
      if (conversationId) {
        fetchHistory(30, 0, conversationId);
      }
      debugLog('CONVERSATION STARTED');
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
