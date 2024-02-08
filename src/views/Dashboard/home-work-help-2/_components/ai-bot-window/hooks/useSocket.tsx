import { useRef, useEffect, useState } from 'react';
import socketWithAuth from '../../../../../../socket';

function useSocket() {
  const socketRef = useRef(null);
  const SHALL_WE_BEGIN = 'Shall we begin, Socrates?'; // replace with actual value
  const [readyToChat, setReadyToChat] = useState(false);
  const [botStatus, setBotStatus] = useState('');
  const [llmResponse, setLLMResponse] = useState('');
  const [messages, setMessages] = useState([]);

  //   1st step is to initiate the socket connection
  const initiateSocket = ({
    documentId,
    studentId,
    topic,
    subject
  }: {
    documentId?: string;
    studentId: string;
    topic: string;
    subject: string;
  }) => {
    socketRef.current = socketWithAuth({
      studentId,
      topic,
      subject,
      documentId,
      namespace: 'homework-help'
    }).connect();
    console.log('socketRef.current', socketRef.current);
  };

  //  2nd step is to listen for the ready event from the server. Once the server is ready, we can start the chat
  useEffect(() => {
    const socket = socketRef.current;
    if (socket && !messages.length) {
      socket.on('ready', (ready) => {
        setReadyToChat(ready);
        if (!messages.length) {
          socket.emit('chat message', SHALL_WE_BEGIN);
          console.log('SHALL_WE_BEGIN', SHALL_WE_BEGIN);
        }
      });
      return () => socket.off('ready');
    }
  }, [messages]);

  useEffect(() => {
    const socket = socketRef.current;
    if (socket) {
      socket.on('chat response start', async (token: string) => {
        setBotStatus('Typing...');
        setLLMResponse((prevResponse) => prevResponse + token);
        console.log('chat response start', token);
      });
      return () => socket.off('chat response start');
    }
  }, []);

  useEffect(() => {
    const socket = socketRef.current;
    if (socket) {
      socket.on('chat response end', (completeText) => {
        setLLMResponse('');
        setTimeout(
          () => setBotStatus('Philosopher, thinker, study companion.'),
          1000
        );
        console.log('chat response end', completeText);
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: completeText, isUser: false, isLoading: false }
        ]);
      });
      return () => socket.off('chat response end');
    }
  }, []);

  useEffect(() => {
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);

  return { initiateSocket, readyToChat, botStatus, llmResponse, messages };
}

export default useSocket;
