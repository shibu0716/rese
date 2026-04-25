import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import rateLimit from 'express-rate-limit';

import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import matchRoutes from './routes/matchRoutes.js';
import betRoutes from './routes/betRoutes.js';
import gameRoutes from './routes/gameRoutes.js';
import { errorMiddleware } from './middleware/errorMiddleware.js';
import { seedMatchesIfEmpty } from './services/matchService.js';
import { setupSimulationEngine } from './sockets/simulationSocket.js';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST']
  }
});

app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());
app.use(
  '/api',
  rateLimit({
    windowMs: 60 * 1000,
    max: 120,
    standardHeaders: true,
    legacyHeaders: false
  })
);

app.get('/health', (req, res) => res.json({ ok: true }));
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/bet', betRoutes);
app.use('/api/game', gameRoutes);
app.use(errorMiddleware);

io.on('connection', (socket) => {
  socket.emit('connected', { message: 'PlaySim Arena socket connected' });
});

const PORT = process.env.PORT || 5000;

const bootstrap = async () => {
  await connectDB();
  await seedMatchesIfEmpty();
  setupSimulationEngine(io);
  server.listen(PORT, () => console.log(`Server listening on ${PORT}`));
};

bootstrap();
