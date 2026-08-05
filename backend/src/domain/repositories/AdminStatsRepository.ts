import { AdminStats } from '@domain/entities/AdminStats';

export interface AdminStatsRepository {
  getStats(): Promise<AdminStats>;
}
