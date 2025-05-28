// backend/index.ts
import Fastify from 'fastify';
import fastifyIO from 'fastify-socket.io';
import cors from '@fastify/cors';
import { Socket, Server as IOServer } from 'socket.io';

declare module 'fastify' {
  interface FastifyInstance {
    io: IOServer;
  }
}

type ChatMessage = {
  user: string;
  message: string;
  timestamp: string;
  replyTo?: ChatMessage;
};

const chatMessages: ChatMessage[] = [];

async function buildServer() {
  const app = Fastify();

  await app.register(cors, {
    origin: ['http://localhost:3000'],
    credentials: true,
  });

  await app.register(fastifyIO, {
    cors: {
      origin: ['http://localhost:3000'],
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  app.get('/', async () => {
    return { message: 'DealWatch Backend API is running 🎉' };
  });

  app.get('/api/deals', async (req, reply) => {
    const { store, sort } = req.query as { store?: string; sort?: string };

    let data = [
      { id: 1, title: 'iPhone 15 ลดราคา', store: 'Shopee', price: 28900 },
      { id: 2, title: 'หูฟังลด 60%', store: 'Lazada', price: 990 },
      { id: 3, title: 'PowerBank ลดราคา', store: 'Shopee', price: 590 },
    ];

    if (store) data = data.filter(d => d.store === store);
    if (sort === 'price_asc') data.sort((a, b) => a.price - b.price);
    else if (sort === 'price_desc') data.sort((a, b) => b.price - a.price);

    return data;
  });

  app.get('/api/stores', async (req, reply) => {
    return [
      { id: 1, name: 'Shopee', logo: 'https://placehold.co/64x64', dealCount: 5 },
      { id: 2, name: 'Lazada', logo: 'https://placehold.co/64x64', dealCount: 8 },
      { id: 3, name: 'JD Central', logo: 'https://placehold.co/64x64', dealCount: 4 },
    ];
  });

  // ✅ MOCK SCRAPER: /api/scrape
  app.get('/api/scrape', async (req, reply) => {
    const mockScrapedDeals = [
      {
        id: 101,
        title: 'iPhone 15 Pro Max',
        price: 48990,
        store: 'Apple TH',
        image: 'https://dummyimage.com/600x400/000/fff&text=iPhone+15',
        link: 'https://www.apple.com/th/iphone-15-pro/',
      },
      {
        id: 102,
        title: 'Galaxy S24 Ultra',
        price: 42900,
        store: 'Samsung TH',
        image: 'https://dummyimage.com/600x400/000/fff&text=Galaxy+S24',
        link: 'https://www.samsung.com/th/smartphones/galaxy-s24-ultra/',
      },
    ];

    return reply.send(mockScrapedDeals);
  });

  app.ready().then(() => {
    app.io.on('connection', (socket: Socket) => {
      console.log('✅ Socket connected:', socket.id);

      socket.emit('chatHistory', chatMessages);

      socket.on('message', (msg: ChatMessage) => {
        chatMessages.push(msg);
        app.io.emit('message', msg);
        console.log('💬 New message:', msg);
      });

      socket.on('disconnect', () => {
        console.log('❌ Socket disconnected:', socket.id);
      });
    });
  });

  try {
    await app.listen({ port: 3001, host: '0.0.0.0' });
    console.log('🚀 Backend running at http://localhost:3001');
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

buildServer();
