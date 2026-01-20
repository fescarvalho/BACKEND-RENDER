import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3"; // Adicionado DeleteObjectCommand
import { Upload } from "@aws-sdk/lib-storage";
import multer from "multer";

// 1. Configuração do Multer
export const uploadConfig = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // Limite de 10MB
  },
});

// 2. Conexão com o Cloudflare R2
const r2Client = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

// 3. Função de Upload (Já existia)
export const uploadToR2 = async (
  file: Express.Multer.File, 
  officeId: string, 
  userId: string
): Promise<string> => {
  const fileName = `${officeId}/${userId}/${Date.now()}-${file.originalname}`;
  const bucketName = process.env.R2_BUCKET_NAME;

  try {
    const upload = new Upload({
      client: r2Client,
      params: {
        Bucket: bucketName,
        Key: fileName,
        Body: file.buffer,
        ContentType: file.mimetype,
      },
    });

    await upload.done();
    return `${process.env.R2_PUBLIC_URL}/${fileName}`;
    
  } catch (error) {
    console.error("Erro no upload para R2:", error);
    throw new Error("Falha ao salvar arquivo no storage.");
  }
};

// 4. Função de Deletar (NOVA - O erro sumirá ao adicionar isso) ✅
export const deleteFromR2 = async (fileUrl: string): Promise<void> => {
  try {
    // Se a URL for nula ou vazia, ignora
    if (!fileUrl) return;

    // A URL vem como: https://pub-xxx.r2.dev/office/user/arquivo.pdf
    // O R2 precisa apenas da parte final: office/user/arquivo.pdf
    
    const baseUrl = `${process.env.R2_PUBLIC_URL}/`;
    // Removemos a parte inicial da URL para sobrar só o caminho do arquivo (Key)
    const fileKey = fileUrl.replace(baseUrl, "");

    const deleteParams = {
      Bucket: process.env.R2_BUCKET_NAME,
      Key: fileKey,
    };

    console.log(`🗑️ Tentando deletar do R2: ${fileKey}`);

    await r2Client.send(new DeleteObjectCommand(deleteParams));
    
    console.log(`✅ Arquivo deletado com sucesso.`);
    
  } catch (error) {
    console.error("Erro ao deletar do R2 (Não crítico):", error);
    // Não jogamos erro (throw) para não travar a deleção do usuário no banco
  }
};