import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { IStorageProvider } from "../../../domain/providers/IStorageProvider";

export class R2StorageProvider implements IStorageProvider {
  private client: S3Client;
  private bucketName: string;
  private publicUrl: string;

  constructor() {
    this.bucketName = process.env.R2_BUCKET_NAME!;
    this.publicUrl = process.env.R2_PUBLIC_URL!;

    this.client = new S3Client({
      region: "auto",
      endpoint: process.env.R2_ENDPOINT,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID!,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
      },
    });
  }

  async save(file: Buffer, path: string, mimetype: string): Promise<string> {
    try {
      const upload = new Upload({
        client: this.client,
        params: {
          Bucket: this.bucketName,
          Key: path,
          Body: file,
          ContentType: mimetype,
        },
      });

      await upload.done();
      return `${this.publicUrl}/${path}`;
    } catch (error) {
      console.error("Erro no upload para R2:", error);
      throw new Error("Falha ao salvar arquivo no storage.");
    }
  }

  async delete(fileUrl: string): Promise<void> {
    try {
      if (!fileUrl) return;

      
      
      const fileKey = fileUrl.replace(`${this.publicUrl}/`, "");

      await this.client.send(
        new DeleteObjectCommand({
          Bucket: this.bucketName,
          Key: fileKey,
        })
      );

      console.log(`✅ Arquivo deletado do R2: ${fileKey}`);
    } catch (error) {
      console.error("Erro não crítico ao deletar do R2:", error);
    }
  }
}