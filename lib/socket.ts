// lib/socket.ts
import { io } from 'socket.io-client';

const socket = io('http://localhost:3001'); // เปลี่ยนตาม env/deploy

export default socket;
