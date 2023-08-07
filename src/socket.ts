import { SOCKET_URL } from './config';
import io from 'socket.io-client';

const socketWithAuth = (payload: { studentId: string; documentId: string }) =>
  io(SOCKET_URL, {
    extraHeaders: {
      'x-shepherd-header': 'vunderkind23'
    },
    autoConnect: false,
    auth: (cb) => {
      cb(payload);
    }
  });

export default socketWithAuth;
