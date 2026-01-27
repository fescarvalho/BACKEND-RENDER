import { IUserRepository } from "../../../domain/repositories/IUserRepository";

export class ListClientsUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(search?: string) {
    
    return await this.userRepository.findAll(search);
  }
}