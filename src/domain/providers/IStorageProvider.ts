export interface IStorageProvider {
    /**
     * Salva um arquivo e retorna a URL pública
     */
    save(file: Buffer, path: string, mimetype: string): Promise<string>;
  
    /**
     * Deleta um arquivo baseado na URL ou Key
     */
    delete(fileUrl: string): Promise<void>;
  }