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
import ownerRoutes from './routes/ownerRoutes.js';
import { errorMiddleware } from './middleware/errorMiddleware.js';
import { seedMatchesIfEmpty } from './services/matchService.js';
import { setupSimulationEngine } from './sockets/simulationSocket.js';

const app = express();
const server = http.createServer(app);
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:3000')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST']
  },
  maxHttpBufferSize: 1e6,
  pingTimeout: 20000,
  pingInterval: 25000
});

app.set('trust proxy', 1);
app.use(cors({ origin: allowedOrigins }));
app.use(express.json({ limit: '32kb' }));
app.use(
  '/api',
  rateLimit({
    windowMs: 60 * 1000,
    max: Number(process.env.API_RATE_LIMIT_PER_MINUTE || 600),
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
app.use('/api/owner', ownerRoutes);
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
