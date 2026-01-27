
  export interface IUserRepository {
    findByEmail(email: string): Promise<any | null>;
    create(data: any): Promise<any>;
    
    
    findById(id: number): Promise<any | null>;
    findAll(search?: string): Promise<any[]>;
    delete(id: number): Promise<void>;
    count(): Promise<number>;
    update(id: number, data: any): Promise<void>;
  }