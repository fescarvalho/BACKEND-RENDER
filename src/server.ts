// ... (imports e configurações iniciais iguais) ...

const app = express();
const httpServer = createServer(app); // ✅ Criamos o servidor HTTP

// ... (middlewares, cors, rotas iguais) ...

// ✅ CONFIGURAÇÃO DO SOCKET.IO (IMPORTANTE)
const io = new Server(httpServer, {
  cors: {
    // No Render, você precisa liberar explicitamente o seu Frontend da Vercel
    origin: [
      "https://leandro-abreu-contabilidade.vercel.app", // Seu Front na Vercel
      "http://localhost:5173" // Seu teste local
    ],
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log(`🔌 Cliente conectado: ${socket.id}`);
  
  socket.on("join_room", (userId) => {
    socket.join(`user_${userId}`);
    console.log(`👤 User ${userId} entrou na sala.`);
  });
});

export { io };

// ... (restante das configurações do app) ...

const PORT = process.env.PORT || 3000;

// ✅ LIMPEZA: Remova 'export default app' e use apenas o listen simples
httpServer.listen(PORT, () => {
  console.log(`🚀 SERVIDOR RODANDO NA PORTA ${PORT}`);
});