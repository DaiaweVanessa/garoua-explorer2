import { TransportRepository } from '@domain/repositories/TransportEventRepositories';
import { AppError } from '@presentation/middlewares/errorHandler';

export class ListTransportUseCase {
  constructor(private readonly transportRepository: TransportRepository) {}
  execute() {
    return this.transportRepository.findAll();
  }
}

export class CreateTransportUseCase {
  constructor(private readonly transportRepository: TransportRepository) {}
  execute(input: Parameters<TransportRepository['create']>[0]) {
    return this.transportRepository.create(input);
  }
}

export class UpdateTransportUseCase {
  constructor(private readonly transportRepository: TransportRepository) {}

  async execute(id: number, input: Parameters<TransportRepository['update']>[1]) {
    const existing = await this.transportRepository.findById(id);
    if (!existing) {
      throw new AppError(404, 'TRANSPORT_NOT_FOUND', 'Option de transport introuvable');
    }
    return this.transportRepository.update(id, input);
  }
}

export class DeleteTransportUseCase {
  constructor(private readonly transportRepository: TransportRepository) {}

  async execute(id: number) {
    const existing = await this.transportRepository.findById(id);
    if (!existing) {
      throw new AppError(404, 'TRANSPORT_NOT_FOUND', 'Option de transport introuvable');
    }
    await this.transportRepository.delete(id);
  }
}
