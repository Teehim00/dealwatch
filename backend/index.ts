// backend/index.ts
import Fastify from 'fastify';
import fastifyIO from 'fastify-socket.io';
import cors from '@fastify/cors';
import { Socket, Server as IOServer } from 'socket.io';

// 👇 Add this to extend FastifyInstance to include `io`
declare module 'fastify' {
  interface FastifyInstance {
    io: IOServer;
  }
}

async function buildServer() {
  const app = Fastify();

  // ✅ Enable CORS
  await app.register(cors, {
    origin: ['http://localhost:3000'],
    credentials: true,
  });

  // ✅ Register Socket.IO with CORS support
  await app.register(fastifyIO, {
    cors: {
      origin: ['http://localhost:3000'],
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  // ✅ Sample root route
  app.get('/', async () => {
    return { message: 'DealWatch Backend API is running 🎉' };
  });

  // ✅ Sample API route
  app.get('/api/deals', async (req, reply) => {
    const { store, sort } = req.query as { store?: string; sort?: string };

    let data = [
      { id: 1, title: 'iPhone 15 ลดราคา', store: 'Shopee', price: 28900 },
      { id: 2, title: 'หูฟังลด 60%', store: 'Lazada', price: 990 },
      { id: 3, title: 'PowerBank ลดราคา', store: 'Shopee', price: 590 },
    ];

    if (store) {
      data = data.filter(d => d.store === store);
    }

    if (sort === 'price_asc') {
      data.sort((a, b) => a.price - b.price);
    } else if (sort === 'price_desc') {
      data.sort((a, b) => b.price - a.price);
    }

    return data;
  });

  // ✅ Sample API route
  app.get('/api/stores', async (req, reply) => {
    const stores = [
      { id: 1, name: 'Shopee', logo: 'https://placehold.co/64x64', dealCount: 5 },
      { id: 2, name: 'Lazada', logo: 'https://placehold.co/64x64', dealCount: 8 },
      { id: 3, name: 'JD Central', logo: 'https://placehold.co/64x64', dealCount: 4 },
    ];
    return stores;
  });

  // ✅ Handle WebSocket connection
  app.ready().then(() => {
    app.io.on('connection', (socket: Socket) => {
      console.log('✅ Socket connected:', socket.id);

      socket.on('message', (msg: string) => {
        console.log('💬 Received Test:', msg);
        app.io.emit('message', msg); // Broadcast to all clients
      });

      socket.on('disconnect', () => {
        console.log('❌ Socket disconnected:', socket.id);
      });
    });
  });

  // ✅ Start server
  try {
    await app.listen({ port: 3001, host: '0.0.0.0' });
    console.log('🚀 Backend running at http://localhost:3001');
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

// ✅ Run the server
buildServer();
