
import dotenv from "dotenv";
import express from "express";
import cors from "cors";


import authRoutes from "../infra/http/routes/auth.routes";
import docsRoutes from "../infra/http/routes/docs.routes";
import adminRoutes from "../infra/http/routes/admin.routes";

dotenv.config();

const app = express();

(BigInt.prototype as any).toJSON = function () {
  return Number(this);
};


app.use(cors());
app.use(express.json());



app.use("/auth", authRoutes);       
app.use("/api", docsRoutes);        
app.use("/admin", adminRoutes);     


app.get("/", (req, res) => {
  return res.json({ msg: "API Contabilidade (Clean Arch) - Online 🚀" });
});


const PORT = process.env.PORT || 3333;

app.listen(PORT, () => {
  console.log(`🔥 Servidor rodando na porta ${PORT}`);
  console.log(`📁 Estrutura: Clean Architecture`);
});