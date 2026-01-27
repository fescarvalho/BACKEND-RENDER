"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.R2StorageProvider = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const lib_storage_1 = require("@aws-sdk/lib-storage");
class R2StorageProvider {
    constructor() {
        this.bucketName = process.env.R2_BUCKET_NAME;
        this.publicUrl = process.env.R2_PUBLIC_URL;
        this.client = new client_s3_1.S3Client({
            region: "auto",
            endpoint: process.env.R2_ENDPOINT,
            credentials: {
                accessKeyId: process.env.R2_ACCESS_KEY_ID,
                secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
            },
        });
    }
    async save(file, path, mimetype) {
        try {
            const upload = new lib_storage_1.Upload({
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
        }
        catch (error) {
            console.error("Erro no upload para R2:", error);
            throw new Error("Falha ao salvar arquivo no storage.");
        }
    }
    async delete(fileUrl) {
        try {
            if (!fileUrl)
                return;
            // Remove a URL base para pegar apenas a Key (caminho relativo)
            // Ex: https://pub.r2.dev/pasta/foto.png -> pasta/foto.png
            const fileKey = fileUrl.replace(`${this.publicUrl}/`, "");
            await this.client.send(new client_s3_1.DeleteObjectCommand({
                Bucket: this.bucketName,
                Key: fileKey,
            }));
            console.log(`✅ Arquivo deletado do R2: ${fileKey}`);
        }
        catch (error) {
            console.error("Erro não crítico ao deletar do R2:", error);
        }
    }
}
exports.R2StorageProvider = R2StorageProvider;
