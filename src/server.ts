import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';

import authRoutes from './infra/http/routes/auth.routes'; 
import docsRoutes from './infra/http/routes/docs.routes';
import adminRoutes from './infra/http/routes/admin.routes';

import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import { createServer } from 'http';
import { Server } from 'socket.io';


(BigInt.prototype as any).toJSON = function () {
  return Number(this);
};

const app = express();
const httpServer = createServer(app);

app.use(helmet());


const allowedOrigins = [
  'https://leandro-abreu-contabilidade.vercel.app',
  'https://backend-render-m0x6.onrender.com',       
  'http://localhost:8080', 
  'http://localhost:5173',
  'http://localhost:3000'
];

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: "Muitas tentativas de acesso vindas deste IP, tente novamente em 15 minutos."
});


const io = new Server(httpServer, {
  cors: {
    origin: '*', 
    methods: ["GET", "POST"],
    credentials: true
  },
  transports: ['websocket', 'polling'] 
});

io.on("connection", (socket) => {
  console.log(`🔌 Cliente conectado: ${socket.id}`);
  
  socket.on("join_room", (userId) => {
    socket.join(`user_${userId}`);
    console.log(`👤 User ${userId} entrou na sala.`);
  });
});

export { io };

app.set('trust proxy', 1);
app.use(limiter);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'A política de CORS deste site não permite acesso desta origem.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());


console.log("Carregando rotas da INFRA...");
app.use("/auth", authRoutes);
app.use("/api", docsRoutes);
app.use("/admin", adminRoutes);

app.get("/", (req, res) => {
  res.json({ status: "Online", msg: "API Rodando 🚀" });
});

const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () => {
  console.log(`🚀 SERVIDOR RODANDO NA PORTA ${PORT}`);
});