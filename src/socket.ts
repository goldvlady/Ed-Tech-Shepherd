import { AI_API, HEADER_KEY } from './config';
import io from 'socket.io-client';

const socketWithAuth = (payload: { studentId: string; documentId: string }) =>
  io(AI_API, {
    extraHeaders: {
      'x-shepherd-header': HEADER_KEY
    },
    autoConnect: false,
    auth: (cb) => {
      cb(payload);
    }
  });

export default socketWithAuth;
