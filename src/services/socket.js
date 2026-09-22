import { io } from 'socket.io-client';

const socket = io(import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:5000', {
  transports: ['websocket'],
  autoConnect: true,
});

export const connectSocket = () => {
  if (!socket.connected) socket.connect();
  return socket;
};

export const disconnectSocket = () => {
  if (socket.connected) socket.disconnect();
};

export default socket;
