import { AdminStatsRepository } from '@domain/repositories/AdminStatsRepository';

export class GetAdminStatsUseCase {
  constructor(private readonly adminStatsRepository: AdminStatsRepository) {}
  execute() {
    return this.adminStatsRepository.getStats();
  }
}
