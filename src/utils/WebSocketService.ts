import {
  ChatRoomNurse,
  CreateMessageResponse,
} from '../lib/schemas/nurse.schemea';
import EventBus from './EventBus';

let socket: WebSocket | null = null;

export const initWebSocket = (username: string, role: string) => {
  const WS_URL = `ws://10.0.2.2:8080/api/v1/pharmacy/ws-chats?username=${username}&role=${role}`;
  console.log('🌐 Kết nối WebSocket tới:', WS_URL);

  socket = new WebSocket(WS_URL);

  socket.onopen = () => console.log('✅ WebSocket connected');
  socket.onmessage = event => {
    try {
      const msg = JSON.parse(event.data);
      console.log('📨 Received WebSocket message:', msg);

      if (msg?.roomId && msg?.messageId) {
        // Đây là tin nhắn
        EventBus.emit('new-message', msg);
      } else if (msg?.roomId && msg?.lastMessage) {
        // Đây là chatroom notification
        EventBus.emit('chatroom-notification', msg);
      } else {
        console.warn('❓ Unknown message type:', msg);
      }
    } catch (error) {
      console.error('❌ Error parsing message:', error);
    }
  };  

  socket.onerror = error => console.error('❌ WebSocket error:', error);
  socket.onclose = () => console.log('🔌 WebSocket disconnected');
};

export const closeWebSocket = () => {
  if (socket) {
    socket.close();
    socket = null;
  }
};
