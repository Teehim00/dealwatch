// import type { Socket } from 'socket.io'

// export function registerSocketEvents(socket: Socket, io: any) {
//   console.log('✅ Socket connected:', socket.id)

//   socket.on('message', (msg: string) => {
//     console.log('📨 Message received:', msg)
//     io.emit('message', msg) // broadcast ไปทุก client
//   })
// }

// socket/handlers.ts
import { Socket, Server as IOServer } from 'socket.io';

export function registerSocketEvents(socket: Socket, io: IOServer) {
  console.log('🧠 Socket connected:', socket.id);

  socket.on('message', (msg: string) => {
    console.log('📩 Message received:', msg);
    io.emit('message', msg);
  });

  socket.on('disconnect', () => {
    console.log('❌ Socket disconnected:', socket.id);
  });
}
